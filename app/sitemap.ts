import { MetadataRoute } from "next";

const KEYWORD_SLUGS = [
  "pawahara-hanrei-jirei",
  "pawahara-soudan-madoguchi",
  "pawahara-kiroku-houkokusho",
  "pawahara-taisyoku-shorei",
  "power-harassment-teigi",
  "pawahara-taishoku-kyouhaku",
  "job-harassment-mental-health",
  "seku-hara-pawahara-chigai",
  "company-pawahara-taio-manual",
  "pawahara-jibun-mamoru",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://pawahara-ai.vercel.app", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: "https://pawahara-ai.vercel.app/tool", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: "https://pawahara-ai.vercel.app/legal", lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: "https://pawahara-ai.vercel.app/terms", lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: "https://pawahara-ai.vercel.app/privacy", lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
  const keywordPages: MetadataRoute.Sitemap = KEYWORD_SLUGS.map((slug) => ({
    url: `https://pawahara-ai.vercel.app/keywords/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...staticPages, ...keywordPages];
}
