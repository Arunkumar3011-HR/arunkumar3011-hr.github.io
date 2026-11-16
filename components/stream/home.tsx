"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Award, ChevronLeft, ChevronRight, Download, Info, Play } from "lucide-react";
import {
  site,
  stats,
  projects,
  certifications,
  highlights,
  moments,
  about,
  type Project,
} from "@/content/site-data";
import { categories, categoryOf, type CategoryId } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { Gate, readViewer, viewers, type Phase, type ViewerId } from "./gate";

const certCount = certifications.reduce((n, g) => n + g.items.length, 0);
const years = stats.find((s) => /year/i.test(s.label));
const [firstName, ...restName] = site.name.split(" ");

const art: Record<CategoryId, string> = {
  talent: "from-[#3b0a14] via-[#b3162f] to-[#f0475c]",
  operations: "from-[#081a33] via-[#15508f] to-[#3d9be0]",
  people: "from-[#1c0b38] via-[#5a2aa8] to-[#a274f0]",
  research: "from-[#33200a] via-[#a8650f] to-[#f0b03d]",
};

const tailored: Record<
  ViewerId,
  { blurb: string; cta: { label: string; href: string }; order: CategoryId[] }
> = {
  recruiter: {
    blurb:
      "HR & Admin Manager at GeoDataTek, with an MBA in HRM from Loyola College. Four years in talent acquisition at Tech Mahindra, rising from coordinator to Associate Manager.",
    cta: { label: "View résumé", href: "/resume" },
    order: ["talent", "operations", "people", "research"],
  },
  leader: {
    blurb:
      "I run HR and administration end to end: hiring, onboarding, payroll, statutory compliance and office operations, with accurate records and reporting for leadership.",
    cta: { label: "See the work", href: "/projects" },
    order: ["operations", "talent", "people", "research"],
  },
  developer: {
    blurb:
      "Sourcing, screening, onboarding, payroll inputs, audits and exits. I have worked every stage of the employee lifecycle, with the tools that go with each.",
    cta: { label: "Explore the toolkit", href: "/skills" },
    order: ["people", "operations", "talent", "research"],
  },
  curious: {
    blurb:
      "From a computer science degree and a research desk to leading HR and administration. A story about finding the right people and looking after them once they join.",
    cta: { label: "Start the story", href: "/about" },
    order: ["talent", "operations", "people", "research"],
  },
};

const explore = [
  { href: "/projects", label: "My Originals", note: `${projects.length} stories from my work`, tone: art.talent },
  { href: "/skills", label: "My Skills", note: "Skills and tools", tone: art.operations },
  { href: "/about", label: "About Me", note: "The person behind the work", tone: art.people },
  { href: "/experience", label: "My Journey", note: `${site.since} to today`, tone: art.research },
  { href: "/certifications", label: "Credentials", note: `${certCount} courses and two degrees`, tone: "from-[#0a2b26] via-[#0f7a68] to-[#3fd9b8]" },
  { href: "/contact", label: "Get in Touch", note: "Start a conversation", tone: "from-[#1a1a1a] via-[#3a3a3a] to-[#8a8a8a]" },
];

const topPicks = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)].slice(0, 5);

/* ───────────────────────── building blocks ───────────────────────── */

function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
        <span aria-hidden className="h-[2px] w-6 bg-primary" />
        {kicker}
      </p>
      <h2 className="mt-2 font-display text-4xl sm:text-5xl">{children}</h2>
    </div>
  );
}

function Row({ title, children, action }: { title: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const nudge = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section className="group/row relative">
      <div className="container flex items-end justify-between gap-4">
        <h3 className="text-lg font-semibold sm:text-xl">{title}</h3>
        <div className="flex items-center gap-3">
          {action}
          <div className="hidden gap-1 sm:flex">
            <button
              type="button"
              onClick={() => nudge(-1)}
              aria-label="Scroll row left"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-white hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              aria-label="Scroll row right"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-white hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={ref}
        className="row-scroll mt-4 gap-3 px-[max(1.25rem,calc((100vw_-_1180px)_/_2_+_1.25rem))] scroll-px-[max(1.25rem,calc((100vw_-_1180px)_/_2_+_1.25rem))] py-3 sm:gap-4"
      >
        {children}
      </div>
    </section>
  );
}

