"use client";

import { useEffect, useRef } from "react";

/**
 * Studio intro copy with a hover "assemble" motion: on mouse-enter the letters
 * dissolve into ASCII/code-like noise (disorder) and then lock into place from
 * top-left to bottom-right (order) — echoing Motian's idea of building a logical
 * structure up from fragments. Punctuation, digits-in-labels and spaces are kept
 * so the *structure* stays legible while the words resolve.
 *
 * The real text is always what React renders (SSR-friendly / accessible); the
 * scramble only mutates textContent imperatively during the animation.
 */
const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz/\\|+=<>*·:—".split("");
const DURATION = 1400; // ms — full assemble time

const scrambleable = (ch: string) => /[A-Za-z]/.test(ch);

export function IntroText({ paragraphs }: { paragraphs: string[][] }) {
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const running = useRef(false);
  const rafId = useRef(0);

  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  // Flat index for each rendered line.
  const offsets: number[] = [];
  let acc = 0;
  for (const p of paragraphs) {
    offsets.push(acc);
    acc += p.length;
  }
  const flatLines = paragraphs.flat();

  const start = () => {
    if (running.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    running.current = true;

    const total = flatLines.reduce((s, l) => s + l.length, 0);
    const settle: number[][] = [];
    let g = 0;
    for (const line of flatLines) {
      const arr: number[] = [];
      for (let i = 0; i < line.length; i++) {
        const base = (g / total) * DURATION * 0.55;
        const jitter = Math.random() * DURATION * 0.45;
        arr.push(base + jitter);
        g++;
      }
      settle.push(arr);
    }

    const t0 = performance.now();
    const frame = (now: number) => {
      const t = now - t0;
      const step = Math.floor(t / 45); // glyph cycle speed
      let done = true;
      for (let li = 0; li < flatLines.length; li++) {
        const el = lineRefs.current[li];
        if (!el) continue;
        const real = flatLines[li];
        let out = "";
        for (let i = 0; i < real.length; i++) {
          const ch = real[i];
          if (!scrambleable(ch) || t >= settle[li][i]) {
            out += ch;
          } else {
            done = false;
            out += GLYPHS[(step + i * 7 + li * 13) % GLYPHS.length];
          }
        }
        el.textContent = out;
      }
      if (!done && t < DURATION + 250) {
        rafId.current = requestAnimationFrame(frame);
      } else {
        for (let li = 0; li < flatLines.length; li++) {
          const el = lineRefs.current[li];
          if (el) el.textContent = flatLines[li];
        }
        running.current = false;
      }
    };
    rafId.current = requestAnimationFrame(frame);
  };

  return (
    <div
      onMouseEnter={start}
      className="space-y-5 text-[13px] leading-[1.75] text-ink md:max-w-[500px]"
    >
      {paragraphs.map((para, pi) => (
        <p key={pi}>
          {para.map((line, li) => {
            const idx = offsets[pi] + li;
            return (
              <span
                key={li}
                ref={(el) => {
                  lineRefs.current[idx] = el;
                }}
                className="block"
              >
                {line}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
