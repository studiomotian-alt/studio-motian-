"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONTACT } from "@/lib/contact";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "WORK", href: "/work" },
  { label: "CONTACT", href: "/contact" },
];

/**
 * Persistent site chrome — fixed on every page so only the page content
 * scrolls: top-left logo, right-side navigation, bottom-right contact links
 * and illustration.
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

      {/* Navigation — horizontal bar below the logo on mobile, vertical right column on desktop */}
      <nav className="fixed inset-x-0 top-0 z-40 flex flex-row items-center justify-between bg-white/80 px-6 pb-3 pt-24 backdrop-blur-sm md:inset-x-auto md:right-12 md:top-48 md:flex-col md:items-end md:justify-start md:gap-10 md:bg-transparent md:p-0 md:backdrop-blur-none lg:right-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={`text-[13px] tracking-wide text-ink transition hover:opacity-60 ${
              isActive(item.href) ? "font-bold" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Contact links — fixed bottom-right, above the illustration */}
      <div className="fixed bottom-32 right-6 z-40 hidden flex-col items-end gap-1.5 md:bottom-48 md:right-12 md:flex lg:right-16">
        <div className="flex gap-4 text-[11px]">
          <a
            href={CONTACT.behanceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-60"
          >
            Behance
          </a>
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-60"
          >
            Instagram
          </a>
        </div>
        <div className="text-[11px] text-muted">E-mail: {CONTACT.email}</div>
      </div>

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
