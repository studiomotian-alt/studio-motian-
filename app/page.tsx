import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { featuredProjects } from "@/lib/projects";
import { CONTACT } from "@/lib/contact";

const services = [
  "Brand Strategy",
  "Brand Naming & Language",
  "Visual Direction",
  "Brand Identity Design",
  "Application Design",
  "Brand Guideline",
];

const process = [
  { step: "01", title: "Define" },
  { step: "02", title: "Develop" },
  { step: "03", title: "Design" },
  { step: "04", title: "Apply" },
];

export default function HomePage() {
  return (
    <>
      <section className="container-x py-10">
        <p className="max-w-md text-sm leading-[1.7] text-ink">
          Studio Motian designs the direction, language, and visual systems of brands.
        </p>

        <div className="mt-5 flex gap-x-5 gap-y-2 text-sm">
          <Link href="/work" className="link-underline">
            Work
          </Link>
          <Link href="/contact" className="link-underline">
            Contact
          </Link>
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
        <div className="grid gap-4 md:grid-cols-3">
          {featuredProjects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>

      <div className="hairline container-x" />

      <section className="container-x py-10">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="eyebrow">Process</div>
          </div>
          <ol className="md:col-span-8 md:col-start-5">
            {process.map((p) => (
              <li
                key={p.step}
                className="grid grid-cols-[2rem_1fr] gap-3 text-sm leading-[1.9] text-ink"
              >
                <span className="meta normal-case">{p.step}</span>
                <span>{p.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="hairline container-x" />

      <section className="container-x py-10">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="eyebrow">Contact</div>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a
                href={`mailto:${CONTACT.email}`}
                className="link-underline"
              >
                Email
              </a>
              <a
                href={CONTACT.kakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline"
              >
                Kakao
              </a>
              <Link href="/contact" className="link-underline">
                Form
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
