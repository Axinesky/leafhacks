import { useCallback, useEffect, useState } from "react";

/*
 * Tiny XP/level store, persisted to localStorage. Real progress, not fake,
 * so the HUD and quest map mean something during the demo. Level curve is
 * simple: each level costs 100 XP.
 *
 * Award XP from anywhere:  addXp("english", 20)
 */

const XP_PER_LEVEL = 100;
const KEY = "sl.progress.v1";

export type ProgressMap = Record<string, number>; // moduleId -> total XP

function read(): ProgressMap {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

// module-level so every hook instance stays in sync
let state: ProgressMap = read();
const listeners = new Set<() => void>();

function emit() {
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function addXp(moduleId: string, amount: number) {
  state = { ...state, [moduleId]: (state[moduleId] ?? 0) + amount };
  emit();
}

export function levelFromXp(xp: number) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const into = xp % XP_PER_LEVEL;
  return { level, into, needed: XP_PER_LEVEL, pct: (into / XP_PER_LEVEL) * 100 };
}

/** Subscribe to progress. Returns the map plus helpers. */
export function useProgress() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => void listeners.delete(l);
  }, []);

  const totalXp = Object.values(state).reduce((a, b) => a + b, 0);
  const xpFor = useCallback((id: string) => state[id] ?? 0, []);

  return { xpFor, totalXp, ...levelFromXp(totalXp), addXp };
}
