# CLAUDE.md

## Repository Purpose

Personal CV/resume portfolio site — pure static HTML. Deployed to https://mareox.github.io/resume/

## Architecture

- **Single `index.html`** with embedded CSS and vanilla JS — no build tools, no frameworks
- **Resume PDF** at `static/Mario_Sanchez_Resume.pdf`
- **Deployment:** GitHub Actions uploads repo root directly to GitHub Pages (no build step)

## Editing Content

All content lives in `index.html`. Sections in scroll order:
1. Hero — `// hello, world`, punchy title, value prop, resume download CTA
2. About — professional summary with metric cards
3. AI as a Daily Driver — three pillars (workflows, security research, diagnostic tools)
4. Projects — card grid (Homelab, DNS Automation, SCM Converter, Troubleshooting Tools)
5. Experience — timeline of PANW career progression
6. Skills — grouped tag chips (Security, Cloud, Automation, AI/ML, Infrastructure)
7. Certifications & Education
8. Footer — social links, resume download, personality line

**Theme:** Dark/light mode with CSS custom properties. Toggle in nav. Preference persisted in localStorage. System `prefers-color-scheme` detected on first visit. No-flash script in `<head>` sets `data-theme` before render.

## Local Preview

Open `index.html` directly in a browser — no server needed.

## Deployment

Automatic via GitHub Actions on push to `main`. No build step — the workflow uploads the repo root as-is.

## Related

- **Homelab Journal:** `~/GIT/homelab-journal/` — linked from hero, about, projects, and footer
- **Resume source:** `U:\Users\MareoX\Documents\Resume\2026\resume.json`
