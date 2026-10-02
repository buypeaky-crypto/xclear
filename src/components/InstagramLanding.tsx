import Checker from "../app/page";
import CheckerSchemas from "./CheckerSchemas";
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

  return (
    <>
      <Checker content={copy} locale={locale} platform="instagram" />
      <CheckerSchemas
        name="Instagram Shadowban Checker"
        url={url}
        description={copy.subtitle}
        keywords={copy.keywords}
        inLanguage={locale}
        faqs={copy.faqs}
      />
    </>
  );
}