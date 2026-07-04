# SocialLearning

**Learning that adapts to how your brain works.** SocialLearning is a calm,
game-inspired revision platform built for students with ADHD and social anxiety,
where every learner sets their own pace, stimulation level and support tools.

Built at **Leafhacks** (EduTech track), powered by **Google Gemini** and
**ElevenLabs**, and developed with **Cursor**.

## The problem

Most learning apps are built for one kind of attention. For students with ADHD,
a wall of text and a busy interface means skim, distract and give up. For
students with social anxiety, live classes, leaderboards and public performance
add pressure that gets in the way of actually learning.

SocialLearning turns revision into short, rewarding quests you take at your own
pace, with no live faces, no leaderboards and nothing to keep up with.

## What it does

- **Quest-based lessons.** Each lesson is broken into short, focused stages
  shown one at a time, with progress dots, a time estimate and an XP reward for
  finishing each stage. One thing on screen at a time, so it never overwhelms.
- **AQA GCSE English (Macbeth).** A full close-reading quest: the extract,
  themes, Jacobean context, the assessment objectives, and an exam-style
  question.
- **AI examiner feedback.** Students write a paragraph and **Gemini** marks it
  like a supportive AQA examiner against AO1, AO2 and AO3, with one clear target
  to improve.
- **Narrated reading (ElevenLabs).** Any passage can be read aloud, reducing the
  reading load that makes text hard for ADHD learners.
- **AI-drawn scenes (Gemini).** Turn an abstract passage into a picture to
  anchor it in something concrete.
- **The reading buddy.** A pixel mascot hops word by word along the text,
  revealing it one word at a time to keep the eye moving.
- **Encouragement, not pressure.** A rotating educational and motivational quote
  greets students on the homepage.

## Accessibility is the point, not an add-on

On first run, every student sets the experience up to suit them, and can change
it any time from Settings:

- **Colour theme** (Meadow, Dusk, Ocean, Mono)
- **Text size** (Small, Medium, Large)
- **Look and feel:** Cosy Pixel (a playful game aesthetic) or Plain and Calm
  (minimal and low-stimulation) so each learner chooses their own stimulation
  level
- **Reduce motion** and a **dyslexia-friendly easy-read font**

Throughout, the app uses large touch targets, visible keyboard focus, high
contrast, and respects the operating system's reduced-motion setting. Progress
is all gain and never loss: no punishing streaks or leaderboards, which matters
for anxious learners.

## Built with

- **React + TypeScript + Vite** for a fast, component-based frontend
- **React Router** for the module and lesson routing
- **Google Gemini API** for examiner feedback and scene images
- **ElevenLabs API** for narrated audio
- **Express** as a small proxy that keeps API keys server-side
- Self-hosted pixel and reading fonts, so it works offline at the event
- Developed with **Cursor**

## Getting started

```bash
npm install
cp .env.example .env   # then add your Gemini and ElevenLabs keys
npm run dev            # runs the web app and API proxy together
```

- Web app: http://localhost:5173
- API proxy health check: http://localhost:8787/api/health

The app runs without keys: the AI and audio features simply show a friendly
"not configured yet" message until the keys are added to `.env`. Keys live only
in `.env` (which is gitignored) and are used server-side, so they never reach
the browser.

## Root cause analysis: GCE deployment and ElevenLabs failures

If the app works locally but fails on GCE, the most common root cause is a split
deployment:

- frontend served on one host
- API proxy served on another host or port

Previously, the frontend always called relative paths such as `/api/audio/tts`.
That only works when the frontend and API are on the same origin (or when Vite
dev proxy is running). On GCE this often causes requests to hit the frontend
server instead of the API proxy, returning 404/502 responses and making
ElevenLabs appear broken.

### Fix applied

- Added `VITE_API_BASE_URL` support, so production builds can target the API
  proxy origin explicitly.
- Added `.env.example` with all required variables.
- Improved upstream error reporting in the API proxy, so ElevenLabs and Gemini
  failures include real provider details instead of a generic proxy error.

### Deployment checks for GCE

1. Set API secrets on the API runtime:
   - `GEMINI_API_KEY`
   - `ELEVENLABS_API_KEY`
2. Set frontend build variable:
   - `VITE_API_BASE_URL=https://<your-api-domain-or-ip>`
3. Confirm health endpoint from browser network:
   - `GET ${VITE_API_BASE_URL}/api/health`
4. Confirm ElevenLabs response details if it fails:
   - `POST /api/audio/tts` now returns provider error details in `details`.

## How it is built

```
src/
  modules/          each subject is a self-contained module
    english/        AQA GCSE Macbeth (content + UI)
    maths/          visual maths (in progress)
    registry.tsx    register a module here and it appears automatically
  pages/            welcome (onboarding), home
  shared/
    quest/          the stage-by-stage lesson stepper
    prefs/          accessibility preferences, applied app-wide
    buddy/          the reading buddy
    ai/             Gemini client (talks to the proxy)
    audio/          ElevenLabs client (talks to the proxy)
    progress/       XP and levels
  styles/           design tokens and themes
server/             the API proxy that holds the keys
```

Adding a subject is one file plus one line: create
`src/modules/<name>/<Name>Module.tsx` and register it in
`src/modules/registry.tsx`. It then appears in the sidebar with its own route.

## The team

- **English module and website:** the reading quest, onboarding and shared shell
- **Maths module:** visual, animated maths lessons
- **Design:** pixel art, the reading buddy sprite and certificates

## How it was built

Manually programmed by the team, assisted with Claude Code, and proof-read by a
human. The code, comments and copy were reviewed and adjusted by hand rather
than shipped as-generated.
