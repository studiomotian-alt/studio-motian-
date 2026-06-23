"use client";

import { Fragment, useRef } from "react";

/**
 * Studio intro copy with a hover "assemble" motion: on mouse-enter every letter
 * scatters to a random position/rotation (disorder) and then settles back into
 * its real place in a top-to-bottom wave (order) — the *same* letters the whole
 * time, never gibberish. Echoes Motian building a logical structure from
 * fragments. Transforms only, so the text layout never reflows.
 */
const SETTLE_MS = 640; // per-letter travel time
const STAGGER_MS = 760; // spread of start times across the text (the "wave")

export function IntroText({ paragraphs }: { paragraphs: string[][] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const running = useRef(false);

  const start = () => {
    const root = containerRef.current;
    if (!root || running.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    running.current = true;

    const chars = root.querySelectorAll<HTMLElement>(".mt-char");
    const n = chars.length || 1;
    chars.forEach((el, i) => {
      const dx = (Math.random() * 2 - 1) * 52;
      const dy = (Math.random() * 2 - 1) * 34;
      const rot = (Math.random() * 2 - 1) * 26;
      const delay = (i / n) * STAGGER_MS + Math.random() * 150;
      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)` },
          { transform: "translate(0, 0) rotate(0deg)" },
        ],
        {
          duration: SETTLE_MS,
          delay,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "backwards", // hold the scattered state during the stagger delay
        },
      );
    });

    window.setTimeout(() => {
      running.current = false;
    }, STAGGER_MS + SETTLE_MS + 300);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={start}
      className="space-y-5 text-[13px] leading-[1.75] text-ink md:max-w-[500px]"
    >
      {paragraphs.map((para, pi) => (
        <p key={pi}>
          {para.map((line, li) => (
            <span key={li} className="block">
              {line.split(" ").map((word, wi, arr) => (
                <Fragment key={wi}>
                  {/* a word is a no-wrap unit; letters inside scatter individually */}
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
