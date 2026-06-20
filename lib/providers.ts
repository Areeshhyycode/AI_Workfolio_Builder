import type { Provider } from "./types";

/**
 * Unified text-generation layer over Groq and Gemini.
 *
 * Both providers are called via plain fetch (no SDK dependency) and both are
 * asked to return a JSON object. We return the raw string; the caller parses.
 */

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

export class ProviderError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "ProviderError";
    this.status = status;
  }
}

export async function generateJson(
  provider: Provider,
  system: string,
  user: string
): Promise<string> {
  if (provider === "groq") return callGroq(system, user);
  if (provider === "gemini") return callGemini(system, user);
  throw new ProviderError(`Unknown provider: ${provider}`, 400);
}

async function callGroq(system: string, user: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new ProviderError(
      "GROQ_API_KEY is not set. Add it to .env.local.",
      400
    );
  }

  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.7,
        max_tokens: 8000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    }
  );

  if (!res.ok) {
    const detail = await safeText(res);
    throw new ProviderError(`Groq error (${res.status}): ${detail}`, res.status);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new ProviderError("Groq returned an empty response.", 502);
  }
  return content;
}

async function callGemini(system: string, user: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new ProviderError(
      "GEMINI_API_KEY is not set. Add it to .env.local.",
      400
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const detail = await safeText(res);
    throw new ProviderError(
      `Gemini error (${res.status}): ${detail}`,
      res.status
    );
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const content: string | undefined = Array.isArray(parts)
    ? parts.map((p: { text?: string }) => p?.text ?? "").join("")
    : undefined;
  if (!content) {
    throw new ProviderError("Gemini returned an empty response.", 502);
  }
  return content;
}

async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 500);
  } catch {
    return "<no body>";
  }
}
