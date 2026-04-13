import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "IsraBis — Сравнение цен в 33 супермаркетах Израиля | Бесплатное приложение",
  description:
    "IsraBis сравнивает цены во всех 33 сетях супермаркетов Израиля — Shufersal, Rami Levy, Victory и ещё 30 сетей. 255 000 товаров, обновление каждые 4 часа. Бесплатно.",
  alternates: {
    canonical: "https://israbis.com/ru",
    languages: {
      "ru": "https://israbis.com/ru",
      "he-IL": "https://israbis.com/",
    },
  },
  openGraph: {
    title: "IsraBis — Сравнение цен во всех супермаркетах Израиля",
    description:
      "Сравнивайте цены в 33 сетях супермаркетов Израиля. 255 000 товаров, обновление каждые 4 часа. Бесплатно для iOS и Android.",
    url: "https://israbis.com/ru",
    siteName: "IsraBis",
    locale: "ru_RU",
    type: "website",
  },
};

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "IsraBis",
  description:
    "Самое полное приложение для сравнения цен в супермаркетах Израиля. 33 сети, 255 000 товаров, обновление каждые 4 часа.",
  operatingSystem: "iOS, Android",
  applicationCategory: "UtilitiesApplication",
  inLanguage: ["he", "ru"],
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
      name: "Сколько супермаркетов охватывает IsraBis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "IsraBis охватывает все 33 сети супермаркетов Израиля, включая Shufersal, Rami Levy, Victory, Osher Ad, Tiv Taam, Yochananof, Yeinot Bitan, Hazi Hinam, Machsanei Hashuk, Carrefour и ещё 23 сети.",
      },
    },
    {
      "@type": "Question",
      name: "Приложение бесплатное?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да. IsraBis бесплатно скачивается и используется на iOS и Android. Базовая версия с полным сравнением цен доступна бесплатно.",
      },
    },
    {
      "@type": "Question",
      name: "Как часто обновляются цены?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Цены обновляются каждые 4 часа на основе официальной государственной базы данных цен Израиля (gov.il), которую все сети супермаркетов обязаны публиковать по закону.",
      },
    },
  ],
};

export default function RussianLandingPage() {
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

      <article className="sec" lang="ru">
        <div className="w-980" style={{ maxWidth: 760 }}>

          <div className="badge" style={{ marginBottom: "var(--space-4)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--accent)">
              <circle cx="12" cy="12" r="5" />
            </svg>
            Официальная база данных цен правительства Израиля
          </div>

          <h1 className="text-h1" style={{ marginBottom: "var(--space-5)" }}>
            Сравнение цен в израильских супермаркетах — найдите самый дешёвый
          </h1>

          {/* ═══ INTRO ═══ */}
          <section style={{ marginBottom: "var(--space-10)" }}>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-4)" }}>
              IsraBis — это приложение для сравнения цен во всех супермаркетах Израиля. Мы охватываем
              все 33 торговые сети страны: Shufersal, Rami Levy, Victory, Osher Ad, Tiv Taam,
              Yochananof, Yeinot Bitan, Hazi Hinam, Machsanei Hashuk, Carrefour и ещё 23 сети.
              Цены обновляются каждые 4 часа из официальной государственной базы данных.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-7)" }}>
              Более миллиона русскоязычных жителей Израиля ежедневно делают покупки в израильских
              супермаркетах. Разница в ценах между самой дешёвой и самой дорогой сетью на одинаковую
              корзину из 50 товаров составляет{" "}
              <strong style={{ color: "var(--accent)" }}>21%</strong>. IsraBis помогает вам
              находить самые выгодные цены и экономить реальные деньги каждый месяц.
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <Link href="/download" className="btn btn-accent">
                Скачать бесплатно — iOS и Android
              </Link>
              <Link href="/stores" className="btn btn-outline">
                Все 33 сети
              </Link>
            </div>
          </section>

          {/* ═══ KEY STATS ═══ */}
          <section style={{ marginBottom: "var(--space-10)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-6)" }}>
              IsraBis в цифрах
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)", textAlign: "center" }}>
              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <div className="stat-number">33</div>
                <p className="text-body-sm c-muted" style={{ marginTop: "var(--space-2)" }}>
                  сети супермаркетов
                </p>
              </div>
              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <div className="stat-number">255K+</div>
                <p className="text-body-sm c-muted" style={{ marginTop: "var(--space-2)" }}>
                  товаров в базе
                </p>
              </div>
              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <div className="stat-number">4ч</div>
                <p className="text-body-sm c-muted" style={{ marginTop: "var(--space-2)" }}>
                  обновление цен
                </p>
              </div>
            </div>
          </section>

          {/* ═══ FEATURES ═══ */}
          <section style={{ marginBottom: "var(--space-10)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-6)" }}>
              Возможности приложения
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  Сравнение цен во всех 33 сетях
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  Добавьте товары в корзину — и IsraBis мгновенно покажет, в каком супермаркете
                  ваша корзина обойдётся дешевле всего. Сравнение происходит по всем 33 сетям
                  одновременно.
                </p>
              </div>

              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  ИИ-шеф IsraSef и сканер холодильника
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  Сфотографируйте содержимое холодильника — IsraBis распознает продукты и предложит
                  рецепты из того, что есть дома. Каждый рецепт сопровождается списком покупок с
                  ценами во всех сетях.
                </p>
              </div>

              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  Семейный список покупок
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  Создайте общий список покупок для всей семьи. Каждый член семьи видит изменения
                  в режиме реального времени — удобно для совместных покупок.
                </p>
              </div>

              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  Рецепт из видео
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  Вставьте ссылку на видео с YouTube или TikTok — IsraBis автоматически извлечёт
                  рецепт, составит список ингредиентов и покажет цены в ближайших супермаркетах.
                </p>
              </div>
            </div>
          </section>

          {/* ═══ FAQ ═══ */}
          <section style={{ marginBottom: "var(--space-10)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-6)" }}>
              Часто задаваемые вопросы
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              {[
                {
                  q: "Сколько супермаркетов охватывает IsraBis?",
                  a: "IsraBis охватывает все 33 сети супермаркетов Израиля — это больше, чем любое другое приложение для сравнения цен в стране. В числе охваченных сетей: Shufersal, Rami Levy, Victory, Osher Ad, Tiv Taam, Yochananof, Yeinot Bitan, Hazi Hinam, Machsanei Hashuk, Carrefour и многие другие.",
                },
                {
                  q: "Приложение бесплатное?",
                  a: "Да, IsraBis полностью бесплатно для скачивания и использования на iOS и Android. Базовый тариф с полным сравнением цен по всем 33 сетям доступен без оплаты.",
                },
                {
                  q: "Как часто обновляются цены?",
                  a: "Цены обновляются каждые 4 часа. IsraBis получает данные напрямую из официальной государственной базы данных цен Израиля (gov.il). По закону о прозрачности цен на продукты питания 2014 года все сети обязаны регулярно публиковать актуальные цены.",
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
              Начните экономить на покупках сегодня
            </h2>
            <p className="text-body c-muted" style={{ maxWidth: "44ch", margin: "0 auto var(--space-7)", lineHeight: "var(--leading-relaxed)" }}>
              Скачайте IsraBis бесплатно на iOS или Android и сравнивайте цены во всех
              33 супермаркетах Израиля за секунды.
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
