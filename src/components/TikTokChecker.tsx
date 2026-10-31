
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

  const matches = [
    ...new Set(tags.filter((tag) => hashtagsToReview.includes(tag))),
  ];

  return matches.length
    ? [
        `Engagement-bait hashtags to review: ${matches
          .map((tag) => `#${tag}`)
          .join(", ")}.`,
      ]
    : [];
}

function isValidTikTokUsername(value: string): boolean {
  return /^[a-z0-9._]{2,24}$/i.test(value);
}

function isValidTikTokVideoUrl(value: string): boolean {
  if (!value) return true;

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      (url.hostname === "tiktok.com" ||
        url.hostname.endsWith(".tiktok.com"))
    );
  } catch {
    return false;
  }
}

export default function TikTokChecker() {
  const [username, setUsername] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [result, setResult] = useState<TikTokResult | null>(null);
  const [error, setError] = useState("");

  const hashtagSignals = findHashtagSignals(hashtagInput);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanUsername = username
      .trim()
      .replace(/^@+/, "")
      .toLowerCase();

    const cleanVideoUrl = videoUrl.trim();

    if (!isValidTikTokUsername(cleanUsername)) {
      setError(
        "Enter a TikTok username using 2–24 letters, numbers, periods, or underscores.",
      );
      setResult(null);
      return;
    }

    if (!isValidTikTokVideoUrl(cleanVideoUrl)) {
      setError("Enter a valid HTTPS video link from TikTok.");
      setResult(null);
      return;
    }

    setLoading(true);
    setShowSupportPopup(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/tiktok-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: cleanUsername,
          ...(cleanVideoUrl ? { videoUrl: cleanVideoUrl } : {}),
        }),
      });

      const rawData: unknown = await response.json();

      if (!rawData || typeof rawData !== "object") {
        throw new Error("The server returned an unexpected response.");
      }

      const data = rawData as Partial<TikTokResult>;

      const checkedResult: TikTokResult = {
        username:
          typeof data.username === "string"
            ? data.username
            : cleanUsername,
        exists: data.exists === true,
        scraped: data.scraped === true,
        isPrivate:
          typeof data.isPrivate === "boolean"
            ? data.isPrivate
            : undefined,
        followerCount:
          typeof data.followerCount === "string"
            ? data.followerCount
            : undefined,
        bio: typeof data.bio === "string" ? data.bio : undefined,
        avatar:
          typeof data.avatar === "string"
            ? data.avatar
            : undefined,
        riskSignals: Array.isArray(data.riskSignals)
          ? data.riskSignals.filter(
              (signal): signal is string =>
                typeof signal === "string",
            )
          : [],
        message:
          typeof data.message === "string"
            ? data.message
            : "The check returned no additional explanation.",
      };

      if (response.status === 429) {
        setError(
          checkedResult.message ||
            "TikTok is rate-limiting checks. Please try again later.",
        );
        return;
      }

      if (
        response.status === 404 ||
        (response.ok && checkedResult.exists === false)
      ) {
        setResult(checkedResult);
        return;
      }

      if (!response.ok) {
        setError(
          checkedResult.message ||
            "The check could not be completed. Please try again.",
        );
        return;
      }

      setResult(checkedResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The check could not reach the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const safeAvatar =
    result?.avatar && /^https:\/\//i.test(result.avatar)
      ? result.avatar
      : undefined;

  return (
    <section
      aria-label="TikTok profile visibility checker"
      aria-busy={loading}
      className="mx-auto mt-8 w-full max-w-5xl px-4 sm:px-6"
    >
      <div className="relative overflow-hidden rounded-[30px] border border-[#30303a] bg-[#101014] p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.20)] sm:p-7 lg:p-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#ff0050]/15 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#00f2ea]/10 blur-3xl"
        />

        <div className="relative">
          <header className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#191920] text-3xl font-black shadow-[4px_4px_0_#ff0050,-4px_-4px_0_#00f2ea]">
                ♪
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00f2ea]">
                  TikTok visibility studio
                </p>

                <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                  Public profile checker
                </h2>

                <p className="mt-1 text-xs text-[#a5a5b1]">
                  Investigate public profile availability
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#383842] bg-[#191920] px-3 py-2 text-[11px] font-semibold text-[#d1d1da]">
              <span className="h-2 w-2 rounded-full bg-[#00f2ea]" />
              No password required
            </span>
          </header>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00f2ea]">
                01 · Profile
              </span>
              <h3 className="mt-2 text-sm font-semibold">
                Public availability
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#a5a5b1]">
                Checks whether TikTok returns a public profile response.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff4b86]">
                02 · Video
              </span>
              <h3 className="mt-2 text-sm font-semibold">
                Optional video lookup
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#a5a5b1]">
                Checks whether TikTok recognizes a supplied public video URL.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c7a5ff]">
                03 · Hashtags
              </span>
              <h3 className="mt-2 text-sm font-semibold">
                Local text review
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#a5a5b1]">
                Highlights selected engagement-bait hashtag patterns.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
            <div className="rounded-2xl border border-[#353540] bg-[#191920] p-4 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold">
                    Start your TikTok check
                  </h3>
                  <p className="mt-1 text-xs text-[#a5a5b1]">
                    Enter a public username to begin.
                  </p>
                </div>

                <span className="rounded-full bg-[#00f2ea]/10 px-3 py-1 text-[10px] font-bold text-[#00f2ea]">
                  FREE CHECK
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="tiktok-username"
                    className="mb-2 block text-sm font-semibold text-[#e9e9ef]"
                  >
                    TikTok username
                    <span className="ml-1 text-[#ff4b86]">*</span>
                  </label>

                  <div className="flex h-12 items-center rounded-xl border border-[#41414d] bg-[#101014] px-3 transition focus-within:border-[#00f2ea] focus-within:ring-2 focus-within:ring-[#00f2ea]/15">
                    <span
                      aria-hidden="true"
                      className="mr-2 text-lg font-bold text-[#00f2ea]"
                    >
                      @
                    </span>

                    <input
                      id="tiktok-username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck={false}
                      required
                      maxLength={25}
                      value={username}
                      onChange={(event) =>
                        setUsername(event.target.value)
                      }
                      placeholder="yourusername"
                      className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#777783]"
                    />
                  </div>

                  <p className="mt-2 text-[11px] leading-5 text-[#92929e]">
                    Use 2–24 letters, numbers, periods, or underscores.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="tiktok-video"
                    className="mb-2 block text-sm font-semibold text-[#e9e9ef]"
                  >
                    Public video URL
                    <span className="ml-1 font-normal text-[#92929e]">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="tiktok-video"
                    name="videoUrl"
                    type="url"
                    value={videoUrl}
                    onChange={(event) =>
                      setVideoUrl(event.target.value)
                    }
                    placeholder="https://www.tiktok.com/@name/video/..."
                    className="h-12 w-full rounded-xl border border-[#41414d] bg-[#101014] px-3 text-sm text-white outline-none transition placeholder:text-[#777783] focus:border-[#ff4b86] focus:ring-2 focus:ring-[#ff4b86]/15"
                  />

                  <p className="mt-2 text-[11px] leading-5 text-[#92929e]">
                    Use a full HTTPS link from TikTok.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="tiktok-hashtags"
                  className="mb-2 block text-sm font-semibold text-[#e9e9ef]"
                >
                  Recent hashtags
                  <span className="ml-1 font-normal text-[#92929e]">
                    (optional local review)
                  </span>
                </label>

                <textarea
                  id="tiktok-hashtags"
                  value={hashtagInput}
                  onChange={(event) =>
                    setHashtagInput(event.target.value)
                  }
                  rows={3}
                  placeholder="#yourtopic #fyp #community"
                  className="w-full resize-y rounded-xl border border-[#41414d] bg-[#101014] px-3 py-3 text-sm text-white outline-none transition placeholder:text-[#777783] focus:border-[#c7a5ff] focus:ring-2 focus:ring-[#c7a5ff]/15"
                />

                <p className="mt-2 text-[11px] leading-5 text-[#92929e]">
                  Separate hashtags with spaces or commas. This text is
                  checked locally and is not sent to the profile lookup API.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={loading || !username.trim()}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#00f2ea] px-7 py-3 text-sm font-extrabold text-[#101014] shadow-[4px_4px_0_#ff0050] transition hover:bg-[#73fff8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f2ea] focus-visible:ring-offset-2 focus-visible:ring-offset-[#191920] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Checking TikTok…" : "Check TikTok profile"}
                </button>

                <span className="text-center text-[11px] text-[#92929e] sm:text-left">
                  No account login · No password · Public lookup only
                </span>
              </div>
            </div>
          </form>

          {hashtagSignals.length > 0 && (
            <div
              role="status"
              className="mt-5 rounded-2xl border border-[#8a5cc7]/40 bg-[#8a5cc7]/10 p-4"
            >
              <p className="text-sm font-bold text-[#d5baff]">
                Hashtag patterns to review
              </p>

              {hashtagSignals.map((signal) => (
                <p
                  key={signal}
                  className="mt-2 text-sm leading-6 text-[#e0d1f5]"
                >
                  {signal}
                </p>
              ))}
            </div>
          )}

          {loading && (
            <div
              role="status"
              aria-live="polite"
              className="mt-5 flex items-center gap-3 rounded-2xl border border-[#00f2ea]/30 bg-[#00f2ea]/5 p-4"
            >
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#00f2ea]/30 border-t-[#00f2ea]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Checking public TikTok information
                </p>
                <p className="mt-1 text-xs text-[#a5a5b1]">
                  This request may be affected by TikTok availability or rate limits.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-2xl border border-[#ff4b86]/40 bg-[#ff4b86]/10 p-4"
            >
              <p className="text-sm font-bold text-[#ff8eaf]">
                The check could not be completed
              </p>
              <p className="mt-1 text-sm leading-6 text-[#f1c8d5]">
                {error}
              </p>
            </div>
          )}

          {result && !result.exists && (
            <div
              role="status"
              aria-live="polite"
              className="mt-5 rounded-2xl border border-[#ff4b86]/40 bg-[#ff4b86]/10 p-5"
            >
              <p className="text-sm font-bold text-[#ff8eaf]">
                Profile not confirmed
              </p>
              <p className="mt-2 text-sm leading-6 text-[#f1c8d5]">
                {result.message ||
                  "TikTok did not return a confirmed public profile response."}
              </p>
              <p className="mt-2 text-xs leading-5 text-[#c7a1af]">
                An unsuccessful public lookup is not proof of a shadowban.
              </p>
            </div>
          )}

          {result?.exists && (
            <div
              aria-live="polite"
              className="mt-5 overflow-hidden rounded-2xl border border-[#353540] bg-[#191920]"
            >
              <div className="border-b border-white/10 p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {safeAvatar && result.scraped && (
                    <Image
                      src={safeAvatar}
                      alt={`${result.username}'s TikTok profile`}
                      width={72}
                      height={72}
                      unoptimized
                      className="h-[72px] w-[72px] rounded-full border-2 border-[#00f2ea] object-cover"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00f2ea]">
                      PUBLIC PROFILE RESPONSE
                    </p>

                    <h3 className="mt-1 break-words text-xl font-bold text-white">
                      @{result.username}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#b4b4c0]">
                      {result.message}
                    </p>

                    {result.scraped && result.followerCount && (
                      <p className="mt-2 text-xs font-semibold text-[#d1d1da]">
                        {result.followerCount} followers shown publicly
                      </p>
                    )}

                    {result.isPrivate && (
                      <span className="mt-2 inline-flex rounded-full bg-[#c7a5ff]/10 px-3 py-1 text-xs font-semibold text-[#d5baff]">
                        Private account
                      </span>
                    )}

                    {result.scraped && result.bio && (
                      <p className="mt-3 break-words text-sm leading-6 text-[#c7c7d0]">
                        {result.bio}
                      </p>
                    )}
                  </div>
                </div>

                {!result.scraped && (
                  <p className="mt-5 rounded-xl border border-[#f0b44d]/30 bg-[#f0b44d]/10 p-4 text-sm leading-6 text-[#f5d8a3]">
                    TikTok returned a response indicating that the profile
                    exists, but did not expose its details to this server.
                    This does not indicate a shadowban.
                  </p>
                )}
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-base font-bold text-white">
                    Visibility evidence
                  </h4>

                  <span className="rounded-full border border-[#00f2ea]/20 bg-[#00f2ea]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#00f2ea]">
                    Public observations
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-[#101014] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#00f2ea]">
                      Profile lookup
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      Profile appears to exist
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#a5a5b1]">
                      TikTok's public oEmbed endpoint returned a response.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#101014] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#ff4b86]">
                      Profile details
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {result.scraped
                        ? "Public page data retrieved"
                        : "Details unavailable"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#a5a5b1]">
                      {result.scraped
                        ? "Some public profile information was available to this server."
                        : "TikTok did not expose profile details to this server."}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#101014] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#c7a5ff]">
                      For You distribution
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      Not measured
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#a5a5b1]">
                      This checker cannot access personalized recommendation
                      or For You analytics.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#101014] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#f0b44d]">
                      Account restriction
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      Not confirmed
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#a5a5b1]">
                      A public profile lookup cannot establish an official
                      account-wide restriction.
                    </p>
                  </div>
                </div>

                {result.riskSignals.length > 0 && (
                  <div className="mt-5 rounded-xl border border-[#f0b44d]/25 bg-[#f0b44d]/[0.06] p-4">
                    <h4 className="text-sm font-bold text-[#f5d8a3]">
                      Additional check information
                    </h4>

                    <ul className="mt-2 space-y-2 text-xs leading-5 text-[#d8c49e]">
                      {result.riskSignals.map((signal, index) => (
                        <li
                          key={`${index}-${signal}`}
                          className="flex gap-2"
                        >
                          <span aria-hidden="true">•</span>
                          <span>{signal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hashtagSignals.length > 0 && (
                  <div className="mt-5 rounded-xl border border-[#c7a5ff]/25 bg-[#c7a5ff]/[0.06] p-4">
                    <h4 className="text-sm font-bold text-[#d5baff]">
                      Submitted hashtag patterns
                    </h4>

                    {hashtagSignals.map((signal) => (
                      <p
                        key={signal}
                        className="mt-2 text-xs leading-5 text-[#d8c5f2]"
                      >
                        {signal}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-5 rounded-xl border border-white/10 bg-[#101014] p-4">
                  <h4 className="text-sm font-bold text-white">
                    Suggested review steps
                  </h4>

                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs leading-6 text-[#b4b4c0]">
                    <li>
                      Check TikTok's in-app Account Status and any
                      recommendation eligibility notices.
                    </li>
                    <li>
                      Review Community Guidelines notices for affected videos.
                    </li>
                    <li>
                      Compare several posts instead of relying on one view count.
                    </li>
                    <li>
                      Review content originality and use relevant hashtags.
                    </li>
                    <li>
                      Use TikTok's official support or appeal process for
                      account-specific decisions.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="mt-5 rounded-2xl border border-[#d7d0e7] bg-white p-5 text-sm leading-6 text-stone-600 shadow-sm sm:p-6">
        <h3 className="font-bold text-stone-900">
          TikTok hashtags to review
        </h3>

        <p className="mt-2">
          Examples associated with engagement bait or spam include{" "}
          {hashtagsToReview.map((tag) => `#${tag}`).join(", ")}.
          TikTok does not publish a universal list of banned hashtags.
          A match in this local list is a review prompt, not proof that
          TikTok has restricted a hashtag or account.
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
