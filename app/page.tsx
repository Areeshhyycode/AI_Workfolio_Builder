"use client";

import { useState } from "react";
import type {
  GeneratedWorkfolio,
  Provider,
  WorkfolioInput,
} from "@/lib/types";
import PortfolioView from "@/components/PortfolioView";
import ResumeView from "@/components/ResumeView";
import { buildPortfolioHtml } from "@/lib/exportHtml";

const EMPTY: WorkfolioInput = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  github: "",
  linkedin: "",
  website: "",
  summary: "",
  skills: "",
  experience: "",
  projects: "",
  education: "",
};

const SAMPLE: WorkfolioInput = {
  name: "Areesha Rafiq",
  title: "Full Stack Developer (MERN Stack)",
  email: "areeshazv@gmail.com",
  phone: "+92 322 3007388",
  location: "Karachi, Pakistan",
  github: "github.com/Areeshhyycode",
  linkedin: "linkedin.com/in/areesha-rafiq-net",
  website: "portfolio-delta-ruddy-88.vercel.app",
  summary:
    "Full-Stack Developer with hands-on experience building scalable web and mobile applications using the MERN Stack, Next.js, and React Native. Experienced in integrating modern AI technologies, with a strong focus on performance, scalability, and user experience.",
  skills:
    "Frontend: React.js, Next.js 14 (App Router), Redux Toolkit, Context API, React Hooks, Tailwind CSS, Framer Motion, Material UI\nBackend: Node.js, Express.js, REST APIs, JWT, OAuth, NextAuth.js, Mongoose, Socket.io\nDatabases: MongoDB, MongoDB Atlas, PostgreSQL (basic), Firebase Firestore\nMobile: React Native, Expo, React Navigation\nAI / LLM: Groq AI, OpenAI APIs, LLaMA 3.3 70B, Prompt Engineering\nDevOps & Tools: Git, GitHub, GitHub Actions (CI/CD), Vercel, Netlify, Docker (basic), Postman\nTesting: Jest, React Testing Library",
  experience:
    "Full Stack Developer, Nexal IT Services — Karachi (onsite), 06/2026 – Present. Built scalable web apps with MERN, Next.js, NestJS, Angular and WordPress. Designed RESTful APIs, optimized MongoDB queries, integrated third-party APIs, auth and payments.\n\nJunior MERN Stack Developer, Zero Vertical Labs — Onsite, 11/2025 – Present. Built full-stack web and cross-platform mobile apps with React, Next.js, React Native, Node and MongoDB. Integrated Firebase and OpenAI-powered features; managed state with Redux Toolkit.\n\nMERN Stack Developer Intern, Lokhandwala Web Solutions — Remote, 08/2025 – 10/2025. Built 6+ REST endpoints with JWT auth, improved React Native performance with lazy loading, wrote Jest/RTL tests.",
  projects:
    "ZVTalent — AI-Powered Hiring Platform. Next.js, MongoDB, Groq AI (LLaMA 3.3 70B), NextAuth.js. Live: zv-talent.vercel.app. Reads resumes, scores candidates vs job descriptions, generates tailored interview questions, and shows ranked candidates on an HR dashboard.\n\nJobGenie AI — AI-Powered Job Application Tracker. Next.js 14, React 18, MongoDB, Groq AI, NextAuth.js, Tailwind. Live: job-genie-ai-ebon.vercel.app. Generates tailored cover letters and interview questions, AI match score, real-time analytics dashboard with Recharts.\n\nDaily Vocab — Automated Vocabulary Builder. Next.js, Node.js, Groq AI, GitHub Actions, Vercel. Live: daily-qoutes-ai.vercel.app. Daily word generator with a fully automated CI/CD cron pipeline that auto-commits and deploys.",
  education:
    "Diploma in Advanced Software Development, Aptech Garden, 2023 – 2025\nIntermediate (ICS), Ziauddin College, In Progress",
};

type Tab = "portfolio" | "resume" | "linkedin";

