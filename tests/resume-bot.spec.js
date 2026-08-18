const { test, expect } = require('@playwright/test');
const axePath = require.resolve('axe-core/axe.min.js');

const apiUrl = 'https://resume-bot.mareoxlan.com/api/resume-bot/v1/chat';
const turnstileUrl = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

const sse = (events) => events.map(({ event, data }) => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`).join('');

async function installTurnstileStub(page) {
  await page.route(turnstileUrl, (route) => route.fulfill({
    contentType: 'application/javascript',
    body: `window.turnstile={render:function(_,options){window.__resumeBotTurnstile=options;return 7;},execute:function(){window.__resumeBotTurnstile.callback('TEST');},reset:function(){},remove:function(){}};`,
  }));
}

async function installApiStub(page, status = 200) {
  await page.route(apiUrl, (route) => {
    if (status !== 200) return route.fulfill({ status, contentType: 'application/json', body: '{}' });
    return route.fulfill({
      contentType: 'text/event-stream',
      body: sse([
        { event: 'meta', data: { trace_id: 'trace', conversation_id: 'conversation', mode: 'career' } },
        { event: 'security', data: { input: 'allowed', turnstile: 'passed', retrieval: 'public_resume', output: 'passed' } },
        { event: 'sources', data: { items: [{ id: 'experience', title: 'Experience', url: 'https://mareox.github.io/resume/#experience' }] } },
        { event: 'delta', data: { text: 'Safe answer: **automation**\n\n1. First public result\n2. <img src=x onerror=window.__resumeBotXss=true>' } },
        { event: 'done', data: { grounded: true, source_ids: ['experience'], latency_ms: 12 } },
      ]),
    });
  });
}

test.beforeEach(async ({ page }) => {
  await installTurnstileStub(page);
});

async function openAssistant(page, opener = 'launcher') {
  const trigger = opener === 'launcher'
    ? page.getByRole('button', { name: 'Open Ask MareoX AI assistant' })
    : page.getByRole('button', { name: 'Open Ask MareoX AI', exact: true });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'Ask MareoX AI' })).toBeVisible();
}

async function openChat(page) {
  await openAssistant(page);
  await page.getByRole('button', { name: 'Next: AI security' }).click();
  await page.getByRole('button', { name: 'Next: automation projects' }).click();
  await page.getByRole('button', { name: 'Ask a follow-up' }).click();
  await expect(page.locator('#resume-bot-chat')).toBeVisible();
  await expect(page.locator('#resume-bot-input')).toBeFocused();
}

test('floating sentinel opens an optional guided career path before chat', async ({ page }) => {
  let chatRequests = 0;
  page.on('request', (request) => { if (request.url() === apiUrl) chatRequests += 1; });
  await page.goto('/');
  await expect(page.getByRole('dialog', { name: 'Ask MareoX AI' })).toBeHidden();
  await openAssistant(page);
  await expect(page.getByRole('heading', { name: 'Start with the career story' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View career experience' })).toHaveAttribute('href', '#experience');
  expect(chatRequests).toBe(0);
  await page.getByRole('button', { name: 'Next: AI security' }).click();
  await page.getByRole('button', { name: 'Next: automation projects' }).click();
  await page.getByRole('button', { name: 'Ask a follow-up' }).click();
  await expect(page.locator('#resume-bot-chat')).toBeVisible();
  await expect(page.locator('#resume-bot-input')).toBeFocused();
  expect(chatRequests).toBe(0);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Ask MareoX AI' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open Ask MareoX AI assistant' })).toBeFocused();
});

test('starter question streams inert text and a public source card', async ({ page }) => {
  await installApiStub(page);
  await page.goto('/');
  await openChat(page);
  await page.getByRole('button', { name: 'What AI security work have you done?' }).click();
  await expect(page.locator('#resume-bot-input')).toHaveValue('What AI security work have you done?');
  await page.getByRole('button', { name: 'Ask', exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => window.__resumeBotTurnstile?.action))
    .toBe('resume_chat');
  expect(await page.evaluate(() => window.__resumeBotTurnstile.size)).toBe(
    page.viewportSize().width <= 480 ? 'compact' : 'flexible',
  );
  const answer = page.locator('.resume-bot-message--assistant').last();
  await expect(answer).toContainText('<img src=x onerror=window.__resumeBotXss=true>');
  await expect(answer.getByRole('strong')).toHaveText('automation');
  await expect(answer.getByRole('listitem')).toHaveCount(2);
  await expect(page.locator('#resume-bot-starters')).toBeHidden();
  await expect(page.locator('.resume-bot-source')).toHaveAttribute('href', 'https://mareox.github.io/resume/#experience');
  await expect(page.locator('img')).toHaveCount(0);
  await expect(page.locator('#resume-bot-status')).toHaveText('Answer complete.');
  await expect(page.locator('#resume-bot-dialog').evaluate((dialog) => dialog.scrollHeight <= dialog.clientHeight)).toBeTruthy();
});

test('security mode, clear action, theme, reduced motion, and narrow layout work', async ({ page }) => {
  await installApiStub(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/');
  const launcher = page.locator('#resume-bot-launcher');
  const launcherBox = await launcher.boundingBox();
  expect(launcherBox.x + launcherBox.width <= 320).toBeTruthy();
  expect(launcherBox.y + launcherBox.height <= 844).toBeTruthy();
  await openChat(page);
  await page.getByRole('button', { name: 'AI Security Lab' }).click();
  await expect(page.getByRole('button', { name: 'AI Security Lab' })).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#resume-bot-input').fill('What AI security work have you done?');
  await page.getByRole('button', { name: 'Ask', exact: true }).click();
  await expect(page.locator('#resume-bot-security')).toBeVisible();
  await page.getByRole('button', { name: 'Clear chat' }).click();
  await expect(page.locator('#resume-bot-starters')).toBeVisible();
  await expect(page.locator('#resume-bot-transcript')).toContainText('Ask a question or choose a starter prompt to begin.');
  await page.keyboard.press('Escape');
  await page.locator('.theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', /dark|light/);
  expect(await page.locator('#ask-ai').evaluate((section) => section.scrollWidth <= section.clientWidth)).toBeTruthy();
});

for (const [name, handler] of [
  ['rate-limit', async (page) => installApiStub(page, 429)],
  ['unavailable', async (page) => installApiStub(page, 503)],
  ['network-failure', async (page) => page.route(apiUrl, (route) => route.abort())],
]) {
  test(`${name} displays the safe fallback`, async ({ page }) => {
    await handler(page);
    await page.goto('/');
    await openChat(page);
    await page.locator('#resume-bot-input').fill('Question');
    await page.getByRole('button', { name: 'Ask', exact: true }).click();
    await expect(page.locator('#resume-bot-status')).toContainText('The assistant is unavailable right now.');
    await expect(page.locator('#resume-bot-transcript').getByRole('link', { name: 'download the PDF' })).toHaveAttribute('href', 'static/Mario_Sanchez_Resume.pdf');
  });
}

test('widget has no serious or critical accessibility violations', async ({ page }) => {
  await installApiStub(page);
  await page.goto('/');
  await page.addScriptTag({ path: axePath });
  const fallbackResults = await page.locator('#ask-ai').evaluate(async () => window.axe.run('#ask-ai'));
  const fallbackSignificant = fallbackResults.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
  expect(fallbackSignificant).toEqual([]);
  await openAssistant(page, 'inline');
  const dialogResults = await page.locator('#resume-bot-dialog').evaluate(async () => window.axe.run('#resume-bot-dialog'));
  const dialogSignificant = dialogResults.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
  expect(dialogSignificant).toEqual([]);
});
