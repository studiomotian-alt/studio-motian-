"use client";

import { Fragment, useEffect, useRef } from "react";
import { SHELL_POINTS, SHELL_ASPECT } from "@/lib/shell-points";

/**
 * Studio intro copy with a hover "shell" motion. While the pointer is over the
 * copy, the letters scatter out of the sentences — each on its own bowed, lightly
 * jittered path, at its own moment — and settle into a grain field shaped like the
 * studio's reference nautilus (앵무조개). Held there, the whole field shimmers
 * (자글자글); it never glides elastically. When the pointer leaves, the grains
 * scatter back home into the readable sentences.
 *
 * Desktop / fine-pointer only; transforms only, never reflow. Rest positions are
 * measured once (and on resize / after fonts load) so the running animation never
 * corrupts the maths.
 */
const DUR = 1600; // master scatter in / out timeline (ms)
const STAGGER = 0.6; // share of the timeline spread across the letters' random starts
const BOX_W_FRAC = 1.0; // shell contain-fits within this fraction of the block width…
const BOX_H_FRAC = 1.15; // …and this fraction of its height
const VOFFSET_FRAC = 0.1; // nudge the formed shell down a touch
const CURVE = 18; // px — how far each letter's path bows mid-flight (organic scatter)
const JIT = 2.2; // px — amplitude of the perpetual grain shimmer
const F1 = 0.021; // rad/ms — shimmer frequencies (fast = 자글자글)
const F2 = 0.037;

type Geom = { cw: number; ch: number; pos: { x: number; y: number }[] };
type Shell = { sl: number; st: number; sw: number; sh: number };
type Assign = {
  tx: number; // target point, normalised 0..1
  ty: number;
  delay: number; // 0..1 — when this letter starts moving
  cx: number; // mid-flight bow vector (px)
  cy: number;
  s1: number; // shimmer phase seeds
  s2: number;
};

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function IntroText({ paragraphs }: { paragraphs: string[][] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLElement[]>([]);
  const geom = useRef<Geom | null>(null);
  const shell = useRef<Shell | null>(null);
  const assign = useRef<Assign[]>([]);
  const hovering = useRef(false);
  const progress = useRef(0); // 0 = sentences, 1 = shell
  const raf = useRef(0);
  const lastT = useRef(0);

  const measure = () => {
    const root = containerRef.current;
    if (!root || hovering.current || progress.current > 0.001) return;
    const cr = root.getBoundingClientRect();
    const chars = Array.from(root.querySelectorAll<HTMLElement>(".mt-char"));
    charsRef.current = chars;
    geom.current = {
      cw: cr.width,
      ch: cr.height,
      pos: chars.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - cr.left, y: r.top + r.height / 2 - cr.top };
      }),
    };
    // shuffle the fill points so neighbouring letters fly off in every direction
    const order = SHELL_POINTS.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    assign.current = chars.map((_, i) => {
      const p = SHELL_POINTS[order[i % order.length]];
      const ang = Math.random() * Math.PI * 2;
      const amt = (0.4 + Math.random() * 0.6) * CURVE;
      return {
        tx: p[0],
        ty: p[1],
        delay: Math.random(),
        cx: Math.cos(ang) * amt,
        cy: Math.sin(ang) * amt,
        s1: Math.random() * Math.PI * 2,
        s2: Math.random() * Math.PI * 2,
      };
    });
  };

  useEffect(() => {
    measure();
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const computeShell = () => {
    const g = geom.current;
    if (!g) return;
    const boxW = g.cw * BOX_W_FRAC;
    const boxH = g.ch * BOX_H_FRAC;
    let sw = boxW;
    let sh = boxW / SHELL_ASPECT;
    if (sh > boxH) {
      sh = boxH;
      sw = boxH * SHELL_ASPECT;
    }
    shell.current = {
      sl: (g.cw - sw) / 2,
      st: (g.ch - sh) / 2 + g.ch * VOFFSET_FRAC,
      sw,
      sh,
    };
  };

  const tick = (now: number) => {
    const dt = now - lastT.current;
    lastT.current = now;

    const goal = hovering.current ? 1 : 0;
    const step = dt / DUR;
    if (progress.current < goal) progress.current = Math.min(goal, progress.current + step);
    else if (progress.current > goal) progress.current = Math.max(goal, progress.current - step);
    const raw = progress.current;

    const chars = charsRef.current;
    const g = geom.current;
    const s = shell.current;
    const as = assign.current;
    const span = 1 - STAGGER;
    if (g && s) {
      for (let i = 0; i < chars.length; i++) {
        const rest = g.pos[i];
        const a = as[i];
        if (!rest || !a) continue;
        let pl = (raw - a.delay * STAGGER) / span;
        pl = pl < 0 ? 0 : pl > 1 ? 1 : pl;
        const pe = easeInOut(pl);
        const tx = s.sl + a.tx * s.sw;
        const ty = s.st + a.ty * s.sh;
        const bow = Math.sin(pe * Math.PI); // 0 at ends, 1 mid-flight
        const jx = (Math.sin(now * F1 + a.s1) + Math.sin(now * F2 + a.s2)) * JIT * pe;
        const jy = (Math.sin(now * F2 + a.s2 * 1.3) + Math.sin(now * F1 + a.s1 * 0.7)) * JIT * pe;
        const dx = (tx - rest.x) * pe + a.cx * bow + jx;
        const dy = (ty - rest.y) * pe + a.cy * bow + jy;
        chars[i].style.transform = `translate(${dx}px, ${dy}px)`;
      }
    }

    if (hovering.current || progress.current > 0.0001) {
      raf.current = requestAnimationFrame(tick);
    } else {
      for (const el of chars) el.style.transform = "";
      raf.current = 0;
    }
  };

  const startLoop = () => {
    if (raf.current) return;
    lastT.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };

  const onEnter = () => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!geom.current) measure();
    computeShell();
    hovering.current = true;
    startLoop();
  };

  const onLeave = () => {
    hovering.current = false;
    startLoop();
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="space-y-5 text-[13px] leading-[1.75] text-ink md:max-w-[440px]"
    >
      {paragraphs.map((para, pi) => (
        <p key={pi}>
          {para.map((line, li) => (
            <span key={li} className="block">
              {line.split(" ").map((word, wi, arr) => (
                <Fragment key={wi}>
                  <span className="inline-block whitespace-nowrap">
                    {Array.from(word).map((ch, ci) => (
                      <span key={ci} className="mt-char inline-block">
                        {ch}
                      </span>
                    ))}
                  </span>
                  {wi < arr.length - 1 ? " " : null}
                </Fragment>
              ))}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
