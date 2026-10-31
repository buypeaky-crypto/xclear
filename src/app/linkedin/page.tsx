
import type { Metadata } from "next";
import LinkedInVisibilityChecker from "@/app/components/LinkedInVisibilityChecker";
import AdBelowChecker from "@/components/AdBelowChecker";

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
    <div className="min-h-screen bg-[#FFFBF0] px-4 pb-20 text-stone-900">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-4xl py-12 text-center sm:py-16">
          <p className="inline-flex rounded-full border border-stone-300 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-600">
            LINKEDIN PROFILE REVIEW
          </p>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            LinkedIn Profile Visibility Checker
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            Review your LinkedIn public profile settings, validate
            your profile URL, and investigate what visitors may
            be able to see. No LinkedIn password or login required.
          </p>
        </header>

        <div className="mx-auto max-w-3xl">
          <LinkedInVisibilityChecker />

          <div className="mt-8">
            <AdBelowChecker />
          </div>
        </div>

        <section className="mx-auto mt-14 max-w-3xl rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
          <h2 className="text-xl font-bold">
            How this LinkedIn checker works
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-stone-600">
            <p>
              The tool validates the format of a LinkedIn personal
              profile URL in your browser and provides a manual
              checklist for reviewing public visibility settings.
            </p>

            <p>
              It does not scrape LinkedIn, access private profile
              information, query LinkedIn search rankings, or
              determine whether LinkedIn has restricted an account.
            </p>

            <p>
              A completed checklist does not guarantee that your
              profile will appear in external search engines,
              LinkedIn search results, or recommendations.
              Always check LinkedIn's own account settings and
              notices for authoritative information.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
