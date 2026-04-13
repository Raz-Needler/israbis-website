import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://israbis.com";
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
    // Store comparison pages
    { url: `${base}/stores/shufersal`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/stores/rami-levy`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/stores/victory`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/stores/osher-ad`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/stores/tiv-taam`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/stores/yochananof`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    // Israeli recipe pages
    { url: `${base}/recipes/shakshuka`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/recipes/hummus`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/recipes/schnitzel`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/recipes/burekas`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/recipes/sabich`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // About page
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    // Language landing pages
    { url: `${base}/en`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/ru`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/ar`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/fr`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // English blog
    { url: `${base}/en/blog/best-supermarket-apps-israel`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    // Chain comparison pages
    { url: `${base}/stores/shufersal-vs-rami-levy`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/stores/victory-vs-osher-ad`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    // New guide pages
    { url: `${base}/guides/mechirim-bepikuach`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/guides/sal-kniyot-shavui`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/guides/mivtzaim-shavua`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
}
