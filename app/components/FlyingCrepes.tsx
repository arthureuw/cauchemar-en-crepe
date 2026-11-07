"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { makeCrepeGeometry, makeCrepeMaterials, seeded, type CrepeKind } from "../lib/crepe3d";

const KINDS: CrepeKind[] = ["crepe", "nutella", "marrons", "sucre", "duo", "complete"];

type Flyer = {
  kind: number;
  x: number;
  y: number;
  z: number;
  speed: number;
  drift: number;
  spin: THREE.Vector3;
  scale: number;
  phase: number;
};

function Crepes({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const scrollBoost = useRef(0);
  const lastScroll = useRef(0);
  const { viewport } = useThree();

  const assets = useMemo(
    () => ({
      geometry: makeCrepeGeometry(1, 0.14),
      materials: KINDS.map((k, i) => makeCrepeMaterials(k, 11 + i * 31)),
    }),
    [],
  );

  const flyers = useMemo<Flyer[]>(() => {
    const rand = seeded(42);
    return Array.from({ length: count }, () => ({
      kind: Math.floor(rand() * KINDS.length),
      x: (rand() - 0.5) * 2,
      y: (rand() - 0.5) * 2,
      z: -4 - rand() * 9,
      speed: 0.25 + rand() * 0.5,
      drift: (rand() - 0.5) * 0.4,
      spin: new THREE.Vector3((rand() - 0.5) * 3, (rand() - 0.5) * 1.5, (rand() - 0.5) * 2),
      scale: 0.45 + rand() * 0.5,
      phase: rand() * Math.PI * 2,
    }));
  }, [count]);

  useEffect(() => {
    lastScroll.current = window.scrollY;
    const onScroll = () => {
      const delta = window.scrollY - lastScroll.current;
      lastScroll.current = window.scrollY;
      scrollBoost.current = THREE.MathUtils.clamp(scrollBoost.current + delta * 0.02, -6, 6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    scrollBoost.current *= 0.93;
    const boost = 1 + Math.abs(scrollBoost.current);

    g.children.forEach((mesh, i) => {
      const f = flyers[i];
      // Largeur visible à cette profondeur (caméra perspective)
      const h = 2 * Math.tan((50 * Math.PI) / 360) * (8 - f.z);
      const w = h * viewport.aspect;
      f.y += f.speed * dt * boost;
      f.x += f.drift * dt;
      if (f.y > 0.6) f.y = -0.6;
      if (f.x > 0.6) f.x = -0.6;
      if (f.x < -0.6) f.x = 0.6;

      mesh.position.set(f.x * w + Math.sin(t * 0.7 + f.phase) * 0.4, f.y * h, f.z);
      mesh.rotation.x += f.spin.x * dt * boost;
      mesh.rotation.y += f.spin.y * dt;
      mesh.rotation.z += f.spin.z * dt * boost;
    });

    // Légère parallaxe avec la souris
    state.camera.position.x += (state.pointer.x * 0.8 - state.camera.position.x) * 0.03;
    state.camera.position.y += (state.pointer.y * 0.5 - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      {flyers.map((f, i) => (
        <mesh
          key={i}
          geometry={assets.geometry}
          material={assets.materials[f.kind]}
          scale={f.scale}
        />
      ))}
    </group>
  );
}

export default function FlyingCrepes() {
  const count = useMemo(() => {
    if (typeof window === "undefined") return 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 6;
    return window.innerWidth < 700 ? 9 : 16;
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} color="#fff1d6" />
        <directionalLight position={[-4, -3, 2]} intensity={0.7} color="#f6b1cf" />
        <Crepes count={count} />
      </Canvas>
    </div>
  );
}
