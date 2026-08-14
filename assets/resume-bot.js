(() => {
  'use strict';

  const endpoint = 'https://resume-bot.mareoxlan.com/api/resume-bot/v1/chat';
  const sourceBaseUrl = 'https://mareox.github.io/resume/#';
  const siteKeyMarker = 'TURNSTILE_SITE_KEY_REPLACE_ME';
  const siteKey = document.querySelector('meta[name="resume-bot-turnstile-sitekey"]')?.content || '';
  const isLocalTest = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
  const elements = {
    career: document.getElementById('resume-bot-mode-career'), security: document.getElementById('resume-bot-mode-security'),
    transcript: document.getElementById('resume-bot-transcript'), input: document.getElementById('resume-bot-input'),
    send: document.getElementById('resume-bot-send'), clear: document.getElementById('resume-bot-clear'),
    status: document.getElementById('resume-bot-status'), sources: document.getElementById('resume-bot-sources'),
    securityCard: document.getElementById('resume-bot-security'), turnstile: document.getElementById('resume-bot-turnstile'),
  };
  if (Object.values(elements).some((element) => element === null)) return;

  let activeMode = 'career';
  let conversationId = null;
  let controller = null;
  let turnstileWidgetId = null;

  const removeChildren = (element) => { while (element.firstChild) element.removeChild(element.firstChild); };
  const setStatus = (text, state = 'idle') => {
    elements.status.textContent = text;
    elements.status.dataset.state = state;
    elements.status.setAttribute('role', state === 'error' ? 'alert' : 'status');
  };
  const setBusy = (busy) => { elements.send.disabled = busy; elements.input.disabled = busy; elements.clear.disabled = false; };
  const resetTranscript = () => {
    removeChildren(elements.transcript);
    const empty = document.createElement('p');
    empty.className = 'resume-bot-empty';
    empty.textContent = 'Ask a question or choose a starter prompt to begin.';
    elements.transcript.appendChild(empty);
  };
  const appendMessage = (role, text) => {
    elements.transcript.querySelector('.resume-bot-empty')?.remove();
    const node = document.createElement('div');
    node.className = `resume-bot-message resume-bot-message--${role}`;
    node.textContent = text;
    elements.transcript.appendChild(node);
    elements.transcript.scrollTop = elements.transcript.scrollHeight;
    return node;
  };
  const setMode = (mode) => {
    activeMode = mode;
    const isSecurity = mode === 'security_lab';
    elements.career.setAttribute('aria-pressed', String(!isSecurity));
    elements.security.setAttribute('aria-pressed', String(isSecurity));
    elements.securityCard.hidden = !isSecurity;
    if (!isSecurity) removeChildren(elements.securityCard);
  };
  const renderSources = (items) => {
    removeChildren(elements.sources);
    if (!Array.isArray(items)) return;
    items.forEach((item) => {
      if (!item || typeof item.id !== 'string' || typeof item.title !== 'string') return;
      const expectedUrl = `${sourceBaseUrl}${item.id}`;
      if (item.url !== expectedUrl) return;
      const link = document.createElement('a');
      link.className = 'resume-bot-source';
      link.href = expectedUrl;
      link.textContent = item.title;
      elements.sources.appendChild(link);
    });
  };
  const renderSecurity = (data) => {
    if (activeMode !== 'security_lab' || !data || typeof data !== 'object') return;
    removeChildren(elements.securityCard);
    elements.securityCard.hidden = false;
    ['input', 'turnstile', 'retrieval', 'output'].forEach((key) => {
      if (typeof data[key] !== 'string') return;
      const item = document.createElement('span');
      item.className = 'resume-bot-security-item';
      item.textContent = `${key}: ${data[key]}`;
      elements.securityCard.appendChild(item);
    });
  };
  const showFallback = () => {
    setStatus('The assistant is unavailable right now. You can still browse the resume or download the PDF.', 'error');
    const fallback = document.createElement('p');
    fallback.className = 'resume-bot-fallback';
    const browse = document.createElement('a');
    browse.href = '#about'; browse.textContent = 'Browse the resume';
    const pdf = document.createElement('a');
    pdf.href = 'static/Mario_Sanchez_Resume.pdf'; pdf.download = 'Mario_Sanchez_Resume.pdf'; pdf.textContent = 'download the PDF';
    fallback.append(browse, document.createTextNode(' or '), pdf, document.createTextNode('.'));
    elements.transcript.appendChild(fallback);
  };
  const readSse = async (response, assistantNode) => {
    if (!response.body) throw new Error('Missing response stream');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const eventOrder = ['meta', 'security', 'sources', 'delta', 'done'];
    let buffer = ''; let lastIndex = -1; let receivedDone = false;
    while (!receivedDone) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      let boundary = buffer.indexOf('\n\n');
      while (boundary >= 0) {
        const block = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 2); boundary = buffer.indexOf('\n\n');
        const eventLine = block.split('\n').find((line) => line.startsWith('event: '));
        const dataLine = block.split('\n').find((line) => line.startsWith('data: '));
        if (!eventLine || !dataLine) throw new Error('Invalid stream event');
        const event = eventLine.slice(7); const data = JSON.parse(dataLine.slice(6)); const index = eventOrder.indexOf(event);
        if (index < 0 || index < lastIndex || (event !== 'delta' && index === lastIndex)) throw new Error('Unexpected stream event order');
        lastIndex = index;
        if (event === 'meta' && typeof data.conversation_id === 'string') conversationId = data.conversation_id;
        if (event === 'security') renderSecurity(data);
        if (event === 'sources') renderSources(data.items);
        if (event === 'delta' && typeof data.text === 'string') { assistantNode.textContent += data.text; elements.transcript.scrollTop = elements.transcript.scrollHeight; }
        if (event === 'done') receivedDone = true;
      }
      if (done && !receivedDone) throw new Error('Stream ended early');
    }
  };
  const getTurnstileToken = () => new Promise((resolve, reject) => {
    if (!window.turnstile || !siteKey || (siteKey === siteKeyMarker && !isLocalTest)) { reject(new Error('Turnstile is not configured')); return; }
    const effectiveSiteKey = siteKey === siteKeyMarker ? 'TEST' : siteKey;
    const size = window.matchMedia('(max-width: 480px)').matches ? 'compact' : 'flexible';
    const options = { sitekey: effectiveSiteKey, action: 'resume_chat', size, callback: resolve, 'error-callback': () => reject(new Error('Turnstile failed')), 'expired-callback': () => reject(new Error('Turnstile expired')) };
    if (turnstileWidgetId === null) turnstileWidgetId = window.turnstile.render(elements.turnstile, options);
    window.turnstile.execute(turnstileWidgetId);
  });
  const send = async () => {
    const message = elements.input.value.trim();
    if (!message) { setStatus('Enter a question first.', 'error'); elements.input.focus(); return; }
    if (message.length > 500) { setStatus('Questions must be 500 characters or fewer.', 'error'); return; }
    setBusy(true); setStatus('Verifying and preparing a grounded answer…'); appendMessage('user', message);
    const assistantNode = appendMessage('assistant', ''); controller = new AbortController();
    try {
      const token = await getTurnstileToken();
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, conversation_id: conversationId, mode: activeMode, turnstile_token: token }), signal: controller.signal });
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      await readSse(response, assistantNode);
      if (!assistantNode.textContent) throw new Error('Empty answer');
      elements.input.value = ''; setStatus('Answer complete.');
    } catch (error) {
      assistantNode.remove(); showFallback();
    } finally {
      if (turnstileWidgetId !== null && window.turnstile) window.turnstile.reset(turnstileWidgetId);
      controller = null; setBusy(false);
    }
  };
  elements.career.addEventListener('click', () => setMode('career'));
  elements.security.addEventListener('click', () => setMode('security_lab'));
  elements.send.addEventListener('click', send);
  elements.clear.addEventListener('click', () => {
    if (controller) controller.abort();
    conversationId = null; elements.input.value = ''; removeChildren(elements.sources); removeChildren(elements.securityCard);
    elements.securityCard.hidden = activeMode !== 'security_lab'; resetTranscript(); setStatus('Chat cleared.'); elements.input.focus();
  });
  document.querySelectorAll('.resume-bot-starter').forEach((button) => button.addEventListener('click', () => { elements.input.value = button.dataset.question || ''; elements.input.focus(); }));
  window.addEventListener('beforeunload', () => controller?.abort());
  resetTranscript(); setMode('career');
})();
