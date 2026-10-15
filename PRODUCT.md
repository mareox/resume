# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers evaluating Mario Sanchez for roles. They need to
understand his relevant experience, inspect evidence of his work, and find a
professional contact path.

## Product Purpose

Present Mario's professional background through a public portfolio, resume,
projects, and writing. Success means visitors can assess his fit for a role and
choose whether to contact him using the public evidence available.

## Positioning

The existing career and project material connects enterprise network security
and SASE delivery with practical automation, AI security, and homelab work.
Specific experience and inspectable projects carry the professional story.

## Operating Context

Visitors browse on desktop or mobile, read the career timeline and credentials,
download the resume, and follow links to LinkedIn, GitHub, and Homelab Journal.
The assistant is an optional way to explore the same public background.

## Capabilities and Constraints

- The current frontend is static HTML, CSS, and vanilla JavaScript. Site content
  lives in `index.html`; assistant code lives in `assets/resume-bot.js` and
  `assets/resume-bot.css`. GitHub Actions deploys the repository to GitHub Pages
  without a site build step.
- The assistant calls a separately hosted API. Its published scope is the public
  resume, with source excerpts and links, streamed answers, follow-up suggestions,
  cancellation, retry, and resume/PDF fallbacks.
- The current assistant includes career and security-lab modes and a career tour.
  Preserve input validation, source restrictions, safe rendering, verification,
  and recovery behavior when changing its interface.
- Website content and generated PDFs have separate source paths. Changes to the
  public sections used by the assistant also require coordinating its separately
  owned corpus update; a frontend edit alone does not update that corpus.
- Public materials must exclude credentials, private infrastructure details, and
  customer data. Existing outcome claims are published claims, not independent
  verification of those outcomes.

## Brand Commitments

Mario Sanchez is the professional identity; MareoX is the established handle.
Preserve the author's direct, technical voice and factual professional content.
The user's reference to Tianliang Zhang's site concerns the chatbot's pop-up
opening behavior; it does not select that site's broader visual identity.

## Evidence on Hand

- `index.html`: career history, project descriptions, skills, credentials, and
  public professional links.
- `resume.json` and `generate_pdf.py`: resume source and PDF generator;
  `static/Mario_Sanchez_Resume.pdf` and `Mario-Sanchez-resume.pdf`: public PDFs.
- `assets/resume-bot.js` and `assets/resume-bot.css`: existing assistant behavior.
- Linked public artifacts include Homelab Journal and the SCM Address Group
  Converter repository. Do not invent case studies, testimonials, or results.

## Product Principles

1. Help recruiters and hiring managers assess relevant experience from evidence.
2. Make important claims traceable to public career or project material.
3. Keep the resume, project links, and contact paths useful without the assistant.
4. Preserve the public-content boundary and existing assistant safeguards.
5. Fit improvements to the existing system unless a broader change is chosen.

## Accessibility & Inclusion

Preserve keyboard access, labelled controls, appropriate focus handling, status
announcements, reduced-motion support, and narrow-screen usability. Direct resume
access and PDF links must remain available when the assistant is unavailable.

## Open Decisions

C1 is the requested next interface improvement: a floating chatbot panel with
the opening interaction the user liked on Tianliang Zhang's site. It is not
implemented by this initialization. A full redesign, framework change, and
hosting migration remain undecided.
