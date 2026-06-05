"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Smooth shell cursor (desktop / fine-pointer only).
 *
 * The wrapper element tracks the mouse position with zero delay (its transform
 * is updated directly in a rAF, no CSS transition). The inner <img> handles the
 * size change — it scales up slightly over clickable elements with a CSS
 * transition, so only the *scale* animates, never the position.
 *
 * When the cursor is over a text field we fade the shell out so the native
 * text caret (I-beam) shows instead.
 */
const W = 27; // cursor.png intrinsic width
const H = 42; // cursor.png intrinsic height
const HX = 1; // hotspot (shell tip) x
const HY = 0; // hotspot (shell tip) y
const HOVER_SCALE = 1.12; // gentle grow over clickable elements

const INTERACTIVE = 'a[href], button, [role="button"], summary, label[for], select';
const TEXT_FIELD =
  'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea';

export function Cursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.documentElement.classList.add("has-custom-cursor");
    setActive(true);

    let x = 0;
    let y = 0;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = wrapRef.current;
      if (el) el.style.transform = `translate3d(${x - HX}px, ${y - HY}px, 0)`;
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
      const target = e.target as Element | null;
      const text = !!target?.closest(TEXT_FIELD);
      setHovering(!text && !!target?.closest(INTERACTIVE));
      setHidden(text);
    };
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ willChange: "transform" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cursor.png"
        alt=""
        draggable={false}
        className="block select-none"
        style={{
          width: W,
          height: H,
          maxWidth: "none",
          transformOrigin: `${HX}px ${HY}px`,
          transform: `scale(${hovering ? HOVER_SCALE : 1})`,
          opacity: hidden ? 0 : 1,
          transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 160ms ease-out",
        }}
      />
    </div>
  );
}
