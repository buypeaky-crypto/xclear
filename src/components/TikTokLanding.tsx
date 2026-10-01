import { tiktokCopies, type TikTokLocale } from "../lib/i18n/tiktok";
import TikTokChecker from "./TikTokChecker";

export default function TikTokLanding({ locale }: { locale: TikTokLocale }) {
  const content = tiktokCopies[locale];

  return (
    <main lang={locale} className="min-h-screen bg-[#FFFBEB] px-4 py-16 text-stone-900">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase text-violet-700">ShadowbannChecker</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight">{content.h1}</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-stone-600">{content.intro}</p>
      </section>
      {locale === "en" && <TikTokChecker />}
      <section aria-labelledby="tiktok-faq-title" className="mx-auto mt-14 max-w-3xl border-t border-stone-300 pt-8">
        <h2 id="tiktok-faq-title" className="text-2xl font-bold">TikTok Shadowban FAQs</h2>
        <div className="mt-5 divide-y divide-stone-200">
          {content.faqs.map((faq) => (
            <details key={faq.question} className="py-4">
              <summary className="cursor-pointer font-semibold">{faq.question}</summary>
              <p className="mt-3 text-sm leading-6 text-stone-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}