import Image from "next/image";
import Link from "next/link";

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

const works: { year: string; items: string[] }[] = [
  { year: "2026", items: ["GIP STUDIO", "CODA HOSTEL"] },
  {
    year: "2025",
    items: [
      "LOVEIT",
      "Retaw",
      "Ereonnal Bakery",
      "BALANCE",
      "Market Book",
      "BT BUGER & TACO",
      "NOWHERE",
      "Orly Minbak",
      "VANGWA",
      "Truly Baker",
      "AVEC",
      "Hyewon Yanggwa",
      "BRICK BAKERS",
      "Goyu",
      "Onit House",
      "House Oson",
      "Dalkom on Baking",
      "Dear. My Muffin",
    ],
  },
  {
    year: "2024",
    items: [
      "Jigyo",
      "ONE HIGH",
      "Sogeum dohwa",
      "Bring on",
      "Fall in football",
      "A piece of cloud",
    ],
  },
  { year: "2023", items: ["Mogenic", "A part of me", "Bonding Market"] },
];

const nav = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "WORK", href: "/work" },
  { label: "CONTACT", href: "/contact" },
];

export default function HomePage() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden px-6 py-8 md:px-12 md:py-10 lg:px-16">
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
        {/* Right nav — placed top-right on desktop, appears under logo on mobile */}
        <nav className="flex flex-row gap-5 md:order-none md:col-span-2 md:col-start-11 md:row-start-1 md:flex-col md:items-end md:gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide text-ink transition hover:opacity-60"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Left — studio intro (not interactive) */}
        <div className="relative md:col-span-4 md:col-start-1 md:row-start-1">
          {/* TODO: faint background illustration (asset pending) */}
          <div className="relative space-y-5 text-[13px] leading-[1.75] text-ink">
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
            {works.map((group) => (
              <div
                key={group.year}
                className="grid grid-cols-[3.5rem_1fr] gap-x-3"
              >
                <div className="text-[13px] tabular-nums text-ink">
                  {group.year}
                </div>
                <ul>
                  {group.items.map((name) => (
                    <li
                      key={name}
                      className="text-[13px] leading-[1.7] text-ink"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TODO: bottom-right illustration (asset pending) */}
    </section>
  );
}
