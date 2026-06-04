export const CONTACT = {
  email: "studio.motian@gmail.com",
  kakaoUrl: "https://pf.kakao.com/_IxoxnWn",
  instagramUrl: "https://www.instagram.com/studio.motian/",
  behanceUrl: "https://www.behance.net/624687c7",
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
