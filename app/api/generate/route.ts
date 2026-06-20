import { NextRequest, NextResponse } from "next/server";
import { buildGenerationPrompt } from "@/lib/prompts";
import { generateJson, ProviderError } from "@/lib/providers";
import { parseWorkfolio } from "@/lib/parse";
import type { GenerateRequest, Provider } from "@/lib/types";

export const runtime = "nodejs";
// Generation can take a while; give it room (Node runtime, no edge timeout).
export const maxDuration = 60;

const VALID_PROVIDERS: Provider[] = ["groq", "gemini"];

export async function POST(req: NextRequest) {
  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { input, provider } = body || ({} as GenerateRequest);

  if (!provider || !VALID_PROVIDERS.includes(provider)) {
    return NextResponse.json(
      { error: `provider must be one of: ${VALID_PROVIDERS.join(", ")}` },
      { status: 400 }
    );
  }

  if (!input || typeof input !== "object") {
    return NextResponse.json({ error: "Missing input." }, { status: 400 });
  }

  const hasAnything = [
    input.name,
    input.title,
    input.skills,
    input.experience,
    input.projects,
  ].some((v) => typeof v === "string" && v.trim().length > 0);

  if (!hasAnything) {
    return NextResponse.json(
      { error: "Please fill in at least one field." },
      { status: 400 }
    );
  }

  try {
    const { system, user } = buildGenerationPrompt(input);
    const raw = await generateJson(provider, system, user);
    const result = parseWorkfolio(raw);
    return NextResponse.json({ result });
  } catch (err) {
    if (err instanceof ProviderError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    const message =
      err instanceof Error ? err.message : "Unexpected generation error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
