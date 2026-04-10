interface Props {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}

export default function ArticleJsonLd({
  title,
  description,
  url,
  datePublished = "2026-04-01",
  dateModified = "2026-04-10",
}: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `https://www.israbi.app${url}`,
    datePublished,
    dateModified,
    inLanguage: "he",
    author: {
      "@type": "Organization",
      name: "IsraBis",
      url: "https://www.israbi.app",
    },
    publisher: {
      "@type": "Organization",
      name: "IsraBis",
      logo: {
        "@type": "ImageObject",
        url: "https://www.israbi.app/images/israbis-logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.israbi.app${url}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
