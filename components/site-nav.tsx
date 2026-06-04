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
 * Persistent site chrome — fixed on every page:
 * the right-side navigation and the bottom-right illustration.
 */
export function SiteNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
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
