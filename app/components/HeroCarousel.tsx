"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { makeCrepeGeometry, makeCrepeMaterials } from "../lib/crepe3d";
import { menu } from "../lib/menu";
import { useInView } from "../lib/useInView";

const ITEMS = menu.flatMap((s) => s.items);
const TILT = THREE.MathUtils.degToRad(10);
const AUTO_SPEED = 0.45;

type Drag = { offset: number; velocity: number; dragging: boolean; unitsPerPx: number };

function Track({ onActive }: { onActive: (i: number) => void }) {
  const { viewport, size, gl } = useThree();
  const drag = useRef<Drag>({ offset: 0, velocity: 0, dragging: false, unitsPerPx: 0.01 });
  const group = useRef<THREE.Group>(null);
  const spins = useRef<THREE.Group[]>([]);
  const active = useRef(-1);

  const geometry = useMemo(() => makeCrepeGeometry(1, 0.1), []);
  const materials = useMemo(() => ITEMS.map((item, i) => makeCrepeMaterials(item.kind, 100 + i * 17)), []);

  // Plus serré sur mobile
  const fit = Math.min(1, viewport.width / 8);
  const spacing = 2.9 * fit;
  const loop = spacing * ITEMS.length;

  // Attraper le carrousel à la souris ou au doigt
  useEffect(() => {
    const el = gl.domElement;
    const last = { x: 0, time: 0 };
    const down = (e: PointerEvent) => {
      drag.current.dragging = true;
      drag.current.velocity = 0;
      last.x = e.clientX;
      last.time = e.timeStamp;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.dragging) return;
      const dx = (e.clientX - last.x) * d.unitsPerPx;
      const elapsed = Math.max(1, e.timeStamp - last.time) / 1000;
      d.offset += dx;
      d.velocity = THREE.MathUtils.clamp(dx / elapsed - AUTO_SPEED, -25, 25);
      last.x = e.clientX;
      last.time = e.timeStamp;
    };
    const up = () => (drag.current.dragging = false);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [gl]);

  useFrame((state, dt) => {
    const d = drag.current;
    const g = group.current;
    if (!g) return;
    d.unitsPerPx = viewport.width / size.width;
    if (!d.dragging) {
      d.offset += (AUTO_SPEED + d.velocity) * dt;
      d.velocity *= Math.pow(0.04, dt);
    }

    // Quand on scrolle, les crêpes s'envolent
    const fly = THREE.MathUtils.clamp(window.scrollY / window.innerHeight, 0, 1.2);
    const t = state.clock.elapsedTime;
    let nearest = 0;
    let best = Infinity;

    g.children.forEach((child, i) => {
      let x = (((i * spacing + d.offset) % loop) + loop) % loop;
      x -= loop / 2;
      const dist = Math.abs(x);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
      const focus = THREE.MathUtils.clamp(1 - dist / (spacing * 1.6), 0, 1);
      const s = (0.78 + focus * 0.5) * fit;
      child.scale.setScalar(s);
      child.position.set(
        x,
        Math.sin(t * 1.4 + i) * 0.08 + focus * 0.25 + fly * (4 + (i % 3) * 2.5),
        focus * 0.8 + fly * (i % 2 ? 2 : -3),
      );
      child.rotation.set(Math.PI / 2 - 0.45 + focus * 0.2 + fly * (i % 2 ? 4 : -5), 0, -TILT + fly * 1.5);
      const spin = spins.current[i];
      if (spin) spin.rotation.y += dt * (0.3 + focus * 0.6);
    });

    if (nearest !== active.current) {
      active.current = nearest;
      onActive(nearest);
    }

    state.camera.position.x += (state.pointer.x * 0.6 - state.camera.position.x) * 0.05;
    state.camera.position.y += (state.pointer.y * 0.4 - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group rotation={[0, 0, TILT]} position={[0, -0.6, 0]}>
      <group ref={group}>
        {ITEMS.map((item, i) => (
          <group key={item.name}>
            <group
              ref={(el) => {
                if (el) spins.current[i] = el;
              }}
            >
              <mesh geometry={geometry} material={materials[i]} />
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}

export default function HeroCarousel() {
  const [wrap, inView] = useInView<HTMLDivElement>();
  const [active, setActive] = useState(0);
  const item = ITEMS[active];

  return (
    <div
      ref={wrap}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 35 }}
        dpr={[1, 2]}
        frameloop={inView ? "always" : "never"}
        style={{ touchAction: "pan-y" }}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[2, 5, 6]} intensity={2.4} color="#fff3dc" />
        <directionalLight position={[-4, -2, 3]} intensity={0.8} color="#f6b1cf" />
        <Track onActive={setActive} />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 bottom-14 flex justify-center px-4 sm:bottom-28">
        <a
          key={item.name}
          href={`#${item.kind}`}
          className="animate-pop pointer-events-auto flex max-w-full items-center gap-2 rounded-full border border-ink bg-cream py-2 pr-2 pl-4 shadow-[4px_4px_0_var(--color-ink)] sm:gap-3 sm:py-2.5 sm:pr-3 sm:pl-5"
          style={{ background: item.color }}
        >
          <span className="truncate text-sm font-bold sm:text-lg">{item.name}</span>
          <span className="shrink-0 rounded-full border border-ink bg-cream px-2 py-0.5 font-mono text-[11px] whitespace-nowrap sm:text-xs">
            {item.successRate} % de réussite
          </span>
        </a>
      </div>
    </div>
  );
}
