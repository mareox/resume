# Floating Resume Bot

## Objective

Add a professional floating security-sentinel launcher and hybrid guided-career experience to the resume site, while preserving the existing grounded chat service and keeping public homelab-journal knowledge as a separate, reviewed corpus decision.

## Done when

The sentinel, guided career path, and existing chat work in a real browser on desktop and mobile; keyboard, screen-reader, reduced-motion, source-card, safe-refusal, and valid Turnstile-protected streamed-answer checks pass.

## Tasks

| ID | Task | Status | Owner | Verification |
| --- | --- | --- | --- | --- |
| T1 | Finalize product scope and implementation contract | done | parent | The hybrid career-tour decision, non-goals, risks, and test plan are recorded in the detailed planning artifact. |
| T2 | Implement the local CSS/SVG sentinel, accessible dialog, and 2–3-card career tour | done | parent | Existing chat element IDs stay unique; tour makes no API call; chat handoff retains the current SSE/Turnstile contract. |
| T3 | Expand browser and accessibility coverage, then deploy the scoped static-site change | done | parent | Twenty Playwright/axe checks pass on desktop and mobile; the public GitHub Pages flow completed valid Turnstile-protected refusal and streamed-answer tests on 2026-08-17. |
| T4 | Decide whether to add a curated public homelab-journal source manifest as a separate corpus release | blocked | parent | Explicit scope approval, selected public sources, sensitive-detail review, and corpus grounding/citation evaluations. |
| T5 | Make processing feedback prominent, playful, and observable during real latency | done | parent | A held-request browser test observes the initial status, a second original action message, the coffee message, streaming, and completion on desktop and mobile; the public site visibly rendered `Thinking it through…` in both the transcript and fixed status lane before completing. |
| T6 | Replace generic unsupported-answer copy with a grounded conversational redirect | done | parent | Seventy-four backend tests prove private-family questions bypass retrieval and generation; the public browser returned the verified 50+ service/four-node Proxmox redirect without disclosing or guessing private facts, then produced a normal grounded project answer. |
| T7 | Repair the responsive chat layout so the transcript scrolls while controls stay visible | done | parent | Twenty-four Playwright/axe checks pass across desktop and mobile, including 864×768 and 320×568 long-transcript cases; a public 864×768 screenshot shows the transcript scrolling while status, composer, and Ask remain fully visible. |
| T8 | Make Turnstile unobtrusive and simplify AI Security Lab status | done | parent | Every Ask remains server-validated; the interaction-only widget stays hidden unless Cloudflare needs visitor action. A fresh production browser shows one collapsed `Safety trace: passed · public sources only` disclosure and no raw implementation chips. |
| T9 | Add personality-aware adversarial and nonsense-response coverage | done | parent | Eighty-five backend tests and 31 deterministic evaluation cases cover prompt injection, protected-data requests, private facts, nonsense, off-topic prompts, output injection, citation abuse, and degenerate answers while preserving a casual-professional geeky voice. |
| T10 | Run sanity, security scan, and public end-to-end acceptance | done | parent | Twenty-four frontend checks, backend lint/type/test gates, a scoped security scan, Atlas readiness, the public invalid-token boundary, and real Brave Turnstile-protected asks passed on 2026-08-18. The live checks covered grounded answers, private-data refusal, prompt injection, nonsense, identity, repeated asks, Clear chat, AI Security Lab, and the responsive dialog. |

## Decisions or blockers

- The first pass is presentation-only: no FastAPI, Ollama, RAG, Turnstile, Caddy, Cloudflare, tracking, auto-open, or dependency change.
- The primary invitation is `Walk me through Mario's career`; it opens a short guided introduction followed by free chat.
- The existing `#ask-ai` section remains a visible fallback and deep-link target.
- The current corpus has six resume-derived documents. The public homelab journal is not a source yet and must never be bulk-crawled.
- Public browser acceptance completed in Brave on 2026-08-18 with valid Turnstile-protected grounded, adversarial, and conversational requests.
- On 2026-08-17, the live DNS record was an unintended proxied Cloudflare Tunnel CNAME that returned a 404. It was restored to the intended DNS-only `proxy.mareoxlan.com` CNAME; public authoritative DNS now resolves it to the Caddy ingress.
- Processing copy will be original and inspired by the concise, active cadence of coding agents; it will not reproduce Claude Code strings.
- Conversational redirects may mention only facts already present in the approved public corpus. They must not infer, confirm, or deny private biographical details.
- The chat will use one scroll owner: the transcript. Header, progress/status, and composer remain fixed within the dialog grid.

## Next action

Monitor production behavior and keep T4 as a separate, intentionally blocked corpus decision; the public homelab journal is not part of the current knowledge base.

## Experience v2 follow-up

The evidence-aware v2 experience is implemented and locally accepted under the
executor-grade plan at
`homelab-infra/atlas/resume-bot/plans/resume-bot-experience-v2-build-plan.md`.
It replaces the nested tour/chat presentation with mutually exclusive views,
adds answer-owned public evidence and deterministic follow-ups, makes Stop,
Retry, Copy, and Clear recoverable, and keeps Security Lab details behind a
plain-language disclosure.

Local acceptance covers 52 desktop/mobile Playwright checks, 118 backend tests,
41 deterministic evaluation cases, secret scanning, visual review, and fresh
code, UX/accessibility, and verification passes with no unresolved P0/P1
findings. Deployment remains ordered: publish the backward-compatible frontend
against the v1 API first, prove it in a real browser, then release the additive
v2 backend. T4 remains blocked and the public homelab journal is not part of the
v2 corpus.
