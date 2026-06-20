import type {
  Contact,
  EducationItem,
  ExperienceItem,
  GeneratedWorkfolio,
  ProfileData,
  ProjectItem,
  SkillGroup,
} from "./types";

/**
 * Defensively parse the model's JSON output into a typed GeneratedWorkfolio,
 * filling safe defaults so the UI never crashes on a missing field.
 */
export function parseWorkfolio(raw: string): GeneratedWorkfolio {
  const obj = jsonParseLoose(raw);
  const o = obj as Record<string, unknown>;
  const p = (o.profile ?? {}) as Record<string, unknown>;

  const profile: ProfileData = {
    name: asString(p.name),
    title: asString(p.title),
    tagline: asString(p.tagline),
    summary: asString(p.summary),
    contact: asContact(p.contact),
    skills: asSkills(p.skills),
    experience: asExperience(p.experience),
    projects: asProjects(p.projects),
    education: asEducation(p.education),
  };

  return {
    profile,
    linkedinSummary: asString(o.linkedinSummary),
  };
}

function jsonParseLoose(raw: string): unknown {
  const cleaned = stripFences(raw).trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Model did not return valid JSON.");
    }
    return JSON.parse(cleaned.slice(start, end + 1));
  }
}

function stripFences(s: string): string {
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1] : s;
}

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : v == null ? "" : String(v);
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map(asString).filter(Boolean);
}

function normUrl(v: unknown): string {
  const s = asString(v);
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.includes("@") || s.startsWith("+")) return s; // email / phone, leave as-is
  return `https://${s}`;
}

function asContact(v: unknown): Contact {
  const c = (v ?? {}) as Record<string, unknown>;
  const out: Contact = {};
  const email = asString(c.email);
  const phone = asString(c.phone);
  const location = asString(c.location);
  const github = normUrl(c.github);
  const linkedin = normUrl(c.linkedin);
  const website = normUrl(c.website);
  if (email) out.email = email;
  if (phone) out.phone = phone;
  if (location) out.location = location;
  if (github) out.github = github;
  if (linkedin) out.linkedin = linkedin;
  if (website) out.website = website;
  return out;
}

function asSkills(v: unknown): SkillGroup[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      const g = item as Record<string, unknown>;
      return { category: asString(g?.category), items: asStringArray(g?.items) };
    })
    .filter((g) => g.category || g.items.length);
}

function asExperience(v: unknown): ExperienceItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      const e = item as Record<string, unknown>;
      return {
        role: asString(e?.role),
        company: asString(e?.company),
        period: asString(e?.period),
        location: asString(e?.location) || undefined,
        bullets: asStringArray(e?.bullets),
      };
    })
    .filter((e) => e.role || e.company || e.bullets.length);
}

function asProjects(v: unknown): ProjectItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      const p = item as Record<string, unknown>;
      return {
        name: asString(p?.name),
        subtitle: asString(p?.subtitle) || undefined,
        tech: asStringArray(p?.tech),
        liveUrl: normUrl(p?.liveUrl) || undefined,
        repoUrl: normUrl(p?.repoUrl) || undefined,
        bullets: asStringArray(p?.bullets),
      };
    })
    .filter((p) => p.name || p.bullets.length);
}

function asEducation(v: unknown): EducationItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      const e = item as Record<string, unknown>;
      return {
        degree: asString(e?.degree),
        institution: asString(e?.institution),
        period: asString(e?.period),
      };
    })
    .filter((e) => e.degree || e.institution);
}
