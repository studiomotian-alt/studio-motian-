"use client";

import { Fragment, useEffect, useRef } from "react";
import { SHELL_POINTS, SHELL_ASPECT } from "@/lib/shell-points";

/**
 * Studio intro copy with a hover "shell" motion. While the pointer is over the
 * copy, the letters draw themselves — in path order, centre outward — onto the
 * nautilus (앵무조개) outline traced from the studio's reference shell, building
 * the shape the way Motian builds a brand: structure, accreted. Once formed they
 * keep *streaming* slowly along the contour, like characters flowing around a
 * line; the shape holds, only the letters travel. A soft fade hides the point
 * where the path wraps from the aperture back to the centre. When the pointer
 * leaves, the shape un-draws (outer whorl first) back into the sentences.
 *
 * Desktop / fine-pointer only; transforms + opacity only, never reflow. Rest
 * positions are measured once (and on resize / after fonts load) so the running
 * animation never corrupts the maths.
 */
const DUR = 1900; // master fly in / out timeline (ms) — slow + lyrical
const STAGGER = 0.73; // share of the timeline spent drawing letters on in path order
const BOX_W_FRAC = 1.08; // spiral contain-fits within this fraction of the block width…
const BOX_H_FRAC = 1.2; // …and this fraction of its height
const VOFFSET_FRAC = 0.12; // nudge the formed shell down a touch
const FLOW_SPEED = 0.019; // path-points per ms — slow, calm streaming along the line
const FADE = 0.045; // fraction of the path at each end where letters fade out / in

const N = SHELL_POINTS.length;

type Geom = { cw: number; ch: number; pos: { x: number; y: number }[] };
type Shell = { sl: number; st: number; sw: number; sh: number };

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function IntroText({ paragraphs }: { paragraphs: string[][] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLElement[]>([]);
  const geom = useRef<Geom | null>(null);
  const shell = useRef<Shell | null>(null);
  const param = useRef<number[]>([]); // each letter's base position along the path
  const hovering = useRef(false);
  const progress = useRef(0); // 0 = sentences, 1 = shell
  const flow = useRef(0); // ever-advancing streaming offset (path-points)
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
    // spread the letters evenly along the whole spiral
    param.current = chars.map((_, i) => (i * N) / n);
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
    const raw = progress.current; // 0 = sentences, 1 = fully formed shell

    flow.current += FLOW_SPEED * dt; // keep the line streaming

    const chars = charsRef.current;
    const g = geom.current;
    const s = shell.current;
    const base = param.current;
    if (g && s) {
      const span = 1 - STAGGER;
      for (let i = 0; i < chars.length; i++) {
        const rest = g.pos[i];
        if (!rest) continue;
        // each letter draws on in path order (centre first, outer whorl last)
        const home = base[i] / N; // 0..1 home position along the path
        let pl = (raw - home * STAGGER) / span;
        pl = pl < 0 ? 0 : pl > 1 ? 1 : pl;
        const pe = easeInOut(pl);
        let q = (base[i] + flow.current) % N;
        if (q < 0) q += N;
        const i0 = Math.floor(q);
        const i1 = (i0 + 1) % N;
        const f = q - i0;
        const a = SHELL_POINTS[i0];
        const b = SHELL_POINTS[i1];
        const px = s.sl + (a[0] + (b[0] - a[0]) * f) * s.sw;
        const py = s.st + (a[1] + (b[1] - a[1]) * f) * s.sh;
        chars[i].style.transform = `translate(${(px - rest.x) * pe}px, ${(py - rest.y) * pe}px)`;
        // fade only the few letters crossing the aperture<->centre wrap
        const u = q / N;
        const endFade = Math.min(Math.min(u, 1 - u) / FADE, 1);
        chars[i].style.opacity = `${1 - (1 - endFade) * pe}`;
      }
    }

    if (hovering.current || progress.current > 0.0001) {
      raf.current = requestAnimationFrame(tick);
    } else {
      for (const el of chars) {
        el.style.transform = "";
        el.style.opacity = "";
      }
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
    if (progress.current < 0.01) flow.current = 0; // fresh formation draws cleanly from the centre
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
