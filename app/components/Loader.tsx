"use client";

import { useEffect, useState, type CSSProperties } from "react";

const LINES = [
  "Arthur fait chauffer la poêle…",
  "Arthur cherche la recette…",
  "Arthur a trouvé le beurre…",
  "Arthur évacue la fumée…",
];

// Le rideau se lève tout seul en CSS : le JS ne fait que compter
export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 2000);
      setProgress(Math.round((1 - Math.pow(1 - k, 3)) * 100));
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (gone) return null;

  return (
    <div
      className="loader fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-butter"
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setGone(true);
      }}
      aria-hidden
    >
      <div className="relative flex h-40 w-56 flex-col-reverse items-center">
        {["#ebb662", "#e2a552", "#f0c27a", "#e2a552", "#ebb662"].map((color, i) => (
          <div
            key={i}
            className="loader-crepe -mt-3 h-8 w-48 rounded-[50%] border-2 border-ink"
            style={{ background: color, "--i": i, rotate: `${(i % 2 ? 1 : -1) * (3 + i * 2)}deg` } as CSSProperties}
          />
        ))}
      </div>
      <p className="font-display text-[clamp(4rem,14vw,9rem)] leading-none font-extrabold tabular-nums">
        {progress}%
      </p>
      <p className="font-mono text-sm uppercase tracking-widest">
        {LINES[Math.min(LINES.length - 1, Math.floor(progress / 26))]}
      </p>
    </div>
  );
}
