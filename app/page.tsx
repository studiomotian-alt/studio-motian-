import Image from "next/image";
import Link from "next/link";
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
    <section className="relative min-h-[100svh] overflow-hidden px-6 py-8 md:px-12 md:py-10 lg:px-16">
      {/* Left background illustration (decorative) */}
      <div className="pointer-events-none absolute left-0 top-[14%] z-0 hidden w-[44%] max-w-[620px] md:block">
        <Image
          src="/illust-bg.png"
          alt=""
          width={640}
          height={811}
          priority
          className="h-auto w-full"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Logo — top left */}
        <Link
          href="/"
          aria-label="Studio Motian — Home"
          className="inline-block"
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

        <div className="mt-12 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-12 md:gap-6">
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
