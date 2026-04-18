import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "IsraBis — Compare Grocery Prices Across 33 Israeli Supermarkets | Free App",
  description:
    "IsraBis compares grocery prices across all 49 Israeli supermarket chains — Shufersal, Rami Levy, Victory, Osher Ad and 45 more. 255,000 products updated every 4 hours. Free.",
  keywords:
    "israel price comparison, cheapest supermarket israel, shufersal vs rami levy, israel grocery app, food prices israel",
  alternates: {
    canonical: "https://israbis.com/en",
    languages: {
      "en": "https://israbis.com/en",
      "he-IL": "https://israbis.com/",
    },
  },
  openGraph: {
    title: "Find the Cheapest Supermarket in Israel — IsraBis",
    description:
      "IsraBis compares grocery prices across all 49 Israeli supermarket chains. 255,000 products updated every 4 hours. Free app for iOS and Android.",
    url: "https://israbis.com/en",
    siteName: "IsraBis",
    locale: "en_US",
    type: "website",
  },
};

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "IsraBis",
  description:
    "Israel's most comprehensive supermarket price comparison app. Compare prices across 49 chains, 255,000 products, updated every 4 hours.",
  operatingSystem: "iOS, Android",
  applicationCategory: "UtilitiesApplication",
  inLanguage: ["he", "en"],
  offers: { "@type": "Offer", price: "0", priceCurrency: "ILS" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "1240",
  },
  url: "https://israbis.com",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What supermarkets does IsraBis cover?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "IsraBis covers all 49 major Israeli supermarket chains, including Shufersal Deal, Shufersal Sheli, Rami Levy, Victory, Osher Ad, Tiv Taam, Yochananof, Yeinot Bitan, Hazi Hinam, Machsanei Hashuk, Carrefour, Mega, Co-op, and 36 more.",
      },
    },
    {
      "@type": "Question",
      name: "Is IsraBis free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. IsraBis is free to download and use on both iOS and Android. A base tier with full price comparison is available at no cost.",
      },
    },
    {
      "@type": "Question",
      name: "How often are prices updated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Prices are updated every 4 hours, sourced directly from Israel's government price transparency database (gov.il), which all supermarket chains are legally required to publish.",
      },
    },
    {
      "@type": "Question",
      name: "Does IsraBis have an English interface?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "IsraBis is primarily a Hebrew-first app, reflecting the Israeli market. However, product names and chain names are internationally recognizable, and the core price comparison functionality is intuitive regardless of language.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate are the prices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Prices come directly from the official government price transparency database that supermarkets are legally required to publish. This means prices reflect actual shelf prices, updated at minimum every 4 hours.",
      },
    },
  ],
};

