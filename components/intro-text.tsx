"use client";

import { Fragment, useEffect, useRef } from "react";
import { SHELL_POINTS, SHELL_S, SHELL_ASPECT } from "@/lib/shell-points";

/**
 * Studio intro copy with a hover "shell" motion. The shell is a fixed thick
 * nautilus (앵무조개) spiral of points. On hover the letters flow in along curved,
 * galaxy-like paths and settle onto those points. Held there, the POINTS never
 * move — only the letters do: each keeps gliding to a neighbouring point, trading
 * places with its neighbour, like characters streaming through fixed slots. The
 * shape itself never wobbles. When the pointer leaves, the letters stream back
 * out along the same curves and disperse into the sentences.
 *
 * Desktop / fine-pointer only; transforms only, never reflow.
 */
const DUR = 2400; // master flow in / out timeline (ms) — slow + graceful
const STAGGER = 0.35; // mild spread so the inflow reads as one stream, not a sprinkle
const BOX_W_FRAC = 1.06; // spiral contain-fits within this fraction of the block width…
const BOX_H_FRAC = 1.2; // …and this fraction of its height
const VOFFSET_FRAC = 0.08; // nudge the formed shell down a touch
const CURVE = 0.34; // how far the inflow paths bow (galaxy swirl), as a fraction of distance
const SWAP_MIN = 1700; // ms — slowest / fastest a single place-trade takes
const SWAP_MAX = 3500;
const ACTIVE = 0.13; // fraction of letters trading places at any moment (gentle stream)
const KNN = 7; // a letter only ever trades with one of its nearest points

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
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

type Geom = { cw: number; ch: number; pos: { x: number; y: number }[] };
type Shell = { sl: number; st: number; sw: number; sh: number };
type L = { rx: number; ry: number; home: number; from: number; to: number; t: number; dur: number; swap: boolean };

export function IntroText({ paragraphs }: { paragraphs: string[][] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLElement[]>([]);
  const geom = useRef<Geom | null>(null);
  const shell = useRef<Shell | null>(null);
  const letters = useRef<L[]>([]);
  const occupant = useRef<Int32Array>(new Int32Array(0));
  const active = useRef(0);
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
      return { rx: r.x, ry: r.y, home, from: home, to: home, t: 0, dur: 0, swap: false };
    });
    occupant.current = occ;
    letters.current = ls;
    active.current = 0;
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

  // keep a gentle number of letters trading places among the fixed points
  const trade = () => {
    const ls = letters.current;
    const occ = occupant.current;
    const n = ls.length;
    const cap = Math.floor(n * ACTIVE);
    let attempts = 0;
    while (active.current < cap && attempts < 40) {
      attempts++;
      const i = (Math.random() * n) | 0;
      const Li = ls[i];
      if (Li.swap) continue;
      const nb = NEIGH[Li.home];
      const p = nb[(Math.random() * nb.length) | 0];
      const who = occ[p];
      const dur = rnd(SWAP_MIN, SWAP_MAX);
      if (who === -1) {
        occ[Li.home] = -1;
        Li.from = Li.home;
        Li.to = p;
        Li.home = p;
        occ[p] = i;
        Li.t = 0;
        Li.dur = dur;
        Li.swap = true;
        active.current += 1;
      } else if (who !== i && !ls[who].swap) {
        const Lj = ls[who];
        const a = Li.home;
        Li.from = a;
        Li.to = p;
        Li.home = p;
        occ[p] = i;
        Lj.from = p;
        Lj.to = a;
        Lj.home = a;
        occ[a] = who;
        Li.t = Lj.t = 0;
        Li.dur = Lj.dur = dur;
        Li.swap = Lj.swap = true;
        active.current += 2;
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

    // advance place-trades; once the shell is formed, keep new ones flowing
    for (let k = 0; k < ls.length; k++) {
      const L = ls[k];
      if (L.swap) {
        L.t += dt / L.dur;
        if (L.t >= 1) {
          L.t = 1;
          L.swap = false;
          L.from = L.to = L.home;
          active.current -= 1;
        }
      }
    }
    if (hovering.current && raw > 0.85 && occ.length) trade();

    const span = 1 - STAGGER;
    if (g && sh) {
      for (let i = 0; i < chars.length; i++) {
        const L = ls[i];
        if (!L) continue;
        // current point (gliding between two fixed points if trading)
        let nx: number;
        let ny: number;
        if (L.swap) {
          const e = easeInOut(L.t);
          const a = SHELL_POINTS[L.from];
          const b = SHELL_POINTS[L.to];
          nx = a[0] + (b[0] - a[0]) * e;
          ny = a[1] + (b[1] - a[1]) * e;
        } else {
          const p = SHELL_POINTS[L.home];
          nx = p[0];
          ny = p[1];
        }
        const sx = sh.sl + nx * sh.sw;
        const sy = sh.st + ny * sh.sh;

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
