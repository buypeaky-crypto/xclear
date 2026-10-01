import type { Metadata } from "next";
import Link from "next/link";
import { baseUrl, getEnglishLanguageAlternates } from "../../lib/i18n/config";

export const metadata: Metadata = {
  title: "Cookie Policy | ShadowbannChecker",
  description:
    "Learn how ShadowbannChecker uses Vercel and Google Analytics technologies without advertising cookies.",
  keywords: ["shadowban checker cookie policy", "shadowban test privacy"],
  alternates: {
    canonical: `${baseUrl}/cookies`,
    languages: getEnglishLanguageAlternates("/cookies"),
  },
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#FFFBEB] px-4 py-12 text-stone-900 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase text-violet-700">ShadowbannChecker</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Cookie Policy</h1>
          <p className="mt-4 text-sm text-stone-500">Last updated: October 1, 2026</p>
        </header>

        <div className="space-y-8 text-[15px] leading-7 text-stone-700">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Cookies and analytics</h2>
            <p>
              ShadowbannChecker does not require cookies for an account, login, or saved checker
              preferences. We use Vercel Analytics and Google Analytics to understand site usage
              and maintain the service. Those providers may use cookies or similar technologies
              for analytics, depending on their configuration and your browser settings. We do not
              use advertising cookies or sell information collected through cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Managing cookies</h2>
            <p>
              You can review, block, or delete cookies in your browser’s privacy or site settings.
              Blocking analytics cookies may limit analytics measurement, but the basic site and
              public-profile checker are intended to remain usable. Browser controls differ by
              browser and device; consult the relevant browser help for instructions. You can also
              use available browser privacy controls to limit third-party analytics requests.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">More information</h2>
            <p>
              For information about usernames submitted to the checker and temporary caching, read
              our <Link className="font-semibold text-violet-700 underline" href="/privacy">Privacy Policy</Link>. To return to the{" "}
              <Link className="font-semibold text-violet-700 underline" href="/">shadowban checker</Link>, visit the home page.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}