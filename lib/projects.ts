export type Project = {
  slug: string;
  title: string;
  /** Optional. Leave blank if unknown — the card will hide it. */
  year?: string;
  category: string;
  /**
   * Either a local file under /public/images/projects/<slug>.jpg
   * or a remote URL (e.g. Behance CDN). Remote hosts must be allowed
   * in next.config.mjs > images.remotePatterns.
   */
  thumbnail?: string;
  behanceUrl: string;
  featured?: boolean;
  /** Optional status shown on the right of the index, e.g. "in process". */
  status?: string;
};

export const projects: Project[] = [
  // ── 2026 ──
  {
    slug: "gip-studio",
    year: "2026",
    title: "GIP STUDIO",
    category: "Brand Identity / Studio",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/458f3c247625525.Y3JvcCw2MzkyLDQ5OTksMTQyLDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/247625525/GIP-STUDIO-Spatial-Design-Studio-Branding",
    featured: true,
  },
  {
    slug: "coda-hostel",
    year: "2026",
    title: "CODA HOSTEL",
    category: "Brand Identity / Hospitality",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/df1972248515105.Y3JvcCwyNDk4LDE5NTQsMjUzLDIwNA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/248515105/CODA-HOSTEL-Hostel-Branding",
  },

  // ── 2025 ──
  {
    slug: "loveit",
    year: "2025",
    title: "LOVEIT",
    category: "Brand Identity / Cafe",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/521045250390737.Y3JvcCw0MDQwLDMxNjAsNTMwLDM2MA.png",
    behanceUrl:
      "https://www.behance.net/gallery/250390737/LOVEIT-Cafe-Branding",
  },
  {
    slug: "retaw",
    year: "2025",
    title: "Retaw",
    category: "Brand Identity / Cafe",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/d56602240609801.Y3JvcCw0MDkxLDMyMDAsODQwLDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/240609801/Retaw-Cafe-Branding",
    featured: true,
  },
  {
    slug: "ereonnal-bakery",
    year: "2025",
    title: "Ereonnal Bakery",
    category: "Brand Identity / Bakery",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/937ae1241628829.Y3JvcCw0MDkxLDMyMDAsNTQ2LDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/241628829/Ereonnal-Bakery-Cafe-Branding",
  },
  {
    slug: "balance",
    year: "2025",
    title: "BALANCE",
    category: "Brand Identity / Cafe",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/4108f9241278855.Y3JvcCw3NjgxLDYwMDcsMCww.png",
    behanceUrl:
      "https://www.behance.net/gallery/241278855/BALANCE-Cafe-Branding",
  },
  {
    slug: "market-book",
    year: "2025",
    title: "Market Book",
    category: "Brand Identity / Furniture",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/9589b5240185697.Y3JvcCw2NzUsNTI4LDM2MiwxODU.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/240185697/Market-Book-Vintage-Furniture-Brand",
  },
  {
    slug: "nowhere",
    year: "2025",
    title: "NOWHERE",
    category: "Brand Identity / Cafe",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/2cffc2240872031.Y3JvcCw3Njc5LDYwMDcsMCww.png",
    behanceUrl:
      "https://www.behance.net/gallery/240872031/NOWHERE-Cafe-Branding",
  },
  {
    slug: "orly-minbak",
    year: "2025",
    title: "Orly Minbak",
    category: "Brand Identity / Hospitality",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/ef0fdb240238275.Y3JvcCw0MDkxLDMyMDAsODAwLDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/240238275/Orly-Minbak-Hostel-Branding",
  },
  {
    slug: "vangwa",
    year: "2025",
    title: "VANGWA",
    category: "Brand Identity / F&B",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/fc5e56241332217.Y3JvcCwyOTc4LDIzMzAsMjgwLDA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/241332217/VANGWA-Korean-Dessert-Branding",
  },
  {
    slug: "truly-baker",
    year: "2025",
    title: "Truly Baker",
    category: "Brand Identity / Bakery",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/b77579247679859.Y3JvcCwzOTcyLDMxMDcsOTI0LDA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/247679859/Truly-Baker-Bakery-Cafe-Branding",
  },
  {
    slug: "avec",
    year: "2025",
    title: "AVEC",
    category: "Brand Identity / Retail",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/3f1492242742223.Y3JvcCw0OTg5LDM5MDMsMzcwLDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/242742223/AVEC-Curated-Grocery-Branding",
  },
  {
    slug: "brick-bakers",
    year: "2025",
    title: "BRICK BAKERS",
    category: "Brand Identity / Bakery",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/2e1d9f241622333.Y3JvcCw0NDg0LDM1MDcsMjMzLDMxMA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/241622333/BRICK-BAKERS-Cafe-Branding",
  },
  {
    slug: "goyu",
    year: "2025",
    title: "Goyu",
    category: "Brand Identity / Beauty",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/9e0022244897049.Y3JvcCw0MDk3LDMyMDUsODAxLDA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/244897049/Goyu-K-beauty-curated-shop-Branding",
    featured: true,
  },

  // ── 2024 ──
  {
    slug: "jigyo",
    year: "2024",
    title: "Jigyo",
    category: "Brand Identity / Pub",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/8ebd94236740913.Y3JvcCw0MjcxLDMzNDEsNzA4LDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/236740913/Jigyo-Korean-Pub-Branding",
  },
  {
    slug: "one-high",
    year: "2024",
    title: "ONE HIGH",
    category: "Brand Identity / Pub",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/2e7be6238411739.Y3JvcCwzMzU0LDI2MjQsNDIzLDA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/238411739/ONE-HIGH-Pizza-Pub-Branding",
  },
  {
    slug: "sogeum-dohwa",
    year: "2024",
    title: "Sogeum dohwa",
    category: "Brand Identity / Cafe",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/fbbf6f240024845.Y3JvcCw0NzA0LDM2ODAsNjUyLDA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/240024845/Sogeum-dohwa-Cafe-Branding",
  },

  // ── 2023 ──
  {
    slug: "mogenic",
    year: "2023",
    title: "Mogenic",
    category: "Brand Identity / Cafe",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/808/121123233311155.Y3JvcCwzMzg5LDI2NTEsMzUyLDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/233311155/Mogenic-Cafe-Branding",
  },
];

export function categoryParts(category: string): {
  scope: string;
  industry: string;
} {
  const i = category.indexOf("/");
  if (i < 0) return { scope: category.trim(), industry: "" };
  return {
    scope: category.slice(0, i).trim(),
    industry: category.slice(i + 1).trim(),
  };
}

export const featuredProjects = projects.filter((p) => p.featured);
