"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Briefcase, Building2, Users, Sparkles, type LucideIcon } from "lucide-react";
import { site } from "@/content/site-data";

export type ViewerId = "recruiter" | "leader" | "developer" | "curious";

export const viewers: {
  id: ViewerId;
  label: string;
  note: string;
  icon: LucideIcon;
  tile: string;
}[] = [
  { id: "recruiter", label: "Hiring Manager", note: "Résumé, roles and credentials", icon: Briefcase, tile: "from-rose-500 to-red-800" },
  { id: "leader", label: "Business Leader", note: "Outcomes and how HR runs", icon: Building2, tile: "from-sky-400 to-blue-800" },
  { id: "developer", label: "HR Professional", note: "Process, tools and practice", icon: Users, tile: "from-emerald-400 to-teal-800" },
  { id: "curious", label: "Just Curious", note: "The whole story", icon: Sparkles, tile: "from-amber-300 to-orange-700" },
];

export type Phase = "intro" | "profiles" | "home";

const KEY = "stream:viewer";

export function readViewer(): ViewerId | null {
  try {
    const v = window.sessionStorage.getItem(KEY);
    return viewers.some((x) => x.id === v) ? (v as ViewerId) : null;
  } catch {
    return null;
  }
}

function saveViewer(v: ViewerId) {
  try {
    window.sessionStorage.setItem(KEY, v);
  } catch {
    /* storage unavailable: the choice just lasts for this page view */
  }
}

const surname = site.name.split(" ")[0];

/** Full-screen opening: title card, then "Who's viewing?" */
export function Gate({
  phase,
  setPhase,
  viewer,
  setViewer,
}: {
  phase: Phase;
  setPhase: (p: Phase) => void;
  viewer: ViewerId | null;
  setViewer: (v: ViewerId) => void;
}) {
  const reduce = useReducedMotion();

  // Title card auto-advances.
  React.useEffect(() => {
    if (phase !== "intro") return;
    const t = window.setTimeout(() => setPhase(viewer ? "home" : "profiles"), reduce ? 600 : 3200);
    return () => window.clearTimeout(t);
  }, [phase, viewer, reduce, setPhase]);

  // Lock scrolling while the gate covers the page.
  React.useEffect(() => {
    document.body.style.overflow = phase === "home" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  const choose = (v: ViewerId) => {
    saveViewer(v);
    setViewer(v);
    setPhase("home");
  };

  return (
    <AnimatePresence>
      {phase === "intro" && (
        <motion.div
          key="intro"
          className="film-grain fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "radial-gradient(60% 55% at 60% 40%, hsl(280 45% 16%) 0%, hsl(0 0% 2%) 70%)" }}
          />
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-px w-[60vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1.4], opacity: [0, 1, 0] }}
            transition={{ duration: 2.4, times: [0, 0.5, 1], ease: "easeOut" }}
          />
          <motion.p
            className="relative font-display text-xl tracking-[0.5em] text-white/90 sm:text-3xl"
            initial={{ opacity: 0, letterSpacing: "0.2em", scale: 0.96 }}
            animate={{ opacity: [0, 1, 1, 0], letterSpacing: "0.55em", scale: 1.08 }}
            transition={{ duration: 3, times: [0, 0.25, 0.8, 1], ease: "easeOut" }}
          >
            AN {surname.toUpperCase()} ORIGINAL
          </motion.p>
          <button
            type="button"
            onClick={() => setPhase(viewer ? "home" : "profiles")}
            className="absolute right-5 top-5 rounded border border-white/40 bg-black/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 hover:border-white"
          >
            Skip intro
          </button>
        </motion.div>
      )}

      {phase === "profiles" && (
        <motion.div
          key="profiles"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gate-title"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-y-auto bg-background px-5 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.45 }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
            style={{ background: "radial-gradient(50% 80% at 50% 0%, hsl(354 82% 52% / 0.22), transparent 70%)" }}
          />
          <h1 id="gate-title" className="relative font-display text-5xl sm:text-6xl">
            Who&rsquo;s viewing?
          </h1>
          <ul className="relative mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-7">
            {viewers.map((v, i) => (
              <motion.li
                key={v.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.08, duration: 0.45 }}
              >
                <button
                  type="button"
                  onClick={() => choose(v.id)}
                  className="group flex w-32 flex-col items-center text-center sm:w-36"
                >
                  <span
                    className={`flex aspect-square w-full items-center justify-center rounded-md bg-gradient-to-br ${v.tile} ring-2 ring-transparent transition duration-200 group-hover:scale-105 group-hover:ring-white group-focus-visible:ring-white`}
                  >
                    <v.icon className="h-12 w-12 text-white drop-shadow" strokeWidth={1.5} />
                  </span>
                  <span className="mt-3 text-sm font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
                    {v.label}
                  </span>
                  <span className="mt-1 text-xs leading-snug text-muted-foreground/80">{v.note}</span>
                </button>
              </motion.li>
            ))}
          </ul>
          <p className="relative mt-10 max-w-sm text-center text-xs text-muted-foreground">
            Every profile sees the same story. Your pick only changes what plays first.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
