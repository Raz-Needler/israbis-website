import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "IsraBis — مقارنة أسعار 33 سوبرماركت في إسرائيل | تطبيق مجاني",
  description:
    "IsraBis يقارن الأسعار في جميع سلاسل السوبرماركت الـ33 في إسرائيل. 255,000 منتج، تحديث كل 4 ساعات. مجاني.",
  alternates: {
    canonical: "https://israbis.com/ar",
    languages: {
      "ar": "https://israbis.com/ar",
      "he-IL": "https://israbis.com/",
    },
  },
  openGraph: {
    title: "IsraBis — قارن أسعار السوبرماركت في إسرائيل",
    description:
      "قارن الأسعار في 33 سلسلة سوبرماركت في إسرائيل. 255,000 منتج، تحديث كل 4 ساعات. مجاني لنظامي iOS وAndroid.",
    url: "https://israbis.com/ar",
    siteName: "IsraBis",
    locale: "ar_IL",
    type: "website",
  },
};

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "IsraBis",
  description:
    "التطبيق الأشمل لمقارنة أسعار السوبرماركت في إسرائيل. 33 سلسلة، 255,000 منتج، تحديث كل 4 ساعات.",
  operatingSystem: "iOS, Android",
  applicationCategory: "UtilitiesApplication",
  inLanguage: ["he", "ar"],
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
      name: "كم عدد السوبرماركتات التي يغطيها IsraBis؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "يغطي IsraBis جميع سلاسل السوبرماركت الـ33 الرئيسية في إسرائيل، بما في ذلك Shufersal وRami Levy وVictory وOsher Ad وTiv Taam وYochananof وYeinot Bitan وHazi Hinam وMachsanei Hashuk وCarrefour وغيرها الكثير.",
      },
    },
    {
      "@type": "Question",
      name: "هل التطبيق مجاني؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم. IsraBis مجاني للتنزيل والاستخدام على نظامي iOS وAndroid. الخطة الأساسية مع مقارنة الأسعار الكاملة متاحة مجانًا.",
      },
    },
    {
      "@type": "Question",
      name: "كم مرة يتم تحديث الأسعار؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "يتم تحديث الأسعار كل 4 ساعات مباشرةً من قاعدة بيانات الأسعار الحكومية الرسمية في إسرائيل (gov.il)، التي تلتزم جميع سلاسل السوبرماركت بنشرها وفقًا للقانون.",
      },
    },
  ],
};

