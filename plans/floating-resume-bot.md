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
| T3 | Expand browser and accessibility coverage, then deploy the scoped static-site change | doing | parent | All 14 local Playwright/axe desktop and mobile checks pass; publish and edge-browser verification remain. |
| T4 | Decide whether to add a curated public homelab-journal source manifest as a separate corpus release | blocked | parent | Explicit scope approval, selected public sources, sensitive-detail review, and corpus grounding/citation evaluations. |

## Decisions or blockers

- The first pass is presentation-only: no FastAPI, Ollama, RAG, Turnstile, Caddy, Cloudflare, tracking, auto-open, or dependency change.
- The primary invitation is `Walk me through Mario's career`; it opens a short guided introduction followed by free chat.
- The existing `#ask-ai` section remains a visible fallback and deep-link target.
- The current corpus has six resume-derived documents. The public homelab journal is not a source yet and must never be bulk-crawled.
- Public completion still requires a normal browser to obtain a valid Turnstile token and receive a streamed answer.

## Next action

Publish the scoped static-site change, confirm the GitHub Pages deployment, and run the live browser smoke check. The detailed technical plan is stored in the local planning artifact under `.omx/plans/`.
