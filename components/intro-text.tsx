"use client";

import { Fragment, useEffect, useRef } from "react";
import { SHELL_POINTS, SHELL_S, SHELL_NRM, SHELL_ASPECT } from "@/lib/shell-points";

/**
 * Studio intro copy with a hover "shell" motion. While the pointer is over the
 * copy, the letters flow onto a THICK nautilus (앵무조개) spiral — drawing on in
 * order along the curve, like a wave, so the band fills from its coil outward.
 * Inside the band the letters sit at shading densities, darker in the coil and
 * fading outward (음영). Once formed, a slow long-wavelength ripple travels the
 * spiral so the whole ribbon sways gently — smooth and wistful, never choppy or
 * jittery. When the pointer leaves, the wave recedes back into the sentences.
 *
 * Desktop / fine-pointer only; transforms only, never reflow.
 */
const DUR = 2200; // master draw in / out timeline (ms) — slow + smooth
const STAGGER = 0.78; // share of the timeline the draw-on wave is spread over
const BOX_W_FRAC = 1.06; // spiral contain-fits within this fraction of the block width…
const BOX_H_FRAC = 1.2; // …and this fraction of its height
const VOFFSET_FRAC = 0.08; // nudge the formed shell down a touch
const WAVE_AMP = 6; // px — gentle ribbon sway while held
const WAVE_N = 1.1; // crests along the whole spiral (low = long, smooth wave)
const WAVE_SPEED = 0.0013; // rad/ms — how fast the sway travels (slow = dreamy)

const N = SHELL_POINTS.length;

type Geom = { cw: number; ch: number; pos: { x: number; y: number }[] };
type Shell = { sl: number; st: number; sw: number; sh: number };
type Slot = { i: number; s: number; nx: number; ny: number };

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
    // spread the letters evenly across every point of the thick band (keeps the shading)
    slot.current = chars.map((_, k) => {
      const i = Math.round((k * (N - 1)) / Math.max(1, n - 1));
      const nrm = SHELL_NRM[i] || [0, 0];
      return { i, s: SHELL_S[i] ?? 0, nx: nrm[0], ny: nrm[1] };
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
        // wave of formation runs along the spiral (coil centre first, outer last)
        let pl = (raw - sp.s * STAGGER) / span;
        pl = pl < 0 ? 0 : pl > 1 ? 1 : pl;
        const pe = easeInOut(pl);
        // slow long-wavelength ribbon sway, along the band normal
        const wave = Math.sin(sp.s * WAVE_N * Math.PI * 2 - now * WAVE_SPEED) * WAVE_AMP;
        const p = SHELL_POINTS[sp.i];
        const tx = sh.sl + p[0] * sh.sw + sp.nx * wave;
        const ty = sh.st + p[1] * sh.sh + sp.ny * wave;
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
