import projectsData from "./projects.json";

export type Project = {
  slug: string;
  title: string;
  /** "YYYY.MM" — used for date sorting; the year is shown in the index. */
  date?: string;
  /** Work scope, e.g. "Brand Strategy / Brand Identity". */
  scope: string;
  /** Industry / category, e.g. "Hospitality". */
  industry?: string;
  /**
   * Behance CDN URL (or local path). Remote hosts must be allowed in
   * next.config.mjs > images.remotePatterns.
   */
  thumbnail?: string;
  /** Optional — when absent, the entry is shown as plain (non-clickable) text. */
  behanceUrl?: string;
  status?: string;
};

/** Portfolio data lives in lib/projects.json (edited via the admin app). */
export const projects: Project[] = projectsData;

/** Group projects by year (newest first), date-sorted within each year. */
export function groupByYear(items: Project[] = projects): {
  year: string;
  projects: Project[];
}[] {
  const sorted = [...items].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );
  const map = new Map<string, Project[]>();
  for (const p of sorted) {
    const y = (p.date ?? "").slice(0, 4);
    const arr = map.get(y);
    if (arr) arr.push(p);
    else map.set(y, [p]);
  }
  return [...map.entries()].map(([year, group]) => ({ year, projects: group }));
}
