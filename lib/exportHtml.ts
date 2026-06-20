import type { ProfileData } from "./types";

/**
 * Build a single self-contained HTML document (inline CSS, no external assets)
 * from the structured profile. The output mirrors the on-screen white & blue
 * PortfolioView so the user can host it anywhere (Vercel, Netlify, GitHub Pages).
 */
export function buildPortfolioHtml(data: ProfileData): string {
  const c = data.contact;

  const heroLinks = [
    c.email && link(`mailto:${c.email}`, "Email"),
    c.website && link(c.website, "Website"),
    c.github && link(c.github, "GitHub"),
    c.linkedin && link(c.linkedin, "LinkedIn"),
  ]
    .filter(Boolean)
    .join("");

  const meta = [c.location, c.phone].filter(Boolean).map(esc).join("  ·  ");

  const skills = data.skills
    .map(
      (g) => `
        <div class="skillgroup">
          <h3>${esc(g.category)}</h3>
          <div class="chips">${g.items
            .map((s) => `<span class="chip">${esc(s)}</span>`)
            .join("")}</div>
        </div>`
    )
    .join("");

  const experience = data.experience
    .map(
      (e) => `
        <div class="exp">
          <div class="exp-head">
            <div>
              <h3>${esc(e.role)}</h3>
              <p class="company">${esc(e.company)}${
        e.location ? `  ·  ${esc(e.location)}` : ""
      }</p>
            </div>
            ${e.period ? `<span class="period">${esc(e.period)}</span>` : ""}
          </div>
          ${bullets(e.bullets)}
        </div>`
    )
    .join("");

  const projects = data.projects
    .map(
      (p) => `
        <article class="card">
          <h3>${esc(p.name)}</h3>
          ${p.subtitle ? `<p class="sub">${esc(p.subtitle)}</p>` : ""}
          ${
            p.tech.length
              ? `<div class="chips">${p.tech
                  .map((t) => `<span class="chip sm">${esc(t)}</span>`)
                  .join("")}</div>`
              : ""
          }
          ${bullets(p.bullets)}
          <div class="card-actions">
            ${p.liveUrl ? link(p.liveUrl, "Live Demo ↗", "btn") : ""}
            ${p.repoUrl ? link(p.repoUrl, "Code", "btn ghost") : ""}
          </div>
        </article>`
    )
    .join("");

  const education = data.education
    .map(
      (e) => `
        <div class="edu">
          <div>
            <h3>${esc(e.degree)}</h3>
            <p class="school">${esc(e.institution)}</p>
          </div>
          ${e.period ? `<span class="period">${esc(e.period)}</span>` : ""}
        </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(data.name)} — ${esc(data.title)}</title>
<style>
  :root{--blue:#2563eb;--blue-dark:#1d4ed8;--ink:#0f172a;--slate:#475569;--line:#e2e8f0;--soft:#eff6ff}
  *{box-sizing:border-box}
  body{margin:0;color:var(--ink);background:#f8fafc;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;line-height:1.6}
  .wrap{max-width:880px;margin:0 auto;background:#fff;box-shadow:0 1px 30px rgba(15,23,42,.06)}
  a{color:var(--blue-dark);text-decoration:none}
  .hero{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-bottom:1px solid var(--line);padding:48px 40px}
  .eyebrow{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--blue-dark);background:#fff;border:1px solid #bfdbfe;padding:4px 12px;border-radius:999px}
  h1{font-size:42px;line-height:1.1;margin:14px 0 6px;letter-spacing:-.02em}
  .tagline{font-size:18px;color:var(--slate);margin:0 0 18px;max-width:60ch}
  .links{display:flex;flex-wrap:wrap;gap:10px}
  .links a{background:var(--blue);color:#fff;padding:8px 16px;border-radius:8px;font-weight:600;font-size:14px}
  .links a:hover{background:var(--blue-dark)}
  .meta{margin:14px 0 0;color:var(--slate);font-size:14px}
  .body{padding:8px 40px 36px}
  section{padding:26px 0;border-bottom:1px solid var(--line)}
  section:last-child{border-bottom:none}
  h2{font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--blue-dark);margin:0 0 16px;padding-left:14px;position:relative}
  h2::before{content:"";position:absolute;left:0;top:2px;bottom:2px;width:4px;border-radius:4px;background:var(--blue)}
  .summary{margin:0;color:var(--slate);max-width:75ch}
  .skills{display:grid;gap:16px}
  .skillgroup h3{font-size:14px;margin:0 0 8px}
  .chips{display:flex;flex-wrap:wrap;gap:8px}
  .chip{background:var(--soft);color:var(--blue-dark);border:1px solid #bfdbfe;padding:5px 12px;border-radius:999px;font-size:13px;font-weight:600}
  .chip.sm{font-size:12px;padding:3px 10px}
  .exp{border-left:3px solid #bfdbfe;padding-left:18px;margin-bottom:18px}
  .exp-head,.edu{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
  .exp h3{font-size:17px;margin:0}
  .company{margin:2px 0 0;color:var(--blue-dark);font-weight:600;font-size:14px}
  .period{color:var(--slate);font-size:13px;white-space:nowrap}
  ul{margin:10px 0 0;padding-left:18px;color:var(--slate)}
  li{margin:4px 0}
  .projects{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
  .card{border:1px solid var(--line);border-radius:12px;padding:18px;display:flex;flex-direction:column;box-shadow:0 1px 2px rgba(15,23,42,.04)}
  .card h3{margin:0;font-size:17px}
  .card .sub{margin:4px 0 10px;color:var(--slate);font-size:14px}
  .card-actions{display:flex;gap:8px;margin-top:auto;padding-top:12px}
  .btn{background:var(--blue);color:#fff!important;padding:7px 14px;border-radius:8px;font-size:13px;font-weight:600}
  .btn:hover{background:var(--blue-dark)}
  .btn.ghost{background:#fff;color:var(--blue-dark)!important;border:1px solid #bfdbfe}
  .edu h3{margin:0;font-size:15px}
  .school{margin:2px 0 0;color:var(--slate);font-size:14px}
  .edu{margin-bottom:10px}
  footer{text-align:center;padding:20px;color:var(--slate);font-size:12px;border-top:1px solid var(--line)}
  @media(max-width:560px){.hero,.body{padding-left:22px;padding-right:22px}h1{font-size:32px}}
</style>
</head>
<body>
  <div class="wrap">
    <header class="hero">
      <span class="eyebrow">${esc(data.title || "Portfolio")}</span>
      <h1>${esc(data.name || "Your Name")}</h1>
      ${data.tagline ? `<p class="tagline">${esc(data.tagline)}</p>` : ""}
      ${heroLinks ? `<div class="links">${heroLinks}</div>` : ""}
      ${meta ? `<p class="meta">${meta}</p>` : ""}
    </header>
    <main class="body">
      ${
        data.summary
          ? `<section><h2>About</h2><p class="summary">${esc(
              data.summary
            )}</p></section>`
          : ""
      }
      ${
        data.skills.length
          ? `<section><h2>Skills</h2><div class="skills">${skills}</div></section>`
          : ""
      }
      ${
        data.experience.length
          ? `<section><h2>Experience</h2>${experience}</section>`
          : ""
      }
      ${
        data.projects.length
          ? `<section><h2>Projects</h2><div class="projects">${projects}</div></section>`
          : ""
      }
      ${
        data.education.length
          ? `<section><h2>Education</h2>${education}</section>`
          : ""
      }
    </main>
    <footer>© ${esc(data.name || "You")} — built with AI Workfolio Builder</footer>
  </div>
</body>
</html>`;
}

function bullets(items: string[]): string {
  if (!items.length) return "";
  return `<ul>${items.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;
}

function link(href: string, label: string, cls = ""): string {
  const rel = href.startsWith("mailto:") ? "" : ' target="_blank" rel="noreferrer"';
  const c = cls ? ` class="${cls}"` : "";
  return `<a${c} href="${escAttr(href)}"${rel}>${esc(label)}</a>`;
}

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escAttr(s: unknown): string {
  return esc(s).replace(/"/g, "&quot;");
}
