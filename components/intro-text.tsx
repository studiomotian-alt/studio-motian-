"use client";

import { Fragment, useEffect, useRef } from "react";
import { SHELL_POINTS, SHELL_ASPECT } from "@/lib/shell-points";

/**
 * Studio intro copy with a hover "shell" motion. While the pointer is over the
 * copy, the letters scatter out of the sentences and settle onto a FIXED field of
 * points shaped like the studio's reference nautilus (앵무조개). The points never
 * move; instead the letters slowly trade places among them — each drifting to a
 * neighbouring point and on to the next — so the shell holds while the text keeps
 * rearranging itself, wistful and dreamlike (아련·몽환). No letter ever dances in
 * place. When the pointer leaves, the letters scatter back into the sentences.
 *
 * Desktop / fine-pointer only; transforms only, never reflow.
 */
const DUR = 1700; // scatter in / out timeline (ms)
const STAGGER = 0.6; // share of the timeline spread across the letters' starts
const BOX_W_FRAC = 1.0; // shell contain-fits within this fraction of the block width…
const BOX_H_FRAC = 1.15; // …and this fraction of its height
const VOFFSET_FRAC = 0.08; // nudge the formed shell down a touch
const CURVE = 14; // px — gentle bow on each letter's scatter path
const MIG_MIN = 2600; // ms — slowest / fastest a single drift between points takes
const MIG_MAX = 5200;
const KNN = 7; // a letter drifts to one of this many nearest points

const N = SHELL_POINTS.length;

// Nearest neighbours for every fixed point, so drift hops stay short and gentle.
const NEIGH: number[][] = (() => {
  const out: number[][] = [];
  for (let i = 0; i < N; i++) {
    const d: { j: number; v: number }[] = [];
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      const dx = SHELL_POINTS[i][0] - SHELL_POINTS[j][0];
      const dy = SHELL_POINTS[i][1] - SHELL_POINTS[j][1];
      d.push({ j, v: dx * dx + dy * dy });
    }
    d.sort((a, b) => a.v - b.v);
    out.push(d.slice(0, KNN).map((o) => o.j));
  }
  return out;
})();

const rnd = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

type Geom = { cw: number; ch: number; pos: { x: number; y: number }[] };
type Shell = { sl: number; st: number; sw: number; sh: number };
type Mig = { a: number; b: number; t: number; dur: number; delay: number; cx: number; cy: number };

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function IntroText({ paragraphs }: { paragraphs: string[][] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLElement[]>([]);
  const geom = useRef<Geom | null>(null);
  const shell = useRef<Shell | null>(null);
  const mig = useRef<Mig[]>([]);
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
    // give every letter a distinct starting point, then a drift target + a path bow
    const order = SHELL_POINTS.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    mig.current = chars.map((_, i) => {
      const a = order[i % order.length];
      const ang = Math.random() * Math.PI * 2;
      const amt = (0.4 + Math.random() * 0.6) * CURVE;
      return {
        a,
        b: pick(NEIGH[a]),
        t: Math.random(),
        dur: rnd(MIG_MIN, MIG_MAX),
        delay: Math.random(),
        cx: Math.cos(ang) * amt,
        cy: Math.sin(ang) * amt,
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
    const ms = mig.current;
    const span = 1 - STAGGER;
    if (g && s) {
      for (let i = 0; i < chars.length; i++) {
        const rest = g.pos[i];
        const m = ms[i];
        if (!rest || !m) continue;

        // advance the slow drift from point a -> point b (then on to the next)
        m.t += dt / m.dur;
        if (m.t >= 1) {
          m.t = 0;
          m.a = m.b;
          m.b = pick(NEIGH[m.a]);
          m.dur = rnd(MIG_MIN, MIG_MAX);
        }
        const e = easeInOut(m.t);
        const pa = SHELL_POINTS[m.a];
        const pb = SHELL_POINTS[m.b];
        const nx = pa[0] + (pb[0] - pa[0]) * e;
        const ny = pa[1] + (pb[1] - pa[1]) * e;
        const tx = s.sl + nx * s.sw;
        const ty = s.st + ny * s.sh;

        // formation: this letter's own slice of the scatter timeline
        let pl = (raw - m.delay * STAGGER) / span;
        pl = pl < 0 ? 0 : pl > 1 ? 1 : pl;
        const pe = easeInOut(pl);
        const bow = Math.sin(pe * Math.PI); // 0 at ends, peaks mid-flight
        const dx = (tx - rest.x) * pe + m.cx * bow;
        const dy = (ty - rest.y) * pe + m.cy * bow;
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
