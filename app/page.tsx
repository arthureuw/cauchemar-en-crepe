import type { CSSProperties } from "react";
import { menu, type MenuItem } from "./lib/menu";
import { FlipGameScene, FlyingCrepesBackground, HeroCarouselScene } from "./components/Scenes";
import { Bubbles, ChefArthur, CircleText, Cloud, CrepePlanet, Flame, Sparkle, Squiggle } from "./components/Doodles";
import { RainbowText, RollText } from "./components/Typography";
import Loader from "./components/Loader";
import SmoothScroll from "./components/SmoothScroll";
import ReserveButton from "./components/ReserveButton";
import MobileMenu from "./components/MobileMenu";

const NAV = [
  { href: "#menu", label: "La carte" },
  { href: "#jeu", label: "Le jeu" },
  { href: "#chef", label: "Le chef" },
  { href: "#avis", label: "Les avis" },
];

const BREAKING = [
  "Une crêpe retrouvée sur le lustre",
  "Arthur affirme que « c'était voulu »",
  "Rupture de stock de beurre demi-sel",
  "Le détecteur de fumée demande une augmentation",
  "Une grand-mère bretonne porte plainte",
  "Le chien du voisin a pris 3 kilos",
];

const PERKS = [
  { title: "Sans filet", text: "Aucun retournement n'est garanti. Ni pour la crêpe, ni pour le chef.", color: "bg-rose", Icon: Sparkle },
  { title: "Fumée 100 % naturelle", text: "Produite sur place, sans additif. Le détecteur adore.", color: "bg-sky", Icon: Cloud },
  { title: "Riche en surprises", text: "Chaque crêpe est unique. Personne ne sait ce qu'elle va devenir.", color: "bg-butter", Icon: Bubbles },
  { title: "Pas du tout végan", text: "Beurre, œufs, jambon. Et encore un peu de beurre.", color: "bg-pistachio", Icon: Flame },
];

const REVIEWS = [
  { stars: 1, text: "Ma crêpe est arrivée avant moi. Par la fenêtre.", who: "Sébastien, table 4", color: "bg-rose" },
  { stars: 5, text: "Je n'ai rien mangé mais j'ai énormément ri.", who: "Léa", color: "bg-butter" },
  { stars: 2, text: "J'ai commandé une complète. J'ai reçu une expérience.", who: "Marc", color: "bg-sky" },
  { stars: 4, text: "Une étoile en moins : ma crêpe est toujours collée au plafond.", who: "Inès", color: "bg-pistachio" },
  { stars: 5, text: "C'est mon fils.", who: "La maman d'Arthur", color: "bg-rose" },
  { stars: 1, text: "Une galette sans sarrasin, c'est une crêpe, jeune homme.", who: "Une grand-mère du Finistère", color: "bg-butter" },
];

const INFOS = [
  { label: "Horaires", value: "Ouvert quand la pâte a reposé. Fermé quand l'alarme incendie sonne." },
  { label: "Adresse", value: "Chez Arthur. Suivez l'odeur de brûlé." },
  { label: "Prix", value: "Prix libre, proportionnel aux dégâts." },
  { label: "Dress code", value: "Tenue anti-projection fortement conseillée." },
];

