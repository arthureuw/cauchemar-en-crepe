import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Aperçu affiché quand on partage le lien (WhatsApp, iMessage, Slack…)
export const alt = "Cauchemar en Crêpe, avec Arthur Leloup : la crêperie où les crêpes volent.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const extraBold = await readFile(join(process.cwd(), "assets/BricolageGrotesque-ExtraBold.ttf"));
const medium = await readFile(join(process.cwd(), "assets/BricolageGrotesque-Medium.ttf"));

const INK = "#0e0e0e";
const CREAM = "#fef7e6";
const RAINBOW = ["#e72f63", "#ffd372", "#88c1f8", "#acd084", "#f6b1cf", "#f15b40"];

const CREPES = [
  { x: -40, y: 360, s: 230, r: -18, topping: "#3b1d0e" },
  { x: 955, y: 330, s: 260, r: 22, topping: "#ffd75e" },
  { x: 60, y: 40, s: 120, r: 30, topping: "#ffe14d" },
  { x: 1010, y: 40, s: 140, r: -25, topping: "#7a4a2a" },
];

function Crepe({ x, y, s, r, topping }: (typeof CREPES)[number]) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: s,
        height: s * 0.8,
        borderRadius: "50%",
        border: `3px solid ${INK}`,
        transform: `rotate(${r}deg)`,
        background: [
          `radial-gradient(circle at 50% 50%, ${topping} 0%, ${topping} 20%, transparent 21%)`,
          // Taches de cuisson
          ...[
            [28, 30, 7],
            [70, 28, 5],
            [24, 66, 6],
            [74, 70, 8],
            [48, 82, 4],
            [84, 48, 4],
            [16, 46, 4],
          ].map(([cx, cy, r]) => `radial-gradient(circle at ${cx}% ${cy}%, #b06a2a 0%, #b06a2a ${r}%, transparent ${r + 1}%)`),
          "radial-gradient(circle at 50% 45%, #f8dc9f 0%, #ebb662 65%, #c07a34 100%)",
        ].join(", "),
        boxShadow: `6px 6px 0 ${INK}`,
      }}
    />
  );
}

function Sparkle({ x, y, s, color }: { x: number; y: number; s: number; color: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 60 60" style={{ position: "absolute", left: x, top: y }}>
      <path
        d="M30 3 C33 22 38 27 57 30 C38 33 33 38 30 57 C27 38 22 33 3 30 C22 27 27 22 30 3Z"
        fill={color}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Rainbow({ text, size: fontSize }: { text: string; size: number }) {
  let n = 0;
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {[...text].map((ch, i) => (
        <span
          key={i}
          style={{
            color: ch === " " ? "transparent" : RAINBOW[n++ % RAINBOW.length],
            WebkitTextStroke: `5px ${INK}`,
            textShadow: `6px 6px 0 ${INK}`,
            width: ch === " " ? fontSize * 0.25 : undefined,
          }}
        >
          {ch}
        </span>
      ))}
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          background: CREAM,
          fontFamily: "Bricolage",
          color: INK,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -100,
            bottom: -420,
            width: 1400,
            height: 640,
            borderRadius: "50%",
            background: "#ffd372",
            border: `3px solid ${INK}`,
          }}
        />
        {CREPES.map((c, i) => (
          <Crepe key={i} {...c} />
        ))}
        <Sparkle x={250} y={110} s={56} color="#e72f63" />
        <Sparkle x={900} y={190} s={44} color="#88c1f8" />
        <Sparkle x={200} y={470} s={40} color="#acd084" />

        <div
          style={{
            marginTop: 70,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 22px",
            borderRadius: 999,
            border: `3px solid ${INK}`,
            background: CREAM,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: 3,
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: 999, background: "#e72f63" }} />
          REC — ÉPISODE 1
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 18, fontSize: 132, fontWeight: 800, lineHeight: 1 }}>
          <Rainbow text="Cauchemar" size={132} />
          <Rainbow text="en Crêpe" size={132} />
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 34,
            padding: "14px 32px",
            borderRadius: 999,
            border: `3px solid ${INK}`,
            background: CREAM,
            boxShadow: `6px 6px 0 ${INK}`,
            fontSize: 36,
            fontWeight: 500,
          }}
        >
          avec&nbsp;<span style={{ fontWeight: 800 }}>Arthur Leloup</span>. Le chef, c&apos;est le problème.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: extraBold, style: "normal", weight: 800 },
        { name: "Bricolage", data: medium, style: "normal", weight: 500 },
      ],
    },
  );
}
