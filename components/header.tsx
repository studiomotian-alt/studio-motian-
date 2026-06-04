"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Home has its own in-page logo; the global SiteNav handles navigation
  // on every page, so the header here only carries the logo.
  if (pathname === "/") return null;

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-colors ${
        scrolled
          ? "border-line bg-bg/85 backdrop-blur-md"
          : "border-transparent bg-bg"
      }`}
    >
      <div className="container-x flex h-11 items-center">
        <Link
          href="/"
          className="flex items-center"
          aria-label="Studio Motian — Home"
        >
          <Image
            src="/logo.png"
            alt="Studio Motian"
            width={1702}
            height={306}
            priority
            className="h-[18px] w-auto"
          />
        </Link>
      </div>
    </header>
  );
}