function EpisodeCard({ project, index }: { project: Project; index: number }) {
  const cat = categoryOf(project);
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative w-[78vw] max-w-[300px] rounded-md outline-offset-4 transition-transform duration-300 hover:z-10 hover:scale-[1.04] focus-visible:scale-[1.04] sm:w-[300px]"
    >
      <div className={cn("film-grain relative aspect-video overflow-hidden rounded-md bg-gradient-to-br", art[cat])}>
        <span aria-hidden className="absolute -right-1 -top-3 font-display text-[7rem] leading-none text-black/25">
          E{String(index + 1).padStart(2, "0")}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
            Episode {String(index + 1).padStart(2, "0")}
          </p>
          <p className="mt-1 font-display text-2xl leading-[0.95] text-white">{project.title.split(" — ")[0]}</p>
        </div>
        <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-black opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Play className="h-3.5 w-3.5 fill-current" />
        </span>
      </div>
      <div className="px-0.5 pt-2.5">
        <p className="text-xs text-muted-foreground">{project.period}</p>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-foreground/80">{project.summary}</p>
        <p className="mt-1.5 truncate text-[11px] text-muted-foreground">{project.stack.slice(0, 3).join(" · ")}</p>
      </div>
    </Link>
  );
}

/* ───────────────────────────── sections ───────────────────────────── */

