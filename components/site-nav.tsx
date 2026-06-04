"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "WORK", href: "/work" },
  { label: "CONTACT", href: "/contact" },
];

/**
 * Persistent site chrome — fixed on every page so only the page content
 * scrolls: the top-left logo, the right-side navigation, and the
 * bottom-right illustration.
 */
export function SiteNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Logo — fixed top-left */}
      <Link
        href="/"
        aria-label="Studio Motian — Home"
        className="fixed left-6 top-8 z-50 md:left-12 md:top-10 lg:left-16"
      >
        <Image
          src="/logo.png"
          alt="Studio Motian"
          width={1702}
          height={306}
          priority
          className="h-7 w-auto md:h-9"
        />
      </Link>

      {/* Navigation — fixed top-right */}
      <nav className="fixed right-6 top-24 z-50 flex flex-col items-end gap-2 md:right-12 md:top-28 lg:right-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={`text-sm tracking-wide text-ink transition hover:opacity-60 ${
              isActive(item.href) ? "font-bold" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Illustration — fixed bottom-right */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-6 right-4 -z-10 w-[150px] md:bottom-10 md:right-6 md:w-[240px]"
      >
        <Image
          src="/illust-shell.png"
          alt=""
          width={320}
          height={180}
          className="h-auto w-full"
        />
      </div>
    </>
  );
}
