type CheckerSchemasProps = {
  name: string;
  url: string;
  description: string;
  keywords: string[];
  inLanguage: string;
  faqs: { question: string; answer: string }[];
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
}: CheckerSchemasProps) {
  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    url,
    description,
    applicationCategory: "SocialNetworkingApplication",
    keywords,
    operatingSystem: "All",
    inLanguage,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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