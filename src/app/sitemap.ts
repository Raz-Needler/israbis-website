import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.israbi.app";
  const now = new Date().toISOString();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/features`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/ai`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/stores`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/download`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/recipes`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/recipes/big-mac`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/recipes/pad-thai`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/recipes/falafel`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/guides/hashvaat-mechirei-super`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/guides/matkonot-im-mechirim`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/guides/aplikatziya-lematkonot`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/guides/hisachon-bekniyot`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/guides/srikat-makrer-ai`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/guides/matkon-misirton`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];
}
