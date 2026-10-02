import BrandHomeLink from "./BrandHomeLink";
import CheckerSchemas from "./CheckerSchemas";
import DonationButtons from "./DonationButtons";
import PlatformSwitcher from "./PlatformSwitcher";
import SupportUsButton from "./SupportUsButton";
import YouTubeChecker from "./YouTubeChecker";
import { getYouTubeUrl, youtubeCopies, type YouTubeLocale } from "../lib/i18n/youtube";

const englishIntroduction = [
  "A sudden decline in views can make creators wonder whether a YouTube shadowban is hiding their channel. The phrase is widely used, but YouTube does not publish a single account-level shadowban status. Search placement and recommendations change for many reasons: viewer interests, competition, seasonality, topic, video packaging, and ordinary ranking experiments. A quiet upload or a lower view count is not proof of a penalty.",
  "This YouTube Shadowban Checker performs a limited, logged-out review of a channel page. Enter a handle such as @MrBeast, a youtube.com/@handle address, a legacy /c/ URL, or a /channel/UC... ID. The checker looks for a reachable channel page, public-page metadata, recent video entries, and visible termination or unavailable-content messages. It does not sign in, use a YouTube API key, inspect private analytics, or see internal search and recommendation systems.",
  "Treat the score as a short list of observable signals, not a verdict. YouTube may serve different page markup by location, device, or time, and public HTML can be incomplete. A missing video entry or metadata field can therefore produce a cautious result even when a channel is operating normally. Conversely, a reachable profile cannot establish that every video is eligible for every search or recommendation surface. No third-party page checker can verify internal distribution decisions.",
  "To investigate a reach change, compare several recent videos with similar topics and publication windows. Open the channel and videos in a signed-out browser, then review YouTube Studio for restrictions, copyright claims, age limits, policy notices, and recommendation eligibility information. Check whether titles and descriptions clearly match the content and whether visibility is set to Public. If Studio identifies a specific decision, use YouTube's appeal process instead of repeatedly re-uploading the same video. Allow time for updates to take effect, then compare results again. Never share your password or access token with a checker.",
];

export default function YouTubeLanding({ locale }: { locale: YouTubeLocale }) {
  const copy = youtubeCopies[locale];
  const url = getYouTubeUrl(locale);

  return (
    <main lang={locale} className="min-h-screen bg-stone-50 px-4 py-10 pb-24 text-stone-900 sm:py-14">
      <section className="mx-auto max-w-3xl text-center">
        <BrandHomeLink />
        <h1 className="mt-4 text-4xl font-black tracking-tight">{copy.h1}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600">{copy.subtitle}</p>
        <PlatformSwitcher activePlatform="youtube" />
        <SupportUsButton />
        <DonationButtons />
      </section>

      {locale === "en" && (
        <section className="mx-auto mt-9 max-w-3xl border-y border-stone-300 py-6 text-sm leading-7 text-stone-700">
          <h2 className="mb-4 text-2xl font-bold text-stone-900">How to tell if you&apos;re shadowbanned on YouTube (And How To Fix It)</h2>
          <div className="space-y-4">{englishIntroduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>
      )}

      <YouTubeChecker locale={locale} />

      <section aria-labelledby="youtube-faq-title" className="mx-auto mt-14 max-w-3xl border-t border-stone-300 pt-8">
        <h2 id="youtube-faq-title" className="text-2xl font-bold">{copy.faqTitle}</h2>
        <div className="mt-5 divide-y divide-stone-200">
          {copy.faqs.map((faq) => (
            <article key={faq.question} className="py-4">
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
      <CheckerSchemas
        name="YouTube Shadowban Checker"
        url={url}
        description={copy.subtitle}
        keywords={copy.keywords}
        inLanguage={locale}
        faqs={copy.faqs}
      />
    </main>
  );
}