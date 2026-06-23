"use client";

import { Fragment, useEffect, useRef } from "react";
import { SHELL_POINTS, SHELL_ASPECT } from "@/lib/shell-points";

/**
 * Studio intro copy with a hover "shell" motion: while the pointer is over the
 * copy, every letter glides toward the centre and arranges into the conch (소라)
 * silhouette — Motian's own motif — and holds there. When the pointer leaves,
 * the letters drift back into the readable sentences. CSS transitions, so moving
 * the mouse on/off mid-flight reverses smoothly. Desktop / fine-pointer only;
 * transforms only, no reflow. Rest positions are measured once (and on
 * resize / after fonts load) so mid-flight transforms never corrupt the maths.
 */
const DUR = 1350; // travel time, each way (gentle)
const EASE = "cubic-bezier(0.6, 0, 0.25, 1)"; // smooth ease-in-out
const STAGGER = 150; // small radial stagger from the centre (focal point)
const BOX_W_FRAC = 1.08; // shell contain-fits within this fraction of the copy block width…
const BOX_H_FRAC = 1.2; // …and this fraction of its height (preserves aspect, any orientation)
const VOFFSET_FRAC = 0.12; // nudge the formed shell down a touch (fraction of block height)

type Geom = {
  cw: number;
  ch: number;
  pos: { x: number; y: number }[];
  order: number[];
};

export function IntroText({ paragraphs }: { paragraphs: string[][] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const geom = useRef<Geom | null>(null);
  const hovering = useRef(false);

  const measure = () => {
    const root = containerRef.current;
    if (!root || hovering.current) return; // never measure while letters are displaced
    const cr = root.getBoundingClientRect();
    const chars = root.querySelectorAll<HTMLElement>(".mt-char");
    const pos = Array.from(chars).map((el) => {
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
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEnter = () => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!geom.current) measure();
    const g = geom.current;
    const root = containerRef.current;
    if (!g || !root) return;
    hovering.current = true;

    const cx = g.cw / 2;
    const cy = g.ch / 2;
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
    const maxDist = Math.hypot(cx, cy) || 1;

    root.querySelectorAll<HTMLElement>(".mt-char").forEach((el, i) => {
      const rp = g.pos[i];
      if (!rp) return;
      const p = SHELL_POINTS[g.order[i % g.order.length]];
      const dx = sl + p[0] * shellW - rp.x;
      const dy = st + p[1] * shellH - rp.y;
      const delay = (Math.hypot(rp.x - cx, rp.y - cy) / maxDist) * STAGGER;
      el.style.transition = `transform ${DUR}ms ${EASE} ${delay}ms`;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  };

  const onLeave = () => {
    hovering.current = false;
    const g = geom.current;
    const root = containerRef.current;
    if (!g || !root) return;
    const cx = g.cw / 2;
    const cy = g.ch / 2;
    const maxDist = Math.hypot(cx, cy) || 1;
    root.querySelectorAll<HTMLElement>(".mt-char").forEach((el, i) => {
      const rp = g.pos[i];
      if (!rp) return;
      const delay = (Math.hypot(rp.x - cx, rp.y - cy) / maxDist) * STAGGER * 0.5;
      el.style.transition = `transform ${DUR}ms ${EASE} ${delay}ms`;
      el.style.transform = "translate(0px, 0px)";
    });
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
