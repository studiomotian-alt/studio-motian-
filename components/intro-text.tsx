"use client";

import { Fragment, useEffect, useRef } from "react";
import { SHELL_POINTS, SHELL_S, SHELL_ASPECT } from "@/lib/shell-points";

/**
 * Studio intro copy with a hover "shell" motion. The shell is a fixed thick
 * nautilus (앵무조개) spiral of points. On hover the letters flow in along curved,
 * galaxy-like paths and settle onto those points. Held there, the POINTS never
 * move and the letters never glide — instead the letter occupying each point is
 * swapped, instantly, with another, the way the characters on an LED signboard
 * (전광판) flip from one to the next. The shape stands perfectly still while its
 * text reshuffles. When the pointer leaves, the letters stream back out along the
 * same curves and disperse into the sentences.
 *
 * Desktop / fine-pointer only; transforms only, never reflow.
 */
const DUR = 2400; // master flow in / out timeline (ms) — slow + graceful
const STAGGER = 0.35; // mild spread so the inflow reads as one stream, not a sprinkle
const BOX_W_FRAC = 1.06; // spiral contain-fits within this fraction of the block width…
const BOX_H_FRAC = 1.2; // …and this fraction of its height
const VOFFSET_FRAC = 0.08; // nudge the formed shell down a touch
const CURVE = 0.34; // how far the inflow paths bow (galaxy swirl), as a fraction of distance
const FLIPS_PER_SEC = 400; // how many letter-pairs flip places each second while held
const KNN = 10; // a letter only ever flips with one of its nearest points

const N = SHELL_POINTS.length;

// nearest points for every point, so place-trades stay local and gentle
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

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type Geom = { cw: number; ch: number; pos: { x: number; y: number }[] };
type Shell = { sl: number; st: number; sw: number; sh: number };
type L = { rx: number; ry: number; home: number };

export function IntroText({ paragraphs }: { paragraphs: string[][] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLElement[]>([]);
  const geom = useRef<Geom | null>(null);
  const shell = useRef<Shell | null>(null);
  const letters = useRef<L[]>([]);
  const occupant = useRef<Int32Array>(new Int32Array(0));
  const flipBudget = useRef(0);
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
    // give every letter a distinct home point
    const order = SHELL_POINTS.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const occ = new Int32Array(N).fill(-1);
    const ls: L[] = chars.map((_, k) => {
      const home = order[k % order.length];
      occ[home] = k;
      const r = geom.current!.pos[k];
      return { rx: r.x, ry: r.y, home };
    });
    occupant.current = occ;
    letters.current = ls;
    flipBudget.current = 0;
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

  // flip `count` letters to a neighbouring point, instantly (전광판-style).
  // a letter only flips once it (and its target) have settled into the shell,
  // so the reshuffle begins the instant each part forms — no dead pause.
  const flip = (count: number, raw: number) => {
    const ls = letters.current;
    const occ = occupant.current;
    const n = ls.length;
    const span = 1 - STAGGER;
    const settled = (h: number) => (raw - SHELL_S[h] * STAGGER) / span >= 0.96;
    for (let c = 0; c < count; c++) {
      const i = (Math.random() * n) | 0;
      const Li = ls[i];
      if (!settled(Li.home)) continue;
      const nb = NEIGH[Li.home];
      const p = nb[(Math.random() * nb.length) | 0];
      if (!settled(p)) continue;
      const who = occ[p];
      if (who === -1) {
        occ[Li.home] = -1;
        Li.home = p;
        occ[p] = i;
      } else if (who !== i) {
        const a = Li.home;
        occ[a] = who;
        occ[p] = i;
        Li.home = p;
        ls[who].home = a;
      }
    }
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
    const ls = letters.current;
    const occ = occupant.current;

    // flip letters between fixed points — instantly — the moment they settle
    if (hovering.current && raw > 0.6 && occ.length) {
      flipBudget.current += (FLIPS_PER_SEC / 1000) * dt;
      const c = Math.floor(flipBudget.current);
      if (c > 0) {
        flip(c, raw);
        flipBudget.current -= c;
      }
    }

    const span = 1 - STAGGER;
    if (g && sh) {
      for (let i = 0; i < chars.length; i++) {
        const L = ls[i];
        if (!L) continue;
        const p = SHELL_POINTS[L.home];
        const sx = sh.sl + p[0] * sh.sw;
        const sy = sh.st + p[1] * sh.sh;

        // formation amount for this letter (mild wave by spiral position)
        let pl = (raw - SHELL_S[L.home] * STAGGER) / span;
        pl = pl < 0 ? 0 : pl > 1 ? 1 : pl;
        const pe = easeInOut(pl);

        // curved (galaxy-swirl) path from the sentence to the shell point
        const dx = sx - L.rx;
        const dy = sy - L.ry;
        const plen = Math.hypot(dx, dy) || 1;
        const camt = CURVE * plen;
        const cx = (L.rx + sx) / 2 + (-dy / plen) * camt;
        const cy = (L.ry + sy) / 2 + (dx / plen) * camt;
        const u = 1 - pe;
        const bx = u * u * L.rx + 2 * u * pe * cx + pe * pe * sx;
        const by = u * u * L.ry + 2 * u * pe * cy + pe * pe * sy;
        chars[i].style.transform = `translate(${bx - L.rx}px, ${by - L.ry}px)`;
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
