
import type { Metadata } from "next";
import Link from "next/link";

const pageUrl = "https://shadowban.online/blog/what-is-shadowban";

const title =
  "What Is a Shadowban? How to Check Your Social Media Visibility";

const description =
  "Learn what people mean by shadowban, how to investigate reduced visibility on X, Instagram, TikTok, Facebook and YouTube, and where to check official account notices.";

export const metadata: Metadata = {
  metadataBase: new URL("https://shadowban.online"),
  title,
  description,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: "article",
    url: pageUrl,
    siteName: "Shadowban.online",
    title,
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shadowban.online visibility guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${pageUrl}#article`,
  mainEntityOfPage: pageUrl,
  headline: title,
  description,
  datePublished: "2026-10-06",
  dateModified: "2026-10-30",
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "Shadowban.online",
    url: "https://shadowban.online",
  },
};

const officialResources = [
  {
    platform: "X",
    label: "Help with X search",
    url: "https://help.x.com/en/using-x/x-search-not-working",
  },
  {
    platform: "X",
    label: "X search rules and restrictions",
    url: "https://help.x.com/en/rules-and-policies/x-search-policies",
  },
  {
    platform: "Instagram",
    label: "Instagram Help Center",
    url: "https://help.instagram.com/",
  },
  {
    platform: "Meta",
    label: "Meta recommendation guidelines",
    url: "https://about.fb.com/news/2020/08/recommendation-guidelines/",
  },
  {
    platform: "TikTok",
    label: "Content violations and bans",
    url: "https://support.tiktok.com/en/safety-hc/account-and-user-safety/content-violations-and-bans",
  },
  {
    platform: "TikTok",
    label: "How the For You feed works",
    url: "https://support.tiktok.com/en/getting-started/for-you/test-for-you",
  },
  {
    platform: "YouTube",
    label: "Why a channel or video may not appear in Search",
    url: "https://support.google.com/youtube/answer/58097?hl=en",
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-stone-900 sm:px-6 sm:py-16">
      <article>
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-700">
            Visibility guide
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            What Is a Shadowban?
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">
            Understand the term, investigate changes in search and
            recommendations, and learn which signals you can actually verify
            on X, Instagram, TikTok, Facebook and YouTube.
          </p>

          <p className="mt-4 text-xs text-stone-500">
            Originally published October 6, 2026 · Updated October 30, 2026
          </p>
        </header>

        <div className="prose max-w-none space-y-6 leading-8">
          <p>
            A <strong>shadowban</strong> is an informal term people use when
            they believe their content or account has become less visible
            without an obvious suspension or removal notice. It is not one
            universal account status shared by every social media platform.
          </p>

          <p>
            Each platform has its own search, recommendation, moderation and
            account-status systems. A post may be removed, may remain
            available but not be recommended to new audiences, or may simply
            rank lower for a particular search. These situations are different
            and should not automatically be described as a shadowban.
          </p>

          <p>
            A drop in views, likes, impressions or followers is not enough to
            prove that an account has been restricted. Audience interest,
            content relevance, privacy settings, search filters, indexing
            delays and recommendation systems can all affect visibility.
          </p>
        </div>

        <section className="mt-12 rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
          <h2 className="text-2xl font-bold">
            Can a shadowban checker confirm a restriction?
          </h2>

          <p className="mt-4 text-sm leading-7 text-stone-600">
            An independent checker cannot access every platform's internal
            ranking, recommendation or enforcement system. It can only report
            the public signals or submitted text that its particular checks
            are designed to examine.
          </p>

          <p className="mt-3 text-sm leading-7 text-stone-600">
            Treat an external result as a diagnostic clue, not an official
            platform decision. When a platform provides an account-status
            notice or recommendation-eligibility explanation, use that
            first-party information as your primary reference.
          </p>
        </section>

        <section className="mt-14 space-y-10">
          <h2 className="text-3xl font-bold">
            How to investigate visibility on each platform
          </h2>

          <section>
            <h3 className="text-2xl font-bold">X (formerly Twitter)</h3>

            <p className="mt-3 leading-7 text-stone-600">
              X explains that not every post appears in search. Protected
              posts, account setup, sensitive-content filters and search
              relevance can affect what people see. X also documents search
              filtering for certain spam-like or repetitive behaviours.
            </p>

            <p className="mt-3 leading-7 text-stone-600">
              Compare multiple public posts using relevant search terms and
              check the account's visibility settings. A username missing
              from one search or suggestion response does not prove that the
              account has been restricted.
            </p>

            <Link
              href="/"
              className="mt-4 inline-block font-semibold text-violet-700 underline underline-offset-4"
            >
              Use the X visibility checker
            </Link>
          </section>

          <section>
            <h3 className="text-2xl font-bold">Instagram</h3>

            <p className="mt-3 leading-7 text-stone-600">
              Instagram has Account Status tools. Eligible professional
              accounts can review whether their content or profile may be
              eligible for recommendations to people who do not already
              follow them.
            </p>

            <p className="mt-3 leading-7 text-stone-600">
              Review any notices shown in your own account. Do not treat a
              decline in Explore reach or hashtag visibility as proof of a
              restriction without checking the platform's information.
            </p>

            <Link
              href="/instagram"
              className="mt-4 inline-block font-semibold text-violet-700 underline underline-offset-4"
            >
              Review Instagram hashtag patterns
            </Link>
          </section>

          <section>
            <h3 className="text-2xl font-bold">TikTok</h3>

            <p className="mt-3 leading-7 text-stone-600">
              TikTok explains that some content may be ineligible for the
              For You feed even when it has not been removed. TikTok may
              provide a notice explaining the decision and an option to
              appeal.
            </p>

            <p className="mt-3 leading-7 text-stone-600">
              Check the notices and account information available inside
              TikTok. A video receiving fewer views, or appearing to stop
              gaining views at a particular number, is not by itself proof
              of a restriction.
            </p>

            <Link
              href="/checker/tiktok"
              className="mt-4 inline-block font-semibold text-violet-700 underline underline-offset-4"
            >
              Check public TikTok visibility
            </Link>
          </section>

          <section>
            <h3 className="text-2xl font-bold">Facebook</h3>

            <p className="mt-3 leading-7 text-stone-600">
              Meta distinguishes content that is allowed on its platforms
              from content that is eligible to be recommended. Recommendation
              guidelines explain why some content may not be distributed
              through recommendation surfaces.
            </p>

            <p className="mt-3 leading-7 text-stone-600">
              Review the account or Page status notices available to you.
              A change in Feed reach, pending group posts or lower engagement
              does not independently establish an account-wide visibility
              restriction.
            </p>

            <Link
              href="/facebook-shadowban-checker"
              className="mt-4 inline-block font-semibold text-violet-700 underline underline-offset-4"
            >
              Review Facebook content patterns
            </Link>
          </section>

          <section>
            <h3 className="text-2xl font-bold">YouTube</h3>

            <p className="mt-3 leading-7 text-stone-600">
              YouTube says newly created channels and videos, as well as
              recently changed channel details, may take several days to
              appear in Search. Search results are also ranked using
              relevance and other signals.
            </p>

            <p className="mt-3 leading-7 text-stone-600">
              Try searching for a specific video ID and check YouTube Studio
              for notifications or errors. A video not appearing near the
              top of a search query does not prove that the channel has
              been shadowbanned.
            </p>

            <Link
              href="/youtube"
              className="mt-4 inline-block font-semibold text-violet-700 underline underline-offset-4"
            >
              Review YouTube content patterns
            </Link>
          </section>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-bold">
            What to do when your visibility changes
          </h2>

          <ol className="mt-6 list-decimal space-y-4 pl-6 leading-7 text-stone-600">
            <li>
              <strong className="text-stone-900">
                Check official notices.
              </strong>{" "}
              Look for account-status messages, content removals,
              recommendation-eligibility notices or search-related guidance
                inside the platform.
            </li>

            <li>
              <strong className="text-stone-900">
                Check the content itself.
              </strong>{" "}
              Confirm that the post, video or profile is public and that
              you are using the correct URL, username or search query.
            </li>

            <li>
              <strong className="text-stone-900">
                Compare more than one result.
              </strong>{" "}
              Review several posts and different relevant search terms.
              One missing result is not enough to establish a pattern.
            </li>

            <li>
              <strong className="text-stone-900">
                Consider ordinary explanations.
              </strong>{" "}
              Audience activity, relevance, privacy settings, indexing
              delays and temporary service problems may affect visibility.
            </li>

            <li>
              <strong className="text-stone-900">
                Use the platform's review process.
              </strong>{" "}
              When a specific account or content decision appears in an
              official notice, follow the platform's instructions to request
              a review or appeal.
            </li>
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-bold">Frequently asked questions</h2>

          <div className="mt-6 space-y-5">
            <div>
              <h3 className="text-lg font-semibold">
                Is a shadowban an official status?
              </h3>
              <p className="mt-2 leading-7 text-stone-600">
                The term is commonly used by creators, but it is not one
                universal status across social media platforms. Each service
                has its own account, moderation, search and recommendation
                systems.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                How long does a shadowban last?
              </h3>
              <p className="mt-2 leading-7 text-stone-600">
                There is no reliable universal duration. The length and
                effect of a restriction depend on the platform and the
                specific decision. Follow the explanation and review
                instructions provided by the platform.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Does low engagement mean my account is restricted?
              </h3>
              <p className="mt-2 leading-7 text-stone-600">
                No. Engagement can change for many reasons, including
                audience interests, content format, timing and ranking.
                A decrease in views or likes alone is not proof of a
                restriction.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Should I delete my posts or stop posting?
              </h3>
              <p className="mt-2 leading-7 text-stone-600">
                Do not delete content or stop posting based only on a
                third-party checker result. First review any official notice
                and the platform's relevant rules. Make changes when you
                understand the specific issue.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Do I need to share my password with a checker?
              </h3>
              <p className="mt-2 leading-7 text-stone-600">
                No. Never share your social media password, login code or
                session cookie with a third-party checker.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
          <h2 className="text-2xl font-bold">Official platform resources</h2>

          <p className="mt-3 text-sm leading-7 text-stone-600">
            These first-party resources explain search, recommendation
            eligibility and account or content decisions. Platform
            documentation may change, so consult the current guidance.
          </p>

          <ul className="mt-5 space-y-3">
            {officialResources.map((resource) => (
              <li key={resource.url}>
                <span className="mr-2 text-xs font-semibold uppercase text-stone-400">
                  {resource.platform}
                </span>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-violet-700 underline underline-offset-4 hover:text-violet-900"
                >
                  {resource.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 rounded-2xl bg-stone-900 p-6 text-center text-white sm:p-8">
          <h2 className="text-2xl font-bold">
            Investigate your public visibility signals
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-300">
            Use Shadowban.online to review selected public signals or
            submitted content patterns. Results are diagnostic and are
            not official platform decisions.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-stone-900 transition hover:bg-stone-200"
          >
            Open the X visibility checker
          </Link>
        </section>

        <p className="mt-10 text-xs leading-6 text-stone-500">
          Shadowban.online is an independent service and is not affiliated
          with X, Instagram, TikTok, Facebook, YouTube or Reddit. Platform
          names are used only to identify the services discussed.
        </p>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