function Billboard({ viewer, onReplay }: { viewer: ViewerId | null; onReplay: () => void }) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const t = tailored[viewer ?? "curious"];
  const who = viewers.find((v) => v.id === viewer);

  return (
    <section ref={ref} className="film-grain relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(48% 62% at 76% 42%, hsl(354 82% 42% / 0.55), transparent 70%), linear-gradient(180deg, hsl(0 0% 5%) 0%, hsl(0 0% 4%) 100%)",
        }}
      />

      {/* portrait */}
      <motion.div
        style={reduce ? undefined : { y: photoY }}
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[62%] w-full sm:h-[92%] sm:w-[58%] lg:w-[46%]"
      >
        <div
          className="absolute inset-0"
          style={{
            maskImage: "radial-gradient(ellipse 58% 72% at 56% 44%, #000 38%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 58% 72% at 56% 44%, #000 38%, transparent 100%)",
          }}
        >
          <Image
            src={site.photo}
            alt={`Portrait of ${site.name}`}
            fill
            priority
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover object-top opacity-60 grayscale contrast-125 sm:opacity-90"
          />
          <div className="absolute inset-0 bg-primary/25 mix-blend-color" />
        </div>
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/60 to-transparent sm:via-background/40" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent" />

      <motion.div
        style={reduce ? undefined : { y: copyY }}
        className="container flex min-h-[100svh] flex-col justify-end pb-20 pt-28 sm:justify-center sm:pb-16"
      >
        <p className="flex items-baseline gap-1.5 font-display leading-none">
          <span className="text-2xl text-primary">{site.brandLetter}</span>
          <span className="text-xs tracking-[0.4em] text-white/70">SERIES</span>
        </p>

        <h1 className="mt-3 font-display text-[23vw] leading-[0.82] tracking-normal sm:text-[9.5rem] lg:text-[12rem]">
          <span className="sr-only">{site.name}</span>
          <span aria-hidden>
            {firstName.toUpperCase().split("").map((ch, i) => (
              <motion.span
                key={i}
                className={cn("inline-block", i === 1 && "text-primary")}
                initial={reduce ? false : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
        </h1>
        <p aria-hidden className="mt-1 font-display text-xl tracking-[0.3em] text-primary sm:text-2xl">
          {restName.join(" ")} · The Series
        </p>

        <ul className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-white/80 sm:text-[13px]">
          <li className="rounded-sm border border-white/40 px-1.5 py-0.5 font-semibold">{site.badge}</li>
          <li>{site.since} – Present</li>
          <li aria-hidden className="text-white/30">•</li>
          <li>{years ? `${years.value}${years.suffix}` : ""} years</li>
          <li aria-hidden className="text-white/30">•</li>
          <li>{projects.length} Originals</li>
          <li aria-hidden className="text-white/30">•</li>
          <li>{certCount} Credentials</li>
        </ul>

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 sm:text-sm">
          {site.title} · {site.company} · {site.location.split(",")[0]}
        </p>

        <p key={viewer ?? "default"} className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75 sm:text-base">
          {t.blurb}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex h-11 items-center gap-2 rounded bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-white/85"
          >
            <Play className="h-4 w-4 fill-current" /> Play intro
          </button>
          <Link
            href={t.cta.href}
            className="inline-flex h-11 items-center gap-2 rounded bg-white/20 px-6 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/30"
          >
            {t.cta.label}
          </Link>
          <a
            href={site.resumeFile}
            download={site.resumeDownloadName}
            aria-label="Download résumé (PDF)"
            title="Download résumé (PDF)"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/50 text-white transition-colors hover:border-white"
          >
            <Download className="h-4 w-4" />
          </a>
          <Link
            href="/about"
            aria-label={`More about ${firstName}`}
            title={`More about ${firstName}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/50 text-white transition-colors hover:border-white"
          >
            <Info className="h-4 w-4" />
          </Link>
        </div>

        {who && (
          <p className="mt-6 text-xs text-white/50">
            Tailored for: <span className="text-white/80">{who.label}</span>
          </p>
        )}
      </motion.div>
    </section>
  );
}

function ContinueExploring() {
  return (
    <Row title="Continue Exploring">
      {explore.map((e, i) => (
        <Link
          key={e.href}
          href={e.href}
          className="group w-[62vw] max-w-[250px] transition-transform duration-300 hover:scale-[1.05] focus-visible:scale-[1.05] sm:w-[250px]"
        >
          <div className={cn("film-grain relative aspect-video overflow-hidden rounded-md bg-gradient-to-br", e.tone)}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/70 text-white">
              <Play className="h-3 w-3 fill-current" />
            </span>
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                Chapter {String(i + 1).padStart(2, "0")}
              </p>
              <p className="font-display text-2xl leading-none text-white">{e.label}</p>
            </div>
          </div>
          <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-0 bg-primary transition-all duration-500 group-hover:w-full group-focus-visible:w-full" />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{e.note}</p>
        </Link>
      ))}
    </Row>
  );
}

function FullStory() {
  return (
    <section className="container">
      <Reveal className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionTitle kicker="The screenplay">The Full Story</SectionTitle>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
            {stats.slice(0, 4).map((s) => (
              <div key={s.label} className="border-l-2 border-primary pl-3">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-5xl leading-none">
                  {s.value}
                  {s.suffix}
                </dd>
                <dd className="mt-1 text-xs text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="space-y-5 text-[17px] leading-relaxed text-foreground/80 lg:col-span-7">
          <p className="text-xl leading-snug text-foreground sm:text-2xl">{site.tagline}</p>
          <p>{about.story[0]}</p>
          <p>{about.story[about.story.length - 1]}</p>
          <Link href="/about" className="link inline-block text-sm font-semibold">
            Read the full story
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

function TopMoments() {
  return (
    <div>
      <div className="container">
        <Reveal>
          <SectionTitle kicker="Awards season">Top Moments</SectionTitle>
        </Reveal>
      </div>
      <div className="mt-2">
        <Row
          title={<span className="sr-only">Career highlights</span>}
          action={
            <Link href="/certifications" className="text-sm font-semibold text-gold hover:underline">
              {certCount} courses completed
            </Link>
          }
        >
          {moments.map((m) => (
            <article
              key={m.title}
              className="relative flex w-[66vw] max-w-[230px] flex-col items-center rounded-md border border-gold/40 bg-gradient-to-b from-gold/[0.13] to-transparent px-5 py-7 text-center transition-transform duration-300 hover:-translate-y-1.5 sm:w-[230px]"
            >
              <Award className="h-9 w-9 text-gold" strokeWidth={1.25} />
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{m.kicker}</p>
              <h4 className="mt-2 font-display text-3xl leading-[0.95] text-[#f3dfa6]">{m.title}</h4>
              <p className="mt-3 text-[13px] leading-snug text-foreground/70">{m.detail}</p>
              <p className="mt-auto pt-4 text-xs tabular-nums text-muted-foreground">{m.year}</p>
            </article>
          ))}
        </Row>
      </div>
    </div>
  );
}

function Originals({ viewer }: { viewer: ViewerId | null }) {
  const order = tailored[viewer ?? "curious"].order;
  let n = 0;
  return (
    <div className="space-y-10">
      <div className="container">
        <Reveal>
          <SectionTitle kicker="Now streaming">The Originals</SectionTitle>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {projects.length} stories from my work, grouped by genre. Each episode opens the full write-up: the
            situation, what I did and what came of it.
          </p>
        </Reveal>
      </div>
      {order.map((id) => {
        const list = projects.filter((p) => categoryOf(p) === id);
        const label = categories.find((c) => c.id === id)?.label ?? "";
        if (list.length === 0) return null;
        const start = n;
        n += list.length;
        return (
          <Row
            key={id}
            title={<span className="capitalize">{label}</span>}
            action={<span className="text-xs text-muted-foreground">{list.length} {list.length === 1 ? "episode" : "episodes"}</span>}
          >
            {list.map((p, i) => (
              <EpisodeCard key={p.slug} project={p} index={start + i} />
            ))}
          </Row>
        );
      })}
    </div>
  );
}

function TopPicks() {
  return (
    <div>
      <div className="container">
        <Reveal>
          <SectionTitle kicker="Top 5 · the highlights reel">{firstName}&rsquo;s Top Picks</SectionTitle>
        </Reveal>
      </div>
      <div className="mt-2">
        <Row title={<span className="sr-only">Top five projects</span>}>
          {topPicks.map((p, i) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group flex w-[74vw] max-w-[300px] items-end transition-transform duration-300 hover:scale-[1.03] focus-visible:scale-[1.03] sm:w-[300px]"
            >
              <span aria-hidden className="rank-numeral -mr-5 select-none text-[11rem] sm:text-[13rem]">
                {i + 1}
              </span>
              <div
                className={cn(
                  "film-grain relative aspect-[2/3] flex-1 overflow-hidden rounded-md bg-gradient-to-b shadow-2xl",
                  art[categoryOf(p)]
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    <span className="sr-only">Rank {i + 1}. </span>
                    {categories.find((c) => c.id === categoryOf(p))?.label}
                  </p>
                  <p className="mt-1 font-display text-[1.7rem] leading-[0.95] text-white">
                    {p.title.split(" — ")[0]}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </Row>
      </div>
    </div>
  );
}

function Seasons() {
  return (
    <section className="container">
      <Reveal>
        <SectionTitle kicker="Season guide">The Journey So Far</SectionTitle>
      </Reveal>
      <ol className="mt-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((h, i) => (
          <li key={i} className="bg-card p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Season {i + 1}</p>
            <p className="mt-1 font-display text-4xl leading-none">{h.year}</p>
            <p className="mt-3 text-sm leading-snug text-foreground/75">{h.text}</p>
          </li>
        ))}
        <li className="flex flex-col justify-between bg-primary p-5 text-primary-foreground">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">Next season</p>
            <p className="mt-1 font-display text-4xl leading-none">Your team</p>
          </div>
          <Link href="/contact" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4">
            Let&rsquo;s build it <ChevronRight className="h-4 w-4" />
          </Link>
        </li>
      </ol>
    </section>
  );
}

function Finale() {
  return (
    <section className="relative isolate overflow-hidden border-t border-border">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(50% 120% at 50% 100%, hsl(354 82% 42% / 0.4), transparent 70%)" }}
      />
      <Reveal className="container py-24 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Up next</p>
        <h2 className="mt-3 font-display text-6xl sm:text-8xl">Let&rsquo;s build your team</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Recruitment, HR operations or administration. Tell me what you are looking for.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${site.email}`}
            className="inline-flex h-12 items-center rounded bg-primary px-7 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
          >
            Email me
          </a>
          {site.linkedin ? (
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center rounded border border-white/40 px-7 text-sm font-semibold transition-colors hover:border-white"
            >
              Connect on LinkedIn
            </a>
          ) : (
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded border border-white/40 px-7 text-sm font-semibold transition-colors hover:border-white"
            >
              Send a message
            </Link>
          )}
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────────── page ─────────────────────────────── */

export function StreamHome() {
  const [phase, setPhase] = React.useState<Phase>("intro");
  const [viewer, setViewer] = React.useState<ViewerId | null>(null);

  // Returning in the same session: skip straight to the page.
  React.useEffect(() => {
    const saved = readViewer();
    if (saved) {
      setViewer(saved);
      setPhase("home");
    }
    const openProfiles = () => setPhase("profiles");
    window.addEventListener("stream:profiles", openProfiles);
    return () => window.removeEventListener("stream:profiles", openProfiles);
  }, []);

  return (
    <>
      <Gate phase={phase} setPhase={setPhase} viewer={viewer} setViewer={setViewer} />
      <Billboard viewer={viewer} onReplay={() => setPhase("intro")} />
      <div className="relative z-10 -mt-14 space-y-20 pb-24 sm:space-y-24">
        <ContinueExploring />
        <FullStory />
        <TopMoments />
        <Originals viewer={viewer} />
        <TopPicks />
        <Seasons />
      </div>
      <Finale />
    </>
  );
}
