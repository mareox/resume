"""Generate professional resume PDF from HTML/CSS using WeasyPrint."""
import json
from pathlib import Path

RESUME_DIR = Path(__file__).parent
RESUME_JSON = RESUME_DIR / "resume.json"
OUTPUT_HTML = RESUME_DIR / "output/pdf/resume.html"
OUTPUT_PDF = RESUME_DIR / "static/Mario_Sanchez_Resume.pdf"

CSS = """
@page {
    size: letter;
    margin: 0.5in 0.55in 0.5in 0.55in;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 9.2pt;
    line-height: 1.28;
    color: #1a1a1a;
}
a { color: #1a1a1a; text-decoration: none; }
h1 {
    font-size: 20pt;
    font-weight: 700;
    letter-spacing: 0.5pt;
    margin-bottom: 2pt;
    color: #0d0d0d;
}
.contact {
    font-size: 9pt;
    color: #444;
    margin-bottom: 6pt;
    letter-spacing: 0.2pt;
}
.contact span { margin: 0 4pt; color: #999; }
.summary {
    font-size: 9pt;
    line-height: 1.4;
    color: #333;
    margin-bottom: 10pt;
    padding-bottom: 8pt;
    border-bottom: 1.5pt solid #0d47a1;
}
h2 {
    font-size: 10.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1pt;
    color: #0d47a1;
    border-bottom: 0.75pt solid #ccc;
    padding-bottom: 2pt;
    margin-top: 10pt;
    margin-bottom: 5pt;
}
h3 {
    font-size: 9.5pt;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 1pt;
}
.job-meta {
    font-size: 8.5pt;
    color: #555;
    margin-bottom: 3pt;
}
.job-meta .company { font-weight: 600; color: #333; }
.job-meta .dates { float: right; font-style: italic; }
ul {
    margin-left: 14pt;
    margin-bottom: 6pt;
}
li {
    margin-bottom: 1.5pt;
    text-align: left;
}
.project-title {
    font-weight: 700;
    font-size: 9.2pt;
    color: #1a1a1a;
}
.project-date {
    font-size: 8.5pt;
    color: #555;
    float: right;
    font-style: italic;
}
.project-desc {
    margin-bottom: 5pt;
    text-align: left;
}
.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1pt;
}
.skill-row {
    width: 100%;
    margin-bottom: 2pt;
}
.skill-cat {
    font-weight: 700;
    color: #333;
    display: inline;
}
.skill-items {
    display: inline;
    color: #444;
}
.cert-row, .edu-row {
    margin-bottom: 2pt;
}
.cert-title { font-weight: 600; }
.cert-date { color: #555; font-style: italic; float: right; }
.edu-degree { font-weight: 600; }
.edu-school { color: #555; }
.clearfix::after { content: ""; display: table; clear: both; }
"""


def build_html(data: dict) -> str:
    b = data["basics"]
    parts = []
    parts.append(f"<!DOCTYPE html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>")

    # Header
    parts.append(f"<h1>{b['name']}</h1>")
    contact_items = []
    if b.get("location", {}).get("address"):
        contact_items.append(b["location"]["address"])
    if b.get("phone"):
        contact_items.append(b["phone"])
    if b.get("email"):
        contact_items.append(b["email"])
    if b.get("website"):
        contact_items.append(f'<a href="https://{b["website"]}">{b["website"]}</a>')
    parts.append(f'<div class="contact">{"<span>|</span>".join(contact_items)}</div>')

    # Summary (Profile)
    if b.get("summary"):
        parts.append(f'<div class="summary">{b["summary"]}</div>')

    # Projects
    if data.get("projects"):
        parts.append("<h2>Projects</h2>")
        for p in data["projects"]:
            date_str = p.get("date", "")
            parts.append('<div class="clearfix">')
            url_part = ""
            if p.get("url"):
                url_part = f' -<a href="{p["url"]}" style="color:#0d47a1;">GitHub</a>'
            parts.append(f'<div><span class="project-title">{p["name"]}</span>{url_part}<span class="project-date">{date_str}</span></div>')
            parts.append("</div>")
            if p.get("description"):
                parts.append(f'<div class="project-desc">{p["description"]}</div>')

    # Experience
    if data.get("work"):
        parts.append("<h2>Experience</h2>")
        for job in data["work"]:
            loc = job.get("location", "")
            dates = f'{job.get("startDate", "")} to {job.get("endDate", "")}'
            parts.append('<div class="clearfix">')
            parts.append(f'<h3>{job["position"]}</h3>')
            if job.get('officialPosition'):
                parts.append(f'<div class="job-meta">Official title: {job["officialPosition"]}</div>')
            parts.append(f'<div class="job-meta"><span class="company">{job["company"]}</span>{" | " + loc if loc else ""}<span class="dates">{dates}</span></div>')
            parts.append("</div>")
            if job.get("highlights"):
                parts.append("<ul>")
                for h in job["highlights"]:
                    parts.append(f"<li>{h}</li>")
                parts.append("</ul>")

    # Skills
    if data.get("skills"):
        parts.append("<h2>Technical Skills</h2>")
        parts.append('<div class="skills-grid">')
        for skill in data["skills"]:
            kw = ", ".join(skill.get("keywords", []))
            parts.append(f'<div class="skill-row"><span class="skill-cat">{skill["name"]}:</span> <span class="skill-items">{kw}</span></div>')
        parts.append("</div>")

    # Education
    if data.get("education"):
        parts.append("<h2>Education</h2>")
        for edu in data["education"]:
            degree = edu.get("studyType", "")
            area = edu.get("area", "")
            school = edu.get("institution", "")
            loc = edu.get("location", "")
            parts.append(f'<div class="edu-row"><span class="edu-degree">{degree}</span> -<span class="edu-school">{school}, {loc}</span></div>')

    # Certifications
    if data.get("awards"):
        parts.append("<h2>Certifications</h2>")
        for cert in data["awards"]:
            parts.append(f'<div class="cert-row clearfix"><span class="cert-title">{cert["title"]}</span><span class="cert-date">{cert.get("date", "")}</span></div>')

    parts.append("</body></html>")
    return "\n".join(parts)


def main():
    data = json.loads(RESUME_JSON.read_text())
    html = build_html(data)
    OUTPUT_HTML.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_HTML.write_text(html)
    print(f"HTML written to {OUTPUT_HTML}")

    from weasyprint import HTML
    HTML(string=html).write_pdf(str(OUTPUT_PDF))
    (RESUME_DIR / "Mario-Sanchez-resume.pdf").write_bytes(OUTPUT_PDF.read_bytes())
    print(f"PDF written to {OUTPUT_PDF}")


if __name__ == "__main__":
    main()
