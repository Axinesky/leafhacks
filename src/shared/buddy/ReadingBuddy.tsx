import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./reading-buddy.css";

/*
 * ReadingBuddy: a little pixel mascot that hops along the text, revealing one
 * word at a time with a pop.
 *
 * Why it helps: a guided, one-word-at-a-time reveal keeps the eye moving and
 * stops a block of text feeling like a wall, which suits ADHD readers. The
 * text is fully readable by default; the buddy reveal is an opt-in replay.
 *
 * Accessibility: hidden words are only dimmed (not removed), so screen readers
 * still read everything, and if the pupil has chosen reduced motion the buddy
 * sits out and the text just shows in full.
 *
 * The sprite is a placeholder drawn in CSS. Swap `.buddy__sprite` for the
 * designer's pixel art when it lands.
 */

interface Props {
  text: string;
  /** Milliseconds per word while revealing. Lower is faster. */
  wordMs?: number;
}

function reducedMotion() {
  return document.documentElement.dataset.motion === "reduced";
}

export function ReadingBuddy({ text, wordMs = 300 }: Props) {
  // Split into tokens keeping the whitespace, so spacing and wrapping are natural.
  const tokens = useMemo(() => text.split(/(\s+)/), [text]);
  const wordIndices = useMemo(
    () =>
      tokens.reduce<number[]>((acc, tok, i) => {
        if (tok.trim().length) acc.push(i);
        return acc;
      }, []),
    [tokens],
  );

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(0); // how many words are revealed
  const done = started && !playing;

  const textRef = useRef<HTMLParagraphElement>(null);
  const wordEls = useRef<Record<number, HTMLSpanElement | null>>({});
  const [buddy, setBuddy] = useState<{ x: number; y: number } | null>(null);

  function start() {
    if (reducedMotion()) {
      setStarted(true);
      setShown(wordIndices.length);
      return;
    }
    setStarted(true);
    setShown(0);
    setPlaying(true);
  }

  // Step through the words on a timer while playing.
  useEffect(() => {
    if (!playing) return;
    if (shown >= wordIndices.length) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setShown((s) => s + 1), wordMs);
    return () => window.clearTimeout(id);
  }, [playing, shown, wordIndices.length, wordMs]);

  // Move the buddy above the most recently revealed word.
  useLayoutEffect(() => {
    if (!playing || shown === 0) {
      setBuddy(null);
      return;
    }
    const el = wordEls.current[wordIndices[shown - 1]];
    if (el) setBuddy({ x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop });
  }, [playing, shown, wordIndices]);

  return (
    <div className={"buddy" + (playing ? " is-playing" : "")}>
      <button type="button" className="btn btn--ghost buddy__play" onClick={start}>
        {done ? "↻ Reveal again" : "🐣 Reveal with buddy"}
      </button>

      <p ref={textRef} className="buddy__text english__text">
        {tokens.map((tok, i) => {
          if (!tok.trim()) return <span key={i}>{tok}</span>;
          const order = wordIndices.indexOf(i);
          const isShown = !started || done || order < shown;
          return (
            <span
              key={i}
              ref={(el) => {
                wordEls.current[i] = el;
              }}
              className={"buddy__word" + (isShown ? " is-shown" : "")}
            >
              {tok}
            </span>
          );
        })}

        {buddy && (
          <span
            className="buddy__sprite"
            style={{ left: buddy.x, top: buddy.y }}
            aria-hidden="true"
          />
        )}
      </p>
    </div>
  );
}