export default function EnglishLandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ═══ HERO ═══ */}
      <article className="sec">
        <div className="w-980" style={{ maxWidth: 760 }}>

          <div className="badge" style={{ marginBottom: "var(--space-4)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--accent)">
              <circle cx="12" cy="12" r="5" />
            </svg>
            Based on Israel&apos;s official government price database
          </div>

          <h1 className="text-h1" style={{ marginBottom: "var(--space-5)" }}>
            Israel&apos;s Most Complete Grocery Price Comparison
          </h1>

          <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-4)" }}>
            IsraBis compares grocery prices across all 49 Israeli supermarket chains — Shufersal,
            Rami Levy, Victory, Osher Ad, Tiv Taam, and 45 more. With 255,000 products updated
            every 4 hours directly from Israel&apos;s government price database, you always know
            where to shop for less.
          </p>

          <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-7)" }}>
            Available free on iOS and Android. Built for olim, tourists, diaspora visitors, and
            anyone navigating Israeli supermarkets.
          </p>

          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-12)" }}>
            <Link href="/download" className="btn btn-accent">
              Download Free — iOS &amp; Android
            </Link>
            <Link href="/stores" className="btn btn-outline">
              See All 33 Supermarkets
            </Link>
          </div>

          {/* ═══ WHY USE ISRABIS ═══ */}
          <section style={{ marginBottom: "var(--space-12)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-6)" }}>
              Why Use IsraBis?
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  Most chains — 33 vs competitors&apos; 25
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  No other Israeli price comparison app covers all 49 supermarket chains. Most competitors
                  cover around 25. IsraBis ingests data from every chain legally required to publish
                  prices under Israel&apos;s 2014 Food Price Transparency Law — giving you the most
                  complete picture.
                </p>
              </div>

              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  255,000 products — the largest database
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  255,000+ active products across all chains, updated every 4 hours. From basic staples
                  to specialty and imported items — if it&apos;s on a shelf in Israel, IsraBis has the price.
                </p>
              </div>

              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  Real-time data from gov.il
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  Prices are sourced directly from Israel&apos;s official government price transparency
                  database. All supermarket chains publish their prices every few hours by law —
                  IsraBis processes those files automatically, so you see prices as accurate as legally
                  required shelf prices.
                </p>
              </div>

              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  AI recipe feature (IsraSef) and fridge scanner
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  IsraBis includes IsraSef — an AI chef that generates recipes, scans your fridge to
                  suggest meals from what you have, and can extract a recipe from a YouTube or TikTok
                  link. Every recipe comes with a full shopping list and live price comparison across
                  all 49 chains.
                </p>
              </div>
            </div>
          </section>

          {/* ═══ THE 33 CHAINS ═══ */}
          <section style={{ marginBottom: "var(--space-12)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-4)" }}>
              The 33 Supermarket Chains
            </h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
              IsraBis covers every major Israeli supermarket chain, including:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
              {[
                "Shufersal Deal",
                "Shufersal Sheli",
                "Rami Levy",
                "Victory",
                "Osher Ad",
                "Tiv Taam",
                "Yochananof",
                "Yeinot Bitan",
                "Hazi Hinam",
                "Machsanei Hashuk",
                "Carrefour",
                "Mega",
                "Co-op",
                "Stop Market",
                "King Store",
                "Good Farm",
                "Super-Pharm",
                "Keshet",
                "Cofix",
                "Super Sapir",
                "Quick",
                "Maayan 2000",
                "Shefa Birkat",
                "Shuk Ha&apos;ir",
                "Fresh Market",
                "Bareket",
                "Niko Market",
                "Primex",
                "Shefa Shuk",
                "Rosh Ha&apos;ir",
                "Zol VeBegadol",
                "Mashbir",
                "Am&apos;pm",
              ].map((chain) => (
                <div key={chain} className="badge" style={{ justifyContent: "flex-start" }}>
                  {chain}
                </div>
              ))}
            </div>

            <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              Prices are available for all branches of each chain, and you can filter by your
              nearest location.
            </p>
          </section>

          {/* ═══ HOW MUCH DOES FOOD COST ═══ */}
          <section style={{ marginBottom: "var(--space-12)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-4)" }}>
              How Much Does Food Cost in Israel?
            </h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-4)" }}>
              Israel&apos;s food prices are <strong style={{ color: "var(--text)" }}>52% above the OECD average</strong> — making it one
              of the most expensive countries in the developed world for groceries. The average Israeli
              family spends approximately 5,300–5,570 NIS per month on food.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-4)" }}>
              What makes this more challenging: the price difference between the cheapest and most
              expensive supermarket on the same basket of 50 basic items is{" "}
              <strong style={{ color: "var(--accent)" }}>21%</strong>. That same basket costs
              approximately 452 NIS at Rami Levy and 548 NIS at Shufersal Deal. On a full monthly
              grocery run, that difference compounds to hundreds of shekels.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              IsraBis helps you find the cheapest option for your exact shopping list — not a generic
              basket, but the actual products you buy, at the chains nearest to you.
            </p>
          </section>

          {/* ═══ FOR OLIM ═══ */}
          <section style={{ marginBottom: "var(--space-12)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-4)" }}>
              For New Immigrants (Olim)
            </h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-4)" }}>
              Making aliyah is exciting — and overwhelming. Navigating Israeli supermarkets is one of
              those small but real challenges: the layout is different, brand names are unfamiliar,
              prices seem high, and you&apos;re not sure which chain is actually cheaper.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-4)" }}>
              IsraBis was built in Israel, for Israeli shoppers — which means it reflects how Israeli
              supermarkets actually work. You can:
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-4)", paddingRight: "var(--space-5)" }}>
              <li className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                Scan a barcode on any product to instantly compare prices across all chains
              </li>
              <li className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                Build a shopping list and see which supermarket is cheapest for your specific basket
              </li>
              <li className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                Use the AI fridge scanner to get recipe ideas from what you already have at home
              </li>
              <li className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                Share shopping lists with family members in real time
              </li>
            </ul>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              The app is primarily in Hebrew, which is also an opportunity — the product and category
              names you&apos;ll see in IsraBis are the same ones you&apos;ll find on Israeli supermarket
              shelves.
            </p>
          </section>

          {/* ═══ FAQ ═══ */}
          <section style={{ marginBottom: "var(--space-12)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-6)" }}>
              Frequently Asked Questions
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              {[
                {
                  q: "What supermarkets does IsraBis cover?",
                  a: "IsraBis covers all 49 major Israeli supermarket chains, including Shufersal Deal, Shufersal Sheli, Rami Levy, Victory, Osher Ad, Tiv Taam, Yochananof, Yeinot Bitan, Hazi Hinam, Machsanei Hashuk, Carrefour, Mega, Co-op, and 36 more. It is the only Israeli price comparison app with full coverage of all 49 chains.",
                },
                {
                  q: "Is IsraBis free?",
                  a: "Yes. IsraBis is free to download and use on both iOS and Android. The free base tier includes full price comparison across all 49 chains with no limit on products or searches.",
                },
                {
                  q: "How often are prices updated?",
                  a: "Prices are updated every 4 hours. IsraBis pulls data directly from Israel's government price transparency database (published under the Food Price Transparency Law), which supermarkets must update regularly. This is the same source all Israeli price comparison services use — but IsraBis processes it faster and covers more chains.",
                },
                {
                  q: "Does IsraBis have an English interface?",
                  a: "IsraBis is a Hebrew-first app, reflecting the Israeli market it serves. The interface is in Hebrew, but the core functionality — price comparison, barcode scanning, shopping lists — is straightforward regardless of language. An English interface is on the product roadmap.",
                },
                {
                  q: "How accurate are the prices?",
                  a: "Very accurate. Prices come directly from the official government price database that all 49 chains publish by law, updated every few hours. This means prices reflect actual shelf prices within the same day. Note that promotional prices and loyalty card discounts may vary by branch.",
                },
              ].map(({ q, a }) => (
                <div key={q} style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "var(--space-5)" }}>
                  <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>{q}</h3>
                  <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ CTA ═══ */}
          <section style={{ textAlign: "center", padding: "var(--space-10) 0" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-4)" }}>
              Start saving on Israeli groceries today
            </h2>
            <p className="text-body c-muted" style={{ maxWidth: "44ch", margin: "0 auto var(--space-7)", lineHeight: "var(--leading-relaxed)" }}>
              Download IsraBis free on iOS and Android. Compare prices across all 49 supermarket
              chains in seconds.
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://apps.apple.com/app/israbis/id123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent btn-lg"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Download on App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.israbis.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm.91-.91L19.59 12 17.72 9.79l-2.27 2.27 2.27 2.15zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
                </svg>
                Get it on Google Play
              </a>
            </div>
          </section>

        </div>
      </article>
    </>
  );
}
