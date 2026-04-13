interface HowToStep {
  "@type": "HowToStep";
  name: string;
  text: string;
  position: number;
}

interface HowToData {
  name: string;
  description: string;
  totalTime: string;
  step: HowToStep[];
}

interface Props {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  howTo?: HowToData;
}

export default function ArticleJsonLd({
  title,
  description,
  url,
  datePublished = "2026-04-01",
  dateModified = "2026-04-10",
  howTo,
}: Props) {
  const articleSchema = {
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

  const howToSchema = howTo
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: howTo.name,
        description: howTo.description,
        totalTime: howTo.totalTime,
        step: howTo.step,
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
    </>
  );
}
