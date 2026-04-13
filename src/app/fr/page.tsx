import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "IsraBis — Comparez les prix dans 33 supermarchés israéliens | Application gratuite",
  description:
    "IsraBis compare les prix dans les 33 chaînes de supermarchés en Israël. 255 000 produits, mis à jour toutes les 4 heures. Gratuit.",
  alternates: {
    canonical: "https://israbis.com/fr",
    languages: {
      "fr": "https://israbis.com/fr",
      "he-IL": "https://israbis.com/",
    },
  },
  openGraph: {
    title: "IsraBis — Comparez les prix dans tous les supermarchés israéliens",
    description:
      "Comparez les prix dans 33 chaînes de supermarchés en Israël. 255 000 produits, mis à jour toutes les 4 heures. Gratuit sur iOS et Android.",
    url: "https://israbis.com/fr",
    siteName: "IsraBis",
    locale: "fr_FR",
    type: "website",
  },
};

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "IsraBis",
  description:
    "L'application la plus complète pour comparer les prix dans les supermarchés israéliens. 33 chaînes, 255 000 produits, mise à jour toutes les 4 heures.",
  operatingSystem: "iOS, Android",
  applicationCategory: "UtilitiesApplication",
  inLanguage: ["he", "fr"],
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
      name: "Quelles chaînes de supermarchés IsraBis couvre-t-il ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "IsraBis couvre les 33 grandes chaînes de supermarchés israéliennes, dont Shufersal Deal, Shufersal Sheli, Rami Levy, Victory, Osher Ad, Tiv Taam, Yochananof, Yeinot Bitan, Hazi Hinam, Machsanei Hashuk, Carrefour, Mega, Co-op et 20 autres.",
      },
    },
    {
      "@type": "Question",
      name: "IsraBis est-il gratuit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. IsraBis est gratuit à télécharger et à utiliser sur iOS et Android. La version de base avec la comparaison complète des prix est disponible sans frais.",
      },
    },
    {
      "@type": "Question",
      name: "À quelle fréquence les prix sont-ils mis à jour ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les prix sont mis à jour toutes les 4 heures à partir de la base de données officielle des prix du gouvernement israélien (gov.il), que toutes les chaînes de supermarchés sont légalement tenues de publier.",
      },
    },
  ],
};

