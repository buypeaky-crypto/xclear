"use client";

import { useState, type FormEvent } from "react";
import type { YouTubeLocale } from "../lib/i18n/youtube";
import { youtubeCopies } from "../lib/i18n/youtube";
import SupportPopup from "./SupportPopup";

type YouTubeCheck = { id: string; label: string; passed: boolean; explanation: string };
type YouTubeResult = { channel: string; score: number; checks: YouTubeCheck[] };

export default function YouTubeChecker({ locale }: { locale: YouTubeLocale }) {
  const copy = youtubeCopies[locale];
  const [input, setInput] = useState("");
  const [result, setResult] = useState<YouTubeResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSupportPopup, setShowSupportPopup] = useState(false);

  async function checkChannel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setShowSupportPopup(true);

    try {
      const response = await fetch("/api/youtube-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await response.json() as YouTubeResult & { error?: string };
      if (!response.ok) throw new Error(data.error || "The channel could not be checked.");
      setResult(data);
    } catch (checkError) {
      setError(checkError instanceof Error ? checkError.message : "The channel could not be checked.");
    } finally {
      setLoading(false);
    }
  }

  const allPassed = Boolean(result?.checks.every((check) => check.passed));
  const isGood = (result?.score ?? 0) >= 80;

  return (
    <>
      <section aria-label="YouTube channel check" className="mx-auto mt-10 max-w-3xl rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
        <form onSubmit={checkChannel}>
          <label htmlFor="youtube-channel" className="mb-2 block text-sm font-semibold text-stone-700">{copy.inputLabel}</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="youtube-channel"
              type="text"
              required
              maxLength={2000}
              autoComplete="url"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={copy.inputPlaceholder}
              className="min-w-0 flex-1 rounded-md border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-800 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? copy.loadingLabel : copy.buttonLabel}
            </button>
          </div>
          {error && <p role="alert" className="mt-4 text-sm font-medium text-red-700">{error}</p>}
        </form>
      </section>

      {result && (
        <section aria-live="polite" className="mx-auto mt-8 max-w-3xl rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <h2 className="text-xl font-bold text-stone-900">{copy.resultTitle} {result.channel}</h2>
              <p className="mt-2 text-sm text-stone-600">{copy.resultNote}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${isGood ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                {isGood ? copy.goodLabel : copy.reviewLabel}
              </span>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${allPassed ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-700"}`}>
                {allPassed ? copy.healthyLabel : copy.suggestedLabel}
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-baseline gap-2">
            <strong className="text-4xl font-black tabular-nums text-stone-900">{result.score}</strong>
            <span className="text-sm text-stone-600">/ 100 · {copy.scoreLabel}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100" role="meter" aria-label={copy.scoreLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={result.score}>
            <div className={`h-full rounded-full transition-[width] ${isGood ? "bg-emerald-600" : "bg-amber-500"}`} style={{ width: `${result.score}%` }} />
          </div>

          <ul className="mt-6 divide-y divide-stone-200">
            {result.checks.map((check) => (
              <li key={check.id}>
                <details className="group py-3">
                  <summary className="flex cursor-pointer list-none items-center gap-3 font-semibold text-stone-800 marker:content-none">
                    <span aria-hidden="true" className={`grid size-6 shrink-0 place-items-center rounded-full text-sm ${check.passed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                      {check.passed ? "✓" : "!"}
                    </span>
                    <span className="flex-1">{check.label}</span>
                    <span aria-hidden="true" className="text-stone-400 transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <p className="ml-9 mt-2 text-sm leading-6 text-stone-600">{check.explanation}</p>
                </details>
              </li>
            ))}
          </ul>

          <div className="mt-7 border-t border-stone-200 pt-5">
            <h3 className="font-bold text-stone-900">{copy.fixTitle}</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-stone-700">
              {copy.fixSteps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </div>
        </section>
      )}
      <SupportPopup isOpen={showSupportPopup} onClose={() => setShowSupportPopup(false)} isChecking={loading} />
    </>
  );
}