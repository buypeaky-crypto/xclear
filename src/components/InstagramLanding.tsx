import Checker from "../app/page";
import {
  getInstagramUrl,
  instagramCopies,
  type InstagramLocale,
} from "../lib/i18n/instagram";

type Props = {
  locale: InstagramLocale;
};

export default function InstagramLanding({ locale }: Props) {
  const copy = instagramCopies[locale];
  const url = getInstagramUrl(locale);
  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Instagram Shadowban Checker | ShadowbannChecker",
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
      <Checker content={copy} locale={locale} platform="instagram" />
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