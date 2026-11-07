"use client";

import dynamic from "next/dynamic";

// WebGL uniquement côté navigateur
export const FlyingCrepesBackground = dynamic(() => import("./FlyingCrepes"), { ssr: false });

export const HeroCarouselScene = dynamic(() => import("./HeroCarousel"), { ssr: false });

export const FlipGameScene = dynamic(() => import("./FlipGame"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[380px] items-center justify-center font-mono text-sm text-ink/60">
      Préchauffage de la poêle…
    </div>
  ),
});
