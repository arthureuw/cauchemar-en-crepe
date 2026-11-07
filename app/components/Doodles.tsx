import type { SVGProps } from "react";

// Petites illustrations à contour noir, façon carnet de croquis
type P = SVGProps<SVGSVGElement>;
const stroke = { stroke: "#0e0e0e", strokeWidth: 2.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

export function Sparkle({ fill = "#ffd372", ...p }: P & { fill?: string }) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden {...p}>
      <path d="M30 3 C33 22 38 27 57 30 C38 33 33 38 30 57 C27 38 22 33 3 30 C22 27 27 22 30 3Z" fill={fill} {...stroke} />
    </svg>
  );
}

export function Cloud({ fill = "#ffffff", ...p }: P & { fill?: string }) {
  return (
    <svg viewBox="0 0 140 80" aria-hidden {...p}>
      <path
        d="M30 70 C10 70 6 48 22 42 C18 24 42 14 54 26 C60 8 92 8 96 30 C112 22 132 34 124 52 C136 58 130 72 116 70 Z"
        fill={fill}
        {...stroke}
      />
    </svg>
  );
}

export function Bubbles({ fill = "#88c1f8", ...p }: P & { fill?: string }) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden {...p}>
      <circle cx="30" cy="46" r="20" fill={fill} {...stroke} />
      <circle cx="60" cy="22" r="11" fill={fill} {...stroke} />
      <circle cx="64" cy="58" r="6" fill={fill} {...stroke} />
      <path d="M20 40 Q22 32 30 30" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Une planète-crêpe avec son anneau de pâte
export function CrepePlanet(p: P) {
  return (
    <svg viewBox="0 0 160 120" aria-hidden {...p}>
      <circle cx="80" cy="60" r="38" fill="#ebb662" {...stroke} />
      <circle cx="68" cy="48" r="6" fill="#c07a34" />
      <circle cx="92" cy="70" r="8" fill="#c07a34" />
      <circle cx="88" cy="44" r="4" fill="#c07a34" />
      <circle cx="66" cy="74" r="4" fill="#c07a34" />
      <ellipse cx="80" cy="64" rx="72" ry="16" fill="none" {...stroke} stroke="#0e0e0e" />
      <path d="M8 64 C10 76 150 76 152 64" fill="none" stroke="#f6b1cf" strokeWidth="7" strokeLinecap="round" />
      <path d="M8 64 C10 76 150 76 152 64" fill="none" {...stroke} />
    </svg>
  );
}

export function Flame({ fill = "#f15b40", ...p }: P & { fill?: string }) {
  return (
    <svg viewBox="0 0 40 52" aria-hidden {...p}>
      <path d="M20 3 C26 16 36 20 36 34 C36 44 28 50 20 50 C12 50 4 44 4 34 C4 26 10 22 12 14 C16 20 18 22 20 3Z" fill={fill} {...stroke} />
      <path d="M20 26 C24 32 28 34 28 40 C28 45 24 47 20 47 C16 47 12 45 12 40 C12 35 17 33 20 26Z" fill="#ffd372" />
    </svg>
  );
}

export function Squiggle({ color = "#e72f63", ...p }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 120 30" aria-hidden {...p}>
      <path d="M4 18 C16 2 26 30 40 14 S64 2 76 16 S102 28 116 10" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

// Le chef, avec sa toque et sa goutte de sueur
export function ChefArthur(p: P) {
  return (
    <svg viewBox="0 0 220 240" aria-hidden {...p}>
      <path
        d="M58 92 C30 92 24 52 54 48 C56 20 92 14 106 34 C120 10 160 18 158 46 C190 46 192 92 162 92 L158 116 L62 116 Z"
        fill="#fff"
        {...stroke}
      />
      <path d="M62 106 L158 106" {...stroke} fill="none" />
      <circle cx="110" cy="160" r="52" fill="#ffd9b8" {...stroke} />
      <circle cx="90" cy="152" r="6" fill="#0e0e0e" />
      <circle cx="130" cy="152" r="6" fill="#0e0e0e" />
      <path d="M80 136 L98 142 M140 136 L122 142" {...stroke} fill="none" />
      <ellipse cx="110" cy="184" rx="14" ry="10" fill="#e72f63" {...stroke} />
      <path d="M164 124 C170 136 176 142 170 150 C164 156 156 150 158 142 C160 136 162 130 164 124Z" fill="#88c1f8" {...stroke} />
      <circle cx="78" cy="174" r="8" fill="#f6b1cf" opacity="0.8" />
      <circle cx="142" cy="174" r="8" fill="#f6b1cf" opacity="0.8" />
    </svg>
  );
}

export function CircleText({ text, ...p }: P & { text: string }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden {...p}>
      <defs>
        <path id="circle-text-path" d="M200 200 m-160 0 a160 160 0 1 1 320 0 a160 160 0 1 1 -320 0" />
      </defs>
      <circle cx="200" cy="200" r="190" fill="none" stroke="#0e0e0e" strokeWidth="2" />
      <circle cx="200" cy="200" r="128" fill="none" stroke="#0e0e0e" strokeWidth="2" strokeDasharray="4 10" />
      <text fontSize="30" fontWeight="800" letterSpacing="3" fill="#0e0e0e" style={{ fontFamily: "var(--font-bricolage)" }}>
        <textPath href="#circle-text-path" textLength="1000">
          {text}
        </textPath>
      </text>
    </svg>
  );
}
