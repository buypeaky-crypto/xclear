import type { Metadata } from "next";
import Link from "next/link";
import { baseUrl, getEnglishLanguageAlternates } from "../../lib/i18n/config";

export const metadata: Metadata = {
  title: "Terms of Service | ShadowbanChecker Rules",
  description: "Terms for using ShadowbannChecker's public social-profile visibility checks.",
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
          <p className="mt-4 text-sm text-stone-500">Last updated: October 3, 2026</p>
        </header>

        <div className="space-y-8 text-[15px] leading-7 text-stone-700">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Using the checker</h2>
            <p>
              ShadowbannChecker provides heuristic checks of public social-profile visibility
              signals. Results may be incomplete, unavailable, or wrong; an unknown or clear result
              is not proof of account status, reach, or recommendation eligibility. The checker is
              not an official service of X, Instagram, Facebook, TikTok, YouTube/Google, or Reddit.
              X announced additional transparency information on August 14, 2026; platform tools
              and interfaces may change, so consult X&apos;s current account controls for authoritative
                information.
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
              Use the checker at your own risk. It is provided free of charge and “as is,” without a guarantee that it will
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
              Visit the <Link className="font-semibold text-violet-700 underline" href="/">shadowban checker</Link>, read the <Link className="font-semibold text-violet-700 underline" href="/imprint">Imprint</Link>, or contact{" "}
              <a className="font-semibold text-violet-700 underline" href="mailto:contact@shadowbannchecker.vercel.app">us</a> with questions.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}