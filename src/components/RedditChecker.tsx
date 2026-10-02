"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Fraunces } from "next/font/google";
import DonationButtons from "./DonationButtons";
import SupportUsButton from "./SupportUsButton";
import BrandHomeLink from "./BrandHomeLink";
import SupportPopup from "./SupportPopup";
import ChecklistRow, { type ChecklistState } from "./ChecklistRow";
import { redditFaqs } from "../lib/i18n/reddit";
import PlatformSwitcher from "./PlatformSwitcher";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

type RedditResult = {
  status: "visible" | "shadowbanned" | "suspended" | "not_found" | "unavailable";
  exists: boolean;
  isShadowbanned: boolean;
  isSuspended: boolean;
  isVisible: boolean;
  karma?: number;
  created?: number;
  linkKarma?: number;
  commentKarma?: number;
  scraped: boolean;
  riskSignals: string[];
  error?: string;
  message?: string;
  reason?: string;
  manualCheckUrl?: string;
};

function accountAge(created: number): string {
  const ageInMonths = Math.max(0, Math.floor((Date.now() / 1000 - created) / (30.4375 * 86400)));
  if (ageInMonths < 1) return "less than a month";
  if (ageInMonths < 12) return `${ageInMonths} ${ageInMonths === 1 ? "month" : "months"}`;
  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;
  return `${years} ${years === 1 ? "year" : "years"}${months ? `, ${months} ${months === 1 ? "month" : "months"}` : ""}`;
}

