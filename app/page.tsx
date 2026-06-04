import Image from "next/image";
import { groupByYear } from "@/lib/projects";

const introParagraphs: string[][] = [
  [
    "We are a design studio that begins with structure.",
    "Studio Motian starts from questions that uncover the essence of a brand.",
    "We seek the answer to its “why,” then structure it through language and design so it can endure over time.",
  ],
  [
    "The brands we create are not merely beautiful.",
    "They are brands that can operate, last, and be used in the real world.",
  ],
  ["The name Motian is derived from the following four words."],
  [
    "(01) Mote: a tiny fragment — the smallest unit of brand language",
    "(02) Moti: a pearl — a small, condensed essence",
    "(03) Motive: intention — the beginning of the message a brand wants to convey",
    "(04) Motiyan: the plural form of pearl — the result of diverse expansion",
  ],
  ["We pursue meaning over sensation, and sustainability over ornament."],
];

export default function HomePage() {
  const years = groupByYear();

  return (
    <section className="relative min-h-[100svh] overflow-hidden px-6 pb-12 md:px-12 md:pb-16 lg:px-16">
      {/* Left background illustration (decorative) */}
      <div className="pointer-events-none absolute left-0 top-[14%] -z-10 hidden md:block">
        <Image
          src="/illust-bg.png"
          alt=""
          width={640}
          height={811}
          priority
          className="h-[700px] w-auto max-w-none"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 gap-12 pt-40 md:grid-cols-12 md:gap-6 md:pt-48">
          {/* Left — studio intro (not interactive) */}
          <div className="relative md:col-span-4 md:col-start-1 md:row-start-1">
            <div className="space-y-5 text-[13px] leading-[1.75] text-ink">
              {introParagraphs.map((para, i) => (
                <p key={i}>
                  {para.map((line, j) => (
                    <span key={j} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>

          {/* Center — year-grouped index (display only, not interactive) */}
          <div className="md:col-span-5 md:col-start-6 md:row-start-1">
            <div className="space-y-6">
              {years.map((group) => (
                <div
                  key={group.year}
                  className="grid grid-cols-[3.5rem_1fr] gap-x-3"
                >
                  <div className="text-[13px] tabular-nums text-ink">
                    {group.year}
                  </div>
                  <ul>
                    {group.projects.map((p) => (
                      <li
                        key={p.slug}
                        className="text-[13px] leading-[1.7] text-ink"
                      >
                        {p.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
