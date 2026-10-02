import Checker from "../app/page";
import {
  facebookCopy,
  getFacebookUrl,
  type FacebookLocale,
} from "../lib/i18n/facebook";

export default function FacebookLanding({ locale }: { locale: FacebookLocale }) {
  const copy = facebookCopy[locale];
  const url = getFacebookUrl(locale);
  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Facebook Shadowban Checker | ShadowbannChecker",
    url,
    description: copy.subtitle,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    inLanguage: locale,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: copy.faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <Checker content={copy} locale={locale} platform="facebook" />
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
