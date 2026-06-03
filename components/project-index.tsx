"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/lib/projects";

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = projects.find((p) => p.slug === hovered);

  // Sort by year descending; undated entries fall to the bottom.
  // Order within the same year is preserved from the source array.
  const sorted = [...projects].sort((a, b) => {
    const ay = a.year ?? "0000";
    const by = b.year ?? "0000";
    return by.localeCompare(ay);
  });

  let lastYear: string | undefined;

  return (
    <div className="relative">
      <ul className="border-t border-line">
        {sorted.map((p) => {
          const showYear = p.year !== lastYear;
          lastYear = p.year;

          return (
            <li
              key={p.slug}
              onMouseEnter={() => setHovered(p.slug)}
              onMouseLeave={() =>
                setHovered((cur) => (cur === p.slug ? null : cur))
              }
            >
              <a
                href={p.behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[2.75rem_1fr_auto] items-baseline gap-3 py-1.5 text-ink md:gap-6"
                aria-label={`${p.title}${p.year ? ` (${p.year})` : ""} — view on Behance`}
              >
                <span className="text-[11px] tabular-nums tracking-wide">
                  {showYear ? p.year ?? "—" : ""}
                </span>

                <span className="text-[13px] leading-snug transition-transform duration-200 group-hover:md:translate-x-1">
                  {p.title}
                </span>

                <span className="justify-self-end text-[11px] tracking-wide text-muted">
                  {p.status ?? ""}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {/* Floating hover preview — fixed, desktop only */}
      <div
        aria-hidden
        className={`pointer-events-none fixed right-[12%] top-28 z-40 hidden w-[420px] transition-all duration-300 md:block lg:right-[16%] lg:w-[500px] xl:right-[18%] xl:w-[580px] ${
          active && active.thumbnail
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0"
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
              sizes="(min-width: 1280px) 580px, (min-width: 1024px) 500px, 420px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
