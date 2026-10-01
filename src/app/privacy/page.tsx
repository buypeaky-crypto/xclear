import type { Metadata } from "next";
import Link from "next/link";
import { baseUrl, getEnglishLanguageAlternates } from "../../lib/i18n/config";

export const metadata: Metadata = {
  title: "Privacy Policy | ShadowbanChecker - 100% Private Shadowban Test",
  description:
    "Privacy policy for ShadowbannChecker: no login or data sold; successful X/Twitter profile lookups may be cached for up to six hours.",
  keywords: [
    "shadowban checker privacy",
    "instagram shadowban checker safe",
    "is shadowbannchecker safe",
  ],
  alternates: {
    canonical: `${baseUrl}/privacy`,
    languages: getEnglishLanguageAlternates("/privacy"),
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FFFBEB] px-4 py-12 text-stone-900 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase text-violet-700">ShadowbannChecker</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-stone-500">Last updated: October 1, 2026</p>
        </header>

        <div className="space-y-8 text-[15px] leading-7 text-stone-700">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">A privacy-first checker</h2>
            <p>
              ShadowbannChecker does not require an account, password, or social-media login. You
              choose whether to submit a public username for a check. The checker currently
              available on our site performs an X/Twitter profile lookup through our API; it is
              browser-facing, but it is not purely client-side because the username is sent to our
              server to perform that request. Instagram, TikTok, and YouTube checks are not
              currently available in the live tool.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Information and temporary caching</h2>
            <p>
              We do not ask for private messages, account credentials, or other private account
              information. When you submit a username, our API uses it to request public profile
              information from X/Twitter or a profile lookup provider. If our optional Upstash Redis
              cache is configured, a successful result, which can include the username, account ID,
              and display name, may be cached for up to six hours to avoid repeating the same
              lookup. This is temporary service caching, not a user account or a permanent profile.
              We do not sell submitted usernames or check results.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Analytics and cookies</h2>
            <p>
              We use Vercel Analytics and Google Analytics to understand general site usage and
              improve reliability. These analytics providers may process technical information
              such as page visits, device or browser details, and approximate usage data. We do not
              use advertising cookies. For details and browser controls, read our{" "}
              <Link className="font-semibold text-violet-700 underline" href="/cookies">Cookie Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Your choices and rights</h2>
            <p>
              You can use the site without submitting a username and without creating an account.
              We aim to handle information in line with applicable privacy laws, including the
              GDPR. Depending on your location, you may have rights to request access to, correction
              of, or deletion of personal information. Contact us and we will review requests under
              the law that applies to you. We do not intentionally collect information about
              children.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Contact</h2>
            <p>
              When you use our instagram shadowban checker resources or request a check, the same
              privacy principles apply: no login is required and we do not sell your submitted
              username. The live checker currently supports X/Twitter only. Questions about this
              policy or an applicable privacy request can be sent to{" "}
              <a className="font-semibold text-violet-700 underline" href="mailto:support@shadowbannchecker.vercel.app">
                support@shadowbannchecker.vercel.app
              </a>.
            </p>
            <p className="mt-4">
              Return to the <Link className="font-semibold text-violet-700 underline" href="/">shadowban checker</Link>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}