"use client";

import { Fragment, useEffect, useRef } from "react";
import { SHELL_POINTS, SHELL_ASPECT } from "@/lib/shell-points";

/**
 * Studio intro copy with a hover "shell" motion. While the pointer is over the
 * copy, the letters draw themselves onto a nautilus (앵무조개) spiral — in order,
 * from the coil's centre outward, like a wave running along the curve rather than
 * a scatter. Once formed, a slow transverse ripple travels the spiral so the line
 * undulates gently (물결), wistful and smooth — never jittery, never busy. When the
 * pointer leaves, the wave recedes and the letters settle back into the sentences.
 *
 * Desktop / fine-pointer only; transforms only, never reflow.
 */
const DUR = 2200; // master draw in / out timeline (ms) — slow + smooth
const STAGGER = 0.82; // share of the timeline spread along the path (a tight wave)
const BOX_W_FRAC = 1.04; // spiral contain-fits within this fraction of the block width…
const BOX_H_FRAC = 1.18; // …and this fraction of its height
const VOFFSET_FRAC = 0.1; // nudge the formed shell down a touch
const WAVE_AMP = 7; // px — transverse ripple amplitude while held
const WAVE_N = 2.5; // number of ripple crests along the spiral
const WAVE_SPEED = 0.0016; // rad/ms — how fast the ripple travels (slow = dreamy)

const N = SHELL_POINTS.length;

// Per-point unit normal (in aspect-correct space) so the ripple pushes each letter
// cleanly perpendicular to the spiral, and its 0..1 position along the path.
const NORMAL: { px: number; py: number; s: number }[] = (() => {
  const ax = SHELL_POINTS.map((p) => p[0] * SHELL_ASPECT);
  const ay = SHELL_POINTS.map((p) => p[1]);
  const out: { px: number; py: number; s: number }[] = [];
  for (let i = 0; i < N; i++) {
    const a = Math.max(0, i - 1);
    const b = Math.min(N - 1, i + 1);
    let tx = ax[b] - ax[a];
    let ty = ay[b] - ay[a];
    const len = Math.hypot(tx, ty) || 1;
    tx /= len;
    ty /= len;
    out.push({ px: -ty, py: tx, s: i / (N - 1) });
  }
  return out;
})();

type Geom = { cw: number; ch: number; pos: { x: number; y: number }[] };
type Shell = { sl: number; st: number; sw: number; sh: number };
type Slot = { i: number; s: number; px: number; py: number };

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function IntroText({ paragraphs }: { paragraphs: string[][] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLElement[]>([]);
  const geom = useRef<Geom | null>(null);
  const shell = useRef<Shell | null>(null);
  const slot = useRef<Slot[]>([]);
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
    const n = chars.length || 1;
    // map each letter, in reading order, to an evenly-spaced point along the spiral
    slot.current = chars.map((_, k) => {
      const i = Math.round((k * (N - 1)) / Math.max(1, n - 1));
      const nrm = NORMAL[i];
      return { i, s: nrm.s, px: nrm.px, py: nrm.py };
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
    const sh = shell.current;
    const sl = slot.current;
    const span = 1 - STAGGER;
    if (g && sh) {
      for (let i = 0; i < chars.length; i++) {
        const rest = g.pos[i];
        const sp = sl[i];
        if (!rest || !sp) continue;
        // the wave of formation runs along the path (centre first, outer last)
        let pl = (raw - sp.s * STAGGER) / span;
        pl = pl < 0 ? 0 : pl > 1 ? 1 : pl;
        const pe = easeInOut(pl);
        // slow transverse ripple travelling along the spiral
        const wave = Math.sin(sp.s * WAVE_N * Math.PI * 2 - now * WAVE_SPEED) * WAVE_AMP;
        const p = SHELL_POINTS[sp.i];
        const tx = sh.sl + p[0] * sh.sw + sp.px * wave;
        const ty = sh.st + p[1] * sh.sh + sp.py * wave;
        chars[i].style.transform = `translate(${(tx - rest.x) * pe}px, ${(ty - rest.y) * pe}px)`;
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
