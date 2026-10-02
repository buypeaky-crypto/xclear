type CheckerSchemasProps = {
  name: string;
  url: string;
  description: string;
  keywords: string[];
  inLanguage: string;
  faqs: { question: string; answer: string }[];
  operatingSystem?: string;
  aggregateRating?: { ratingValue: string; ratingCount: string };
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
  faqs,
  operatingSystem = "All",
  aggregateRating,
}: CheckerSchemasProps) {
  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    url,
    description,
    applicationCategory: "SocialNetworkingApplication",
    keywords,
    operatingSystem,
    inLanguage,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    ...(aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: aggregateRating.ratingValue,
        ratingCount: aggregateRating.ratingCount,
      },
    }),
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage,
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(softwareApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqPage) }}
      />
    </>
  );
}