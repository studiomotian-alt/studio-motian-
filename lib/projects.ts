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
};

export const projects: Project[] = [
  {
    slug: "coda-hostel",
    title: "CODA HOSTEL",
    category: "Brand Identity / Hospitality",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/df1972248515105.Y3JvcCwyNDk4LDE5NTQsMjUzLDIwNA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/248515105/CODA-HOSTEL-Hostel-Branding",
    featured: true,
  },
  {
    slug: "truly-baker",
    title: "Truly Baker",
    category: "Brand Identity / Bakery",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/b77579247679859.Y3JvcCwzOTcyLDMxMDcsOTI0LDA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/247679859/Truly-Baker-Bakery-Cafe-Branding",
  },
  {
    slug: "gip-studio",
    title: "GIP STUDIO",
    category: "Brand Identity / Studio",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/458f3c247625525.Y3JvcCw2MzkyLDQ5OTksMTQyLDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/247625525/GIP-STUDIO-Spatial-Design-Studio-Branding",
    featured: true,
  },
  {
    slug: "goyu",
    title: "Goyu",
    category: "Brand Identity / Beauty",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/9e0022244897049.Y3JvcCw0MDk3LDMyMDUsODAxLDA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/244897049/Goyu-K-beauty-curated-shop-Branding",
    featured: true,
  },
  {
    slug: "avec",
    title: "AVEC",
    category: "Brand Identity / Retail",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/3f1492242742223.Y3JvcCw0OTg5LDM5MDMsMzcwLDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/242742223/AVEC-Curated-Grocery-Branding",
  },
  {
    slug: "ereonnal-bakery",
    title: "Ereonnal Bakery",
    category: "Brand Identity / Bakery",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/937ae1241628829.Y3JvcCw0MDkxLDMyMDAsNTQ2LDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/241628829/Ereonnal-Bakery-Cafe-Branding",
  },
  {
    slug: "brick-bakers",
    title: "BRICK BAKERS",
    category: "Brand Identity / Bakery",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/2e1d9f241622333.Y3JvcCw0NDg0LDM1MDcsMjMzLDMxMA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/241622333/BRICK-BAKERS-Cafe-Branding",
  },
  {
    slug: "vangwa",
    title: "VANGWA",
    category: "Brand Identity / F&B",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/fc5e56241332217.Y3JvcCwyOTc4LDIzMzAsMjgwLDA.jpg",
    behanceUrl:
      "https://www.behance.net/gallery/241332217/VANGWA-Korean-Dessert-Branding",
  },
  {
    slug: "balance",
    title: "BALANCE",
    category: "Brand Identity / Cafe",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/4108f9241278855.Y3JvcCw3NjgxLDYwMDcsMCww.png",
    behanceUrl:
      "https://www.behance.net/gallery/241278855/BALANCE-Cafe-Branding",
  },
  {
    slug: "nowhere",
    title: "NOWHERE",
    category: "Brand Identity / Cafe",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/2cffc2240872031.Y3JvcCw3Njc5LDYwMDcsMCww.png",
    behanceUrl:
      "https://www.behance.net/gallery/240872031/NOWHERE-Cafe-Branding",
  },
  {
    slug: "retaw",
    title: "Retaw",
    category: "Brand Identity / Cafe",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/d56602240609801.Y3JvcCw0MDkxLDMyMDAsODQwLDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/240609801/Retaw-Cafe-Branding",
  },
  {
    slug: "orly-minbak",
    title: "Orly Minbak",
    category: "Brand Identity / Hospitality",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/ef0fdb240238275.Y3JvcCw0MDkxLDMyMDAsODAwLDA.png",
    behanceUrl:
      "https://www.behance.net/gallery/240238275/Orly-Minbak-Hostel-Branding",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
