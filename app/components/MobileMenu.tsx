"use client";

import { useState } from "react";

export default function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex h-10 items-center gap-2 rounded-full border border-ink bg-butter px-4 font-bold"
      >
        <span className="relative block h-3 w-4" aria-hidden>
          <span className={`absolute left-0 h-0.5 w-4 bg-ink transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 h-0.5 w-4 bg-ink transition ${open ? "top-1.5 -rotate-45" : "top-2.5"}`} />
        </span>
        {open ? "Fermer" : "Menu"}
      </button>

      {open && (
        <ul
          id="mobile-menu"
          className="animate-pop absolute inset-x-0 top-full mt-2 flex flex-col gap-1 rounded-[2rem] border border-ink bg-cream p-3 shadow-[4px_4px_0_var(--color-ink)]"
        >
          {[...links, { href: "#reserver", label: "Réserver" }].map((l, i) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block rounded-full px-5 py-3 text-xl font-extrabold ${
                  ["bg-rose", "bg-sky", "bg-pistachio", "bg-butter", "bg-raspberry text-cream"][i % 5]
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
