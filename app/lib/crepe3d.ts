import * as THREE from "three";

export type CrepeKind =
  | "crepe"
  | "complete"
  | "chevre"
  | "philadelphia"
  | "gourmande"
  | "sucre"
  | "nutella"
  | "marrons"
  | "duo";

// Générateur pseudo-aléatoire déterministe : même scène à chaque chargement
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Pâte de froment pour tout le monde, salées comprises
const BLE = { base: "#ebb662", light: "#f8dc9f", spot: "#a8601f" };

type Ctx = CanvasRenderingContext2D;
type Rand = () => number;

function blob(ctx: Ctx, x: number, y: number, r: number, rand: Rand) {
  ctx.beginPath();
  const n = 9;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (0.8 + rand() * 0.35);
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function spread(ctx: Ctx, c: number, color: string, rand: Rand, strokes = 7) {
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let i = 0; i < strokes; i++) {
    ctx.lineWidth = 12 + rand() * 14;
    ctx.beginPath();
    let x = c - 170 + rand() * 40;
    let y = c - 150 + i * (300 / strokes);
    ctx.moveTo(x, y);
    for (let k = 0; k < 6; k++) {
      x += 50 + rand() * 20;
      y += (rand() - 0.5) * 60;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function ham(ctx: Ctx, c: number, color: string, rand: Rand, n = 3) {
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    ctx.save();
    ctx.translate(c + (rand() - 0.5) * 180, c + (rand() - 0.5) * 180);
    ctx.rotate(rand() * Math.PI);
    blob(ctx, 0, 0, 55 + rand() * 20, rand);
    ctx.restore();
  }
}

function cheese(ctx: Ctx, c: number, rand: Rand) {
  ctx.strokeStyle = "#ffd75e";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  for (let i = 0; i < 90; i++) {
    const x = c + (rand() - 0.5) * 300;
    const y = c + (rand() - 0.5) * 300;
    const a = rand() * Math.PI;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * 22, y + Math.sin(a) * 22);
    ctx.stroke();
  }
}

function egg(ctx: Ctx, c: number, rand: Rand) {
  ctx.fillStyle = "#fffaf0";
  blob(ctx, c, c, 92, rand);
  const yolk = ctx.createRadialGradient(c - 8, c - 8, 4, c, c, 42);
  yolk.addColorStop(0, "#ffe27a");
  yolk.addColorStop(1, "#f29b12");
  ctx.fillStyle = yolk;
  ctx.beginPath();
  ctx.arc(c, c, 40, 0, Math.PI * 2);
  ctx.fill();
}

function goat(ctx: Ctx, c: number, rand: Rand) {
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + rand() * 0.3;
    const x = c + Math.cos(a) * 120;
    const y = c + Math.sin(a) * 120;
    ctx.fillStyle = "#f7f1e3";
    ctx.beginPath();
    ctx.arc(x, y, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#e6d9b8";
    ctx.lineWidth = 5;
    ctx.stroke();
  }
}

function drawTexture(kind: CrepeKind, seed: number) {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const rand = seeded(seed);
  const c = size / 2;
  const p = BLE;

  const grad = ctx.createRadialGradient(c, c, 10, c, c, c);
  grad.addColorStop(0, p.light);
  grad.addColorStop(0.75, p.base);
  grad.addColorStop(1, p.spot);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Les taches de cuisson « dentelle »
  for (let i = 0; i < 260; i++) {
    const r = Math.sqrt(rand()) * c * 0.95;
    const a = rand() * Math.PI * 2;
    const s = 2 + rand() * 14;
    ctx.globalAlpha = 0.15 + rand() * 0.45;
    ctx.fillStyle = p.spot;
    ctx.beginPath();
    ctx.ellipse(c + Math.cos(a) * r, c + Math.sin(a) * r, s, s * (0.5 + rand() * 0.6), rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  switch (kind) {
    case "complete":
      ham(ctx, c, "#ec9ea0", rand);
      cheese(ctx, c, rand);
      egg(ctx, c, rand);
      break;
    case "chevre":
      ham(ctx, c, "#b5333c", rand, 4);
      goat(ctx, c, rand);
      break;
    case "philadelphia":
      ham(ctx, c, "#ec9ea0", rand);
      spread(ctx, c, "#fbf8f2", rand, 5);
      break;
    case "gourmande":
      ham(ctx, c, "#ec9ea0", rand, 2);
      ham(ctx, c, "#b5333c", rand, 2);
      goat(ctx, c, rand);
      spread(ctx, c, "rgba(251,248,242,0.85)", rand, 3);
      cheese(ctx, c, rand);
      egg(ctx, c, rand);
      break;
    case "sucre":
      ctx.fillStyle = "#fffdf6";
      for (let i = 0; i < 420; i++) {
        const r = Math.sqrt(rand()) * c * 0.8;
        const a = rand() * Math.PI * 2;
        ctx.fillRect(c + Math.cos(a) * r, c + Math.sin(a) * r, 3, 3);
      }
      for (let i = 0; i < 2; i++) {
        const x = c + (i ? 70 : -60);
        const y = c + (i ? -50 : 60);
        ctx.fillStyle = "#ffe14d";
        ctx.beginPath();
        ctx.arc(x, y, 52, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff6b3";
        ctx.beginPath();
        ctx.arc(x, y, 42, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffe14d";
        ctx.lineWidth = 4;
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(a) * 42, y + Math.sin(a) * 42);
          ctx.stroke();
        }
      }
      break;
    case "nutella":
      spread(ctx, c, "#3b1d0e", rand);
      break;
    case "marrons":
      spread(ctx, c, "#7a4a2a", rand);
      break;
    case "duo":
      spread(ctx, c, "#3b1d0e", rand, 4);
      spread(ctx, c, "#8a5634", rand, 4);
      break;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Disque fin, légèrement gondolé, comme une vraie crêpe (ratée)
export function makeCrepeGeometry(radius = 1, wobble = 0.12, thetaLength = Math.PI * 2) {
  const geo = new THREE.CylinderGeometry(radius, radius, 0.035, 72, 1, false, 0, thetaLength);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const d = Math.min(1, Math.hypot(x, z) / radius);
    const w = Math.sin(x * 3.1 + 0.6) * Math.cos(z * 2.7) + Math.sin(Math.atan2(z, x) * 5) * 0.6;
    pos.setY(i, pos.getY(i) + w * wobble * d * d);
  }
  geo.computeVertexNormals();
  return geo;
}

export function makeCrepeMaterials(kind: CrepeKind, seed: number) {
  const top = drawTexture(kind, seed);
  const bottom = drawTexture("crepe", seed + 7);
  const edge = new THREE.MeshStandardMaterial({ color: BLE.spot, roughness: 0.8 });
  return [
    edge,
    new THREE.MeshStandardMaterial({ map: top, roughness: 0.65 }),
    new THREE.MeshStandardMaterial({ map: bottom, roughness: 0.75 }),
  ];
}
