"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Session-once intro splash: a white screen with a small, subtle (50%) video
 * that fades in while it plays, then glides out to reveal the site.
 *
 * Mobile-safe autoplay: instead of relying on the `autoPlay` attribute (React
 * applies `muted` too late, so iOS shows a play button and blocks it), we set
 * `muted` on the element and call play() ourselves. The video only fades in once
 * playback actually starts, so a play button is never shown; if autoplay is
 * genuinely blocked (e.g. Low Power Mode) we skip straight to the site.
 *
 * Skipped on repeat visits in the same session and for "reduce motion" users
 * (both handled by the inline boot script in app/layout.tsx).
 */
const FADE_IN_MS = 1000;
const FADE_OUT_MS = 1300;
const FADE_LEAD = 1.3; // begin fading out this many seconds before the video ends

export function Intro() {
  const [show, setShow] = useState(false);
  const [entered, setEntered] = useState(false); // becomes true only once playback starts
  const [out, setOut] = useState(false);
  const dismissing = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    const safety = window.setTimeout(dismiss, 4000); // last-resort fallback
    return () => window.clearTimeout(safety);
  }, [dismiss]);

  // Reliable muted autoplay (incl. iOS): set the muted property, then play().
  useEffect(() => {
    if (!show) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const start = v.play();
    if (start && typeof start.then === "function") {
      start
        .then(() => requestAnimationFrame(() => setEntered(true)))
        .catch(() => dismiss()); // autoplay blocked → skip straight to the site
    } else {
      requestAnimationFrame(() => setEntered(true));
    }
  }, [show, dismiss]);

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
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
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
