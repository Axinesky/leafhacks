import { apiUrl } from "@/shared/api/apiUrl";

/*
 * Frontend Gemini client. It never sees the API key, it just calls our own
 * /api/ai/* proxy, which adds the key server-side. Use these from any module.
 */

export interface GenerateTextOptions {
  /** System-style instruction to steer tone. Keep prompts deliberate; this is
   * how we avoid generic "AI slop" output and keep it on-brand and calm. */
  system?: string;
  signal?: AbortSignal;
}

/** Generate a text response (explanations, simplified rephrasings, quiz items). */
export async function generateText(
  prompt: string,
  opts: GenerateTextOptions = {},
): Promise<string> {
  const res = await fetch(apiUrl("/api/ai/text"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, system: opts.system }),
    signal: opts.signal,
  });
  if (!res.ok) throw new Error(`AI text failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { text: string };
  return data.text;
}

/**
 * Generate an image from a prompt (e.g. "a moody castle courtyard, Macbeth Act 2").
 * Returns a data URL you can drop straight into an <img src>.
 */
export async function generateImage(
  prompt: string,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(apiUrl("/api/ai/image"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
    signal,
  });
  if (!res.ok) throw new Error(`AI image failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { dataUrl: string };
  return data.dataUrl;
}
