import type { Metadata } from "next";
import Link from "next/link";
import { baseUrl, getEnglishLanguageAlternates } from "../../lib/i18n/config";

export const metadata: Metadata = {
  title: "Imprint | ShadowbannChecker",
  description: "Provider information and contact details for ShadowbannChecker.",
  alternates: {
    canonical: `${baseUrl}/imprint`,
    languages: getEnglishLanguageAlternates("/imprint"),
  },
};

export default function ImprintPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12 text-stone-900 sm:py-16">
      <article className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase text-blue-700">ShadowbannChecker</p>
          <h1 className="text-4xl font-black">Impressum</h1>
          <p className="mt-4 text-sm text-stone-500">Angaben nach § 5 DDG (vormals § 5 TMG)</p>
        </header>

        <div className="space-y-7 text-[15px] leading-7 text-stone-700">
          <section>
            <h2 className="mb-2 text-xl font-bold text-stone-900">Diensteanbieter</h2>
            <p>Aljannah TV<br />Vertreten durch Freeman Dunhill</p>
            <p className="mt-3 font-semibold text-red-800">
              Vollständige ladungsfähige Anschrift vor Veröffentlichung ergänzen:
              <br />[Straße, Hausnummer, Postleitzahl, Ort, Land]
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-stone-900">Kontakt</h2>
            <p>
              E-Mail: <a className="text-blue-700 underline" href="mailto:contact@shadowbannchecker.vercel.app">contact@shadowbannchecker.vercel.app</a>
              <br />X: <a className="text-blue-700 underline" href="https://x.com/gutnews247" target="_blank" rel="noreferrer">@gutnews247</a>
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-stone-900">Haftung und Marken</h2>
            <p>
              ShadowbannChecker ist ein unabhängiges Informationsangebot und steht in keiner
              Verbindung zu X, Meta, TikTok, Google/YouTube oder Reddit. Die jeweiligen Namen und
              Marken gehören ihren Inhabern. Die Prüfergebnisse sind unverbindliche technische
              Hinweise und keine Aussage der genannten Plattformen.
            </p>
          </section>

          <p>
            Hinweis: Die Anschrift und die Kontaktangaben müssen vom Betreiber geprüft und
            vervollständigt werden. Diese Seite ersetzt keine rechtliche Prüfung. Zurück zum{" "}
            <Link className="font-semibold text-blue-700 underline" href="/">Checker</Link>.
          </p>
        </div>
      </article>
    </main>
  );
}