"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import SupportPopup from "./SupportPopup";

type TikTokResult = {
  username: string;
  exists: boolean;
  scraped: boolean;
  isPrivate?: boolean;
  followerCount?: string;
  bio?: string;
  avatar?: string;
  riskSignals: string[];
  message: string;
};

const hashtagsToReview = [
  "followforfollow",
  "likeforlike",
  "followtrain",
  "f4f",
  "l4l",
  "tagsforlikes",
];

function findHashtagSignals(value: string): string[] {
  const tags = value
    .split(/[\s,]+/)
    .map((tag) => tag.trim().toLowerCase().replace(/^#+/, ""))
    .filter(Boolean);
  const matches = [...new Set(tags.filter((tag) => hashtagsToReview.includes(tag)))];

  return matches.length
    ? [`Engagement-bait hashtags to review: ${matches.map((tag) => `#${tag}`).join(", ")}.`]
    : [];
}

export default function TikTokChecker() {
  const [username, setUsername] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [result, setResult] = useState<TikTokResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setShowSupportPopup(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/tiktok-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, ...(videoUrl.trim() ? { videoUrl: videoUrl.trim() } : {}) }),
      });
      const data = (await response.json()) as TikTokResult;

      if (response.status === 429) {
        setError(data.message || "TikTok is rate-limiting checks. Please try again later.");
      } else if (response.status === 404 || (response.ok && data.exists === false)) {
        setResult(data);
      } else if (!response.ok) {
        setError(data.message || "The check could not be completed. Please try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("The check could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const hashtagSignals = findHashtagSignals(hashtagInput);

  return (
    <section aria-label="TikTok profile check" className="mx-auto mt-8 max-w-3xl">
      <form onSubmit={handleSubmit} className="rounded-md border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="tiktok-username" className="mb-2 block text-sm font-semibold text-stone-700">
              TikTok username <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center border-b border-stone-300 pb-2">
              <span aria-hidden="true" className="mr-2 text-xl font-bold text-violet-600">@</span>
              <input
                id="tiktok-username"
                name="username"
                autoComplete="username"
                required
                maxLength={24}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="username"
                className="min-w-0 flex-1 bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400"
              />
            </div>
          </div>
          <div>
            <label htmlFor="tiktok-video" className="mb-2 block text-sm font-semibold text-stone-700">
              Video URL <span className="font-normal text-stone-500">(optional)</span>
            </label>
            <input
              id="tiktok-video"
              name="videoUrl"
              type="url"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="https://www.tiktok.com/@name/video/..."
              className="w-full rounded-md border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
            />
          </div>
        </div>
        <div className="mt-5">
          <label htmlFor="tiktok-hashtags" className="mb-2 block text-sm font-semibold text-stone-700">
            Recent hashtags <span className="font-normal text-stone-500">(optional)</span>
          </label>
          <textarea
            id="tiktok-hashtags"
            value={hashtagInput}
            onChange={(event) => setHashtagInput(event.target.value)}
            rows={2}
            placeholder="#topic #fyp"
            className="w-full resize-y rounded-md border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
          />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="rounded-full bg-violet-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Checking TikTok..." : "Check TikTok Shadowban"}
          </button>
          <span className="text-xs text-stone-500">No password or login required</span>
        </div>
      </form>

      {error && (
        <div role="alert" className="mt-5 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          {error}
        </div>
      )}

      {result && !result.exists && (
        <div role="alert" className="mt-5 rounded-md border border-red-300 bg-red-50 p-4 font-semibold text-red-800">
          This TikTok username doesn&apos;t appear to exist
        </div>
      )}

      {result?.exists && (
        <div aria-live="polite" className="mt-5 rounded-md border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center">
            {result.scraped && result.avatar && (
              <Image
                src={result.avatar}
                alt={`${result.username}'s TikTok profile`}
                width={64}
                height={64}
                unoptimized
                className="h-16 w-16 rounded-full border border-stone-200 object-cover"
              />
            )}
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-stone-900">@{result.username} appears to exist</h2>
              {result.scraped && result.followerCount && (
                <p className="mt-1 text-sm text-stone-600">{result.followerCount} followers shown publicly</p>
              )}
              {result.isPrivate && <p className="mt-1 text-sm text-stone-600">This account appears to be private.</p>}
              {result.scraped && result.bio && <p className="mt-2 break-words text-sm text-stone-700">{result.bio}</p>}
            </div>
          </div>

          {!result.scraped && (
            <p className="mt-5 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              The public profile appears to exist, but TikTok did not expose its details to this server. This does not indicate a shadowban.
            </p>
          )}

          <section className="mt-5">
            <h3 className="font-bold text-stone-900">Visibility risk signals</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-stone-700">
              {result.riskSignals.map((signal) => <li key={signal}>{signal}</li>)}
              {hashtagSignals.map((signal) => <li key={signal}>{signal}</li>)}
            </ul>
          </section>

          <section className="mt-6 border-t border-stone-200 pt-5">
            <h3 className="font-bold text-stone-900">If your videos get 0 views</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-stone-700">
              <li>Review TikTok account status and notices for Community Guidelines or recommendation-eligibility issues.</li>
              <li>Post original videos; reused clips, visible watermarks, or duplicate uploads may affect distribution.</li>
              <li>Avoid repetitive, unrelated, or engagement-bait hashtags. Hashtags alone cannot establish a restriction.</li>
            </ul>
          </section>

          <section className="mt-6 border-t border-stone-200 pt-5">
            <h3 className="font-bold text-stone-900">Recovery steps</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-stone-700">
              <li>Check TikTok&apos;s in-app account status and any content or recommendation notices.</li>
              <li>Remove or appeal content TikTok identifies, and use original videos with relevant hashtags.</li>
              <li>Give distribution time to settle and compare several posts; a single view count is not proof of a shadowban.</li>
            </ol>
          </section>
        </div>
      )}

      <section className="mt-6 rounded-md border border-stone-200 bg-white p-5 text-sm leading-6 text-stone-600">
        <h3 className="font-bold text-stone-800">Hashtags to review</h3>
        <p className="mt-2">
          Examples associated with engagement bait or spam include {hashtagsToReview.map((tag) => `#${tag}`).join(", ")}. TikTok does not publish a universal list of banned hashtags; policies and availability can change.
        </p>
      </section>
      <SupportPopup
        isOpen={showSupportPopup}
        onClose={() => setShowSupportPopup(false)}
        isChecking={loading}
      />
    </section>
  );
}