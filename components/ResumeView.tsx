import type { ProfileData } from "@/lib/types";

/**
 * ATS-friendly resume: a single white sheet of real, selectable text (no
 * tables, no images), so applicant-tracking systems parse it cleanly. The
 * `.rs-doc` element is what gets printed to PDF (see print styles + page.tsx).
 */
export default function ResumeView({ data }: { data: ProfileData }) {
  const c = data.contact;
  const contactLine = [
    c.email,
    c.phone,
    c.location,
    plain(c.website),
    plain(c.github),
    plain(c.linkedin),
  ]
    .filter(Boolean)
    .join("  |  ");

  return (
    <div className="rs-doc" id="resume-print">
      <h1 className="rs-name">{data.name || "Your Name"}</h1>
      <p className="rs-title">{data.title}</p>
      {contactLine && <p className="rs-contact">{contactLine}</p>}

      {data.summary && (
        <section className="rs-section">
          <h2 className="rs-h2">Professional Summary</h2>
          <p className="rs-text">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="rs-section">
          <h2 className="rs-h2">Professional Experience</h2>
          {data.experience.map((e, i) => (
            <div className="rs-entry" key={i}>
              <div className="rs-entry-head">
                <span className="rs-entry-title">
                  {e.role}
                  {e.company ? `, ${e.company}` : ""}
                </span>
                <span className="rs-entry-meta">
                  {[e.period, e.location].filter(Boolean).join(" · ")}
                </span>
              </div>
              <ul className="rs-bullets">
                {e.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="rs-section">
          <h2 className="rs-h2">Technical Skills</h2>
          {data.skills.map((g, i) => (
            <p className="rs-skill" key={i}>
              <strong>{g.category}:</strong> {g.items.join(", ")}
            </p>
          ))}
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="rs-section">
          <h2 className="rs-h2">Projects</h2>
          {data.projects.map((p, i) => (
            <div className="rs-entry" key={i}>
              <div className="rs-entry-head">
                <span className="rs-entry-title">
                  {p.name}
                  {p.subtitle ? `, ${p.subtitle}` : ""}
                </span>
                {p.liveUrl && (
                  <span className="rs-entry-meta">Live: {plain(p.liveUrl)}</span>
                )}
              </div>
              {p.tech.length > 0 && (
                <p className="rs-tech">{p.tech.join(" · ")}</p>
              )}
              <ul className="rs-bullets">
                {p.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section className="rs-section">
          <h2 className="rs-h2">Education</h2>
          {data.education.map((e, i) => (
            <div className="rs-entry-head" key={i}>
              <span className="rs-entry-title">
                {e.degree}
                {e.institution ? `, ${e.institution}` : ""}
              </span>
              <span className="rs-entry-meta">{e.period}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

/** Strip the protocol so resume links read cleanly (e.g. github.com/x). */
function plain(url?: string): string {
  if (!url) return "";
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}
