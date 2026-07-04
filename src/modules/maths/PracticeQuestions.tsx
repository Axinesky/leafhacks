import { useState } from "react";
import { generateText } from "@/shared/ai/geminiClient";
import { addXp } from "@/shared/progress/useProgress";
import { questionsFor } from "./questions";

/*
 * Practice questions for a maths topic, shown one at a time so pupils are
 * never faced with a wall of questions.
 *
 * Gemini powers the "Hint" button and checks typed answers (correct answers
 * can be written many ways, so string comparison is not enough). The model
 * solution lives locally, so "Show solution" always works, even offline or
 * with no API key.
 */

const TUTOR_SYSTEM =
  "You are a supportive GCSE maths tutor helping a pupil with ADHD practise. " +
  "Use warm, plain British English. Keep every reply to one or two short " +
  "sentences. Never use em dashes. Be encouraging and never judgemental.";

interface QuestionState {
  answer: string;
  hint: string | null;
  feedback: string | null;
  correct: boolean;
  revealed: boolean;
  error: string | null;
}

const FRESH: QuestionState = {
  answer: "",
  hint: null,
  feedback: null,
  correct: false,
  revealed: false,
  error: null,
};

export function PracticeQuestions({ topicId }: { topicId: string }) {
  const questions = questionsFor(topicId);
  const [index, setIndex] = useState(0);
  const [states, setStates] = useState<QuestionState[]>(() =>
    questions.map(() => ({ ...FRESH })),
  );
  const [busy, setBusy] = useState<"hint" | "check" | null>(null);

  if (questions.length === 0) return null;

  const q = questions[index];
  const s = states[index];
  const answered = s.correct || s.revealed;
  const doneCount = states.filter((st) => st.correct || st.revealed).length;

  function patch(update: Partial<QuestionState>) {
    setStates((prev) =>
      prev.map((st, i) => (i === index ? { ...st, ...update } : st)),
    );
  }

  async function getHint() {
    setBusy("hint");
    patch({ error: null });
    try {
      const hint = await generateText(
        `Question: ${q.prompt}\nModel solution: ${q.solution}\n\n` +
          "Give one short hint to help the pupil take their next step. " +
          "Do not reveal the final answer.",
        { system: TUTOR_SYSTEM },
      );
      patch({ hint: hint.trim() });
    } catch {
      patch({
        error:
          "The hint helper is unavailable right now. You can still show the solution below.",
      });
    } finally {
      setBusy(null);
    }
  }

  async function checkAnswer() {
    if (!s.answer.trim()) {
      patch({ error: "Type your answer first, in any format you like." });
      return;
    }
    setBusy("check");
    patch({ error: null, feedback: null });
    try {
      const reply = await generateText(
        `Question: ${q.prompt}\nModel solution: ${q.solution}\n` +
          `Pupil's answer: ${s.answer}\n\n` +
          "Is the pupil's answer mathematically equivalent to the model solution? " +
          "Accept any correct format (fractions, decimals, either order of roots). " +
          "Reply with one line that starts with exactly 'Correct' if it is right, " +
          "or exactly 'Not yet' if it is not, followed by one short encouraging " +
          "sentence. Never reveal the solution.",
        { system: TUTOR_SYSTEM },
      );
      const correct = reply.trim().toLowerCase().startsWith("correct");
      if (correct && !s.correct && !s.revealed) addXp("maths", 5);
      patch({ feedback: reply.trim(), correct: correct || s.correct });
    } catch {
      patch({
        error:
          "Checking is unavailable right now. Compare your working with the solution instead.",
      });
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="panel maths__practice" aria-label="Practice questions">
      <p className="maths__practicehead pixel">
        Practise · question {index + 1} / {questions.length}
        {doneCount > 0 && ` · ${doneCount} done`}
      </p>

      <p className="maths__q">{q.prompt}</p>

      <label htmlFor={`practice-${q.id}`} className="maths__srlabel">
        Your answer
      </label>
      <input
        id={`practice-${q.id}`}
        className="maths__input"
        value={s.answer}
        onChange={(e) => patch({ answer: e.target.value })}
        placeholder="Type your answer, e.g. x = 2 or x = 3"
        autoComplete="off"
      />

      <div className="maths__actions">
        <button
          type="button"
          className="btn"
          onClick={checkAnswer}
          disabled={busy !== null}
        >
          {busy === "check" ? "Checking…" : "✓ Check answer"}
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={getHint}
          disabled={busy !== null}
        >
          {busy === "hint" ? "Thinking…" : "💡 Hint"}
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => patch({ revealed: true })}
          disabled={s.revealed}
        >
          Show solution
        </button>
      </div>

      {s.hint && <p className="maths__hint">{s.hint}</p>}
      {s.feedback && (
        <p
          className={
            "maths__feedback" + (s.correct ? " maths__feedback--correct" : "")
          }
          role="status"
        >
          {s.feedback}
        </p>
      )}
      {s.revealed && <p className="maths__eq">{q.solution}</p>}
      {s.error && (
        <p role="alert" className="maths__error">
          {s.error}
        </p>
      )}

      <div className="maths__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          ← Previous
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
          disabled={index === questions.length - 1 || !answered}
          title={answered ? undefined : "Answer or reveal this one first"}
        >
          Next →
        </button>
      </div>
    </section>
  );
}
