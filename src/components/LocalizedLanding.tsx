import Checker from "../app/page";
import CheckerSchemas from "./CheckerSchemas";
import { dictionaries } from "../lib/i18n/dictionaries";
import { getLocaleUrl, type Locale } from "../lib/i18n/config";

type Props = {
  locale: Exclude<Locale, "en">;
};

export default function LocalizedLanding({ locale }: Props) {
  const dictionary = dictionaries[locale];
  const url = getLocaleUrl(locale);

  return (
    <>
      <Checker content={dictionary} />
      <CheckerSchemas
        name="Twitter Shadowban Checker"
        url={url}
        description={dictionary.description}
        keywords={dictionary.keywords}
        inLanguage={locale}
        faqs={dictionary.faqs}
      />
    </>
  );
}