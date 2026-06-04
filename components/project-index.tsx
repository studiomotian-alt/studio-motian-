"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/lib/projects";

const ROW_CLASS =
  "group grid grid-cols-[2.75rem_1fr] items-baseline gap-3 py-1.5 text-ink md:grid-cols-[2.75rem_minmax(0,1fr)_14rem_11rem] md:gap-6";

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = projects.find((p) => p.slug === hovered);

  // Newest first, by "YYYY.MM" date.
  const sorted = [...projects].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );

  let lastYear: string | undefined;

  return (
    <div className="relative">
      <ul className="border-t border-line">
        {sorted.map((p) => {
          const year = (p.date ?? "").slice(0, 4);
          const showYear = year !== lastYear;
          lastYear = year;

          const content = (
            <>
              <span className="text-[11px] tabular-nums tracking-wide">
                {showYear ? year || "—" : ""}
              </span>

              <span className="text-[13px] leading-snug transition-transform duration-200 group-hover:font-bold group-hover:md:translate-x-1">
                {p.title}
              </span>

              <span className="hidden whitespace-nowrap text-[11px] tracking-wide text-muted group-hover:font-bold group-hover:text-ink md:block">
                {p.scope}
              </span>

              <span className="hidden whitespace-nowrap text-[11px] tracking-wide text-muted group-hover:font-bold group-hover:text-ink md:block">
                {p.industry}
              </span>
            </>
          );

          return (
            <li
              key={p.slug}
              onMouseEnter={() => setHovered(p.slug)}
              onMouseLeave={() =>
                setHovered((cur) => (cur === p.slug ? null : cur))
              }
            >
              {p.behanceUrl ? (
                <a
                  href={p.behanceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={ROW_CLASS}
                  aria-label={`${p.title} — ${p.scope} — view on Behance`}
                >
                  {content}
                </a>
              ) : (
                <div className={`${ROW_CLASS} cursor-default`}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Floating hover preview — fixed, desktop only */}
      <div
        aria-hidden
        className={`pointer-events-none fixed left-[18rem] top-28 z-40 hidden w-[400px] transition-all duration-300 md:block lg:w-[460px] xl:w-[520px] ${
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
