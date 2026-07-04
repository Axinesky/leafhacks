import { useState } from "react";
import { speak, stop } from "@/shared/audio/elevenLabsClient";
import { generateImage, generateText } from "@/shared/ai/geminiClient";
import { addXp } from "@/shared/progress/useProgress";
import { MACBETH as T, EXAMINER_SYSTEM } from "./content";
import "./english.css";

/*
 * English module: YOUR module.
 *
 * AQA GCSE English Literature (Macbeth). A close-reading quest with narration,
 * an AI-drawn scene, the full exam scaffolding (question, themes, context,
 * assessment objectives) and an examiner-feedback tool powered by Gemini.
 * Content lives in content.ts, so build outward by adding more set texts there.
 */

export function EnglishModule() {
  const [narrating, setNarrating] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reward, setReward] = useState<string | null>(null);

  function award(amount: number, label: string) {
    addXp("english", amount);
    setReward(`+${amount} XP · ${label}`);
    window.setTimeout(() => setReward(null), 2200);
  }

  async function narrate() {
    setError(null);
    try {
      setNarrating(true);
      await speak(T.extract, "dramatic");
      award(10, "listened");
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
      award(20, "scene unlocked");
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
      award(30, "answer marked");
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setMarking(false);
    }
  }

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

      {reward && (
        <div className="english__reward pixel" role="status">
          {reward}
        </div>
      )}

      {/* Exam task */}
      <section className="panel english__task" aria-label="Exam question">
        <h2 className="english__h2">📝 Your task</h2>
        <p className="english__question">{T.question}</p>
        <p className="english__sub">Write about:</p>
        <ul className="english__list">
          {T.taskPoints.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      {/* Extract */}
      <section className="panel english__passage" aria-label="Extract">
        <p className="english__speaker">{T.speaker}</p>
        <p className="english__text">{T.extract}</p>
        <div className="english__actions">
          <button type="button" className="btn" onClick={narrating ? stop : narrate}>
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

      {/* Themes */}
      <section className="english__block" aria-label="Themes">
        <h2 className="english__h2">🎭 Key themes</h2>
        <div className="english__chips">
          {T.themes.map((theme) => (
            <span key={theme} className="chip">
              {theme}
            </span>
          ))}
        </div>
      </section>

      {/* Context (AO3) */}
      <section className="panel english__block" aria-label="Context">
        <h2 className="english__h2">🏰 Context (AO3)</h2>
        <ul className="english__list">
          {T.context.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      {/* Assessment objectives */}
      <section className="english__block" aria-label="Assessment objectives">
        <h2 className="english__h2">🎯 What you are marked on</h2>
        <div className="english__aos">
          {T.objectives.map((ao) => (
            <div key={ao.code} className="panel ao">
              <span className="ao__code pixel">{ao.code}</span>
              <p className="ao__text">{ao.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Examiner feedback (Gemini) */}
      <section className="panel english__block english__practise" aria-label="Practise">
        <h2 className="english__h2">✍️ Practise your answer</h2>
        <p className="english__sub">
          Write a paragraph, then get instant examiner-style feedback. Useful
          terms to try: {T.terminology.join(", ")}.
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

        {feedback && (
          <div className="english__feedback" role="status">
            <p className="english__feedbackhead pixel">Examiner says</p>
            <p>{feedback}</p>
          </div>
        )}
      </section>
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
