"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/lib/projects";

const ACCENT = "#E8290B";

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

  // Most recent year — highlighted in the accent colour like the reference.
  const newestYear =
    sorted.map((p) => p.year).find((y): y is string => Boolean(y)) ?? null;

  let lastYear: string | undefined;

  return (
    <div className="relative">
      <ul className="border-t border-line">
        {sorted.map((p) => {
          const showYear = p.year !== lastYear;
          lastYear = p.year;
          const isNewest = Boolean(p.year) && p.year === newestYear;
          const color = isNewest ? ACCENT : undefined;

          return (
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
                className="group grid grid-cols-[2.75rem_1fr_auto] items-baseline gap-3 py-1.5 md:gap-6"
                aria-label={`${p.title}${p.year ? ` (${p.year})` : ""} — view on Behance`}
              >
                <span
                  className="text-[11px] tabular-nums tracking-wide"
                  style={{ color: color ?? "var(--ink)" }}
                >
                  {showYear ? p.year ?? "—" : ""}
                </span>

                <span
                  className="text-[13px] leading-snug transition-transform duration-200 group-hover:md:translate-x-1"
                  style={{ color: color ?? "var(--ink)" }}
                >
                  {p.title}
                </span>

                <span
                  className="justify-self-end text-[11px] tracking-wide"
                  style={{ color: "var(--muted)" }}
                >
                  {p.status ?? ""}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {/* Floating hover preview — fixed top-right, desktop only */}
      <div
        aria-hidden
        className={`pointer-events-none fixed right-6 top-28 z-40 hidden w-[300px] transition-all duration-300 md:block lg:right-10 lg:w-[360px] xl:right-16 ${
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
              sizes="360px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
