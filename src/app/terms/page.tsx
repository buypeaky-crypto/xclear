import type { Metadata } from "next";
import Link from "next/link";
import { baseUrl, getEnglishLanguageAlternates } from "../../lib/i18n/config";

export const metadata: Metadata = {
  title: "Terms of Service | ShadowbannChecker Rules",
  description:
    "Read the terms for using ShadowbannChecker’s free public-profile and hashtag visibility tools.",
  keywords: ["shadowban checker terms", "instagram shadowban test terms"],
  alternates: {
    canonical: `${baseUrl}/terms`,
    languages: getEnglishLanguageAlternates("/terms"),
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FFFBEB] px-4 py-12 text-stone-900 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase text-violet-700">ShadowbannChecker</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-sm text-stone-500">Last updated: October 1, 2026</p>
        </header>

        <div className="space-y-8 text-[15px] leading-7 text-stone-700">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Using the checker</h2>
            <p>
              ShadowbannChecker is a free informational tool intended to help people check whether
              their own public social-media profile may have visibility or account-status issues.
              The live check currently looks up public X/Twitter profile information. It does not
              require a login, and it is not an official service of X, Instagram, TikTok, or
              YouTube.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Fair use</h2>
            <p>
              Use the tool lawfully, reasonably, and only for legitimate informational purposes.
              Do not overload, scrape, disrupt, probe, or attempt to bypass limits on this site or
              third-party services. Do not use results to harass, threaten, impersonate, or target
              another person. Automated or abusive use may be rate-limited or blocked to protect
              the service and its providers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">No guarantee</h2>
            <p>
              The checker is provided free of charge and “as is,” without a guarantee that it will
              be available, complete, current, or accurate. Social platforms change their systems
              and access rules, and a public profile lookup cannot prove that an account is or is
              not shadowbanned. Results are informational only; confirm account issues through the
              relevant platform and do not rely on this tool for business, legal, or other
              consequential decisions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Availability and changes</h2>
            <p>
              We may modify, limit, or discontinue any part of the free service, and we may block
              access when needed to address abuse or protect the service. These terms may also
              change; continued use after an update means you accept the revised terms to the
              extent permitted by law.
            </p>
            <p className="mt-4">
              Visit the <Link className="font-semibold text-violet-700 underline" href="/">shadowban checker</Link> or contact{" "}
              <a className="font-semibold text-violet-700 underline" href="mailto:support@shadowbannchecker.vercel.app">support</a> with questions.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}