export default function ArabicLandingPage() {
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

      <article className="sec" dir="rtl" lang="ar">
        <div className="w-980" style={{ maxWidth: 760 }}>

          <div className="badge" style={{ marginBottom: "var(--space-4)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--accent)">
              <circle cx="12" cy="12" r="5" />
            </svg>
            مبني على قاعدة بيانات الأسعار الحكومية الرسمية
          </div>

          <h1 className="text-h1" style={{ marginBottom: "var(--space-5)" }}>
            قارن أسعار السوبرماركت في إسرائيل — اعثر على الأرخص
          </h1>

          {/* ═══ INTRO ═══ */}
          <section style={{ marginBottom: "var(--space-10)" }}>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-4)" }}>
              IsraBis هو تطبيق مقارنة الأسعار الأشمل في إسرائيل. يغطي جميع سلاسل السوبرماركت
              الـ33 في البلاد، بما فيها Shufersal وRami Levy وVictory وOsher Ad وTiv Taam
              وYochananof وYeinot Bitan وHazi Hinam وMachsanei Hashuk وCarrefour وغيرها.
              تُحدَّث الأسعار كل 4 ساعات من قاعدة البيانات الحكومية الرسمية.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-7)" }}>
              الفرق في السعر بين أرخص سلسلة وأغلاها على نفس سلة التسوق يصل إلى{" "}
              <strong style={{ color: "var(--accent)" }}>21%</strong>. IsraBis يساعدك على إيجاد
              أفضل الأسعار وتوفير المال الحقيقي في كل شهر.
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <Link href="/download" className="btn btn-accent">
                تنزيل مجاني — iOS وAndroid
              </Link>
              <Link href="/stores" className="btn btn-outline">
                جميع الـ33 سلسلة
              </Link>
            </div>
          </section>

          {/* ═══ KEY STATS ═══ */}
          <section style={{ marginBottom: "var(--space-10)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-6)" }}>
              IsraBis بالأرقام
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)", textAlign: "center" }}>
              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <div className="stat-number">33</div>
                <p className="text-body-sm c-muted" style={{ marginTop: "var(--space-2)" }}>
                  سلسلة سوبرماركت
                </p>
              </div>
              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <div className="stat-number">255K+</div>
                <p className="text-body-sm c-muted" style={{ marginTop: "var(--space-2)" }}>
                  منتج في قاعدة البيانات
                </p>
              </div>
              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <div className="stat-number">4h</div>
                <p className="text-body-sm c-muted" style={{ marginTop: "var(--space-2)" }}>
                  تحديث الأسعار
                </p>
              </div>
            </div>
          </section>

          {/* ═══ FEATURES ═══ */}
          <section style={{ marginBottom: "var(--space-10)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-6)" }}>
              مميزات التطبيق
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  مقارنة الأسعار في جميع الـ33 سلسلة
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  أضف المنتجات إلى سلة التسوق — وسيُظهر IsraBis فورًا في أي سوبرماركت ستكون
                  سلتك الأرخص. تتم المقارنة عبر جميع الـ33 سلسلة في آنٍ واحد.
                </p>
              </div>

              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  الشيف الذكي IsraSef وماسح الثلاجة
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  صوِّر محتويات ثلاجتك — سيتعرف IsraBis على المنتجات ويقترح وصفات مما لديك في
                  المنزل. كل وصفة تأتي مع قائمة تسوق وأسعار من جميع السلاسل.
                </p>
              </div>

              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  قائمة التسوق العائلية
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  أنشئ قائمة تسوق مشتركة لجميع أفراد الأسرة. يرى كل فرد التغييرات في الوقت
                  الفعلي — مناسب جدًا للتسوق المشترك.
                </p>
              </div>

              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  وصفة من فيديو
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  الصق رابط فيديو من YouTube أو TikTok — سيستخرج IsraBis الوصفة تلقائيًا،
                  ويُنشئ قائمة المكونات، ويعرض الأسعار في أقرب السوبرماركتات.
                </p>
              </div>
            </div>
          </section>

          {/* ═══ FAQ ═══ */}
          <section style={{ marginBottom: "var(--space-10)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-6)" }}>
              الأسئلة الشائعة
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              {[
                {
                  q: "كم عدد السوبرماركتات التي يغطيها IsraBis؟",
                  a: "يغطي IsraBis جميع سلاسل السوبرماركت الـ33 الرئيسية في إسرائيل — وهو أكثر شمولًا من أي تطبيق مقارنة أسعار آخر في البلاد. تشمل السلاسل المغطاة: Shufersal وRami Levy وVictory وOsher Ad وTiv Taam وYochananof وYeinot Bitan وHazi Hinam وMachsanei Hashuk وCarrefour والمزيد.",
                },
                {
                  q: "هل التطبيق مجاني؟",
                  a: "نعم، IsraBis مجاني تمامًا للتنزيل والاستخدام على نظامي iOS وAndroid. الخطة الأساسية مع مقارنة الأسعار الكاملة عبر الـ33 سلسلة متاحة بدون أي رسوم.",
                },
                {
                  q: "كم مرة يتم تحديث الأسعار؟",
                  a: "تُحدَّث الأسعار كل 4 ساعات. يحصل IsraBis على البيانات مباشرةً من قاعدة بيانات الأسعار الحكومية الرسمية في إسرائيل (gov.il). بموجب قانون شفافية أسعار المواد الغذائية لعام 2014، تلتزم جميع السلاسل بنشر الأسعار المحدَّثة بانتظام.",
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
              ابدأ التوفير في تسوقك اليوم
            </h2>
            <p className="text-body c-muted" style={{ maxWidth: "44ch", margin: "0 auto var(--space-7)", lineHeight: "var(--leading-relaxed)" }}>
              نزِّل IsraBis مجانًا على iOS أو Android وقارن الأسعار في جميع
              الـ33 سوبرماركت في إسرائيل خلال ثوانٍ.
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
                App Store
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
                Google Play
              </a>
            </div>
          </section>

        </div>
      </article>
    </>
  );
}
