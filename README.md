# AI Workfolio Builder

Enter your **skills, experience, and projects** → get an AI-generated:

- 🌐 **Portfolio website** (self-contained HTML, live preview + download)
- 📝 **Project descriptions** (recruiter-ready write-ups)
- 📄 **Resume** (ATS-friendly Markdown)
- 💼 **LinkedIn summary** (first-person "About" section)

Built with **Next.js (App Router) + TypeScript**. Generation runs server-side
and supports two AI providers: **Groq** (Llama 3.3 70B) and **Google Gemini**.

## Getting started

```bash
npm install
cp .env.example .env.local   # then add your API key(s)
npm run dev
```

Open http://localhost:3000.

### API keys

You only need a key for the provider you select in the UI:

| Provider | Env var          | Get a key                                   |
| -------- | ---------------- | ------------------------------------------- |
| Groq     | `GROQ_API_KEY`   | https://console.groq.com/keys               |
| Gemini   | `GEMINI_API_KEY` | https://aistudio.google.com/app/apikey      |

Optional model overrides: `GROQ_MODEL`, `GEMINI_MODEL`.

## How it works

1. The form posts your input to `POST /api/generate` with the chosen provider.
2. `lib/prompts.ts` builds one prompt asking for all four assets as JSON.
3. `lib/providers.ts` calls Groq or Gemini (plain `fetch`, JSON-mode output).
4. `lib/parse.ts` defensively parses the response into typed assets.
5. The UI renders the portfolio in a sandboxed `<iframe>` and offers copy /
   download for each asset.

## Project structure

```
app/
  page.tsx            # form + tabbed results (client)
  layout.tsx
  globals.css
  api/generate/route.ts   # server route, calls the AI provider
lib/
  types.ts            # shared types
  prompts.ts          # prompt builder
  providers.ts        # Groq + Gemini calls
  parse.ts            # JSON -> typed result
```

## Notes

- The portfolio iframe is sandboxed (`allow-same-origin` only) — generated
  scripts do not run, so the preview is safe.
- Keys are read server-side only; they are never sent to the browser.
