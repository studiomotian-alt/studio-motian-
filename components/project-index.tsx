"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/lib/projects";

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = projects.find((p) => p.slug === hovered);

  return (
    <div className="relative">

      <ul className="divide-y divide-line border-t border-line">
        {projects.map((p, i) => (
          <li
            key={p.slug}
            onMouseEnter={() => setHovered(p.slug)}
            onMouseLeave={() =>
              setHovered((cur) => (cur === p.slug ? null : cur))
            }
            className={`transition-opacity ${
              hovered && hovered !== p.slug ? "md:opacity-40" : "opacity-100"
            }`}
          >
            <a
              href={p.behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[2rem_1fr_1.5rem] items-baseline gap-3 py-2 md:grid-cols-[2rem_minmax(0,1fr)_minmax(0,1fr)_1.5rem] md:gap-5 md:py-2.5"
              aria-label={`${p.title} — view on Behance`}
            >
              <span className="meta normal-case">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="text-sm text-ink transition-transform duration-200 group-hover:md:translate-x-1">
                {p.title}
              </span>

              <span className="meta hidden md:inline normal-case tracking-[0.06em]">
                {p.category}
              </span>

              <span
                aria-hidden
                className="meta justify-self-end transition-transform duration-200 group-hover:text-ink"
              >
                ↗
              </span>

              {/* Mobile: category appears below */}
              <span className="meta col-start-2 col-end-3 -mt-0.5 normal-case tracking-[0.06em] md:hidden">
                {p.category}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* Floating hover preview — fixed top-right, desktop only */}
      <div
        aria-hidden
        className={`pointer-events-none fixed right-6 top-28 z-40 hidden w-[320px] transition-all duration-300 md:block lg:right-10 lg:w-[380px] xl:right-16 ${
          active && active.thumbnail
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        {active && active.thumbnail && (
          <div
            className="relative overflow-hidden rounded-sm bg-line shadow-2xl ring-1 ring-line"
            style={{ aspectRatio: "404 / 316" }}
          >
            <Image
              key={active.slug}
              src={active.thumbnail}
              alt=""
              fill
              sizes="380px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
