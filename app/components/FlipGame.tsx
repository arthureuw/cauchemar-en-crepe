"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { makeCrepeGeometry, makeCrepeMaterials } from "../lib/crepe3d";
import { useInView } from "../lib/useInView";

type Trajectory = "land" | "double" | "up" | "left" | "right" | "squash";

type Outcome = {
  trajectory: Trajectory;
  title: string;
  text: string;
  success: boolean;
  weight: number;
};

const OUTCOMES: Outcome[] = [
  { trajectory: "land", success: true, weight: 1, title: "PARFAIT.", text: "Évidemment, personne n'a filmé." },
  { trajectory: "up", success: false, weight: 3, title: "AU PLAFOND.", text: "Elle y est encore. On l'appelle Gérard." },
  { trajectory: "left", success: false, weight: 2, title: "TABLE 4.", text: "Le client n'avait rien commandé. Il paie quand même." },
  { trajectory: "right", success: false, weight: 2, title: "SUR LE CHIEN.", text: "Il a dit merci. Lui au moins." },
  { trajectory: "double", success: false, weight: 2, title: "DOUBLE SALTO.", text: "Retournée deux fois. Donc pas retournée." },
  { trajectory: "squash", success: false, weight: 2, title: "PLIÉE EN QUATRE.", text: "Arthur appelle ça une « crêpe surprise »." },
  { trajectory: "up", success: false, weight: 1, title: "EN ORBITE.", text: "La NASA a appelé. Elle veut la recette." },
];

const RATINGS = [
  { max: 0, text: "Ni retournée, ni comestible." },
  { max: 15, text: "Etchebest pleure quelque part." },
  { max: 35, text: "La grand-mère bretonne est déçue." },
  { max: 60, text: "Presque un crêpier. Presque." },
  { max: 100, text: "Suspect. Arthur a sûrement triché." },
];

function pickOutcome(): Outcome {
  const total = OUTCOMES.reduce((s, o) => s + o.weight, 0);
  let r = Math.random() * total;
  for (const o of OUTCOMES) {
    r -= o.weight;
    if (r <= 0) return o;
  }
  return OUTCOMES[0];
}

type Flip = { id: number; trajectory: Trajectory };

const FLIP_DURATION = 1.25;

function Pan({ flip, onLanded }: { flip: Flip | null; onLanded: (id: number) => void }) {
  const pan = useRef<THREE.Group>(null);
  const crepe = useRef<THREE.Mesh>(null);
  const anim = useRef<{ flip: Flip; t: number; startRotX: number; reported: boolean } | null>(null);
  const respawn = useRef(1);
  const landedFace = useRef(0);

  const geometry = useMemo(() => makeCrepeGeometry(1.05, 0.05), []);
  const materials = useMemo(() => makeCrepeMaterials("crepe", 7), []);

  const panGeometry = useMemo(() => {
    const pts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(1.25, 0),
      new THREE.Vector2(1.38, 0.05),
      new THREE.Vector2(1.5, 0.28),
      new THREE.Vector2(1.46, 0.3),
      new THREE.Vector2(1.34, 0.1),
      new THREE.Vector2(1.2, 0.06),
      new THREE.Vector2(0, 0.06),
    ];
    return new THREE.LatheGeometry(pts, 64);
  }, []);

  useEffect(() => {
    if (!flip || !crepe.current) return;
    anim.current = { flip, t: 0, startRotX: crepe.current.rotation.x, reported: false };
  }, [flip]);

  useFrame((state, dt) => {
    const c = crepe.current;
    const p = pan.current;
    if (!c || !p) return;
    const time = state.clock.elapsedTime;
    const a = anim.current;

    // Coup de poignet de la poêle au début du lancer
    const kick = a && a.t < 0.25 ? Math.sin((a.t / 0.25) * Math.PI) : 0;
    p.rotation.x = -kick * 0.35;
    p.position.y = kick * 0.15;

    if (!a) {
      // Ça grésille tranquillement
      c.position.set(Math.sin(time * 1.3) * 0.03, 0.12, Math.cos(time * 1.1) * 0.03);
      c.rotation.z = Math.sin(time * 2) * 0.02;
      if (respawn.current < 1) {
        respawn.current = Math.min(1, respawn.current + dt * 2.5);
        const s = THREE.MathUtils.smootherstep(respawn.current, 0, 1);
        c.scale.set(s, 1, s);
      }
      return;
    }

    a.t += dt;
    const k = Math.min(1, a.t / FLIP_DURATION);
    const arc = 4 * k * (1 - k);
    const tr = a.flip.trajectory;

    if (tr === "land" || tr === "double" || tr === "squash") {
      const turns = tr === "double" ? Math.PI * 2 : Math.PI;
      c.position.set(0, 0.12 + arc * 3.2, 0);
      c.rotation.x = a.startRotX + turns * THREE.MathUtils.smootherstep(k, 0, 1);
      if (tr === "squash" && k > 0.85) {
        const s = 1 - ((k - 0.85) / 0.15) * 0.5;
        c.scale.set(s, 1, s * 0.6);
      }
    } else {
      const side = tr === "left" ? -1 : tr === "right" ? 1 : 0;
      const up = tr === "up" ? 14 : 3;
      c.position.set(side * k * 9, 0.12 + k * up - (side ? k * k * 4 : 0), side ? -k * 2 : 0);
      c.rotation.x = a.startRotX + k * Math.PI * 5;
      c.rotation.z = side * k * Math.PI * 2;
    }

    if (k >= 1 && !a.reported) {
      a.reported = true;
      onLanded(a.flip.id);
      if (tr === "land") landedFace.current += Math.PI;
      if (tr !== "land" && tr !== "double") {
        // Nouvelle crêpe dans la poêle (on ne lâche rien)
        respawn.current = 0;
        c.scale.set(0, 1, 0);
      }
      c.rotation.set(landedFace.current, 0, 0);
      c.position.set(0, 0.12, 0);
      anim.current = null;
    }
  });

  return (
    <>
      <group ref={pan} position={[0, -0.6, 0]}>
        <mesh geometry={panGeometry}>
          <meshStandardMaterial color="#2a2522" metalness={0.75} roughness={0.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[2.35, 0.24, 0]} rotation={[0, 0, Math.PI / 2 - 0.12]}>
          <cylinderGeometry args={[0.11, 0.13, 1.8, 20]} />
          <meshStandardMaterial color="#6b3e1f" roughness={0.8} />
        </mesh>
        <mesh position={[1.45, 0.18, 0]} rotation={[0, 0, Math.PI / 2 - 0.12]}>
          <cylinderGeometry args={[0.07, 0.07, 0.4, 12]} />
          <meshStandardMaterial color="#3a3330" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh ref={crepe} geometry={geometry} material={materials} position={[0, 0.12, 0]} />
      </group>
    </>
  );
}

