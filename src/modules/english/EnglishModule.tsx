import { useState } from "react";
import { speak, stop } from "@/shared/audio/elevenLabsClient";
import { generateImage, generateText } from "@/shared/ai/geminiClient";
import { Quest, type Stage } from "@/shared/quest/Quest";
import { ReadingBuddy } from "@/shared/buddy/ReadingBuddy";
import { MACBETH as T, EXAMINER_SYSTEM } from "./content";
import "./english.css";

/*
 * English module: YOUR module.
 *
 * AQA GCSE English Literature (Macbeth), delivered as a quest of short stages
 * rather than one long page. Showing one focused thing at a time is the
 * ADHD-friendly heart of this: read and listen, spot the themes, learn the
 * context, then write and get marked. Content lives in content.ts.
 */

export function EnglishModule() {
  // Shared state, used across the stages below.
  const [narrating, setNarrating] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function narrate() {
    setError(null);
    try {
      setNarrating(true);
      await speak(T.extract, "dramatic");
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setNarrating(false);
    }
  }

  async function visualise() {
    setError(null);
    setLoadingImage(true);
    try {
      setImage(await generateImage(T.scenePrompt));
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setLoadingImage(false);
    }
  }

  async function markAnswer() {
    if (answer.trim().length < 20) {
      setError("Write a little more first, at least a sentence or two.");
      return;
    }
    setError(null);
    setMarking(true);
    setFeedback(null);
    try {
      const result = await generateText(
        `Question: ${T.question}\n\nPupil's paragraph:\n${answer}`,
        { system: EXAMINER_SYSTEM },
      );
      setFeedback(result);
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setMarking(false);
    }
  }

  const stages: Stage[] = [
    {
      id: "read",
      title: "Read and listen",
      estMinutes: 3,
      xp: 10,
      render: () => (
        <>
          <p className="english__instruction">
            Read the extract slowly. Press play to hear it read aloud, and draw
            the scene if it helps you picture it.
          </p>
          <section className="panel english__passage" aria-label="Extract">
            <p className="english__speaker">{T.speaker}</p>
            <ReadingBuddy text={T.extract} />
            <div className="english__actions">
              <button
                type="button"
                className="btn"
                onClick={narrating ? stop : narrate}
              >
                {narrating ? "⏹ Stop" : "🔊 Read aloud"}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={visualise}
                disabled={loadingImage}
              >
                {loadingImage ? "Drawing…" : "🎨 Picture this scene"}
              </button>
            </div>
          </section>
          {error && (
            <p role="alert" className="english__error">
              {error}
            </p>
          )}
          {image && (
            <figure className="english__figure">
              <img src={image} alt={`Illustration of the scene: ${T.scenePrompt}`} />
              <figcaption>An imagined view of the scene.</figcaption>
            </figure>
          )}
        </>
      ),
    },
    {
      id: "themes",
      title: "Spot the themes",
      estMinutes: 1,
      xp: 10,
      render: () => (
        <>
          <p className="english__instruction">
            These are the big ideas Shakespeare explores. Keep them in mind as
            you read, they are what your answer should track.
          </p>
          <div className="english__chips">
            {T.themes.map((theme) => (
              <span key={theme} className="chip">
                {theme}
              </span>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "context",
      title: "Context (AO3)",
      estMinutes: 2,
      xp: 10,
      render: () => (
        <>
          <p className="english__instruction">
            Context you can weave into your answer to hit AO3.
          </p>
          <ul className="english__list english__contextlist">
            {T.context.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: "write",
      title: "Write and get marked",
      estMinutes: 5,
      xp: 30,
      render: () => (
        <>
          <section className="panel english__task" aria-label="Exam question">
            <p className="english__question">{T.question}</p>
            <p className="english__sub">Write about:</p>
            <ul className="english__list">
              {T.taskPoints.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>

          <div className="english__aos">
            {T.objectives.map((ao) => (
              <div key={ao.code} className="panel ao">
                <span className="ao__code pixel">{ao.code}</span>
                <p className="ao__text">{ao.summary}</p>
              </div>
            ))}
          </div>

          <p className="english__instruction">
            Useful terms to try: {T.terminology.join(", ")}.
          </p>
          <label htmlFor="answer" className="english__srlabel">
            Your paragraph
          </label>
          <textarea
            id="answer"
            className="english__textarea"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="In this extract, Shakespeare presents Macbeth's ambition through…"
            rows={6}
          />
          <button
            type="button"
            className="btn btn--gold"
            onClick={markAnswer}
            disabled={marking}
          >
            {marking ? "Marking…" : "🧑‍🏫 Get examiner feedback"}
          </button>

          {error && (
            <p role="alert" className="english__error">
              {error}
            </p>
          )}
          {feedback && (
            <div className="english__feedback" role="status">
              <p className="english__feedbackhead pixel">Examiner says</p>
              <p>{feedback}</p>
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <article className="english">
      <header className="english__head">
        <p className="english__eyebrow pixel">▸ close reading quest</p>
        <h1>
          {T.play}: {T.focusTheme}
        </h1>
        <div className="english__tags">
          <span className="tag tag--exam pixel">
            {T.board} · {T.paper}
          </span>
          <span className="tag pixel">{T.scene}</span>
        </div>
      </header>

      <Quest moduleId="english" title={`${T.play}: ${T.focusTheme}`} stages={stages} />
    </article>
  );
}

function errMessage(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  return msg.includes("500") || msg.includes("key")
    ? "The AI service isn't configured yet. Add your API keys to .env and restart."
    : msg;
}

export default EnglishModule;