export default function FrenchLandingPage() {
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

      <article className="sec" lang="fr">
        <div className="w-980" style={{ maxWidth: 760 }}>

          <div className="badge" style={{ marginBottom: "var(--space-4)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--accent)">
              <circle cx="12" cy="12" r="5" />
            </svg>
            Basé sur la base de données officielle des prix du gouvernement israélien
          </div>

          <h1 className="text-h1" style={{ marginBottom: "var(--space-5)" }}>
            Comparez les prix dans les supermarchés israéliens — trouvez le moins cher
          </h1>

          {/* ═══ INTRO ═══ */}
          <section style={{ marginBottom: "var(--space-10)" }}>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-4)" }}>
              Vous venez de faire votre alyah ou vous planifiez de venir en Israël ?
              IsraBis vous aide à naviguer les supermarchés israéliens et à économiser de l&apos;argent
              dès votre première visite. Comparez les prix dans les 33 chaînes de supermarchés du pays,
              dont Shufersal, Rami Levy, Victory, Osher Ad, Tiv Taam, Yochananof et bien d&apos;autres.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-7)" }}>
              La différence de prix entre la chaîne la moins chère et la plus chère sur le même
              panier de 50 articles courants atteint{" "}
              <strong style={{ color: "var(--accent)" }}>21%</strong>. IsraBis vous aide à trouver
              le meilleur prix pour votre liste de courses spécifique et à économiser de vraies
              sommes chaque mois.
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <Link href="/download" className="btn btn-accent">
                Télécharger gratuitement — iOS et Android
              </Link>
              <Link href="/stores" className="btn btn-outline">
                Les 33 supermarchés
              </Link>
            </div>
          </section>

          {/* ═══ KEY STATS ═══ */}
          <section style={{ marginBottom: "var(--space-10)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-6)" }}>
              IsraBis en chiffres
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)", textAlign: "center" }}>
              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <div className="stat-number">33</div>
                <p className="text-body-sm c-muted" style={{ marginTop: "var(--space-2)" }}>
                  chaînes de supermarchés
                </p>
              </div>
              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <div className="stat-number">255 000+</div>
                <p className="text-body-sm c-muted" style={{ marginTop: "var(--space-2)" }}>
                  produits en base
                </p>
              </div>
              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <div className="stat-number">4h</div>
                <p className="text-body-sm c-muted" style={{ marginTop: "var(--space-2)" }}>
                  mise à jour des prix
                </p>
              </div>
            </div>
          </section>

          {/* ═══ FEATURES ═══ */}
          <section style={{ marginBottom: "var(--space-10)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-6)" }}>
              Fonctionnalités
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  Comparaison des prix dans les 33 chaînes
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  Ajoutez des produits à votre panier — IsraBis calcule instantanément dans quel
                  supermarché votre panier sera le moins cher. La comparaison se fait simultanément
                  sur les 33 chaînes.
                </p>
              </div>

              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  Chef IA IsraSef et scanner de réfrigérateur
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  Photographiez votre réfrigérateur — IsraBis identifie les aliments et propose des
                  recettes avec ce que vous avez déjà chez vous. Chaque recette est accompagnée d&apos;une
                  liste de courses avec les prix dans toutes les chaînes.
                </p>
              </div>

              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  Liste de courses familiale
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  Créez une liste de courses partagée pour toute la famille. Chaque membre voit
                  les modifications en temps réel — idéal pour les courses en commun.
                </p>
              </div>

              <div className="glass-card-premium" style={{ padding: "var(--space-6)" }}>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>
                  Recette depuis une vidéo
                </h3>
                <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  Collez un lien YouTube ou TikTok — IsraBis extrait automatiquement la recette,
                  crée la liste des ingrédients et affiche les prix dans les supermarchés les
                  plus proches.
                </p>
              </div>
            </div>
          </section>

          {/* ═══ POUR LES OLIM ═══ */}
          <section style={{ marginBottom: "var(--space-10)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-4)" }}>
              Pour les Olim — nouveaux immigrants
            </h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-4)" }}>
              Faire son alyah est une expérience extraordinaire — mais naviguer dans les supermarchés
              israéliens est un défi réel. Les noms de marques sont différents, les prix semblent
              élevés, et on ne sait pas toujours quelle chaîne est véritablement moins chère.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-4)" }}>
              IsraBis a été conçu en Israël pour les consommateurs israéliens. Il reflète la réalité
              des supermarchés locaux — les mêmes noms de produits et de rayons que vous verrez sur
              les étagères. Avec IsraBis, vous pouvez :
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-4)", paddingRight: "var(--space-5)" }}>
              <li className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                Scanner le code-barres de n&apos;importe quel produit pour comparer instantanément
                les prix dans toutes les chaînes
              </li>
              <li className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                Créer une liste de courses et voir quel supermarché est le moins cher pour votre
                panier exact
              </li>
              <li className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                Utiliser le scanner de réfrigérateur IA pour obtenir des idées de recettes avec ce
                que vous avez déjà
              </li>
              <li className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                Partager vos listes de courses avec les membres de votre famille en temps réel
              </li>
            </ul>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              L&apos;application est en hébreu — ce qui peut même être une aide pour apprendre les noms
              courants en hébreu des produits alimentaires dès votre arrivée.
            </p>
          </section>

          {/* ═══ FAQ ═══ */}
          <section style={{ marginBottom: "var(--space-10)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-6)" }}>
              Questions fréquentes
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              {[
                {
                  q: "Quelles chaînes de supermarchés IsraBis couvre-t-il ?",
                  a: "IsraBis couvre les 33 grandes chaînes de supermarchés israéliennes, dont Shufersal Deal, Shufersal Sheli, Rami Levy, Victory, Osher Ad, Tiv Taam, Yochananof, Yeinot Bitan, Hazi Hinam, Machsanei Hashuk, Carrefour, Mega, Co-op et 20 autres. C'est la seule application israelienne de comparaison de prix avec une couverture complète des 33 chaînes.",
                },
                {
                  q: "IsraBis est-il gratuit ?",
                  a: "Oui. IsraBis est gratuit à télécharger et à utiliser sur iOS et Android. La version de base avec la comparaison complète des prix sur l'ensemble des 33 chaînes est disponible sans aucun frais.",
                },
                {
                  q: "À quelle fréquence les prix sont-ils mis à jour ?",
                  a: "Les prix sont mis à jour toutes les 4 heures. IsraBis récupère les données directement depuis la base de données officielle des prix du gouvernement israélien (gov.il). En vertu de la loi sur la transparence des prix alimentaires de 2014, toutes les chaînes sont légalement tenues de publier leurs prix régulièrement.",
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
              Commencez à économiser dès aujourd&apos;hui
            </h2>
            <p className="text-body c-muted" style={{ maxWidth: "44ch", margin: "0 auto var(--space-7)", lineHeight: "var(--leading-relaxed)" }}>
              Téléchargez IsraBis gratuitement sur iOS ou Android et comparez les prix dans les
              33 supermarchés israéliens en quelques secondes.
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
