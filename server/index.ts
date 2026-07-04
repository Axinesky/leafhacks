import express from "express";
import cors from "cors";
import "dotenv/config";

/*
 * API proxy. This is the ONLY place the API keys live. The frontend calls
 * /api/* here; we add the secret key and forward to Google / ElevenLabs.
 *
 * Keys come from .env (see .env.example). Never move these calls to the browser.
 */

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;
const PORT = Number(process.env.API_PORT ?? 8787);

// Models: override via env if you want a different one.
const TEXT_MODEL = process.env.GEMINI_TEXT_MODEL ?? "gemini-2.5-flash";
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";

function requireKey(res: express.Response, key: string | undefined, name: string) {
  if (!key) {
    res.status(500).json({ error: `${name} is not set. Add it to .env and restart.` });
    return false;
  }
  return true;
}

/** Text generation (explanations, simplified rephrasings, quiz items). */
app.post("/api/ai/text", async (req, res) => {
  if (!requireKey(res, GEMINI_KEY, "GEMINI_API_KEY")) return;
  const { prompt, system } = req.body as { prompt?: string; system?: string };
  if (!prompt) return res.status(400).json({ error: "Missing 'prompt'." });

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          ...(system
            ? { systemInstruction: { parts: [{ text: system }] } }
            : {}),
        }),
      },
    );
    if (!r.ok) return res.status(502).json({ error: await r.text() });
    const data = await r.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? "")
        .join("") ?? "";
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

/** Image generation: returns a data URL ready for <img src>. */
app.post("/api/ai/image", async (req, res) => {
  if (!requireKey(res, GEMINI_KEY, "GEMINI_API_KEY")) return;
  const { prompt } = req.body as { prompt?: string };
  if (!prompt) return res.status(400).json({ error: "Missing 'prompt'." });

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      },
    );
    if (!r.ok) return res.status(502).json({ error: await r.text() });
    const data = await r.json();
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    const img = parts.find(
      (p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData,
    );
    if (!img?.inlineData) {
      return res.status(502).json({ error: "No image returned by the model." });
    }
    const { mimeType, data: b64 } = img.inlineData;
    res.json({ dataUrl: `data:${mimeType};base64,${b64}` });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

/** Text-to-speech via ElevenLabs: streams back audio/mpeg. */
app.post("/api/audio/tts", async (req, res) => {
  if (!requireKey(res, ELEVEN_KEY, "ELEVENLABS_API_KEY")) return;
  const { text, voiceId } = req.body as { text?: string; voiceId?: string };
  if (!text || !voiceId)
    return res.status(400).json({ error: "Missing 'text' or 'voiceId'." });

  try {
    const r = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVEN_KEY!,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
        }),
      },
    );
    if (!r.ok) return res.status(502).json({ error: await r.text() });
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(buf);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

/*
 * A fresh educational / motivational quote. No key needed. The frontend already
 * falls back to a local list, so if this source is down it is not a problem.
 */
app.get("/api/quote", async (_req, res) => {
  try {
    const r = await fetch(
      "https://api.quotable.io/random?tags=education|wisdom|inspirational&maxLength=140",
    );
    if (!r.ok) return res.status(502).json({ error: "quote source down" });
    const data = await r.json();
    res.json({ text: data.content, author: data.author });
  } catch (e) {
    res.status(502).json({ error: String(e) });
  }
});

app.get("/api/health", (_req, res) =>
  res.json({
    ok: true,
    gemini: Boolean(GEMINI_KEY),
    elevenlabs: Boolean(ELEVEN_KEY),
  }),
);

app.listen(PORT, () => {
  console.log(`API proxy on http://localhost:${PORT}`);
  if (!GEMINI_KEY) console.warn("  ⚠ GEMINI_API_KEY not set");
  if (!ELEVEN_KEY) console.warn("  ⚠ ELEVENLABS_API_KEY not set");
});
