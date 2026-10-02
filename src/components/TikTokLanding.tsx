import { getTikTokUrl, tiktokCopies, type TikTokLocale } from "../lib/i18n/tiktok";
import TikTokChecker from "./TikTokChecker";
import DonationButtons from "./DonationButtons";
import SupportUsButton from "./SupportUsButton";
import BrandHomeLink from "./BrandHomeLink";
import PlatformSwitcher from "./PlatformSwitcher";
import CheckerSchemas from "./CheckerSchemas";

export default function TikTokLanding({ locale }: { locale: TikTokLocale }) {
  const content = tiktokCopies[locale];

  return (
    <main lang={locale} className="min-h-screen bg-platform-tiktok px-4 py-16 text-stone-900">
      <section className="mx-auto max-w-3xl text-center">
        <BrandHomeLink />
        <h1 className="mt-4 text-4xl font-black tracking-tight">{content.h1}</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-stone-600">{content.intro}</p>
        <PlatformSwitcher activePlatform="tiktok" />
        <SupportUsButton />
      </section>
      {locale === "en" && (
        <section className="mx-auto mt-8 max-w-3xl border-y border-stone-300 py-6 text-sm leading-7 text-stone-700">
          <h2 className="text-xl font-bold text-stone-900">TikTok Shadowban Signals: Views, Hashtags, and the For You Page</h2>
          <div className="mt-4 space-y-4">
            <p>
              A TikTok shadowban is a popular phrase for a suspected drop in video discovery, but TikTok does not publish a single official shadowban status. Lower views or fewer For You Page (FYP) recommendations can have many causes, including audience interest, watch time, video topic, posting patterns, and normal ranking changes. A single video that stops growing is not proof that an account has been penalized.
            </p>
            <p>
              This TikTok shadowban checker reviews public account availability and lets you inspect a video URL and recent hashtags for a short list of visibility risk signals. It does not log in to TikTok or access private analytics, recommendation eligibility, or internal moderation decisions. Public endpoints can also be incomplete or temporarily unavailable, so treat the result as a checklist rather than a guarantee about FYP reach. Never provide your password to a third-party checker.
            </p>
            <p>
              To investigate a real TikTok reach drop, compare several recent videos with similar formats and audiences, then review account notifications and each video&apos;s analytics in TikTok. Check whether the video is public, whether its sound or content is eligible, and whether TikTok shows a For You feed eligibility notice. Review hashtags for relevance instead of repeating broad or engagement-bait tags. If you find a specific restriction, use TikTok&apos;s in-app appeal process. This separates observable profile and video signals from platform-only distribution decisions.
            </p>
            <p>
              Give each video enough time to collect comparable data, and note its average watch time, completion rate, and traffic sources alongside views. A change in one metric can explain a distribution shift without indicating an account-level TikTok shadowban. Recheck the relevant video and account notices before changing your posting strategy.
            </p>
          </div>
        </section>
      )}
      {locale === "en" && <TikTokChecker />}
      <DonationButtons />
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
      <CheckerSchemas
        name="TikTok Shadowban Checker"
        url={getTikTokUrl(locale)}
        description={content.description}
        keywords={content.keywords}
        inLanguage={locale}
        faqs={content.faqs}
      />
    </main>
  );
}