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

const BSBI = "Brand Strategy / Brand Identity";
const BI = "Brand Identity";

export const projects: Project[] = [
  // ── 2026 ──
  {
    slug: "poesie-papier",
    date: "2026.04",
    title: "Poésie Papier",
    scope: BSBI,
    industry: "Lifestyle Brand",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/e6ddff251125909.Y3JvcCwzMTM3LDI0NTMsMTA4LDg1.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/251125909/Poesie-Papier-Lifestyle-Brand-Branding",
  },
  {
    slug: "coda-hostel",
    date: "2026.04",
    title: "CODA HOSTEL",
    scope: BSBI,
    industry: "Hospitality",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/df1972248515105.Y3JvcCwyNDk4LDE5NTQsMjUzLDIwNA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/248515105/CODA-HOSTEL-Hostel-Branding",
  },
  {
    slug: "gip-studio",
    date: "2026.03",
    title: "GIP STUDIO",
    scope: BSBI,
    industry: "Spatial Design Studio",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/458f3c247625525.Y3JvcCw2MzkyLDQ5OTksMTQyLDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/247625525/GIP-STUDIO-Spatial-Design-Studio-Branding",
  },

  // ── 2025 ──
  {
    slug: "loveit",
    date: "2025.12",
    title: "LOVEIT",
    scope: BI,
    industry: "Bakery",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/521045250390737.Y3JvcCw0MDQwLDMxNjAsNTMwLDM2MA.png",
    behanceUrl:
      "https://www.behance.net/gallery/250390737/LOVEIT-Cafe-Branding",
  },
  { slug: "dear-my-muffin", date: "2025.12", title: "Dear. My Muffin", scope: BSBI, industry: "Baby Apparel Brand" },
  { slug: "chilli-chiily", date: "2025.11", title: "Chilli & Chiily", scope: BSBI, industry: "Korean Snack Bar" },
  {
    slug: "goyu",
    date: "2025.11",
    title: "Goyu",
    scope: BSBI,
    industry: "Beauty Select Shop",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/9e0022244897049.Y3JvcCw0MDk3LDMyMDUsODAxLDA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/244897049/Goyu-K-beauty-curated-shop-Branding",
  },
  {
    slug: "truly-baker",
    date: "2025.10",
    title: "Truly Baker",
    scope: BSBI,
    industry: "Bakery",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/b77579247679859.Y3JvcCwzOTcyLDMxMDcsOTI0LDA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/247679859/Truly-Baker-Bakery-Cafe-Branding",
  },
  {
    slug: "brick-bakers",
    date: "2025.10",
    title: "BRICK BAKERS",
    scope: BSBI,
    industry: "Bakery Cafe",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/2e1d9f241622333.Y3JvcCw0NDg0LDM1MDcsMjMzLDMxMA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/241622333/BRICK-BAKERS-Cafe-Branding",
  },
  { slug: "dalkom-on-baking", date: "2025.10", title: "Dalkom on Baking", scope: BI, industry: "Bakery" },
  { slug: "house-oson", date: "2025.09", title: "House Oson", scope: BSBI, industry: "Hospitality" },
  {
    slug: "orly-minbak",
    date: "2025.08",
    title: "Orly Minbak",
    scope: BSBI,
    industry: "Hospitality",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/ef0fdb240238275.Y3JvcCw0MDkxLDMyMDAsODAwLDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/240238275/Orly-Minbak-Hostel-Branding",
  },
  {
    slug: "avec",
    date: "2025.08",
    title: "AVEC",
    scope: BSBI,
    industry: "Grocery Store",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/3f1492242742223.Y3JvcCw0OTg5LDM5MDMsMzcwLDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/242742223/AVEC-Curated-Grocery-Branding",
  },
  { slug: "onit-house", date: "2025.07", title: "Onit House", scope: BSBI, industry: "Hospitality" },
  { slug: "hyewon-yanggwa", date: "2025.06", title: "Hyewon Yanggwa", scope: BSBI, industry: "Dessert Cafe" },
  {
    slug: "ereonnal-bakery",
    date: "2025.05",
    title: "Ereonnal Bakery",
    scope: BSBI,
    industry: "Bakery Cafe",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/937ae1241628829.Y3JvcCw0MDkxLDMyMDAsNTQ2LDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/241628829/Ereonnal-Bakery-Cafe-Branding",
  },
  { slug: "bt-burger-taco", date: "2025.05", title: "BT BURGER & TACO", scope: BSBI, industry: "F&B Franchise" },
  {
    slug: "nowhere",
    date: "2025.05",
    title: "NOWHERE",
    scope: BI,
    industry: "Cafe",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/2cffc2240872031.Y3JvcCw3Njc5LDYwMDcsMCww.png",
    behanceUrl:
      "https://www.behance.net/gallery/240872031/NOWHERE-Cafe-Branding",
  },
  {
    slug: "vangwa",
    date: "2025.05",
    title: "VANGWA",
    scope: BSBI,
    industry: "Korean Dessert",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/fc5e56241332217.Y3JvcCwyOTc4LDIzMzAsMjgwLDA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/241332217/VANGWA-Korean-Dessert-Branding",
  },
  {
    slug: "retaw",
    date: "2025.04",
    title: "Retaw",
    scope: BSBI,
    industry: "Cafe",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/d56602240609801.Y3JvcCw0MDkxLDMyMDAsODQwLDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/240609801/Retaw-Cafe-Branding",
  },
  {
    slug: "balance",
    date: "2025.04",
    title: "BALANCE",
    scope: BI,
    industry: "Dessert Cafe",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/4108f9241278855.Y3JvcCw3NjgxLDYwMDcsMCww.png",
    behanceUrl:
      "https://www.behance.net/gallery/241278855/BALANCE-Cafe-Branding",
  },
  { slug: "fall-in-football", date: "2025.03", title: "Fall in football", scope: BSBI, industry: "Sports Facility" },

  // ── 2024 ──
  { slug: "a-piece-of-cloud", date: "2024.12", title: "A piece of cloud", scope: BSBI, industry: "Cafe" },
  {
    slug: "sogeum-dohwa",
    date: "2024.11",
    title: "Sogeum dohwa",
    scope: BSBI,
    industry: "Bakery",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/fbbf6f240024845.Y3JvcCw0NzA0LDM2ODAsNjUyLDA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/240024845/Sogeum-dohwa-Cafe-Branding",
  },
  { slug: "bring-on", date: "2024.09", title: "Bring on", scope: BSBI, industry: "Cafe" },
  {
    slug: "market-book",
    date: "2024.09",
    title: "Market Book",
    scope: BI,
    industry: "Furniture Studio",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/9589b5240185697.Y3JvcCw2NzUsNTI4LDM2MiwxODU.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/240185697/Market-Book-Vintage-Furniture-Brand",
  },
  {
    slug: "one-high",
    date: "2024.06",
    title: "ONE HIGH",
    scope: BSBI,
    industry: "Pizza Pub",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/2e7be6238411739.Y3JvcCwzMzU0LDI2MjQsNDIzLDA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/238411739/ONE-HIGH-Pizza-Pub-Branding",
  },
  {
    slug: "jigyo",
    date: "2024.02",
    title: "Jigyo",
    scope: BSBI,
    industry: "Korean Dining Pub",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/8ebd94236740913.Y3JvcCw0MjcxLDMzNDEsNzA4LDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/236740913/Jigyo-Korean-Pub-Branding",
  },

  // ── 2023 ──
  { slug: "a-part-of-me", date: "2023.10", title: "A part of me", scope: BSBI, industry: "Piercing Shop" },

  // ── 2022 ──
  {
    slug: "mogenic",
    date: "2022.09",
    title: "Mogenic",
    scope: BSBI,
    industry: "Cafe",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/121123233311155.Y3JvcCwzMzg5LDI2NTEsMzUyLDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/233311155/Mogenic-Cafe-Branding",
  },
  { slug: "bonding-market", date: "2022.08", title: "Bonding Market", scope: BSBI, industry: "Bakery Cafe" },
  { slug: "epilogue-nine", date: "2022.08", title: "Epilogue Nine", scope: BSBI, industry: "Cafe" },
];

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
