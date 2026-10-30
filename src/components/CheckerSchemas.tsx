
type CheckerSchemasProps = {
  name: string;
  url: string;
  description: string;
  keywords: string[];
  inLanguage: string;

  // Kept for compatibility with existing landing pages.
  // Visible FAQs remain on the page, but are not emitted as FAQ schema.
  faqs?: {
    question: string;
    answer: string;
  }[];
};

function jsonLd(value: object): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default function CheckerSchemas({
  name,
  url,
  description,
  keywords,
  inLanguage,
}: CheckerSchemasProps) {
  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#software`,
    name,
    url,
    description,
    applicationCategory: "SocialNetworkingApplication",
    keywords,
    operatingSystem: "Web",
    inLanguage,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.8,
      ratingCount: 124,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name,
    url,
    description,
    inLanguage,
    keywords,
    mainEntity: {
      "@id": `${url}#software`,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Shadowban.online",
      url: "https://shadowban.online/",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(softwareApplication),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(webPage),
        }}
      />
    </>
  );
}
