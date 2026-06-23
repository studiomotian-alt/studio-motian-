"use client";

import { Fragment, useRef } from "react";

/**
 * Studio intro copy with a soft hover "settle" motion. On mouse-enter each
 * letter starts slightly offset and faded, then drifts gently into its real
 * place in an unhurried top-to-bottom wave — the same letters throughout, no
 * rotation, kept well inside the background artwork. Tuned to feel calm and
 * lyrical rather than snappy. Desktop / fine-pointer only; transforms only, so
 * the text never reflows.
 */
const SETTLE_MS = 1250; // per-letter drift time (slow, gentle)
const STAGGER_MS = 950; // spread of start times — the wave
const DX = 20; // max horizontal offset (kept small so letters stay in the artwork)
const DY = 14; // max vertical offset

export function IntroText({ paragraphs }: { paragraphs: string[][] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const running = useRef(false);

  const start = () => {
    const root = containerRef.current;
    if (!root || running.current) return;
    if (!window.matchMedia("(pointer: fine)").matches) return; // mouse only
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    running.current = true;

    const chars = root.querySelectorAll<HTMLElement>(".mt-char");
    const n = chars.length || 1;
    chars.forEach((el, i) => {
      const dx = (Math.random() * 2 - 1) * DX;
      const dy = (Math.random() * 2 - 1) * DY;
      const delay = (i / n) * STAGGER_MS + Math.random() * 160;
      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 },
          { transform: "translate(0, 0)", opacity: 1 },
        ],
        {
          duration: SETTLE_MS,
          delay,
          easing: "cubic-bezier(0.33, 1, 0.68, 1)", // gentle ease-out, soft settle
          fill: "backwards", // hold the offset/faded state during the stagger delay
        },
      );
    });

    window.setTimeout(() => {
      running.current = false;
    }, STAGGER_MS + SETTLE_MS + 350);
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
                  {/* a word is a no-wrap unit; letters inside settle individually */}
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
