import Checker from "../app/page";
import { dictionaries } from "../lib/i18n/dictionaries";
import { getLocaleUrl, type Locale } from "../lib/i18n/config";

type Props = {
  locale: Exclude<Locale, "en">;
};

export default function LocalizedLanding({ locale }: Props) {
  const dictionary = dictionaries[locale];
  const url = getLocaleUrl(locale);
  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ShadowbannChecker",
    url,
    description: dictionary.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: dictionary.faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };

  return (
    <>
      <Checker content={dictionary} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}