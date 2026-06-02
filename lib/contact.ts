export const CONTACT = {
  email: "studio.motian@gmail.com",
  kakaoUrl: "#",
  instagramUrl: "#",
  behanceUrl: "#",
};

export const PROJECT_TYPES = [
  "Brand Strategy",
  "Brand Identity",
  "Naming / Slogan",
  "Package Design",
  "Application Design",
  "Brand Guideline",
  "Space-related Branding",
  "Other",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