export default function RedditChecker({
  initialUsername = "",
  autoCheck = false,
}: {
  initialUsername?: string;
  autoCheck?: boolean;
}) {
  const [username, setUsername] = useState(initialUsername);
  const [loading, setLoading] = useState(false);
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [result, setResult] = useState<RedditResult | null>(null);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!autoCheck) return;
    const timer = window.setTimeout(() => formRef.current?.requestSubmit(), 0);
    return () => window.clearTimeout(timer);
  }, [autoCheck]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setShowSupportPopup(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/reddit-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = (await response.json()) as RedditResult;
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Reddit could not complete the check. Try again later.");
      }
    } catch {
      setError("The check could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const notFound = result?.status === "not_found";
  const unavailable = result?.status === "unavailable";
  const existenceState: ChecklistState = result?.exists ? "pass" : notFound ? "fail" : "risk";
  const reachabilityState: ChecklistState = unavailable
    ? "risk"
    : result?.status === "visible"
      ? "pass"
      : result?.status === "not_found"
        ? "fail"
        : "risk";
  const shadowbanState: ChecklistState = result?.status === "visible"
    ? "pass"
    : result?.status === "shadowbanned"
      ? "risk"
      : result?.status === "unavailable"
        ? "risk"
        : "fail";
  const suspensionState: ChecklistState = result?.status === "suspended"
    ? "fail"
    : result?.status === "unavailable"
      ? "risk"
      : "pass";
  const accountDataAvailable = result?.created !== undefined || result?.karma !== undefined;

  return (
    <main className="min-h-screen bg-platform-reddit px-4 py-10 text-stone-900 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          <BrandHomeLink />
          <h1 className={`${fraunces.className} mt-4 text-4xl font-black italic leading-tight text-stone-900 sm:text-5xl`}>
            Reddit Shadowban Checker
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Check whether a Reddit profile is publicly reachable while logged out. No login, API key, or password required.
          </p>
          <PlatformSwitcher activePlatform="reddit" />
          <SupportUsButton />
        </header>

        <section className="mx-auto mt-8 max-w-3xl border-y border-stone-300 py-6 text-sm leading-7 text-stone-700">
          <h2 className="text-xl font-bold text-stone-900">Reddit Shadowban Checks: Profile Visibility, Comments, and Appeals</h2>
          <div className="mt-4 space-y-4">
            <p>
              A Reddit shadowban usually means that an account or its contributions are not visible to other people, even though the account owner can still see them. Reddit does not provide a simple public shadowban label that a third-party tool can verify in every case. A profile that fails to load while logged out can be a useful signal, but deleted accounts, suspensions, network blocks, and temporary Reddit errors can produce similar results. Low karma or a removed post alone does not establish an account restriction.
            </p>
            <p>
              This Reddit shadowban checker tests whether a public profile endpoint responds to a logged-out request and reviews any account details Reddit makes public. It cannot see private moderation notes, guarantee that every comment is indexed, or decide why content was removed. Treat an unavailable response as inconclusive, and compare the profile and recent comments in a private browser window before drawing conclusions. Do not share your Reddit password or authorization token with a checker.
            </p>
            <p>
              If your Reddit visibility appears limited, check account notices and review Reddit&apos;s rules and spam guidance. Look for messages from moderators, distinguish a community ban from a site-wide account action, and use the official appeal process when an account restriction appears mistaken. A community may remove a post without limiting your whole profile, while automated spam controls can delay or filter content. This public check is a starting point for investigation, not an official diagnosis or a substitute for Reddit&apos;s own account and appeal tools.
            </p>
            <p>
              For a useful comparison, check both the profile and a few recent comments while logged out, then repeat later if Reddit is returning errors. Keep links to account notices and moderation messages for an appeal, but do not repost removed material simply to test its visibility. Separate community-level moderation from site-wide access signals before choosing what to do next.
            </p>
          </div>
        </section>

        <section aria-label="Reddit account visibility check" className="mx-auto mt-8 max-w-2xl">
          <form ref={formRef} onSubmit={handleSubmit} className="rounded-md border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <label htmlFor="reddit-username" className="mb-2 block text-sm font-semibold text-stone-700">
              Reddit username
            </label>
            <div className="flex items-center border-b border-stone-300 pb-2">
              <span aria-hidden="true" className="mr-2 text-lg font-bold text-violet-600">u/</span>
              <input
                id="reddit-username"
                autoComplete="username"
                required
                maxLength={20}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter Reddit username"
                className="min-w-0 flex-1 bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400"
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="submit"
                disabled={loading || !username.trim()}
                className="rounded-full bg-violet-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Checking Reddit..." : "Check Reddit Shadowban"}
              </button>
              <span className="text-xs text-stone-500">Logged-out public check only</span>
            </div>
          </form>

          {error && (
            <div role="alert" className="mt-5 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              {error}
            </div>
          )}

          {result && (
            <section aria-live="polite" className="mt-5 rounded-md border border-amber-200 bg-[#fdf6e3] p-5 shadow-sm sm:p-7">
              <h2 className="text-xl font-bold text-stone-900">Reddit visibility checklist</h2>
              {unavailable && (
                <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                  <p className="font-semibold">⚠️ Reddit blocked automated check from Vercel</p>
                  <p className="mt-1">{result.reason ?? result.message}</p>
                </div>
              )}
              {notFound && <p className="mt-3 text-sm font-semibold text-red-700">Username doesn&apos;t exist</p>}
              <ul className="mt-3 divide-y divide-stone-200">
                <ChecklistRow
                  id="reddit-exists"
                  state={existenceState}
                  label={result.exists ? `u/${username} exists` : notFound ? `u/${username} doesn’t exist` : `Could not confirm u/${username} exists`}
                  explanation="This row reflects the response from a logged-out Reddit profile endpoint. A blocked request does not establish whether the account exists."
                />
                <ChecklistRow
                  id="reddit-public"
                  state={reachabilityState}
                  label={unavailable ? "Reddit blocked automated check from Vercel" : result.isVisible ? "Publicly reachable logged-out (200); search suggestion ban not tested" : notFound ? "Username not found" : "Not publicly reachable logged-out (404)"}
                  explanation="We fetch the profile as a logged-out visitor. A 200 means the profile endpoint is visible; this does not test search suggestions. A 404 means it is not reachable logged-out, but can also occur for deleted or unavailable accounts."
                >
                  {unavailable && result.manualCheckUrl && (
                    <a href={result.manualCheckUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-black">
                      Open manual check
                    </a>
                  )}
                </ChecklistRow>
                <ChecklistRow
                  id="reddit-shadowban"
                  state={shadowbanState}
                  label={result.isShadowbanned ? "Not publicly reachable — possible shadowban" : result.status === "unavailable" ? "Shadowban status unavailable" : "No shadowban signal from this check"}
                  explanation="If old.reddit.com/user/name returns 404 while logged out but the profile is visible when signed in, it may indicate a visibility restriction. A 404 alone cannot prove a shadowban."
                />
                <ChecklistRow
                  id="reddit-suspension"
                  state={suspensionState}
                  label={result.isSuspended ? "Suspension identified" : result.status === "unavailable" ? "Suspension status unavailable" : "No suspension identified"}
                  explanation="A suspension is shown only when Reddit returns a response that specifically identifies the account as suspended."
                />
                <ChecklistRow
                  id="reddit-account-data"
                  state={accountDataAvailable ? "pass" : unavailable ? "risk" : "neutral"}
                  label={accountDataAvailable ? "Account age and karma available" : "Account age and karma not available"}
                  explanation="These values come from Reddit's public about endpoint when it returns profile data."
                >
                  <dl className="mt-3 grid gap-1 sm:grid-cols-2">
                    {result.created !== undefined && <><dt>Created (UTC)</dt><dd>{new Date(result.created * 1000).toISOString()}</dd></>}
                    {result.linkKarma !== undefined && <><dt>Link karma</dt><dd>{result.linkKarma.toLocaleString()}</dd></>}
                    {result.commentKarma !== undefined && <><dt>Comment karma</dt><dd>{result.commentKarma.toLocaleString()}</dd></>}
                    {result.karma !== undefined && <><dt>Total karma</dt><dd>{result.karma.toLocaleString()}</dd></>}
                  </dl>
                  {result.created !== undefined && <p className="mt-2">Account age: {accountAge(result.created)}</p>}
                </ChecklistRow>
              </ul>
              {result.riskSignals.length > 0 && (
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-stone-600">
                  {result.riskSignals.map((signal) => <li key={signal}>{signal}</li>)}
                </ul>
              )}
            </section>
          )}
        </section>

        <DonationButtons />

        <section aria-labelledby="reddit-educator-title" className="mx-auto mt-10 max-w-3xl border-t border-stone-300 pt-8">
          <h2 id="reddit-educator-title" className="text-2xl font-bold">Understand Reddit visibility</h2>
          <div className="mt-5 space-y-6 text-sm leading-6 text-stone-700">
            <article>
              <h3 className="font-bold text-stone-900">What is a Reddit shadowban?</h3>
              <p className="mt-1">It is a common name for an account visibility restriction where posts or comments may not appear to other users. A logged-out profile check is a signal, not an official decision from Reddit.</p>
            </article>
            <article>
              <h3 className="font-bold text-stone-900">Why can it happen?</h3>
              <p className="mt-1">Reddit may limit accounts for suspected spam, vote manipulation, ban evasion, or other policy issues. A single removed post or low karma does not establish that your account is restricted.</p>
            </article>
            <article>
              <h3 className="font-bold text-stone-900">How long does it last?</h3>
              <p className="mt-1">There is no standard duration. Restrictions depend on the account and the issue; review Reddit&apos;s account notices and appeal response for current information.</p>
            </article>
            <article>
              <h3 className="font-bold text-stone-900">How do I appeal?</h3>
              <p className="mt-1">Use Reddit&apos;s <a className="font-semibold text-violet-700 underline" href="https://www.reddit.com/appeal" target="_blank" rel="noopener noreferrer">official appeal form</a>. Explain the situation and include relevant context. Never provide your password to a checker.</p>
            </article>
            <article>
              <h3 className="font-bold text-stone-900">How can I check manually?</h3>
              <p className="mt-1">Open your profile and recent comments in a private window while logged out. Compare the results on <a className="font-semibold text-violet-700 underline" href="https://old.reddit.com" target="_blank" rel="noopener noreferrer">old.reddit.com</a>. Deleted accounts, removed content, and community moderation can look similar, so a 404 is not proof by itself.</p>
            </article>
            <article>
              <h3 className="font-bold text-stone-900">What about r/ShadowBan?</h3>
              <p className="mt-1">Visit <a className="font-semibold text-violet-700 underline" href="https://www.reddit.com/r/ShadowBan/" target="_blank" rel="noopener noreferrer">r/ShadowBan</a> and follow its current posting instructions to request a community-level check of recent comments.</p>
            </article>
          </div>
        </section>

        <section aria-labelledby="reddit-faq-title" className="mx-auto mt-10 max-w-3xl border-t border-stone-300 pt-8">
          <h2 id="reddit-faq-title" className="text-2xl font-bold">Reddit shadowban FAQs</h2>
          <div className="mt-5 divide-y divide-stone-200">
            {redditFaqs.map((faq) => (
              <details key={faq.question} className="py-4">
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-3 text-sm leading-6 text-stone-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <SupportPopup
          isOpen={showSupportPopup}
          onClose={() => setShowSupportPopup(false)}
          isChecking={loading}
        />
      </div>
    </main>
  );
}