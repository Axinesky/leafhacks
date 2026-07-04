# SocialLearning

Calm, accessible EduTech for learners with ADHD and social anxiety. Lessons
become multi-sensory: narrated audio (ElevenLabs) and AI-generated visuals
(Google Gemini), with a low-stimulation, self-paced interface.

## Quick start

```bash
npm install
cp .env.example .env   # then paste your Gemini + ElevenLabs keys into .env
npm run dev            # runs the web app + API proxy together
```

- Web app: http://localhost:5173
- API proxy: http://localhost:8787 (check http://localhost:8787/api/health)

The app works without keys — AI/audio buttons just show a friendly "not
configured" message until you fill in `.env`.

## Who owns what

| Area | Path | Owner |
| --- | --- | --- |
| English module | `src/modules/english/` | you |
| Maths module | `src/modules/maths/` | collaborator |
| Certificates & pixel art | `src/shared/` (add here) | designer |
| Shared shell / design | `src/shared/`, `src/styles/` | shared |

## Adding a module

1. Create `src/modules/<name>/<Name>Module.tsx` exporting a default component.
2. Register it in `src/modules/registry.tsx`.
   It automatically appears in the sidebar and gets a route at `/learn/<name>`.

## Using AI + audio from a module

```ts
import { speak } from "@/shared/audio/elevenLabsClient";
import { generateImage, generateText } from "@/shared/ai/geminiClient";

await speak("Read this aloud", "dramatic");
const url = await generateImage("a moody castle at dusk");
const note = await generateText("Explain this line simply", { system: "You are a calm tutor." });
```

These call the proxy in `server/` — **API keys never touch the frontend.**

## Design principles (the anti-"AI slop" rules)

- Muted, warm palette; one accent per module — see `src/styles/tokens.css`.
- Respect `prefers-reduced-motion`; large hit targets; visible focus rings.
- Deliberate, on-tone AI prompts — not generic output.
