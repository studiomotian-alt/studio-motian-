"use client";

import { Fragment, useEffect, useRef } from "react";
import { SHELL_POINTS, SHELL_ASPECT } from "@/lib/shell-points";

/**
 * Studio intro copy with a hover "shell" motion. While the pointer is over the
 * copy, every letter glides toward the centre and arranges into the nautilus
 * (앵무조개) line — Motian's motif — and then keeps gently *flowing* (a slow
 * coordinated drift) while holding that shape. When the pointer leaves, the
 * letters drift back into the readable sentences. Desktop / fine-pointer only;
 * transforms only, no reflow. Rest positions are measured once (and on resize /
 * after fonts load) so the running animation never corrupts the maths.
 */
const DUR = 1350; // fly in / out, each way
const BOX_W_FRAC = 1.08; // shell contain-fits within this fraction of the block width…
const BOX_H_FRAC = 1.2; // …and this fraction of its height (any orientation)
const VOFFSET_FRAC = 0.12; // nudge the formed shell down a touch
const FLOW_AMP = 6; // px — amplitude of the perpetual drift while held
const FLOW_SPEED = 0.0011; // rad/ms — slow, calm flow

type Geom = { cw: number; ch: number; pos: { x: number; y: number }[]; order: number[] };
type Target = { dx: number; dy: number; phase: number };

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function IntroText({ paragraphs }: { paragraphs: string[][] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLElement[]>([]);
  const geom = useRef<Geom | null>(null);
  const targets = useRef<Target[]>([]);
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
    const pos = chars.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - cr.left, y: r.top + r.height / 2 - cr.top };
    });
    const order = SHELL_POINTS.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    geom.current = { cw: cr.width, ch: cr.height, pos, order };
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

  const computeTargets = () => {
    const g = geom.current;
    if (!g) return;
    const boxW = g.cw * BOX_W_FRAC;
    const boxH = g.ch * BOX_H_FRAC;
    let shellW = boxW;
    let shellH = boxW / SHELL_ASPECT;
    if (shellH > boxH) {
      shellH = boxH;
      shellW = boxH * SHELL_ASPECT;
    }
    const sl = (g.cw - shellW) / 2;
    const st = (g.ch - shellH) / 2 + g.ch * VOFFSET_FRAC;
    targets.current = charsRef.current.map((_, i) => {
      const rp = g.pos[i] || { x: 0, y: 0 };
      const p = SHELL_POINTS[g.order[i % g.order.length]];
      return {
        dx: sl + p[0] * shellW - rp.x,
        dy: st + p[1] * shellH - rp.y,
        phase: (p[0] + p[1]) * Math.PI * 1.6, // a coordinated wave across the shape
      };
    });
  };

  const tick = (now: number) => {
    const dt = now - lastT.current;
    lastT.current = now;
    const goal = hovering.current ? 1 : 0;
    const step = dt / DUR;
    if (progress.current < goal) progress.current = Math.min(goal, progress.current + step);
    else if (progress.current > goal) progress.current = Math.max(goal, progress.current - step);
    const p = easeInOut(progress.current);

    const chars = charsRef.current;
    const ts = targets.current;
    for (let i = 0; i < chars.length; i++) {
      const t = ts[i];
      if (!t) continue;
      const fx = Math.sin(now * FLOW_SPEED + t.phase) * FLOW_AMP * p;
      const fy = Math.sin(now * FLOW_SPEED * 0.9 + t.phase + Math.PI / 2) * FLOW_AMP * p;
      chars[i].style.transform = `translate(${t.dx * p + fx}px, ${t.dy * p + fy}px)`;
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
    computeTargets();
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