// Recule la caméra sur écran étroit pour garder la poêle et son manche dans le cadre
function CameraRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const k = Math.max(1, 1.35 / (size.width / size.height));
    camera.position.set(0, 3.1 * k, 4.4 * k);
    camera.lookAt(0, 0.4, 0);
  }, [camera, size]);
  return null;
}

export default function FlipGame() {
  const [flip, setFlip] = useState<Flip | null>(null);
  const [pending, setPending] = useState<Outcome | null>(null);
  const [result, setResult] = useState<Outcome | null>(null);
  const [stats, setStats] = useState({ tries: 0, wins: 0 });
  const nextId = useRef(1);
  const pendingRef = useRef<Outcome | null>(null);
  const [wrap, inView] = useInView<HTMLDivElement>();

  const busy = pending !== null;

  const launch = () => {
    if (busy) return;
    const outcome = pickOutcome();
    pendingRef.current = outcome;
    setPending(outcome);
    setResult(null);
    setFlip({ id: nextId.current++, trajectory: outcome.trajectory });
  };

  const onLanded = () => {
    const current = pendingRef.current;
    if (!current) return;
    pendingRef.current = null;
    setPending(null);
    setResult(current);
    setStats((s) => ({ tries: s.tries + 1, wins: s.wins + (current.success ? 1 : 0) }));
  };

  const rate = stats.tries ? Math.round((stats.wins / stats.tries) * 100) : 0;
  const rating = RATINGS.find((r) => rate <= r.max) ?? RATINGS[RATINGS.length - 1];

  return (
    <div className="relative flex w-full flex-1 flex-col">
      <div ref={wrap} className="relative min-h-[340px] flex-1">
        <Canvas camera={{ position: [0, 3.1, 4.4], fov: 42 }} dpr={[1, 2]} frameloop={inView ? "always" : "never"}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[2, 6, 3]} intensity={2.4} color="#fff3dc" />
          <pointLight position={[0, -1.2, 1.5]} intensity={18} color="#f15b40" />
          <CameraRig />
          <group position={[-0.5, 0.3, 0]}>
            <Pan flip={flip} onLanded={onLanded} />
          </group>
        </Canvas>

        {result && (
          <div
            key={stats.tries}
            className="animate-pop pointer-events-none absolute inset-x-4 top-4 mx-auto max-w-sm rounded-3xl border border-ink bg-butter px-4 py-3 text-center shadow-[4px_4px_0_var(--color-ink)]"
            role="status"
          >
            <p className="text-2xl font-extrabold">{result.title}</p>
            <p className="text-sm font-medium">{result.text}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 pb-2">
        <button
          type="button"
          onClick={launch}
          disabled={busy}
          className="rounded-full border border-ink bg-raspberry px-8 py-3 text-lg font-extrabold text-cream shadow-[4px_4px_0_var(--color-ink)] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-ink)] active:translate-y-1 active:shadow-[1px_1px_0_var(--color-ink)] disabled:opacity-70"
        >
          {busy ? "Arthur se concentre…" : "Retourne la crêpe, Arthur !"}
        </button>
        <p className="px-4 text-center font-mono text-[11px] text-balance sm:text-xs">
          {stats.tries === 0
            ? "Taux de réussite officiel : non communiqué"
            : `${stats.wins}/${stats.tries} réussies (${rate}\u00a0%) — ${rating.text}`}
        </p>
      </div>
    </div>
  );
}
