// Shared types for the AI Workfolio Builder.

export type Provider = "groq" | "gemini";

/** Raw fields the user enters. */
export interface WorkfolioInput {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  website: string;
  summary: string;
  skills: string;
  experience: string;
  projects: string;
  education: string;
}

export interface Contact {
  email?: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location?: string;
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  subtitle?: string;
  tech: string[];
  liveUrl?: string;
  repoUrl?: string;
  bullets: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
}

/**
 * The single structured profile the AI produces. Both the portfolio site and
 * the resume are rendered from this, so they always stay consistent.
 */
export interface ProfileData {
  name: string;
  title: string;
  tagline: string; // short hero subtitle
  summary: string; // professional summary paragraph
  contact: Contact;
  skills: SkillGroup[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
}

export interface GeneratedWorkfolio {
  profile: ProfileData;
  linkedinSummary: string; // short, first-person
}

export interface GenerateRequest {
  input: WorkfolioInput;
  provider: Provider;
}
