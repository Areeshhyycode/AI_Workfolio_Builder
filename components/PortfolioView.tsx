import type { ProfileData } from "@/lib/types";

/**
 * Polished white & blue portfolio, rendered with React (not raw HTML).
 * All classes are prefixed `pf-` and styled in globals.css.
 */
export default function PortfolioView({ data }: { data: ProfileData }) {
  const c = data.contact;
  return (
    <div className="pf">
      {/* Hero */}
      <header className="pf-hero">
        <div className="pf-hero-inner">
          <span className="pf-eyebrow">{data.title || "Portfolio"}</span>
          <h1 className="pf-name">{data.name || "Your Name"}</h1>
          {data.tagline && <p className="pf-tagline">{data.tagline}</p>}
          <div className="pf-links">
            {c.email && <a className="pf-link" href={`mailto:${c.email}`}>Email</a>}
            {c.website && (
              <a className="pf-link" href={c.website} target="_blank" rel="noreferrer">
                Website
              </a>
            )}
            {c.github && (
              <a className="pf-link" href={c.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}
            {c.linkedin && (
              <a className="pf-link" href={c.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
          </div>
          {(c.location || c.phone) && (
            <p className="pf-meta">
              {[c.location, c.phone].filter(Boolean).join("  ·  ")}
            </p>
          )}
        </div>
      </header>

      <main className="pf-body">
        {data.summary && (
          <section className="pf-section">
            <h2 className="pf-h2">About</h2>
            <p className="pf-summary">{data.summary}</p>
          </section>
        )}

        {data.skills.length > 0 && (
          <section className="pf-section">
            <h2 className="pf-h2">Skills</h2>
            <div className="pf-skills">
              {data.skills.map((g, i) => (
                <div className="pf-skillgroup" key={i}>
                  <h3 className="pf-skillcat">{g.category}</h3>
                  <div className="pf-chips">
                    {g.items.map((s, j) => (
                      <span className="pf-chip" key={j}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="pf-section">
            <h2 className="pf-h2">Experience</h2>
            <div className="pf-timeline">
              {data.experience.map((e, i) => (
                <div className="pf-exp" key={i}>
                  <div className="pf-exp-head">
                    <div>
                      <h3 className="pf-exp-role">{e.role}</h3>
                      <p className="pf-exp-company">
                        {e.company}
                        {e.location ? `  ·  ${e.location}` : ""}
                      </p>
                    </div>
                    {e.period && <span className="pf-period">{e.period}</span>}
                  </div>
                  {e.bullets.length > 0 && (
                    <ul className="pf-bullets">
                      {e.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
          <section className="pf-section">
            <h2 className="pf-h2">Projects</h2>
            <div className="pf-projects">
              {data.projects.map((p, i) => (
                <article className="pf-card" key={i}>
                  <h3 className="pf-card-title">{p.name}</h3>
                  {p.subtitle && <p className="pf-card-sub">{p.subtitle}</p>}
                  {p.tech.length > 0 && (
                    <div className="pf-chips">
                      {p.tech.map((t, j) => (
                        <span className="pf-chip pf-chip-sm" key={j}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {p.bullets.length > 0 && (
                    <ul className="pf-bullets">
                      {p.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                  <div className="pf-card-actions">
                    {p.liveUrl && (
                      <a
                        className="pf-btn"
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Live Demo ↗
                      </a>
                    )}
                    {p.repoUrl && (
                      <a
                        className="pf-btn pf-btn-ghost"
                        href={p.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Code
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="pf-section">
            <h2 className="pf-h2">Education</h2>
            {data.education.map((e, i) => (
              <div className="pf-edu" key={i}>
                <div>
                  <h3 className="pf-edu-degree">{e.degree}</h3>
                  <p className="pf-edu-school">{e.institution}</p>
                </div>
                {e.period && <span className="pf-period">{e.period}</span>}
              </div>
            ))}
          </section>
        )}
      </main>

      <footer className="pf-footer">
        © {data.name || "You"} — built with AI Workfolio Builder
      </footer>
    </div>
  );
}