function Marquee({ items, className, reverse }: { items: string[]; className: string; reverse?: boolean }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <span key={t} className="flex items-center gap-6 px-6">
          {t}
          <Sparkle className="h-5 w-5 shrink-0" fill="#fef7e6" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden border-y border-ink ${className}`}>
      <div className={`flex w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

function MiniCrepe({ item }: { item: MenuItem }) {
  const topping: Record<string, string> = {
    complete: "#ffd75e",
    chevre: "#f7f1e3",
    philadelphia: "#fbf8f2",
    gourmande: "#ec9ea0",
    sucre: "#ffe14d",
    nutella: "#3b1d0e",
    marrons: "#7a4a2a",
    duo: "#3b1d0e",
  };
  return (
    <div
      className="relative h-16 w-16 shrink-0 rounded-full sm:h-20 sm:w-20 border border-ink transition-transform duration-700 group-hover:rotate-[200deg]"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${topping[item.kind]} 0 26%, transparent 27%),
          radial-gradient(circle at 30% 35%, #0000001f 0 6%, transparent 7%),
          radial-gradient(circle at 70% 65%, #0000001f 0 8%, transparent 9%),
          radial-gradient(circle at 65% 28%, #0000001f 0 4%, transparent 5%),
          #ebb662`,
      }}
      aria-hidden
    >
      {item.kind === "complete" || item.kind === "gourmande" ? (
        <span className="absolute inset-[38%] rounded-full bg-[#f29b12]" />
      ) : null}
    </div>
  );
}

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <article
      id={item.kind}
      className="group relative flex scroll-mt-28 flex-col gap-4 rounded-[2rem] border border-ink p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] sm:p-8"
      style={{ background: item.color, rotate: `${index % 2 ? 0.6 : -0.6}deg` } as CSSProperties}
    >
      <div className="flex items-start justify-between gap-4">
        <MiniCrepe item={item} />
        <div className="flex items-center gap-1" aria-label={`Niveau de risque : ${item.risk} sur 5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Flame key={i} className={`h-6 w-5 sm:h-7 sm:w-6 ${i < item.risk ? "" : "opacity-25 grayscale"}`} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-2xl leading-tight font-extrabold sm:text-3xl">{item.name}</h4>
        <p className="mt-2 font-mono text-xs tracking-wide uppercase">{item.ingredients}</p>
      </div>
      <p className="text-base leading-relaxed">{item.description}</p>

      <div className="relative mt-auto rounded-2xl border border-ink bg-cream p-4">
        <p className="mb-1 font-mono text-[11px] tracking-widest uppercase">Rapport de l&apos;inspecteur</p>
        <p className="font-hand text-xl leading-tight sm:text-2xl">{item.verdict}</p>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-ink bg-cream/70 p-3">
          <dt className="font-mono text-[11px] uppercase">Taux de réussite</dt>
          <dd className="mt-2 flex items-center gap-2">
            <span className="h-2.5 flex-1 overflow-hidden rounded-full border border-ink bg-cream">
              <span className="block h-full bg-raspberry" style={{ width: `${item.successRate}%` }} />
            </span>
            <span className="font-bold tabular-nums">{item.successRate}%</span>
          </dd>
        </div>
        <div className="rounded-2xl border border-ink bg-cream/70 p-3">
          <dt className="font-mono text-[11px] uppercase">Altitude de vol</dt>
          <dd className="mt-1 text-xl font-extrabold">{item.altitude}</dd>
        </div>
      </dl>
    </article>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${n} étoile${n > 1 ? "s" : ""} sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Sparkle key={i} className="h-5 w-5" fill={i < n ? "#0e0e0e" : "#fef7e6"} />
      ))}
    </span>
  );
}

export default function Home() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <FlyingCrepesBackground />

      <div className="bg-ink py-2 text-sm font-medium text-cream">
        <p className="px-4 text-center">
          Livraison offerte si la crêpe arrive entière. <span className="opacity-60">(Ce n&apos;est jamais arrivé.)</span>
        </p>
      </div>

      <header className="sticky top-3 z-50 px-3 sm:px-6">
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-ink bg-cream/95 py-2 pr-2 pl-3 backdrop-blur-md sm:pl-4">
          <a href="#top" className="roll-host flex min-w-0 items-center gap-2 font-extrabold">
            <span className="h-7 w-7 shrink-0 rounded-full border border-ink bg-[#ebb662] shadow-[inset_-4px_-3px_0_#c07a34]" aria-hidden />
            <RollText text="Cauchemar en Crêpe" />
          </a>
          <ul className="hidden items-center gap-7 font-medium md:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="roll-host">
                  <RollText text={n.label} />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#reserver"
            className="roll-host hidden rounded-full border border-ink bg-raspberry px-5 py-2 font-bold text-cream transition hover:bg-ink md:block"
          >
            <RollText text="Réserver" />
          </a>
          <MobileMenu links={NAV} />
        </nav>
      </header>

      <main id="top" className="flex flex-col">
        {/* HERO */}
        <section className="relative -mt-16 h-[100svh] min-h-[640px] overflow-hidden bg-cream">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="parallax absolute -bottom-[30vw] left-1/2 h-[70vw] w-[110vw] -translate-x-1/2 rounded-[50%] border border-ink bg-butter sm:-bottom-[22vw] sm:h-[48vw]" style={{ "--speed": -0.15 } as CSSProperties} />
            <div className="absolute top-1/2 left-1/2 w-[min(96vw,640px)] -translate-x-1/2 -translate-y-[30%] sm:-translate-y-[38%]">
              <div className="scroll-rotate">
                <CircleText text="CAUCHEMAR EN CRÊPE ✦ AVEC ARTHUR LELOUP ✦ LE CHEF, C'EST LE PROBLÈME ✦ " className="animate-spin-slow w-full opacity-90" />
              </div>
            </div>
            <Cloud className="parallax animate-float absolute top-[44%] left-[3%] w-24 sm:top-[40%] sm:w-40" style={{ "--speed": 0.35 } as CSSProperties} />
            <Cloud className="parallax animate-float absolute top-[42%] right-[4%] hidden w-24 [animation-delay:-2s] sm:block sm:w-32" fill="#f6b1cf" style={{ "--speed": 0.25 } as CSSProperties} />
            <CrepePlanet className="parallax animate-float absolute right-[10%] bottom-[20%] hidden w-36 [animation-delay:-4s] md:block" style={{ "--speed": 0.4 } as CSSProperties} />
            <Sparkle className="animate-wiggle absolute top-[48%] left-[12%] w-10" fill="#e72f63" />
            <Sparkle className="animate-wiggle absolute top-[18%] right-[28%] w-8 [animation-delay:-1s]" fill="#88c1f8" />
            <Bubbles className="parallax animate-float absolute bottom-[24%] left-[8%] hidden w-20 md:block" style={{ "--speed": 0.3 } as CSSProperties} />
          </div>

          <div className="relative z-10 flex flex-col items-center px-4 pt-28 text-center sm:pt-36">
            <p className="mb-3 flex items-center gap-2 rounded-full border border-ink bg-cream px-3 py-1 font-mono text-xs tracking-widest uppercase">
              <span className="h-2 w-2 animate-pulse rounded-full bg-raspberry" aria-hidden />
              Rec — épisode 1
            </p>
            <h1 className="text-[clamp(3rem,10vw,8.5rem)] leading-[0.9] font-extrabold tracking-tight">
              <RainbowText text="Cauchemar en Crêpe" />
            </h1>
            <p className="mt-4 rounded-full border border-ink bg-cream px-4 py-1.5 text-sm font-medium sm:mt-5 sm:px-5 sm:py-2 sm:text-lg">
              avec <strong className="font-extrabold">Arthur Leloup</strong>. Le chef, c&apos;est le problème.
            </p>
          </div>

          <HeroCarouselScene />

          <p className="pointer-events-none absolute inset-x-0 bottom-6 z-10 px-4 text-center font-mono text-[11px] tracking-[0.2em] uppercase sm:bottom-8 sm:text-xs">
            Attrapez une crêpe<span className="hidden sm:inline"> ✦ Scrollez pour les faire décoller</span>
          </p>
        </section>

        <div className="relative z-10 -my-4 overflow-x-clip">
          <div className="-mx-4 -rotate-2">
            <Marquee items={BREAKING} className="bg-raspberry py-3 text-lg font-bold text-cream" />
          </div>
        </div>

        {/* L'ÉMISSION */}
        <section id="chef" className="relative mx-auto grid w-full max-w-6xl scroll-mt-24 gap-12 px-4 py-20 sm:px-6 sm:py-28 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase">Le pitch</p>
            <h2 className="mt-3 text-[clamp(2.4rem,5.4vw,4.2rem)] leading-[0.95] font-extrabold tracking-tight">
              Une crêperie.
              <br />
              Un chef.
              <br />
              <span className="relative inline-block whitespace-nowrap">
                Zéro compétence.
                <Squiggle className="absolute -bottom-5 left-0 h-5 w-full" preserveAspectRatio="none" />
              </span>
            </h2>
            <p className="mt-10 max-w-lg text-lg leading-relaxed">
              Dans cet épisode, Arthur Leloup reprend une crêperie. Il n&apos;a jamais fait de crêpes. Il a regardé une
              vidéo, une fois, en accéléré. Les caméras tournent, la pâte repose, la poêle chauffe… et les crêpes, elles,
              décollent.
            </p>
          </div>

          <div className="relative rotate-1 rounded-[2rem] border border-ink bg-rose p-5 shadow-[6px_6px_0_var(--color-ink)] sm:rotate-2 sm:p-8">
            <Sparkle className="animate-wiggle absolute -top-5 -right-2 w-12 sm:-right-5 sm:w-14" />
            <div className="flex items-center gap-4">
              <div className="w-20 shrink-0 rounded-full border border-ink bg-sky sm:w-28">
                <ChefArthur className="w-full" />
              </div>
              <div>
                <p className="font-mono text-xs tracking-widest uppercase">Fiche du chef</p>
                <p className="text-2xl leading-tight font-extrabold sm:text-3xl">Arthur Leloup</p>
                <p className="font-hand text-2xl">Chef (auto-proclamé)</p>
              </div>
            </div>
            <dl className="mt-6 divide-y divide-ink border-y border-ink">
              {[
                ["Formation", "Deux tutos YouTube et une Chandeleur ratée en 2009"],
                ["Spécialité", "La crêpe au plafond"],
                ["Record", "11 crêpes en vol simultané"],
                ["Devise", "« La première est toujours ratée. » Il parle de toutes."],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 py-2.5 sm:grid-cols-[7rem_1fr] sm:gap-3">
                  <dt className="font-mono text-xs leading-6 uppercase">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 px-4 pb-20 sm:gap-4 sm:px-6 sm:pb-28 lg:grid-cols-4">
          {PERKS.map(({ title, text, color, Icon }) => (
            <div key={title} className="rounded-[1.5rem] border border-ink bg-cream/90 p-4 sm:rounded-[2rem] sm:p-6">
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-ink sm:mb-5 sm:h-20 sm:w-20 ${color}`}>
                <Icon className="w-8 sm:w-12" />
              </div>
              <h3 className="text-lg leading-tight font-extrabold sm:text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-snug sm:text-base sm:leading-relaxed">{text}</p>
            </div>
          ))}
        </section>

        {/* LA CARTE */}
        <section id="menu" className="scroll-mt-24 border-t border-ink bg-cream/60 py-16 backdrop-blur-[2px] sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <p className="font-mono text-xs tracking-widest uppercase">Menu du jour (et de toujours)</p>
              <h2 className="mt-3 text-[clamp(3rem,9vw,7rem)] leading-[0.9] font-extrabold tracking-tight">
                <RainbowText text="La carte" offset={2} />
              </h2>
              <p className="mx-auto mt-4 max-w-md text-lg">Chaque plat a été inspecté. Les résultats sont accablants.</p>
            </div>

            {menu.map((section) => (
              <div key={section.id} className="mt-14 sm:mt-20">
                <div className="mb-8 flex flex-col gap-2 border-b border-ink pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <h3 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{section.title}</h3>
                  <p className="font-hand max-w-sm text-2xl leading-tight sm:text-right">{section.subtitle}</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {section.items.map((item, i) => (
                    <MenuCard key={item.name} item={item} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LE JEU */}
        <section id="jeu" className="scroll-mt-24 px-3 py-16 sm:px-6 sm:py-24">
          <div className="relative mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-ink bg-sky sm:rounded-[2.5rem] md:grid-cols-[1fr_1.3fr]">
            <div className="relative z-10 flex flex-col justify-center gap-4 p-6 sm:gap-5 sm:p-12">
              <p className="font-mono text-xs tracking-widest uppercase">Mini-jeu officiel</p>
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] font-extrabold tracking-tight">
                Retourne la crêpe.
              </h2>
              <p className="text-lg leading-relaxed">
                Mettez-vous dans la peau d&apos;Arthur. Un clic, un coup de poignet, et beaucoup d&apos;espoir. Les
                résultats sont fidèles à la réalité : désastreux.
              </p>
              <p className="font-hand text-2xl">Taux de réussite d&apos;Arthur en conditions réelles : 9 %.</p>
              <Cloud className="animate-float absolute -bottom-10 -left-10 hidden w-32 md:block" />
            </div>
            <div className="relative flex min-h-[400px] flex-col border-t border-ink bg-cream/40 sm:min-h-[480px] md:border-t-0 md:border-l">
              <FlipGameScene />
            </div>
          </div>
        </section>

        {/* AVIS */}
        <section id="avis" className="scroll-mt-24 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs tracking-widest uppercase">Avis vérifiés (par Arthur)</p>
            <h2 className="mt-3 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-extrabold tracking-tight">
              Ils ont survécu.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 px-4 sm:px-6 md:grid-cols-2 lg:mx-auto lg:max-w-6xl lg:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <figure
                key={r.who}
                className={`relative rounded-[2rem] border border-ink p-5 sm:p-6 ${r.color}`}
                style={{ rotate: `${[-1.5, 1, -0.5, 1.5, -1, 0.5][i]}deg` }}
              >
                <Stars n={r.stars} />
                <blockquote className="mt-3 text-xl leading-snug font-bold sm:mt-4 sm:text-2xl">« {r.text} »</blockquote>
                <figcaption className="mt-4 font-mono text-xs uppercase">— {r.who}</figcaption>
                <span className={`absolute -bottom-3 left-10 h-6 w-6 rotate-45 border-r border-b border-ink ${r.color}`} aria-hidden />
              </figure>
            ))}
          </div>
        </section>

        <Marquee
          items={["Galettes", "Crêpes", "Fumée", "Beurre salé", "Crêpes volantes", "Nutella à la truelle"]}
          className="bg-butter py-3 text-2xl font-extrabold sm:py-4 sm:text-3xl"
          reverse
        />

        {/* INFOS / RÉSERVER */}
        <section id="reserver" className="scroll-mt-24 px-3 py-16 sm:px-6 sm:py-24">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-ink bg-navy p-6 pt-24 text-cream sm:rounded-[2.5rem] sm:p-14">
            <CrepePlanet className="animate-float absolute -top-4 right-2 w-32 sm:-top-6 sm:right-4 sm:w-56" />
            <p className="font-mono text-xs tracking-widest uppercase">Infos pratiques</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-extrabold tracking-tight">
              Venir manger (si vous osez).
            </h2>
            <dl className="mt-10 grid gap-x-10 sm:grid-cols-2">
              {INFOS.map((info) => (
                <div key={info.label} className="border-t border-cream/40 py-5">
                  <dt className="font-mono text-xs tracking-widest text-butter uppercase">{info.label}</dt>
                  <dd className="mt-1 text-lg font-medium sm:text-xl">{info.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              <ReserveButton />
            </div>
          </div>
        </section>
      </main>

      <footer className="overflow-hidden border-t border-ink bg-cream pt-16 pb-8">
        <p className="px-4 text-center text-[clamp(2.6rem,11vw,10rem)] leading-[0.85] font-extrabold tracking-tight">
          <RainbowText text="Cauchemar en Crêpe" offset={4} />
        </p>
        <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-3 px-4 font-mono text-xs uppercase sm:flex-row sm:justify-between sm:px-6">
          <p>© 2026 Arthur Leloup — chef, plongeur, pompier.</p>
          <p>Aucune grand-mère bretonne n&apos;a été blessée. Seulement vexée.</p>
        </div>
      </footer>
    </>
  );
}
