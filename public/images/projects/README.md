# Project Thumbnails

Drop project images into this folder, then reference them in `/lib/projects.ts`.

## Recommended

- **Aspect ratio**: 404:316 (~1.28:1, landscape) — matches Behance thumbnails
- **Resolution**: 1616 × 1264 px (2x for retina) — Behance covers also work as-is
- **Format**: `.jpg` for photographic content, `.webp` if pre-optimized
- **Naming**: kebab-case matching the project `slug` (e.g. `goyu.jpg`)

## Usage

```ts
// lib/projects.ts
{
  slug: "goyu",
  title: "GOYU",
  thumbnail: "/images/projects/goyu.jpg", // ← set this
  ...
}
```

If `thumbnail` is omitted, the card falls back to a colored placeholder with the
project name — useful while images are still being prepared.
