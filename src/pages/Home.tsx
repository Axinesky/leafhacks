import { Link } from "react-router-dom";
import { modules } from "@/modules/registry";
import { useProgress, levelFromXp } from "@/shared/progress/useProgress";
import "./home.css";

export function Home() {
  const { xpFor } = useProgress();

  return (
    <div className="home">
      <header className="home__hero">
        <p className="home__eyebrow pixel">▸ your journey</p>
        <h1>Choose your quest</h1>
        <p className="home__lede">
          Learn at your own pace: narrated, visual, and pressure-free. Earn XP,
          level up, and unlock badges as you go. No leaderboards, no rush.
        </p>
      </header>

      <section aria-label="Quests" className="home__grid">
        {modules.map((m) => {
          const { level, pct } = levelFromXp(xpFor(m.id));
          return (
            <Link
              key={m.id}
              to={`/learn/${m.id}`}
              className="panel home__quest"
              style={{ ["--accent" as string]: m.accent }}
            >
              <div className="home__questtop">
                <span className="home__glyph" aria-hidden="true">
                  {m.glyph}
                </span>
                <span className="home__lv pixel">Lv.{level}</span>
              </div>
              <h2>{m.title}</h2>
              <p>{m.description}</p>
              <div className="xpbar home__questxp" aria-hidden="true">
                <div className="xpbar__fill" style={{ width: `${pct}%` }} />
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
