import { speak, stop } from "@/shared/audio/elevenLabsClient";
import { addXp } from "@/shared/progress/useProgress";
import { useState } from "react";

/*
 * Maths module: YOUR COLLABORATOR'S module.
 *
 * Intentionally a light shell so they can own it without merge collisions.
 * The plan: animated graphs (a plotting lib or SVG/canvas) with a "narrate the
 * concept" button already wired to ElevenLabs below as a starting example.
 */

export function MathsModule() {
  const [narrating, setNarrating] = useState(false);

  async function explain() {
    setNarrating(true);
    try {
      await speak(
        "A parabola is the shape you get when you square a number. " +
          "As the input grows, the output grows much faster, curving upward.",
        "warm",
      );
      addXp("maths", 10);
    } finally {
      setNarrating(false);
    }
  }

  return (
    <article>
      <p className="pixel" style={{ color: "var(--accent)", fontSize: "0.6rem", margin: 0 }}>
        ▸ visual maths quest
      </p>
      <h1 style={{ marginTop: "var(--space-2)" }}>Coming to life here</h1>
      <div className="card" style={{ marginTop: "var(--space-6)" }}>
        <p style={{ marginTop: 0, color: "var(--text-muted)" }}>
          Animated graph goes here. The audio + AI plumbing is shared, so you can
          focus on the visuals.
        </p>
        <button
          type="button"
          className="btn"
          onClick={narrating ? stop : explain}
        >
          {narrating ? "⏹ Stop" : "🔊 Explain a parabola"}
        </button>
      </div>
    </article>
  );
}

export default MathsModule;
