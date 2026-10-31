
import type { Metadata } from "next";

import LinkedInVisibilityChecker from "@/app/components/LinkedInVisibilityChecker";
import AdBelowChecker from "@/components/AdBelowChecker";
import BrandHomeLink from "@/components/BrandHomeLink";
import PlatformSwitcher from "@/components/PlatformSwitcher";
import SupportUsButton from "@/components/SupportUsButton";

const pageUrl = "https://shadowban.online/linkedin";

export const metadata: Metadata = {
  title: "LinkedIn Profile Visibility Checker",
  description:
    "Review LinkedIn public profile settings, validate your profile URL, and complete a manual visibility checklist. No LinkedIn password required.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: "website",
    url: pageUrl,
    siteName: "Shadowban.online",
    title: "LinkedIn Profile Visibility Checker",
    description:
      "Review LinkedIn public profile visibility and search discoverability with a guided manual checklist.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LinkedIn Profile Visibility Checker by Shadowban.online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Profile Visibility Checker",
    description:
      "Review LinkedIn public profile visibility with a guided manual checklist.",
    images: ["/og-image.png"],
  },
};

export default function LinkedInPage() {
  return (
    <main className="min-h-screen bg-[#f3f6f8] pb-20 text-[#1d2939]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="flex min-h-[76px] items-center justify-between gap-4 border-b border-[#dfe6ed]">
          <BrandHomeLink />

          <span className="hidden items-center gap-2 rounded-full border border-[#c8d9eb] bg-white px-3 py-1.5 text-xs font-semibold text-[#385d83] sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-[#0a66c2]" />
            Independent profile review
          </span>
        </header>

        {/* Hero */}
        <section className="mx-auto grid max-w-5xl items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#c8d9eb] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0a66c2]">
              <span className="grid h-5 w-5 place-items-center rounded-sm bg-[#0a66c2] text-[11px] font-black text-white">
                in
              </span>
              LINKEDIN PROFILE VISIBILITY
            </p>

            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.06] tracking-tight text-[#142b45] sm:text-5xl lg:text-6xl">
              LinkedIn Profile Visibility Checker
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#526579] sm:text-base">
              Review your LinkedIn public profile settings, validate your
              profile URL, and investigate what visitors may be able to see.
              Follow a guided checklist to review your visibility settings.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#d7e2ec] bg-white px-3 py-2 text-xs font-semibold text-[#526579]">
                No LinkedIn password
              </span>

              <span className="rounded-full border border-[#d7e2ec] bg-white px-3 py-2 text-xs font-semibold text-[#526579]">
                Local URL validation
              </span>

              <span className="rounded-full border border-[#d7e2ec] bg-white px-3 py-2 text-xs font-semibold text-[#526579]">
                Manual visibility checklist
              </span>
            </div>

            <a
              href="#linkedin-checker"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0a66c2] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(10,102,194,0.18)] transition hover:bg-[#004182] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2] focus-visible:ring-offset-2"
            >
              Check profile visibility
              <span aria-hidden="true" className="ml-2">
                ↓
              </span>
            </a>
          </div>

          {/* Hero information panel */}
          <aside className="relative overflow-hidden rounded-[26px] border border-[#cdddeb] bg-white p-5 shadow-[0_20px_55px_rgba(25,65,105,0.07)] sm:p-6">
            <div
              aria-hidden="true"
              className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-[#0a66c2]/10 blur-3xl"
            />

            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0a66c2]">
                    PROFILE REVIEW
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-[#142b45]">
                    What can you review?
                  </h2>
                </div>

                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#0a66c2] text-xl font-black text-white shadow-sm">
                  in
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex gap-3 border-b border-[#e8eef4] pb-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e8f2fc] text-xs font-black text-[#0a66c2]">
                    01
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-[#142b45]">
                      Profile URL validation
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#65788a]">
                      Check whether your personal LinkedIn profile URL
                      follows the supported format.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 border-b border-[#e8eef4] pb-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e8f2fc] text-xs font-black text-[#0a66c2]">
                    02
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-[#142b45]">
                      Public profile settings
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#65788a]">
                      Review which profile sections are available to
                      people outside LinkedIn.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e8f2fc] text-xs font-black text-[#0a66c2]">
                    03
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-[#142b45]">
                      Manual visibility review
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#65788a]">
                      Follow the checklist to examine your public
                      profile and external search visibility.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 border-t border-[#e8eef4] pt-4 text-xs leading-5 text-[#718296]">
                This tool does not access LinkedIn accounts, scrape
                profiles, or verify actual search rankings.
              </p>
            </div>
          </aside>
        </section>

        {/* Platform selector */}
        <div className="flex justify-center">
          <PlatformSwitcher activePlatform="linkedin" locale="en" />
        </div>

        {/* Main checker */}
        <section
          id="linkedin-checker"
          className="mx-auto mt-8 max-w-4xl scroll-mt-8"
          aria-label="LinkedIn profile visibility checker"
        >
          <div className="overflow-hidden rounded-[28px] border border-[#cdddeb] bg-white shadow-[0_20px_60px_rgba(25,65,105,0.07)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7eef5] bg-[#f7fbff] p-5 sm:p-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0a66c2]">
                  LINKEDIN VISIBILITY TOOL
                </p>

                <h2 className="mt-1 text-xl font-bold tracking-tight text-[#142b45]">
                  Review your public profile
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#65788a]">
                  Validate your URL and review your profile settings.
                </p>
              </div>

              <span className="rounded-full border border-[#c8d9eb] bg-white px-3 py-1.5 text-xs font-semibold text-[#385d83]">
                No account connection
              </span>
            </div>

            <div className="p-4 sm:p-7">
              <LinkedInVisibilityChecker />
            </div>
          </div>

          <div className="mt-5">
            <AdBelowChecker />
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto mt-16 max-w-5xl">
          <div className="mb-6 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0a66c2]">
              HOW IT WORKS
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#142b45] sm:text-3xl">
              How the LinkedIn visibility checker works
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#526579]">
              This tool combines local profile URL validation with a
              manual checklist. It helps you organize your review without
              requiring LinkedIn account access.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-[#d7e2ec] bg-white p-5 shadow-sm">
              <span className="text-xs font-black text-[#0a66c2]">
                01
              </span>

              <h3 className="mt-3 font-bold text-[#142b45]">
                Enter your profile URL
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#65788a]">
                Submit your personal LinkedIn profile URL. The tool
                checks its structure in your browser.
              </p>
            </article>

            <article className="rounded-2xl border border-[#d7e2ec] bg-white p-5 shadow-sm">
              <span className="text-xs font-black text-[#0a66c2]">
                02
              </span>

              <h3 className="mt-3 font-bold text-[#142b45]">
                Review visibility settings
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#65788a]">
                Check your public profile visibility and the individual
                sections that visitors may be able to see.
              </p>
            </article>

            <article className="rounded-2xl border border-[#d7e2ec] bg-white p-5 shadow-sm">
              <span className="text-xs font-black text-[#0a66c2]">
                03
              </span>

              <h3 className="mt-3 font-bold text-[#142b45]">
                Complete the checklist
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#65788a]">
                Mark each manual review step as completed and use
                LinkedIn's own settings for account-specific information.
              </p>
            </article>
          </div>
        </section>

        {/* Methodology and limitations */}
        <section className="mx-auto mt-16 max-w-5xl">
          <div className="mb-6 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0a66c2]">
              METHODOLOGY
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#142b45] sm:text-3xl">
              What this LinkedIn checker actually checks
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#526579]">
              The tool validates the format of a LinkedIn personal profile
              URL locally and provides a manual checklist for reviewing
              public visibility settings.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-[#d7e2ec] bg-white p-5 sm:p-6">
              <h3 className="font-bold text-[#142b45]">
                What the tool checks
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#65788a]">
                <li>Whether the submitted URL follows the supported LinkedIn personal profile format.</li>
                <li>Whether you have reviewed public profile visibility settings.</li>
                <li>Whether you have reviewed the visibility of selected profile sections.</li>
                <li>Whether you have manually checked the profile while signed out.</li>
                <li>Whether you have reviewed external search-engine visibility.</li>
              </ul>
            </article>

            <article className="rounded-2xl border border-[#d7e2ec] bg-white p-5 sm:p-6">
              <h3 className="font-bold text-[#142b45]">
                What the tool cannot check
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#65788a]">
                <li>Whether a LinkedIn profile actually exists or is accessible.</li>
                <li>LinkedIn search rankings or recommendation positions.</li>
                <li>Private profile information or account restrictions.</li>
                <li>Whether every profile section is indexed by search engines.</li>
                <li>Whether LinkedIn has applied a visibility limitation to an account.</li>
              </ul>
            </article>
          </div>

          <div className="mt-4 rounded-2xl border border-[#c8d9eb] bg-[#eaf4fc] p-5">
            <h3 className="font-bold text-[#164b78]">
              Important limitation
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#385d83]">
              A valid profile URL does not guarantee that a profile exists,
              is publicly accessible, or appears in LinkedIn search or
              external search engines. Completing the manual checklist
              also does not guarantee profile visibility.
            </p>
          </div>
        </section>

        {/* Recommended next steps */}
        <section className="mx-auto mt-12 max-w-5xl rounded-2xl border border-[#d7e2ec] bg-white p-5 sm:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0a66c2]">
            RECOMMENDED NEXT STEPS
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#142b45]">
            How to investigate LinkedIn profile visibility
          </h2>

          <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-[#526579]">
            <li>
              Open LinkedIn's public profile settings and review whether
              your public profile visibility is enabled.
            </li>

            <li>
              Review which profile sections you have chosen to make public.
            </li>

            <li>
              Open your public profile in a private or incognito browser
              window while signed out.
            </li>

            <li>
              Search for your name and profile URL using an external
              search engine. Search-engine updates can take time.
            </li>

            <li>
              Check LinkedIn's own account notifications and help
              documentation for account-specific information.
            </li>
          </ol>
        </section>

        {/* FAQs */}
        <section className="mx-auto mt-16 max-w-5xl">
          <div className="mb-6 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0a66c2]">
              QUESTIONS AND ANSWERS
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#142b45] sm:text-3xl">
              LinkedIn profile visibility FAQs
            </h2>
          </div>

          <div className="space-y-3">
            <details className="rounded-xl border border-[#d7e2ec] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#142b45]">
                Can this checker confirm a LinkedIn shadowban?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#65788a]">
                No. It validates a profile URL format and provides a manual
                visibility checklist. It does not access LinkedIn account
                information, search rankings, or enforcement decisions.
              </p>
            </details>

            <details className="rounded-xl border border-[#d7e2ec] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#142b45]">
                Does this tool access my LinkedIn account?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#65788a]">
                No. It does not connect to LinkedIn, request your password,
                or retrieve private profile information. URL validation
                takes place locally in your browser.
              </p>
            </details>

            <details className="rounded-xl border border-[#d7e2ec] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#142b45]">
                How can I check what visitors see on my LinkedIn profile?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#65788a]">
                Review your public profile settings and open your profile
                in a private browser window while signed out. The information
                shown to visitors depends on your LinkedIn visibility settings.
              </p>
            </details>

            <details className="rounded-xl border border-[#d7e2ec] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#142b45]">
                Why is my LinkedIn profile not appearing in Google?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#65788a]">
                External search engines control their own indexing and
                update schedules. Public profile settings, available
                information, and indexing delays may affect whether a
                profile appears in search results.
              </p>
            </details>

            <details className="rounded-xl border border-[#d7e2ec] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#142b45]">
                Does a valid LinkedIn profile URL mean my profile is public?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#65788a]">
                No. URL validation only confirms that the address follows
                the supported format. You must review the profile's actual
                visibility settings and test it while signed out.
              </p>
            </details>

            <details className="rounded-xl border border-[#d7e2ec] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#142b45]">
                Where can I review LinkedIn public profile settings?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#65788a]">
                Use LinkedIn's own settings and official Help Center.
                The available controls and options inside LinkedIn are
                the authoritative source for your account.
              </p>
            </details>
          </div>
        </section>

        {/* Official resources */}
        <section className="mx-auto mt-12 max-w-5xl rounded-2xl border border-[#cdddeb] bg-white p-5 sm:p-7">
          <h2 className="text-lg font-bold text-[#142b45]">
            Official LinkedIn resources
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#65788a]">
            Use LinkedIn's official help documentation for current
            instructions about public profile settings and account visibility.
          </p>

          <a
            href="https://www.linkedin.com/help/linkedin/answer/a518980"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center text-sm font-semibold text-[#0a66c2] underline decoration-[#9fc5e8] underline-offset-4 transition hover:text-[#004182]"
          >
            LinkedIn Help: Public profile visibility ↗
          </a>
        </section>

        {/* Independence notice */}
        <section className="mx-auto mt-8 max-w-5xl rounded-2xl border border-[#d7e2ec] bg-[#eaf4fc] p-5 text-center sm:p-6">
          <h2 className="font-bold text-[#164b78]">
            Independent tool, not an official LinkedIn service
          </h2>

          <p className="mx-auto mt-2 max-w-3xl text-sm leading-6 text-[#385d83]">
            Shadowban.online is independent and is not affiliated with,
            endorsed by, or operated by LinkedIn or Microsoft. LinkedIn
            names and trademarks are used only to identify the service
            being discussed.
          </p>
        </section>

        {/* Support */}
        <div className="mt-10 flex justify-center">
          <SupportUsButton />
        </div>
      </div>
    </main>
  );
}