const TABS: { id: Tab; label: string }[] = [
  { id: "portfolio", label: "Portfolio Site" },
  { id: "resume", label: "Resume (PDF)" },
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
          Enter your details — get a polished portfolio site, an ATS-friendly
          resume (download as PDF), and a short LinkedIn summary.
        </p>
      </div>

      <div className="grid">
        {/* ---------- Input panel ---------- */}
        <div className="panel form-panel">
          <div className="row">
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" type="text" value={input.name}
                onChange={(e) => update("name", e.target.value)} placeholder="Areesha Rafiq" />
            </div>
            <div>
              <label htmlFor="title">Title</label>
              <input id="title" type="text" value={input.title}
                onChange={(e) => update("title", e.target.value)} placeholder="Full Stack Developer" />
            </div>
          </div>

          <div className="row">
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" type="text" value={input.email}
                onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" />
            </div>
            <div>
              <label htmlFor="phone">Phone</label>
              <input id="phone" type="text" value={input.phone}
                onChange={(e) => update("phone", e.target.value)} placeholder="+92 …" />
            </div>
          </div>

          <div className="row">
            <div>
              <label htmlFor="location">Location</label>
              <input id="location" type="text" value={input.location}
                onChange={(e) => update("location", e.target.value)} placeholder="Karachi, Pakistan" />
            </div>
            <div>
              <label htmlFor="website">Website / Portfolio</label>
              <input id="website" type="text" value={input.website}
                onChange={(e) => update("website", e.target.value)} placeholder="yoursite.vercel.app" />
            </div>
          </div>

          <div className="row">
            <div>
              <label htmlFor="github">GitHub</label>
              <input id="github" type="text" value={input.github}
                onChange={(e) => update("github", e.target.value)} placeholder="github.com/you" />
            </div>
            <div>
              <label htmlFor="linkedin">LinkedIn</label>
              <input id="linkedin" type="text" value={input.linkedin}
                onChange={(e) => update("linkedin", e.target.value)} placeholder="linkedin.com/in/you" />
            </div>
          </div>

          <label htmlFor="summary">Professional Summary</label>
          <textarea id="summary" rows={3} value={input.summary}
            onChange={(e) => update("summary", e.target.value)}
            placeholder="A few lines about you (or leave blank — AI will write one)." />

          <label htmlFor="skills">Skills</label>
          <textarea id="skills" rows={4} value={input.skills}
            onChange={(e) => update("skills", e.target.value)}
            placeholder="Group like 'Frontend: React, Next.js' — one group per line." />

          <label htmlFor="experience">Experience</label>
          <textarea id="experience" rows={6} value={input.experience}
            onChange={(e) => update("experience", e.target.value)}
            placeholder="One role per block: Title, Company — Location, Dates. What you did." />

          <label htmlFor="projects">Projects</label>
          <textarea id="projects" rows={6} value={input.projects}
            onChange={(e) => update("projects", e.target.value)}
            placeholder="One per block: Name — description. Tech. Live: url. GitHub: url." />

          <label htmlFor="education">Education</label>
          <textarea id="education" rows={2} value={input.education}
            onChange={(e) => update("education", e.target.value)}
            placeholder="Degree, Institution, Years — one per line." />

          <label htmlFor="provider">AI Provider</label>
          <select id="provider" value={provider}
            onChange={(e) => setProvider(e.target.value as Provider)}>
            <option value="groq">Groq (Llama 3.3 70B)</option>
            <option value="gemini">Google Gemini</option>
          </select>

          <button className="btn" onClick={generate} disabled={loading || !filled}>
            {loading ? (<><span className="spinner" /> Generating…</>) : "Generate Workfolio"}
          </button>
          <button className="btn-ghost" style={{ marginTop: 10 }}
            onClick={() => setInput(SAMPLE)} disabled={loading}>
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
                : "Your portfolio, resume, and LinkedIn summary will appear here."}
            </div>
          ) : (
            <Results result={result} tab={tab} setTab={setTab} />
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
}: {
  result: GeneratedWorkfolio;
  tab: Tab;
  setTab: (t: Tab) => void;
}) {
  return (
    <div>
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "portfolio" && (
        <div>
          <div className="result-head">
            <strong>Live preview</strong>
            <button
              className="btn-ghost"
              onClick={() => {
                const slug =
                  (result.profile.name || "portfolio")
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "") || "portfolio";
                downloadFile(
                  buildPortfolioHtml(result.profile),
                  `${slug}-portfolio.html`,
                  "text/html"
                );
              }}
            >
              ⬇ Download Site (.html)
            </button>
          </div>
          <p className="hint" style={{ marginBottom: 12 }}>
            One self-contained file — open it in any browser or drop it on
            Vercel / Netlify / GitHub Pages to go live.
          </p>
          <div className="preview-shell">
            <PortfolioView data={result.profile} />
          </div>
        </div>
      )}

      {tab === "resume" && (
        <div>
          <div className="result-head">
            <strong>ATS-friendly resume</strong>
            <button className="btn-ghost" onClick={() => window.print()}>
              ⬇ Download PDF
            </button>
          </div>
          <p className="hint" style={{ marginBottom: 12 }}>
            Click “Download PDF”, then choose <em>Save as PDF</em> as the printer.
            The text stays selectable, so ATS systems read it correctly.
          </p>
          <div className="preview-shell">
            <ResumeView data={result.profile} />
          </div>
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

function downloadFile(text: string, filename: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
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
