# resume

Personal portfolio site. Single HTML file, no frameworks, no build step.

**Live:** [mareox.github.io/resume](https://mareox.github.io/resume/)

## What's in here

```
index.html              ← the entire site
static/                 ← favicon + resume PDF
.github/workflows/      ← GitHub Pages deploy on push to main
```

## AI project evidence

The public summary, AI section, and project cards highlight the read-only Python/FastMCP infrastructure server and Gilfoyle AI operations agent. These are explicitly personal projects, separate from customer delivery. The public resume JSON feeds both downloadable PDF paths. The separately hosted assistant uses a six-section public-only corpus rebuilt from this HTML.

## Stack

- Pure HTML + CSS + vanilla JS
- DM Sans + JetBrains Mono (Google Fonts)
- Dark/light mode with `prefers-color-scheme` detection + manual toggle
- Scroll-reveal animations via IntersectionObserver
- `prefers-reduced-motion` respected

## Local preview

Open `index.html` in a browser. That's it.

## Deployment

Automatic via GitHub Actions on push to `main`. No build step needed.

## Related

- [Homelab Journal](https://mareox.github.io/homelab-journal/) for build logs and deep dives
