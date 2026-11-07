"use client";

import { useState } from "react";

const REPLIES = [
  "Réservation reçue. Arthur panique déjà.",
  "Table réservée. Prévoyez un casque.",
  "C'est noté. Arthur relit la recette de la pâte.",
  "Confirmé. Le détecteur de fumée a été prévenu.",
];

export default function ReserveButton() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="rounded-full border border-ink bg-butter px-7 py-3 text-lg font-extrabold text-ink shadow-[4px_4px_0_var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-rose active:translate-y-1 active:shadow-[1px_1px_0_var(--color-ink)]"
      >
        Réserver (à vos risques)
      </button>
      <p className="min-h-6 text-sm text-cream/90" role="status">
        {count > 0 && REPLIES[(count - 1) % REPLIES.length]}
      </p>
    </div>
  );
}
