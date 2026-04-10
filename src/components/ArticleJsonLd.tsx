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
    url: `https://israbis.com${url}`,
    datePublished,
    dateModified,
    inLanguage: "he",
    author: {
      "@type": "Organization",
      name: "IsraBis",
      url: "https://israbis.com",
    },
    publisher: {
      "@type": "Organization",
      name: "IsraBis",
      logo: {
        "@type": "ImageObject",
        url: "https://israbis.com/images/israbis-logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://israbis.com${url}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
