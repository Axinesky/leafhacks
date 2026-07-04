import { useState, type ReactNode } from "react";
import { addXp } from "@/shared/progress/useProgress";
import "./quest.css";

/*
 * A quest is a lesson broken into small, focused stages shown one at a time.
 *
 * This is the ADHD-friendly core: instead of one long overwhelming scroll, the
 * pupil sees a single task, a clear sense of how far they are (the dots), a
 * short time estimate, and an XP reward for finishing each stage. Reusable
 * across modules, so Maths can lay its lessons out the same way.
 */

export interface Stage {
  id: string;
  /** Short stage name shown in the header. */
  title: string;
  /** Rough time to finish, in minutes. Bounded tasks help focus. */
  estMinutes: number;
  /** XP awarded the first time this stage is completed. */
  xp: number;
  /** The stage content. */
  render: () => ReactNode;
}

interface QuestProps {
  moduleId: string;
  title: string;
  stages: Stage[];
}

export function Quest({ moduleId, title, stages }: QuestProps) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);

  const stage = stages[index];
  const isLast = index === stages.length - 1;
  const totalXp = stages.reduce((sum, s) => sum + s.xp, 0);

  function advance() {
    // Award this stage's XP once.
    if (!done.has(stage.id)) {
      addXp(moduleId, stage.xp);
      setDone((prev) => new Set(prev).add(stage.id));
    }
    if (isLast) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      window.scrollTo({ top: 0 });
    }
  }

  function restart() {
    setIndex(0);
    setFinished(false);
    window.scrollTo({ top: 0 });
  }

  if (finished) {
    return (
      <div className="quest__complete panel">
        <p className="quest__badge" aria-hidden="true">
          🏅
        </p>
        <h1>Quest complete!</h1>
        <p className="quest__completesub">
          You worked through every stage of <strong>{title}</strong>. Nice work,
          at your own pace.
        </p>
        <p className="quest__xpwon pixel">+{totalXp} XP earned</p>
        <button type="button" className="btn btn--ghost" onClick={restart}>
          ↺ Do it again
        </button>
      </div>
    );
  }

  return (
    <div className="quest">
      {/* Progress: dots so the end is always in sight */}
      <div className="quest__progress" aria-label={`Stage ${index + 1} of ${stages.length}`}>
        <ol className="quest__dots">
          {stages.map((s, i) => (
            <li
              key={s.id}
              className={
                "quest__dot" +
                (i < index ? " is-done" : "") +
                (i === index ? " is-current" : "")
              }
              aria-current={i === index ? "step" : undefined}
            >
              <span className="quest__dotlabel">{s.title}</span>
            </li>
          ))}
        </ol>
      </div>

      <header className="quest__head">
        <p className="quest__step pixel">
          Stage {index + 1} / {stages.length} · ≈ {stage.estMinutes} min
        </p>
        <h1 className="quest__title">{stage.title}</h1>
      </header>

      <div className="quest__body">{stage.render()}</div>

      <div className="quest__nav">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            setIndex((i) => Math.max(0, i - 1));
            window.scrollTo({ top: 0 });
          }}
          disabled={index === 0}
        >
          ← Back
        </button>
        <button type="button" className="btn" onClick={advance}>
          {isLast ? "Finish quest ✓" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
