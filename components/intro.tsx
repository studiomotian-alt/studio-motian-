"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Session-once intro splash: a white screen with a small, subtle (50%) video
 * that plays once and then fades out to reveal the site.
 *
 * Flash-free: an inline script in app/layout.tsx adds `mt-intro-on` to <html>
 * *before* first paint (and a CSS cover shows instantly). This component then
 * plays the video and, on end / click / safety-timeout, fades everything out
 * and removes the classes. Repeat visits in the same session are skipped, and
 * users with "reduce motion" never see it (handled in the inline script).
 */
export function Intro() {
  const [show, setShow] = useState(false);
  const [out, setOut] = useState(false);

  const dismiss = useCallback(() => {
    setOut(true);
    const root = document.documentElement;
    root.classList.add("mt-intro-out");
    window.setTimeout(() => {
      root.classList.remove("mt-intro-on", "mt-intro-out", "mt-intro-lock");
      setShow(false);
    }, 720);
  }, []);

  useEffect(() => {
    if (!document.documentElement.classList.contains("mt-intro-on")) return;
    try {
      sessionStorage.setItem("mt_intro", "1");
    } catch {
      /* private mode — show once anyway */
    }
    setShow(true);
    // Fallback in case the video never fires onEnded (autoplay blocked, etc.)
    const safety = window.setTimeout(dismiss, 5200);
    return () => window.clearTimeout(safety);
  }, [dismiss]);

  if (!show) return null;

  return (
    <div
      onClick={dismiss}
      aria-hidden
      className={`fixed inset-0 z-[9991] flex cursor-pointer items-center justify-center transition-opacity duration-700 ease-out ${
        out ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        autoPlay
        muted
        playsInline
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
