"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Session-once intro splash: a white screen with a small, subtle (50%) video.
 * The video fades IN over the (instantly-white, flash-free) cover, plays, and
 * the whole thing fades OUT starting shortly before the clip ends so the reveal
 * overlaps the last moment of the video for a smoother hand-off to the site.
 *
 * Skipped on repeat visits in the same session and for "reduce motion" users
 * (both handled by the inline boot script in app/layout.tsx).
 */
const FADE_MS = 700;
const FADE_LEAD = 0.8; // begin fading out this many seconds before the video ends

export function Intro() {
  const [show, setShow] = useState(false);
  const [entered, setEntered] = useState(false); // false → fade in from 0
  const [out, setOut] = useState(false); // true → fade out
  const dismissing = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissing.current) return;
    dismissing.current = true;
    setOut(true);
    const root = document.documentElement;
    root.classList.add("mt-intro-out"); // fades the white cover out in sync
    window.setTimeout(() => {
      root.classList.remove("mt-intro-on", "mt-intro-out", "mt-intro-lock");
      setShow(false);
    }, FADE_MS + 60);
  }, []);

  useEffect(() => {
    if (!document.documentElement.classList.contains("mt-intro-on")) return;
    try {
      sessionStorage.setItem("mt_intro", "1");
    } catch {
      /* private mode — show once anyway */
    }
    setShow(true);
    const fadeIn = window.setTimeout(() => setEntered(true), 50); // paint at 0, then fade in
    const safety = window.setTimeout(dismiss, 5500); // fallback if playback is blocked
    return () => {
      window.clearTimeout(fadeIn);
      window.clearTimeout(safety);
    };
  }, [dismiss]);

  const onTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (v.duration && v.currentTime >= v.duration - FADE_LEAD) dismiss();
  };

  if (!show) return null;

  return (
    <div
      onClick={dismiss}
      aria-hidden
      className="fixed inset-0 z-[9991] flex cursor-pointer items-center justify-center transition-opacity ease-out"
      style={{
        opacity: out ? 0 : entered ? 1 : 0,
        transitionDuration: `${FADE_MS}ms`,
      }}
    >
      <video
        autoPlay
        muted
        playsInline
        onTimeUpdate={onTimeUpdate}
        onEnded={dismiss}
        poster="/motian_bg_poster.jpg"
        className="w-[400px] max-w-[78vw] opacity-50"
      >
        <source src="/motian_bg.webm" type="video/webm" />
        <source src="/motian_bg.mp4" type="video/mp4" />
      </video>
      <span className="pointer-events-none absolute bottom-8 right-8 text-[11px] tracking-wide text-ink/40">
        Skip
      </span>
    </div>
  );
}
