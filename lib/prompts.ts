import type { WorkfolioInput } from "./types";

/**
 * Builds the single prompt that asks the model for all four artifacts at once,
 * returned as a strict JSON object. Generating in one call keeps cost/latency
 * low and keeps the artifacts consistent with each other.
 */
export function buildGenerationPrompt(input: WorkfolioInput): {
  system: string;
  user: string;
} {
  const system = [
    "You are an expert career writer and front-end developer.",
    "You turn a person's raw skills, experience, and projects into polished,",
    "recruiter-ready career assets.",
    "",
    "You MUST respond with a single valid JSON object and nothing else.",
    "Do not wrap it in markdown code fences. Do not add commentary.",
    "The JSON object must have exactly these keys:",
    '  "portfolioHtml": string  — a COMPLETE, self-contained HTML5 document',
    "      (inline <style>, no external assets, responsive, modern, accessible)",
    "      that presents the person as a portfolio website. Include hero, about,",
    "      skills, experience, and projects sections. Use tasteful colors and",
    "      good typography. It must render standalone in an iframe.",
    '  "projectDescriptions": array of { "name": string, "description": string }',
    "      — one polished 2-4 sentence write-up per project, achievement-focused.",
    '  "resume": string — a clean, ATS-friendly resume in Markdown.',
    '  "linkedinSummary": string — a first-person LinkedIn "About" section,',
    "      ~3 short paragraphs, warm but professional.",
    "",
    "Invent reasonable, professional details only where needed for flow; never",
    "fabricate employers, dates, or metrics the user did not imply.",
  ].join("\n");

  const user = [
    "Here is the person's information. Generate the four assets.",
    "",
    `Name: ${input.name || "(not provided)"}`,
    `Professional title: ${input.title || "(not provided)"}`,
    "",
    "Skills:",
    input.skills || "(not provided)",
    "",
    "Experience:",
    input.experience || "(not provided)",
    "",
    "Projects:",
    input.projects || "(not provided)",
  ].join("\n");

  return { system, user };
}
