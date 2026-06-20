"use client";

import { useState } from "react";
import type {
  GeneratedWorkfolio,
  Provider,
  WorkfolioInput,
} from "@/lib/types";

const EMPTY: WorkfolioInput = {
  name: "",
  title: "",
  skills: "",
  experience: "",
  projects: "",
};

const SAMPLE: WorkfolioInput = {
  name: "Jordan Rivera",
  title: "Full-Stack Developer",
  skills:
    "TypeScript, React, Next.js, Node.js, PostgreSQL, Python, AWS, Docker, REST APIs",
  experience:
    "Software Engineer at Brightline (2022–present): built customer dashboards used by 10k+ users.\nJunior Developer at Codeworks (2020–2022): maintained internal tooling and CI pipelines.",
  projects:
    "TaskFlow — a real-time team task manager built with Next.js and WebSockets.\nLeafLedger — a personal finance tracker with charting and CSV import.\nDevPort — an open-source portfolio template (1.2k GitHub stars).",
};

type Tab = "portfolio" | "projects" | "resume" | "linkedin";

const TABS: { id: Tab; label: string }[] = [
  { id: "portfolio", label: "Portfolio Site" },
  { id: "projects", label: "Project Descriptions" },
  { id: "resume", label: "Resume" },
  { id: "linkedin", label: "LinkedIn Summary" },
];

export default function Home() {
  const [input, setInput] = useState<WorkfolioInput>(EMPTY);
  const [provider, setProvider] = useState<Provider>("groq");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedWorkfolio | null>(null);
  const [tab, setTab] = useState<Tab>("portfolio");

  function update<K extends keyof WorkfolioInput>(
    key: K,
    value: WorkfolioInput[K]
  ) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, provider }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Generation failed.");
      setResult(data.result as GeneratedWorkfolio);
      setTab("portfolio");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const filled = Object.values(input).some((v) => v.trim().length > 0);

  return (
    <div className="container">
      <div className="header">
        <h1>
          AI <span className="brand">Workfolio</span> Builder
        </h1>
        <p>
          Enter your skills, experience, and projects — get a portfolio site,
          polished project descriptions, a resume, and a LinkedIn summary.
        </p>
      </div>

      <div className="grid">
        {/* ---------- Input panel ---------- */}
        <div className="panel">
          <div className="row">
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Jordan Rivera"
                value={input.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Full-Stack Developer"
                value={input.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </div>
          </div>

          <label htmlFor="skills">Skills</label>
          <textarea
            id="skills"
            rows={3}
            placeholder="TypeScript, React, Node.js, PostgreSQL…"
            value={input.skills}
            onChange={(e) => update("skills", e.target.value)}
          />

          <label htmlFor="experience">Experience</label>
          <textarea
            id="experience"
            rows={4}
            placeholder="One role per line: title, company, what you did…"
            value={input.experience}
            onChange={(e) => update("experience", e.target.value)}
          />

          <label htmlFor="projects">Projects</label>
          <textarea
            id="projects"
            rows={4}
            placeholder="One project per line: name — what it does…"
            value={input.projects}
            onChange={(e) => update("projects", e.target.value)}
          />

          <label htmlFor="provider">AI Provider</label>
          <select
            id="provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value as Provider)}
          >
            <option value="groq">Groq (Llama 3.3 70B)</option>
            <option value="gemini">Google Gemini</option>
          </select>
          <div className="hint">
            Set the matching API key in <code>.env.local</code>.
          </div>

          <button
            className="btn"
            onClick={generate}
            disabled={loading || !filled}
          >
            {loading ? (
              <>
                <span className="spinner" /> Generating…
              </>
            ) : (
              "Generate Workfolio"
            )}
          </button>

          <button
            className="btn-ghost"
            style={{ marginTop: 10 }}
            onClick={() => setInput(SAMPLE)}
            disabled={loading}
          >
            Fill with sample data
          </button>

          {error && <div className="error">{error}</div>}
        </div>

        {/* ---------- Output panel ---------- */}
        <div className="panel">
          {!result ? (
            <div className="empty">
              {loading
                ? "Generating your workfolio — this can take 10–30 seconds…"
                : "Your generated assets will appear here."}
            </div>
          ) : (
            <Results result={result} tab={tab} setTab={setTab} name={input.name} />
          )}
        </div>
      </div>
    </div>
  );
}

function Results({
  result,
  tab,
  setTab,
  name,
}: {
  result: GeneratedWorkfolio;
  tab: Tab;
  setTab: (t: Tab) => void;
  name: string;
}) {
  const slug = (name || "workfolio").toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div>
      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "portfolio" && (
        <div>
          <div className="result-head">
            <strong>Live preview</strong>
            <div className="actions">
              <CopyButton text={result.portfolioHtml} />
              <DownloadButton
                text={result.portfolioHtml}
                filename={`${slug}-portfolio.html`}
                label="Download .html"
                type="text/html"
              />
            </div>
          </div>
          <iframe
            className="preview-frame"
            title="Portfolio preview"
            srcDoc={result.portfolioHtml}
            sandbox="allow-same-origin"
          />
        </div>
      )}

      {tab === "projects" && (
        <div>
          <div className="result-head">
            <strong>Project descriptions</strong>
            <CopyButton
              text={result.projectDescriptions
                .map((p) => `${p.name}\n${p.description}`)
                .join("\n\n")}
            />
          </div>
          {result.projectDescriptions.length === 0 ? (
            <div className="empty">No projects generated.</div>
          ) : (
            result.projectDescriptions.map((p, i) => (
              <div className="project-card" key={i}>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "resume" && (
        <div>
          <div className="result-head">
            <strong>Resume (Markdown)</strong>
            <div className="actions">
              <CopyButton text={result.resume} />
              <DownloadButton
                text={result.resume}
                filename={`${slug}-resume.md`}
                label="Download .md"
                type="text/markdown"
              />
            </div>
          </div>
          <pre className="output">{result.resume}</pre>
        </div>
      )}

      {tab === "linkedin" && (
        <div>
          <div className="result-head">
            <strong>LinkedIn “About” summary</strong>
            <CopyButton text={result.linkedinSummary} />
          </div>
          <pre className="output">{result.linkedinSummary}</pre>
        </div>
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="btn-ghost"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard may be blocked; ignore */
        }
      }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function DownloadButton({
  text,
  filename,
  label,
  type,
}: {
  text: string;
  filename: string;
  label: string;
  type: string;
}) {
  function download() {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button className="btn-ghost" onClick={download}>
      {label}
    </button>
  );
}
