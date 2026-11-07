import type { CSSProperties } from "react";

const RAINBOW = ["#e72f63", "#ffd372", "#88c1f8", "#acd084", "#f6b1cf", "#f15b40"];

export function RollText({ text }: { text: string }) {
  return (
    <span className="roll" aria-label={text}>
      <span aria-hidden>
        {[...text].map((ch, i) => (
          <span key={i} className="roll-char" style={{ "--i": i } as CSSProperties}>
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}

export function RainbowText({ text, offset = 0 }: { text: string; offset?: number }) {
  let n = offset;
  return (
    <span aria-label={text}>
      {text.split(" ").map((word, w) => (
        <span key={w}>
          {w > 0 && " "}
          <span aria-hidden className="inline-block whitespace-nowrap">
            {[...word].map((ch, i) => (
              <span key={i} className="rainbow-letter" style={{ color: RAINBOW[n++ % RAINBOW.length] }}>
                {ch}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
