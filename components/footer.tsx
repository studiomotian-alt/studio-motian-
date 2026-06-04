"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONTACT } from "@/lib/contact";

export function Footer() {
  const pathname = usePathname();

  // Standalone landing pages (home, about) hide the global footer.
  if (pathname === "/" || pathname === "/about") return null;

  return (
    <footer className="mt-12 border-t border-line">
      <div className="container-x flex flex-col gap-3 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} Studio Motian</div>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <a href={`mailto:${CONTACT.email}`} className="link-underline">
            Email
          </a>
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            Instagram
          </a>
          <a
            href={CONTACT.behanceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            Behance
          </a>
          <Link href="/contact" className="link-underline">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
