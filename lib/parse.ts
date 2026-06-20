import type { GeneratedWorkfolio, ProjectDescription } from "./types";

/**
 * Defensively parse the model's JSON output into a GeneratedWorkfolio.
 * Strips accidental markdown fences and validates shape.
 */
export function parseWorkfolio(raw: string): GeneratedWorkfolio {
  const cleaned = stripFences(raw).trim();

  let obj: unknown;
  try {
    obj = JSON.parse(cleaned);
  } catch {
    // Last resort: grab the outermost {...} block.
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Model did not return valid JSON.");
    }
    obj = JSON.parse(cleaned.slice(start, end + 1));
  }

  const o = obj as Record<string, unknown>;

  return {
    portfolioHtml: asString(o.portfolioHtml),
    projectDescriptions: asProjects(o.projectDescriptions),
    resume: asString(o.resume),
    linkedinSummary: asString(o.linkedinSummary),
  };
}

function stripFences(s: string): string {
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1] : s;
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function asProjects(v: unknown): ProjectDescription[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      const p = item as Record<string, unknown>;
      return { name: asString(p?.name), description: asString(p?.description) };
    })
    .filter((p) => p.name || p.description);
}
