import type { WorkfolioInput } from "./types";

/**
 * Builds the prompt that turns the user's raw input into ONE structured
 * profile object plus a short LinkedIn summary. The app renders the portfolio
 * site and the resume from this structured data, so the model only has to
 * produce clean, well-organized content — not markup.
 */
export function buildGenerationPrompt(input: WorkfolioInput): {
  system: string;
  user: string;
} {
  const system = [
    "You are an expert career writer who turns a person's raw notes into a",
    "polished, recruiter-ready professional profile.",
    "",
    "Respond with a SINGLE valid JSON object and nothing else — no markdown",
    "fences, no commentary. Use this exact shape:",
    "{",
    '  "profile": {',
    '    "name": string,',
    '    "title": string,                 // professional title',
    '    "tagline": string,               // ONE short punchy hero line (max ~12 words)',
    '    "summary": string,               // 2-4 sentence professional summary',
    '    "contact": {                     // copy verbatim from input; omit if missing',
    '      "email": string, "phone": string, "location": string,',
    '      "github": string, "linkedin": string, "website": string',
    "    },",
    '    "skills": [ { "category": string, "items": string[] } ],  // grouped',
    '    "experience": [ {',
    '      "role": string, "company": string, "period": string,',
    '      "location": string,            // optional',
    '      "bullets": string[]            // 2-4 achievement-focused bullets',
    "    } ],",
    '    "projects": [ {',
    '      "name": string, "subtitle": string,   // subtitle = one-line description',
    '      "tech": string[],                      // tech stack tags',
    '      "liveUrl": string, "repoUrl": string,  // optional; extract from input',
    '      "bullets": string[]                    // 2-3 impact bullets',
    "    } ],",
    '    "education": [ { "degree": string, "institution": string, "period": string } ]',
    "  },",
    '  "linkedinSummary": string  // SHORT: 3-4 sentences, first person, warm',
    "}",
    "",
    "Rules:",
    "- Copy contact details, live URLs, and repo URLs VERBATIM from the input.",
    "  If the input says 'Live: foo.vercel.app', set liveUrl to that URL.",
    "  Normalize URLs to include https:// where missing.",
    "- Keep the LinkedIn summary genuinely short — no more than 4 sentences.",
    "- Rewrite bullets to be concrete and achievement-focused, but NEVER invent",
    "  employers, dates, metrics, or links the user did not provide.",
    "- If a field is empty, return an empty string or empty array — do not guess.",
  ].join("\n");

  const user = [
    "Build the profile from this information:",
    "",
    `Name: ${input.name || "(none)"}`,
    `Title: ${input.title || "(none)"}`,
    `Email: ${input.email || "(none)"}`,
    `Phone: ${input.phone || "(none)"}`,
    `Location: ${input.location || "(none)"}`,
    `GitHub: ${input.github || "(none)"}`,
    `LinkedIn: ${input.linkedin || "(none)"}`,
    `Website/Portfolio: ${input.website || "(none)"}`,
    "",
    "Professional summary (raw):",
    input.summary || "(none — write one from the rest)",
    "",
    "Skills:",
    input.skills || "(none)",
    "",
    "Experience (one role per block):",
    input.experience || "(none)",
    "",
    "Projects (one per block; include any Live/GitHub links):",
    input.projects || "(none)",
    "",
    "Education:",
    input.education || "(none)",
  ].join("\n");

  return { system, user };
}
