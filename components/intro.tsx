"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Session-once intro splash: a white screen with a small, subtle (50%) video.
 * The video fades IN over ~1s while it plays, then the whole thing fades OUT
 * starting well before the clip ends so the hand-off to the site feels quick
 * and smooth (the video is also pre-trimmed front/back to ~2.9s).
 *
 * Skipped on repeat visits in the same session and for "reduce motion" users
 * (both handled by the inline boot script in app/layout.tsx).
 */
const FADE_IN_MS = 1000; // video rises up over its first second (while playing)
const FADE_OUT_MS = 1300; // long, smooth glide out to the home screen
const FADE_LEAD = 1.3; // begin fading out this many seconds before the video ends

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
    }, FADE_OUT_MS + 60);
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
    const safety = window.setTimeout(dismiss, 4000); // fallback if playback is blocked
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
      className="fixed inset-0 z-[9991] flex cursor-pointer items-center justify-center transition-opacity"
      style={{
        opacity: out ? 0 : entered ? 1 : 0,
        transitionDuration: `${out ? FADE_OUT_MS : FADE_IN_MS}ms`,
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
