import Image from "next/image";
import type { Project } from "@/lib/projects";

const palettes = [
  { bg: "#E8E6DF", fg: "#1A1A1A" },
  { bg: "#D9D6CC", fg: "#1A1A1A" },
  { bg: "#1A1A1A", fg: "#FAFAF7" },
  { bg: "#EFEDE7", fg: "#1A1A1A" },
  { bg: "#C9C5BA", fg: "#1A1A1A" },
  { bg: "#222222", fg: "#FAFAF7" },
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function ProjectCard({
  project,
  index = 0,
  priority = false,
}: {
  project: Project;
  index?: number;
  priority?: boolean;
}) {
  const palette = palettes[(hash(project.slug) + index) % palettes.length];
  const hasImage = Boolean(project.thumbnail);

  return (
    <a
      href={project.behanceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      aria-label={`${project.title} — view on Behance`}
    >
      <div
        className="relative aspect-[404/316] w-full overflow-hidden rounded-sm"
        style={{ backgroundColor: palette.bg }}
      >
        {hasImage && project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={`${project.title} — ${project.category}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-end p-6 md:p-8"
            style={{ color: palette.fg }}
          >
            <div
              className="font-light tracking-tightest"
              style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.4rem)", lineHeight: 1 }}
            >
              {project.title}
            </div>
          </div>
        )}

        {project.year && (
          <div
            className={`absolute right-6 top-6 text-[11px] uppercase tracking-widest md:right-8 md:top-8 ${
              hasImage ? "text-bg/90" : "opacity-70"
            }`}
            style={hasImage ? undefined : { color: palette.fg }}
          >
            {project.year}
          </div>
        )}
        <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/5" />
      </div>

      <div className="mt-2.5 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-ink">{project.title}</div>
          <div className="meta mt-1 normal-case tracking-[0.04em]">
            {project.year ? `${project.year} — ${project.category}` : project.category}
          </div>
        </div>
        <span
          aria-hidden
          className="meta inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-ink"
        >
          ↗
        </span>
      </div>
    </a>
  );
}
