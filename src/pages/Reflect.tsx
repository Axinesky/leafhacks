import { useEffect, useRef, useState } from "react";
import { generateText } from "@/shared/ai/geminiClient";
import "./reflect.css";

/*
 * The Reflection Centre: a calm, private space where a warm Gemini companion
 * ("Buddy") listens and helps students feel steadier before or after studying.
 *
 * Safety first. Buddy is NOT a therapist, counsellor or doctor, and the system
 * prompt forbids diagnosis or medical advice. It validates feelings, keeps
 * replies short and kind, and if a student sounds in crisis it gently signposts
 * real help. The same signposting is shown statically in the UI, so it is there
 * even if the AI is unavailable.
 */

const REFLECT_SYSTEM =
  "You are Buddy, a warm, calm companion in a reflection space for UK secondary " +
  "school students, many of whom have ADHD or social anxiety and are revising for " +
  "GCSEs. You are NOT a therapist, doctor or counsellor, and you must never " +
  "diagnose, label, or give medical advice. Your job is simply to listen, validate " +
  "feelings, and gently help the student feel calmer and less alone. Speak in warm, " +
  "plain British English. Keep replies short, two to four sentences. Be kind and " +
  "never judgemental. Normalise what they feel, reflect it back gently, and where it " +
  "helps offer one small, doable idea such as a slow breath, a short break, one tiny " +
  "next step, or writing a worry down. Ask at most one gentle question. Do not " +
  "lecture or give long lists. If a student sounds like they may be in crisis or at " +
  "risk of harming themselves or others, do not try to counsel them: warmly encourage " +
  "them to talk to someone they trust such as a parent, a teacher or their GP, and to " +
  "contact a helpline. In the UK they can call Childline free on 0800 1111, or " +
  "Samaritans on 116 123, at any time. Make clear they deserve support and are not a " +
  "burden. Never claim to be human; if asked, say you are a friendly AI companion.";

type Msg = { role: "you" | "buddy"; text: string };

const WELCOME: Msg = {
  role: "buddy",
  text: "Hi, I'm Buddy. This is a calm, private space, and there's no right or wrong thing to say here. How are you feeling right now?",
};

const QUICK_STARTS = [
  "I'm feeling overwhelmed",
  "I'm anxious about an exam",
  "I can't focus",
  "I just need a moment",
];

export function Reflect() {
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [breathing, setBreathing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, thinking]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || thinking) return;
    const next: Msg[] = [...messages, { role: "you", text: content }];
    setMessages(next);
    setInput("");
    setThinking(true);
    try {
      const reply = await generateText(buildPrompt(next), { system: REFLECT_SYSTEM });
      setMessages((m) => [...m, { role: "buddy", text: reply.trim() }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "buddy",
          text: "I'm having trouble connecting right now, but I'm still here with you. Take one slow breath, and know that whatever you're feeling is okay.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <div className="reflect">
      <header className="reflect__hero">
        <p className="reflect__eyebrow pixel">▸ a calm space</p>
        <h1>Reflection Centre</h1>
        <p className="reflect__lede">
          A private moment to slow down and talk things through. No pressure, no
          judgement, and nobody else can see this.
        </p>
      </header>

      <div className="reflect__tools">
        <button
          type="button"
          className="btn btn--ghost"
          aria-pressed={breathing}
          onClick={() => setBreathing((b) => !b)}
        >
          {breathing ? "Hide breathing" : "🌬️ Breathing exercise"}
        </button>
      </div>

      {breathing && <BreathingExercise />}

      <section className="panel reflect__chat" aria-label="Chat with Buddy">
        <div className="reflect__messages">
          {messages.map((m, i) => (
            <div key={i} className={`reflect__msg reflect__msg--${m.role}`}>
              {m.text}
            </div>
          ))}
          {thinking && (
            <div className="reflect__msg reflect__msg--buddy reflect__typing" aria-label="Buddy is typing">
              <span />
              <span />
              <span />
            </div>
          )}
          <div ref={endRef} />
        </div>

        {messages.length <= 1 && (
          <div className="reflect__quick">
            {QUICK_STARTS.map((q) => (
              <button
                key={q}
                type="button"
                className="reflect__chip"
                onClick={() => send(q)}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <form
          className="reflect__inputrow"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <label htmlFor="reflect-input" className="reflect__srlabel">
            Write to Buddy
          </label>
          <input
            id="reflect-input"
            className="reflect__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type whatever is on your mind…"
            autoComplete="off"
          />
          <button type="submit" className="btn" disabled={thinking || !input.trim()}>
            Send
          </button>
        </form>
      </section>

      <footer className="reflect__safety">
        <p>
          Buddy is a friendly AI companion, not a counsellor or a replacement for
          real support. If things feel like too much, please talk to someone you
          trust. You are not a burden, and you deserve help.
        </p>
        <p className="reflect__help">
          <strong>Childline</strong> 0800 1111 · <strong>Samaritans</strong> 116
          123 · free, any time.
        </p>
      </footer>
    </div>
  );
}

/** A gentle box-breathing guide. Pure CSS/JS, no AI, works offline. */
function BreathingExercise() {
  const phases = [
    { label: "Breathe in", ms: 4000, scale: 1.6 },
    { label: "Hold", ms: 2000, scale: 1.6 },
    { label: "Breathe out", ms: 4000, scale: 1 },
    { label: "Hold", ms: 2000, scale: 1 },
  ];
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(
      () => setPhase((p) => (p + 1) % phases.length),
      phases[phase].ms,
    );
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const current = phases[phase];
  return (
    <div className="panel breathe" aria-label="Breathing exercise">
      <div
        className="breathe__circle"
        style={{
          transform: `scale(${current.scale})`,
          transitionDuration: `${current.ms}ms`,
        }}
      />
      <p className="breathe__label pixel">{current.label}</p>
    </div>
  );
}

/** Turn the conversation into a single prompt for Buddy's next reply. */
function buildPrompt(messages: Msg[]): string {
  const transcript = messages
    .map((m) => `${m.role === "you" ? "Student" : "Buddy"}: ${m.text}`)
    .join("\n");
  return `Here is the conversation so far. Reply as Buddy to the student's latest message.\n\n${transcript}\n\nBuddy:`;
}
