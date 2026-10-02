import Checker from "../app/page";
import CheckerSchemas from "./CheckerSchemas";
import {
  facebookCopy,
  getFacebookUrl,
  type FacebookLocale,
} from "../lib/i18n/facebook";

export default function FacebookLanding({ locale }: { locale: FacebookLocale }) {
  const copy = facebookCopy[locale];
  const url = getFacebookUrl(locale);

  return (
    <>
      <Checker content={copy} locale={locale} platform="facebook" />
      <CheckerSchemas
        name="Facebook Shadowban Checker"
        url={url}
        description={copy.subtitle}
        keywords={[
          "facebook shadowban checker",
          "facebook shadowban test",
          "how to tell if you're shadow banned on facebook",
          "facebook spam filter check",
          "page not recommendable",
        ]}
        inLanguage={locale}
        faqs={copy.faqs}
      />
    </>
  );
}
