"use client";

import { Fragment, useRef } from "react";
import { SHELL_POINTS, SHELL_ASPECT } from "@/lib/shell-points";

/**
 * Studio intro copy with a hover "shell" motion: on mouse-enter every letter
 * glides smoothly toward the centre and arranges into the conch (소라) silhouette
 * — Motian's own motif — holds for a beat, then drifts back into the readable
 * sentences. The same letters throughout, centred (no top-down drop), kept
 * inside the artwork. Desktop / fine-pointer only; transforms only, no reflow.
 */
const OUT_MS = 1150; // disperse into the shell
const HOLD_MS = 650; // hold the shell
const BACK_MS = 1200; // reform the text
const TOTAL = OUT_MS + HOLD_MS + BACK_MS;
const STAGGER = 180; // gentle radial stagger from the centre (the focal point)
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)"; // smooth ease-in-out

export function IntroText({ paragraphs }: { paragraphs: string[][] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const running = useRef(false);

  const start = () => {
    const root = containerRef.current;
    if (!root || running.current) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    running.current = true;

    const crect = root.getBoundingClientRect();
    const cx = crect.width / 2;
    const cy = crect.height / 2;
    const shellH = crect.height * 0.9;
    const shellW = shellH * SHELL_ASPECT;
    const shellLeft = (crect.width - shellW) / 2;
    const shellTop = (crect.height - shellH) / 2;
    const maxDist = Math.hypot(cx, cy) || 1;

    const chars = Array.from(root.querySelectorAll<HTMLElement>(".mt-char"));

    // Shuffle the shell points so the letters spread across the whole shape.
    const order = SHELL_POINTS.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    // Read every letter's position first (one batch — avoids layout thrash).
    const items = chars.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        el,
        x: r.left + r.width / 2 - crect.left,
        y: r.top + r.height / 2 - crect.top,
      };
    });

    items.forEach((it, i) => {
      const p = SHELL_POINTS[order[i % order.length]];
      const dx = shellLeft + p[0] * shellW - it.x;
      const dy = shellTop + p[1] * shellH - it.y;
      const delay = (Math.hypot(it.x - cx, it.y - cy) / maxDist) * STAGGER;
      it.el.animate(
        [
          { transform: "translate(0px, 0px)", offset: 0, easing: EASE },
          {
            transform: `translate(${dx}px, ${dy}px)`,
            offset: OUT_MS / TOTAL,
            easing: "linear",
          },
          {
            transform: `translate(${dx}px, ${dy}px)`,
            offset: (OUT_MS + HOLD_MS) / TOTAL,
            easing: EASE,
          },
          { transform: "translate(0px, 0px)", offset: 1 },
        ],
        { duration: TOTAL, delay, easing: "linear" },
      );
    });

    window.setTimeout(() => {
      running.current = false;
    }, TOTAL + STAGGER + 200);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={start}
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
