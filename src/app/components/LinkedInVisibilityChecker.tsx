
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

  const progress = (completedCount / checks.length) * 100;

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
    <section className="space-y-6 text-left text-[#172b4d]">
      {/* Profile URL validation */}
      <div className="overflow-hidden rounded-2xl border border-[#d6e2ea] bg-white shadow-sm">
        <div className="border-b border-[#e4edf3] bg-[#f3f8fc] px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0a66c2] text-lg font-black text-white">
              in
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0a66c2]">
                Profile validation
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#172b4d]">
                Check your LinkedIn profile URL
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#536579]">
            Enter your public LinkedIn personal profile URL.
            We validate its format locally without accessing
            your LinkedIn account or profile data.
          </p>
        </div>

        <div className="p-5 sm:p-7">
          <form onSubmit={validateProfile} className="space-y-3">
            <label
              htmlFor="linkedin-profile-url"
              className="block text-sm font-bold text-[#253b53]"
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
              aria-invalid={Boolean(error)}
              aria-describedby={`linkedin-url-help${
                error ? " linkedin-url-error" : ""
              }`}
              className="w-full rounded-xl border border-[#cbd8e3] bg-white px-4 py-3.5 text-sm text-[#172b4d] outline-none transition placeholder:text-[#8798a8] hover:border-[#8aa7bf] focus:border-[#0a66c2] focus:ring-4 focus:ring-[#0a66c2]/10"
            />

            {error && (
              <p
                id="linkedin-url-error"
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-5 text-red-700"
              >
                {error}
              </p>
            )}

            <p
              id="linkedin-url-help"
              className="text-xs leading-5 text-[#718397]"
            >
              Personal profile URLs beginning with linkedin.com/in/
              are supported.
            </p>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#0a66c2] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#004182] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0a66c2]/25 sm:w-auto"
            >
              Validate profile URL
            </button>
          </form>

          {validatedUrl && (
            <div
              className="mt-6 rounded-xl border border-[#b8dfc9] bg-[#f0faf4] p-4 sm:p-5"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d5f1df] text-sm font-bold text-[#167442]">
                  ✓
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-[#17643b]">
                    Profile URL format is valid
                  </p>

                  <p className="mt-2 break-all text-sm leading-6 text-[#365b48]">
                    {validatedUrl}
                  </p>

                  <a
                    href={validatedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex font-bold text-sm text-[#0a66c2] underline decoration-[#0a66c2]/40 underline-offset-4 hover:text-[#004182]"
                  >
                    Open LinkedIn profile
                    <span className="ml-1" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </div>
              </div>

              <p className="mt-4 border-t border-[#cce8d7] pt-3 text-xs leading-5 text-[#557563]">
                This validates the URL format only. It does not
                confirm that the profile exists or is publicly visible.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Manual visibility checklist */}
      <div className="overflow-hidden rounded-2xl border border-[#d6e2ea] bg-white shadow-sm">
        <div className="border-b border-[#e4edf3] px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0a66c2]">
                Manual account review
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#172b4d]">
                Public visibility checklist
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#64788c]">
                Review these settings directly in LinkedIn.
              </p>
            </div>

            <span className="rounded-full border border-[#cfe2f2] bg-[#edf6fd] px-3 py-1.5 text-xs font-bold text-[#0a66c2]">
              {completedCount} of {checks.length} reviewed
            </span>
          </div>

          <div className="mt-5">
            <div
              className="h-2.5 overflow-hidden rounded-full bg-[#e8eff5]"
              role="progressbar"
              aria-label="Checklist progress"
              aria-valuemin={0}
              aria-valuemax={checks.length}
              aria-valuenow={completedCount}
              aria-valuetext={`${completedCount} of ${checks.length} checks reviewed`}
            >
              <div
                className="h-full rounded-full bg-[#0a66c2] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-2 flex justify-between text-xs text-[#718397]">
              <span>Review progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#eaf0f5] px-5 sm:px-7">
          {checks.map((check, index) => (
            <label
              key={check.id}
              className="flex cursor-pointer gap-4 py-5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf6fd] text-xs font-bold text-[#0a66c2]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="flex min-w-0 flex-1 gap-3">
                <input
                  type="checkbox"
                  checked={completed[check.id]}
                  onChange={(event) =>
                    updateCheck(check.id, event.target.checked)
                  }
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#0a66c2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2] focus-visible:ring-offset-2"
                />

                <span className="min-w-0">
                  <span
                    className={`block text-sm font-bold ${
                      completed[check.id]
                        ? "text-[#0a66c2]"
                        : "text-[#253b53]"
                    }`}
                  >
                    {check.title}
                  </span>

                  <span className="mt-1 block text-sm leading-6 text-[#64788c]">
                    {check.detail}
                  </span>
                </span>
              </span>
            </label>
          ))}
        </div>

        <div className="border-t border-[#e4edf3] bg-[#f6f9fc] px-5 py-5 sm:px-7">
          <p className="text-sm font-bold text-[#253b53]">
            Your review progress
          </p>

          <p
            className="mt-1 text-sm leading-6 text-[#64788c]"
            aria-live="polite"
          >
            {completedCount === checks.length
              ? "You have marked every manual check as reviewed. This does not guarantee that your profile appears in search results or recommendations."
              : `${checks.length - completedCount} manual check(s) remain. Continue reviewing your LinkedIn public visibility settings.`}
          </p>
        </div>
      </div>

      {/* Official LinkedIn guidance */}
      <div className="rounded-2xl border border-[#cfe2f2] bg-[#f3f8fc] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0a66c2] shadow-sm">
            <span className="text-lg font-black">in</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#172b4d]">
              Official LinkedIn guidance
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#536579]">
              LinkedIn explains how public profile settings control
              which profile sections can appear to people who are not
              signed in and to external search engines.
            </p>

            <a
              href={helpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-sm font-bold text-[#0a66c2] underline decoration-[#0a66c2]/40 underline-offset-4 hover:text-[#004182]"
            >
              Read LinkedIn public profile visibility help
              <span className="ml-1" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>

      <p className="rounded-xl border border-[#e1e9ef] bg-[#f8fafc] p-4 text-xs leading-6 text-[#718397]">
        This is a manual self-review tool, not an official LinkedIn
        service or an automated shadowban detector. Shadowban.online
        does not scrape LinkedIn, access private profile information,
        or determine LinkedIn account restrictions.
      </p>
    </section>
  );
}
