import type { Metadata } from "next";
import Link from "next/link";
import { baseUrl, getEnglishLanguageAlternates } from "../../lib/i18n/config";

export const metadata: Metadata = {
  title: "Privacy Policy | ShadowbannChecker",
  description: "How ShadowbannChecker processes submitted usernames, temporary cache data, analytics, and service logs.",
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
          <p className="mt-4 text-sm text-stone-500">Last updated: October 3, 2026</p>
        </header>

        <div className="space-y-8 text-[15px] leading-7 text-stone-700">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Controller and service</h2>
            <p>
              The proposed controller is Aljannah TV / Freeman Dunhill. The controller&apos;s full
                legal identity and postal address must be completed on the Imprint page before
              publication. Contact: contact@shadowbannchecker.vercel.app. The service does not
              require an account, password, or social-media login. A submitted public username or
              profile URL is sent to our server and, for a check, to the relevant platform or
              public lookup endpoint.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Checks, cache, and logs</h2>
            <p>
              A username is personal data when it identifies a person. The current shared checker
              caches results keyed by platform and username in Upstash Redis for up to one hour.
              Its abuse-prevention counter stores a SHA-256 hash derived from the request IP for up
              to 60 seconds. The X guest token is cached for one hour. These are temporary service
              operations; the site does not maintain a user watchlist or account history. Vercel
              and other infrastructure providers may process request metadata in their logs under
              their own retention settings. We cannot promise a 24-hour deletion period for those
              provider logs. We do not ask for passwords, private messages, access tokens, or
              verification codes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Analytics, pixels, and payments</h2>
            <p>
              The site loads Vercel Analytics and Google Analytics. If a public Facebook Pixel ID
              is configured, it also loads Meta Pixel and sends page-view events. These providers
              may process device, usage, and network information and may use cookies or similar
              technologies. Review provider settings and our{" "}
              <Link className="font-semibold text-violet-700 underline" href="/cookies">Cookie Policy</Link>.
              Donations may be handled by PayPal. BTC and ETH donations are recorded on public
              blockchains, where transaction data is visible to anyone. We do not operate an email
              alert subscription or retain submitted email addresses through this checker.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Your choices and rights</h2>
            <p>
              Depending on applicable law, including the GDPR where it applies, you may request
              access to, correction of, or deletion of personal data, or object to or restrict
              certain processing. Send a request to the contact below and identify the data and
              relevant date; we may need to verify the request. A request cannot erase information
              already held by a platform, payment provider, or infrastructure provider, but we
              will forward or address it as required by law. You can use the site without
              submitting a username.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Contact</h2>
            <p>
              Questions, privacy requests, or concerns can be sent to{" "}
              <a className="font-semibold text-violet-700 underline" href="mailto:contact@shadowbannchecker.vercel.app">
                contact@shadowbannchecker.vercel.app
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