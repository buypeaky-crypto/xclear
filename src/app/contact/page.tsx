import type { Metadata } from "next";
import Link from "next/link";
import { baseUrl, getEnglishLanguageAlternates } from "../../lib/i18n/config";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | ShadowbannChecker Support",
  description:
    "Contact the ShadowbannChecker team for help with checker results, privacy questions, or bug reports.",
  keywords: [
    "contact shadowban checker",
    "instagram shadowban test help",
    "tiktok shadowban checker support",
  ],
  alternates: {
    canonical: `${baseUrl}/contact`,
    languages: getEnglishLanguageAlternates("/contact"),
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FFFBEB] px-4 py-12 text-stone-900 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase text-violet-700">We’re here to help</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-7 text-stone-600">
            Have questions about your Instagram shadowban check results? Contact us.
          </p>
        </header>

        <div className="grid gap-10 md:grid-cols-[1fr_0.8fr]">
          <section aria-labelledby="contact-form-title">
            <h2 className="mb-5 text-2xl font-bold text-stone-900" id="contact-form-title">
              Send a message
            </h2>
            <p className="mb-5 text-sm leading-6 text-stone-600">
              This form is a frontend demo and does not deliver messages. For support, use the email below.
            </p>
            <ContactForm />
          </section>

          <aside className="border-t border-stone-200 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <h2 className="mb-4 text-2xl font-bold text-stone-900">Support</h2>
            <p className="mb-3 text-[15px] leading-7 text-stone-700">
              For help with a check, questions about privacy, or a bug report, email us:
            </p>
            <a
              className="font-semibold text-violet-700 underline"
              href="mailto:support@shadowbannchecker.vercel.app"
            >
              support@shadowbannchecker.vercel.app
            </a>
            <p className="mt-6 text-[15px] leading-7 text-stone-700">
              You can also reach us on{" "}
              <a
                className="font-semibold text-violet-700 underline"
                href="https://x.com/shadowban_eu"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter/X
              </a>.
            </p>
            <p className="mt-6 text-[15px] leading-7 text-stone-700">
              Return to the <Link className="font-semibold text-violet-700 underline" href="/">shadowban checker</Link>.
            </p>
          </aside>
        </div>
      </article>
    </main>
  );
}