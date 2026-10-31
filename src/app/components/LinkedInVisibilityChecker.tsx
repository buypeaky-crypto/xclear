
"use client";

import { useState, type FormEvent } from "react";

const checks = [
  {
    id: "publicProfile",
    title: "Public profile visibility is enabled",
    detail:
      "Check LinkedIn's public profile settings and confirm that your profile is available to people who are not signed in.",
  },
  {
    id: "profileSections",
    title: "The profile sections you want are public",
    detail:
      "Review the visibility of your profile photo, headline, summary, experience, and other sections you want people to see.",
  },
  {
    id: "activity",
    title: "Articles and Activity visibility has been reviewed",
    detail:
      "Check whether your Articles & Activity section is available in your public profile settings, when applicable.",
  },
  {
    id: "loggedOut",
    title: "I checked my profile while signed out",
    detail:
      "Open your public profile in a private or incognito browser window to see what a visitor can access.",
  },
  {
    id: "searchEngines",
    title: "I checked my search-engine visibility",
    detail:
      "Search for your name and LinkedIn profile URL using an external search engine. Remember that updates can take weeks or months to appear.",
  },
] as const;

type CheckId = (typeof checks)[number]["id"];

const helpUrl =
  "https://www.linkedin.com/help/linkedin/answer/a518980";

const emptyChecks: Record<CheckId, boolean> = {
  publicProfile: false,
  profileSections: false,
  activity: false,
  loggedOut: false,
  searchEngines: false,
};

function normalizeProfileUrl(value: string): string | null {
  const input = value.trim();

  if (!input) return null;

  try {
    const withProtocol = /^https?:\/\//i.test(input)
      ? input
      : `https://${input}`;

    const url = new URL(withProtocol);
    const hostname = url.hostname.toLowerCase();

    if (
      hostname !== "linkedin.com" &&
      hostname !== "www.linkedin.com"
    ) {
      return null;
    }

    const match = url.pathname.match(
      /^\/in\/([a-z0-9_%~-]+)\/?$/i
    );

    if (!match) return null;

    return `https://www.linkedin.com/in/${match[1]}/`;
  } catch {
    return null;
  }
}

export default function LinkedInVisibilityChecker() {
  const [profileUrl, setProfileUrl] = useState("");
  const [validatedUrl, setValidatedUrl] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");
  const [completed, setCompleted] =
    useState<Record<CheckId, boolean>>(emptyChecks);

  const completedCount = checks.filter(
    (check) => completed[check.id]
  ).length;

  function validateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = normalizeProfileUrl(profileUrl);

    if (!normalized) {
      setValidatedUrl(null);
      setError(
        "Enter a valid LinkedIn personal profile URL, such as linkedin.com/in/your-name."
      );
      return;
    }

    setError("");
    setValidatedUrl(normalized);
  }

  function updateCheck(id: CheckId, checked: boolean) {
    setCompleted((previous) => ({
      ...previous,
      [id]: checked,
    }));
  }

  return (
    <section className="space-y-6 text-left">
      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-bold text-stone-900">
          Check your LinkedIn profile URL
        </h2>

        <p className="mt-2 text-sm leading-6 text-stone-600">
          Enter your public LinkedIn personal profile URL.
          We validate its format locally without accessing
          your LinkedIn account or profile data.
        </p>

        <form
          onSubmit={validateProfile}
          className="mt-5 space-y-3"
        >
          <label
            htmlFor="linkedin-profile-url"
            className="block text-sm font-semibold text-stone-800"
          >
            LinkedIn profile URL
          </label>

          <input
            id="linkedin-profile-url"
            type="text"
            value={profileUrl}
            onChange={(event) => {
              setProfileUrl(event.target.value);
              setValidatedUrl(null);
              setError("");
            }}
            placeholder="linkedin.com/in/your-name"
            autoComplete="url"
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? "linkedin-url-error" : "linkedin-url-help"
            }
          />

          {error && (
            <p
              id="linkedin-url-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <p
            id="linkedin-url-help"
            className="text-xs leading-5 text-stone-500"
          >
            Personal profile URLs beginning with linkedin.com/in/
            are supported.
          </p>

          <button
            type="submit"
            className="w-full rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 sm:w-auto"
          >
            Validate profile URL
          </button>
        </form>

        {validatedUrl && (
          <div
            className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-4"
            aria-live="polite"
          >
            <p className="font-semibold text-stone-900">
              Profile URL format is valid
            </p>

            <p className="mt-1 break-all text-sm text-stone-600">
              {validatedUrl}
            </p>

            <a
              href={validatedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-violet-700 underline underline-offset-4"
            >
              Open LinkedIn profile
            </a>

            <p className="mt-3 text-xs leading-5 text-stone-500">
              This validates the URL format only. It does not
              confirm that the profile exists or is publicly visible.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Public visibility checklist
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Review these settings directly in LinkedIn.
            </p>
          </div>

          <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700">
            {completedCount} of {checks.length} reviewed
          </span>
        </div>

        <div
          className="mt-5 h-2 overflow-hidden rounded-full bg-stone-100"
          role="progressbar"
          aria-label="Checklist progress"
          aria-valuemin={0}
          aria-valuemax={checks.length}
          aria-valuenow={completedCount}
        >
          <div
            className="h-full rounded-full bg-violet-600 transition-all"
            style={{
              width: `${(completedCount / checks.length) * 100}%`,
            }}
          />
        </div>

        <div className="mt-6 space-y-5">
          {checks.map((check) => (
            <label
              key={check.id}
              className="flex cursor-pointer gap-3"
            >
              <input
                type="checkbox"
                checked={completed[check.id]}
                onChange={(event) =>
                  updateCheck(check.id, event.target.checked)
                }
                className="mt-1 h-4 w-4 shrink-0 accent-violet-700"
              />

              <span>
                <span className="block text-sm font-semibold text-stone-900">
                  {check.title}
                </span>

                <span className="mt-1 block text-sm leading-6 text-stone-600">
                  {check.detail}
                </span>
              </span>
            </label>
          ))}
        </div>

        <div
          className="mt-6 rounded-xl bg-stone-50 p-4"
          aria-live="polite"
        >
          <p className="text-sm font-semibold text-stone-900">
            Your review progress
          </p>

          <p className="mt-1 text-sm leading-6 text-stone-600">
            {completedCount === checks.length
              ? "You have marked every manual check as reviewed. This does not guarantee that your profile appears in search results or recommendations."
              : `${checks.length - completedCount} manual check(s) remain. Continue reviewing your LinkedIn public visibility settings.`}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold text-stone-900">
          Official LinkedIn guidance
        </h2>

        <p className="mt-2 text-sm leading-6 text-stone-600">
          LinkedIn explains how public profile settings control
          which profile sections can appear to people who are not
          signed in and to external search engines.
        </p>

        <a
          href={helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-semibold text-violet-700 underline underline-offset-4"
        >
          Read LinkedIn public profile visibility help
        </a>
      </div>

      <p className="text-xs leading-6 text-stone-500">
        This is a manual self-review tool, not an official LinkedIn
        service or an automated shadowban detector. Shadowban.online
        does not scrape LinkedIn, access private profile information,
        or determine LinkedIn account restrictions.
      </p>
    </section>
  );
}
