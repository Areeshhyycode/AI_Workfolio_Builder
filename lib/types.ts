// Shared types for the AI Workfolio Builder.

export type Provider = "groq" | "gemini";

/** What the user enters. */
export interface WorkfolioInput {
  name: string;
  title: string; // e.g. "Full-Stack Developer"
  skills: string; // free text or comma separated
  experience: string; // free text, one role per line is fine
  projects: string; // free text, one project per line is fine
}

/** A single generated project blurb. */
export interface ProjectDescription {
  name: string;
  description: string;
}

/** What the AI returns — the four artifacts. */
export interface GeneratedWorkfolio {
  /** Self-contained HTML document for a portfolio site. */
  portfolioHtml: string;
  /** Polished, recruiter-ready project write-ups. */
  projectDescriptions: ProjectDescription[];
  /** Plain-text / markdown resume. */
  resume: string;
  /** LinkedIn "About" summary. */
  linkedinSummary: string;
}

export interface GenerateRequest {
  input: WorkfolioInput;
  provider: Provider;
}
