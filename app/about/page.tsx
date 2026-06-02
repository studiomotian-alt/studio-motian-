import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Studio Motian designs the direction, language, and visual systems of brands.",
};

const philosophy = [
  {
    num: "01",
    body: "A brand begins with a sentence — not decoration, but language that carries intent.",
  },
  {
    num: "02",
    body: "A brand gains meaning through repetition — across touchpoints, not in a single mark.",
  },
  {
    num: "03",
    body: "A brand must be used — designed for the real world, not just for a screen.",
  },
];

const services = [
  "Brand Strategy",
  "Brand Naming & Language",
  "Visual Direction",
  "Brand Identity Design",
  "Application Design",
  "Brand Guideline",
];

const howWeWork = [
  { num: "01", body: "Brand strategy first." },
  { num: "02", body: "Before design, we define." },
  { num: "03", body: "Designed for real use." },
  { num: "04", body: "One brand, one experience." },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-x py-10">
        <p className="max-w-md text-sm leading-[1.7] text-ink">
          Studio Motian designs the direction, language, and visual systems of brands — starting from a small cue and extending into how the brand is used.
        </p>
      </section>

      <div className="hairline container-x" />

      <section className="container-x py-10">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="eyebrow">Philosophy</div>
          </div>
          <ol className="md:col-span-8 md:col-start-5">
            {philosophy.map((p) => (
              <li
                key={p.num}
                className="grid grid-cols-[2rem_1fr] gap-3 text-sm leading-[1.9] text-ink"
              >
                <span className="meta normal-case">{p.num}</span>
                <span>{p.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="hairline container-x" />

      <section className="container-x py-10">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="eyebrow">Services</div>
          </div>
          <ul className="md:col-span-8 md:col-start-5">
            {services.map((s) => (
              <li key={s} className="text-sm leading-[1.9] text-ink">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="hairline container-x" />

      <section className="container-x py-10">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="eyebrow">How We Work</div>
          </div>
          <ol className="md:col-span-8 md:col-start-5">
            {howWeWork.map((p) => (
              <li
                key={p.num}
                className="grid grid-cols-[2rem_1fr] gap-3 text-sm leading-[1.9] text-ink"
              >
                <span className="meta normal-case">{p.num}</span>
                <span>{p.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="hairline container-x" />

      <section className="container-x py-10">
        <Link href="/work" className="link-underline text-sm">
          Selected works
        </Link>
      </section>
    </>
  );
}
