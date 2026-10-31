
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TikTokChecker from "@/components/TikTokChecker";
import RedditChecker from "@/components/RedditChecker";
import Home from "../../page";
import { platforms, type Platform } from "@/lib/platforms";

export const dynamicParams = false;

type FAQ = {
  question: string;
  answer: string;
};

type Resource = {
  label: string;
  url: string;
};

type PlatformPageContent = {
  name: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  method: string;
  canonicalPath: string;
  checks: string[];
  limitations: string[];
  nextSteps: string[];
  faqs: FAQ[];
  resources: Resource[];
};

const SITE_URL = "https://shadowban.online";

const PAGE_CONTENT: Record<Platform, PlatformPageContent> = {
  twitter: {
    name: "X",
    title: "X Search Visibility Checker",
    description:
      "Check public X profile reachability, limited logged-out search results and typeahead suggestions. Missing results do not prove an account restriction.",
    h1: "X Search and Profile Visibility Checker",
    intro:
      "Investigate selected public visibility signals for an X account. This checker performs limited logged-out requests and explains which signals were observed and which could not be verified.",
    method: "Public X endpoints · Logged-out diagnostic checks",
    canonicalPath: "/",
    checks: [
      "Public profile endpoint reachability.",
      "Whether a recent post from the username appears in a limited logged-out search query.",
      "Whether the exact username appears in the returned typeahead suggestions.",
    ],
    limitations: [
      "A missing search result does not establish why a post was not returned.",
      "Search results may depend on protected-post settings, account setup, sensitive-content filters and relevance.",
      "This checker cannot inspect X's internal recommendation ranking, For You distribution or reply-ranking decisions.",
      "A public profile response does not guarantee that every post is discoverable.",
    ],
    nextSteps: [
      "Confirm that your posts are public rather than protected.",
      "Complete the account setup and verify the email address associated with your account.",
      "Review search and sensitive-content settings.",
      "Compare several public posts rather than relying on one missing search result.",
      "Review X's official help documentation if your content continues to be missing.",
    ],
    faqs: [
      {
        question: "Can this X checker confirm an official shadowban?",
        answer:
          "No. It tests selected public profile, search and suggestion signals. It cannot access X's internal ranking or enforcement decisions. An inconclusive result is not proof of a shadowban.",
      },
      {
        question: "Why might my X posts not appear in search?",
        answer:
          "X identifies several possible reasons, including protected posts, incomplete account setup, potentially sensitive content and search relevance filtering. Not every post is guaranteed to appear in search.",
      },
      {
        question: "Does a missing search suggestion mean my account is restricted?",
        answer:
          "No. Suggestions depend on the search system and other factors. A username missing from one limited suggestion response is not sufficient evidence of an account restriction.",
      },
    ],
    resources: [
      {
        label: "X: Help with search visibility",
        url: "https://help.x.com/en/using-x/x-search-not-working",
      },
      {
        label: "X: Search rules and restrictions",
        url: "https://help.x.com/en/rules-and-policies/x-search-policies",
      },
      {
        label: "X: How search works",
        url: "https://help.x.com/en/using-x/x-search",
      },
    ],
  },

  instagram: {
    name: "Instagram",
    title: "Instagram Hashtag Checker and Pattern Review",
    description:
      "Review submitted Instagram hashtags against a local reference list. This heuristic does not query Instagram or confirm account restrictions.",
    h1: "Instagram Hashtag Pattern Checker",
    intro:
      "Review hashtags for selected patterns using a local reference list. You do not need to connect an Instagram account or provide your password.",
    method: "Local hashtag heuristic · No Instagram account lookup",
    canonicalPath: "/instagram",
    checks: [
      "Compare submitted hashtags against the local reference list.",
      "Identify repeated hashtags in the submitted list.",
      "Identify when the submitted hashtag count exceeds the configured threshold.",
    ],
    limitations: [
      "The checker does not make a live Instagram search request.",
      "The username field is optional context and is not used to retrieve account information.",
      "A hashtag appearing in a local reference list does not establish that Instagram officially banned it.",
      "This tool cannot inspect Explore, Reels, recommendation eligibility or actual account reach.",
    ],
    nextSteps: [
      "Review Account Status in the Instagram app.",
      "Check whether your account or individual content has recommendation eligibility notices.",
      "Compare several recent public posts rather than relying on one engagement result.",
      "Review the reason displayed by Instagram if a post or account is marked as ineligible.",
      "Use Instagram's available review process when you believe a decision is incorrect.",
    ],
    faqs: [
      {
        question: "Does this checker search Instagram directly?",
        answer:
          "No. It compares the hashtags you submit with a local reference list. It does not log in to Instagram, query live hashtag search results or retrieve account information.",
      },
      {
        question: "Does a hashtag match prove that Instagram restricted my account?",
        answer:
          "No. A local pattern match is not an official Instagram moderation decision. Hashtag context, content and platform policies all matter.",
      },
      {
        question: "Where can I check Instagram recommendation eligibility?",
        answer:
          "Review Account Status and any recommendation eligibility information available in your Instagram account. Those first-party notices are more useful for account-specific decisions than a third-party hashtag heuristic.",
      },
    ],
    resources: [
      {
        label: "Instagram Help Center",
        url: "https://help.instagram.com/",
      },
      {
        label: "Meta recommendation guidelines",
        url: "https://about.fb.com/news/2020/08/recommendation-guidelines/",
      },
    ],
  },

  tiktok: {
    name: "TikTok",
    title: "TikTok Public Profile Visibility Checker",
    description:
      "Check whether a public TikTok profile or video returns accessible public data. This does not measure For You recommendations or confirm an account restriction.",
    h1: "TikTok Public Profile Visibility Checker",
    intro:
      "Review available public TikTok profile information and optionally submit a video URL. Public profile availability is not the same as recommendation eligibility or For You Page reach.",
    method: "Public profile retrieval · Optional video oEmbed lookup",
    canonicalPath: "/checker/tiktok",
    checks: [
      "Attempt to retrieve a public TikTok profile.",
      "Extract available public profile information when the page exposes it.",
      "Optionally check whether TikTok recognizes a submitted public video URL through its oEmbed endpoint.",
      "Review selected engagement-bait hashtag patterns locally.",
    ],
    limitations: [
      "A public profile lookup does not measure For You Page impressions or recommendation distribution.",
      "The availability of public profile information depends on what TikTok returns to the server.",
      "A timeout, blocked request or unavailable profile response does not prove an account restriction.",
      "A successful video oEmbed response does not guarantee that the video is recommended.",
      "The hashtag review uses local rules and does not query TikTok hashtag search.",
    ],
    nextSteps: [
      "Review any account or video notifications inside TikTok.",
      "Check relevant Community Guidelines and video eligibility notices.",
      "Use TikTok's available explanation tools, such as Why this post, when reviewing For You recommendations.",
      "Compare several videos before drawing conclusions from a change in views.",
      "Use TikTok's official account and support tools for account-specific decisions.",
    ],
    faqs: [
      {
        question: "Does this checker measure my For You Page reach?",
        answer:
          "No. It attempts public profile retrieval and can optionally check a public video URL. It does not have access to your private For You analytics or personalized recommendation distribution.",
      },
      {
        question: "Does an accessible TikTok profile mean my videos are eligible for recommendations?",
        answer:
          "No. A public profile response only establishes that the profile endpoint returned data. TikTok's recommendation systems use personalized signals and content eligibility rules.",
      },
      {
        question: "Can a blocked TikTok profile request prove a shadowban?",
        answer:
          "No. Automated requests can fail because of network restrictions, timeouts or unavailable public data. An unsuccessful request must not be interpreted as proof of an account restriction.",
      },
      {
        question: "What does the optional video URL check tell me?",
        answer:
          "The optional check asks TikTok's public oEmbed endpoint whether it recognizes the submitted video URL. A successful response does not show whether the video is recommended or distributed on the For You Page.",
      },
    ],
    resources: [
      {
        label: "TikTok: What is For You?",
        url: "https://support.tiktok.com/en/getting-started/for-you/test-for-you",
      },
      {
        label: "TikTok: How recommendations work",
        url: "https://support.tiktok.com/en/using-tiktok/exploring-videos/how-tiktok-recommends-content",
      },
    ],
  },

  facebook: {
    name: "Facebook",
    title: "Facebook Content Pattern Checker",
    description:
      "Review submitted Facebook text for selected content patterns. This local tool does not access Page Insights, account status or distribution data.",
    h1: "Facebook Content Pattern Review",
    intro:
      "Review submitted text and keywords for selected content patterns. This tool is a local text review, not a Facebook profile or Page visibility test.",
    method: "Local text-pattern heuristic · No Facebook account lookup",
    canonicalPath: "/facebook-shadowban-checker",
    checks: [
      "Review submitted words and phrases against configured local rules.",
      "Identify selected follow-exchange and engagement-bait phrases.",
      "Identify when the submitted list exceeds the configured keyword threshold.",
    ],
    limitations: [
      "The checker does not connect to Facebook or access Page Insights.",
      "It does not retrieve profile visibility, comment visibility or recommendation status.",
      "A content-pattern match is not an official Facebook moderation decision.",
      "A decline in reach by itself does not establish that an account or Page has been restricted.",
    ],
    nextSteps: [
      "Review Account Status and Support Inbox in Facebook.",
      "Check any policy or recommendation notices relating to your profile or Page.",
      "Review whether the affected content is public and available to its intended audience.",
      "Compare several posts and their audience insights rather than relying on one post.",
      "Use Facebook's available review options if an account or content decision appears incorrect.",
    ],
    faqs: [
      {
        question: "Does this checker inspect my Facebook Page?",
        answer:
          "No. It analyzes only the text and keywords you enter. It does not log in to Facebook, retrieve Page Insights or check private account distribution information.",
      },
      {
        question: "Can a drop in Facebook reach prove a shadowban?",
        answer:
          "No. Reach can change for many reasons, including audience activity, content format and recommendation systems. A third-party text heuristic cannot establish an account restriction.",
      },
      {
        question: "Where should I review Facebook account restrictions?",
        answer:
          "Start with Facebook's own Account Status, Support Inbox and any policy or recommendation notices shown for your profile or the Pages you manage.",
      },
    ],
    resources: [
      {
        label: "Facebook Help Center",
        url: "https://www.facebook.com/help/",
      },
      {
        label: "Meta recommendation guidelines",
        url: "https://about.fb.com/news/2020/08/recommendation-guidelines/",
      },
    ],
  },

  youtube: {
    name: "YouTube",
    title: "YouTube Content Pattern Checker",
    description:
      "Review submitted YouTube tags and keywords for selected text patterns. This local tool does not inspect channel status or video recommendations.",
    h1: "YouTube Content Pattern Review",
    intro:
      "Review submitted tags and keywords using local content-pattern rules. This tool does not connect to your YouTube channel or query YouTube search.",
    method: "Local keyword and hashtag heuristic · No YouTube account lookup",
    canonicalPath: "/youtube",
    checks: [
      "Review the submitted keywords and tags.",
      "Identify selected follow-exchange phrases.",
      "Review the configured hashtag-count pattern.",
    ],
    limitations: [
      "This tool does not request a YouTube channel or video.",
      "It does not retrieve YouTube Studio analytics, search positions or recommendation data.",
      "It does not measure Shorts feed distribution or comment visibility.",
      "A local text-pattern result is not evidence of a YouTube restriction.",
    ],
    nextSteps: [
      "Review Channel violations and restriction notices in YouTube Studio.",
      "Check whether the channel and affected videos are public.",
      "Search for a specific video using its video ID when investigating discoverability.",
      "Check YouTube's guidance if you recently created a channel, changed a handle or updated a video.",
      "Use YouTube's official appeal process when a specific policy decision appears incorrect.",
    ],
    faqs: [
      {
        question: "Does this tool check my YouTube channel?",
        answer:
          "No. It reviews submitted text using local rules. It does not connect to YouTube, retrieve channel information or check your videos in search results.",
      },
      {
        question: "Can a keyword-pattern result confirm a YouTube shadowban?",
        answer:
          "No. It only reports configured patterns in the text you submitted. It cannot establish channel restrictions, search suppression or recommendation eligibility.",
      },
      {
        question: "Why might a new YouTube video not appear in search?",
        answer:
          "YouTube explains that recently created channels, videos or changed handles may take several days to appear in search. Search results also depend on relevance and other ranking factors.",
      },
    ],
    resources: [
      {
        label: "YouTube: Search visibility help",
        url: "https://support.google.com/youtube/answer/58097?hl=en",
      },
      {
        label: "YouTube Help Center",
        url: "https://support.google.com/youtube/",
      },
    ],
  },

  reddit: {
    name: "Reddit",
    title: "Reddit Public Profile Visibility Checker",
    description:
      "Check public Reddit profile availability and returned account details when accessible. An inaccessible profile alone does not prove a shadowban.",
    h1: "Reddit Public Profile Visibility Check",
    intro:
      "Attempt a logged-out public profile lookup and review available account information. The result helps investigate public profile availability but cannot establish every Reddit moderation or visibility decision.",
    method: "Logged-out public profile lookup · API availability dependent",
    canonicalPath: "/checker/reddit",
    checks: [
      "Attempt to retrieve public Reddit profile information.",
      "Display available account information when Reddit returns a valid profile response.",
      "Distinguish a confirmed response from unavailable or inconclusive responses.",
    ],
    limitations: [
      "A public profile response does not guarantee that every post or comment is visible.",
      "A 404 or unavailable profile may have multiple explanations, including deleted or inaccessible accounts.",
      "Automated requests can be blocked or rate-limited.",
      "This checker cannot inspect every subreddit moderation decision.",
      "A public profile lookup is not an official Reddit account-status determination.",
    ],
    nextSteps: [
      "Review your Reddit inbox for account or enforcement notifications.",
      "Distinguish a sitewide account restriction from a ban in one subreddit.",
      "Review the account-status information provided by Reddit.",
      "Use Reddit's official appeal process if you believe a sitewide decision was incorrect.",
      "Contact subreddit moderators for questions about community-specific moderation.",
    ],
    faqs: [
      {
        question: "Can this public Reddit checker prove a shadowban?",
        answer:
          "No. It checks public profile availability and returned account information. An inaccessible profile does not by itself establish whether an account is deleted, unavailable, suspended or affected by another visibility issue.",
      },
      {
        question: "Does a Reddit sitewide ban mean I am banned from every subreddit?",
        answer:
          "A sitewide account ban and an individual subreddit ban are different actions. Review Reddit's notifications and account-status information to understand which action applies.",
      },
      {
        question: "Where can I appeal a Reddit account restriction?",
        answer:
          "Follow the appeal instructions in Reddit's notification or official Help Center. Third-party checkers cannot reverse an account restriction.",
      },
    ],
    resources: [
      {
        label: "Reddit: Account status overview",
        url: "https://support.reddithelp.com/hc/en-us/articles/360045734591-Account-status-overview",
      },
      {
        label: "Reddit: Account flagged for spam",
        url: "https://support.reddithelp.com/hc/en-us/articles/360045309012-My-account-was-flagged-for-spam-or-inauthentic-activity",
      },
      {
        label: "Reddit Help Center",
        url: "https://support.reddithelp.com/",
      },
    ],
  },
};

function getPlatform(value: string): Platform | null {
  const normalized = value === "x" ? "twitter" : value;

  return (platforms as readonly string[]).includes(normalized)
    ? (normalized as Platform)
    : null;
}

function getCanonicalUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function generateStaticParams() {
  return [
    ...platforms.map((platform) => ({ platform })),
    { platform: "x" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string }>;
}): Promise<Metadata> {
  const { platform: raw } = await params;
  const platform = getPlatform(raw);

  if (!platform) {
    notFound();
  }

  const content = PAGE_CONTENT[platform];
  const canonical = getCanonicalUrl(content.canonicalPath);

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      siteName: "Shadowban.online",
      title: content.title,
      description: content.description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ platform: string }>;
}) {
  const { platform: raw } = await params;
  const platform = getPlatform(raw);

  if (!platform) {
    notFound();
  }

  const content = PAGE_CONTENT[platform];
  const isTikTokPlatform = platform === "tiktok";
  const isRedditPlatform = platform === "reddit";

  let checker;

  switch (platform) {
    case "twitter":
      checker = (
        <Home
          platform="x"
          backgroundClassName="bg-transparent"
        />
      );
      break;

    case "instagram":
      checker = (
        <Home
          platform="instagram"
          variant="checker"
          backgroundClassName="bg-white border rounded-lg p-6 shadow-sm"
        />
      );
      break;

    case "tiktok":
      checker = <TikTokChecker />;
      break;

    case "facebook":
      checker = (
        <Home
          platform="facebook"
          variant="checker"
          backgroundClassName="bg-white border rounded-lg p-6 shadow-sm"
        />
      );
      break;

    case "youtube":
      checker = (
        <Home
          platform="youtube"
          variant="checker"
          backgroundClassName="bg-white border rounded-lg p-6 shadow-sm"
        />
      );
      break;

    case "reddit":
      checker = <RedditChecker variant="checker" />;
      break;
  }

  const needsPageHeading = isTikTokPlatform || isRedditPlatform;

  const sectionHeadingClass = isTikTokPlatform
    ? "text-2xl font-bold tracking-tight text-white sm:text-3xl"
    : isRedditPlatform
      ? "text-2xl font-bold tracking-tight text-[#292321] sm:text-3xl"
      : "text-2xl font-bold tracking-tight text-stone-900";

  const sectionTextClass = isTikTokPlatform
    ? "text-sm leading-7 text-[#b8b8c5] sm:text-base"
    : isRedditPlatform
      ? "text-sm leading-7 text-[#705d52] sm:text-base"
      : "text-sm leading-7 text-stone-600 sm:text-base";

  const sectionBorderClass = isTikTokPlatform
    ? "border-white/10"
    : isRedditPlatform
      ? "border-[#ead8cd]"
      : "border-stone-200";

  return (
    <div
      className={
        isTikTokPlatform
          ? "min-h-screen bg-[#09090d] text-white"
          : isRedditPlatform
            ? "min-h-screen bg-[#fff7f1] text-[#292321]"
            : "min-h-screen bg-[#FFFBF0]"
      }
    >
      {needsPageHeading && (
        <header
          className={
            isTikTokPlatform
              ? "mx-auto max-w-6xl px-4 pb-2 pt-12 sm:px-6 sm:pt-16"
              : isRedditPlatform
                ? "mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14"
                : "mx-auto max-w-4xl px-4 pt-10 text-center sm:px-6 sm:pt-14"
          }
        >
          {isTikTokPlatform ? (
            <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-[#34343e] bg-[#15151c] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#00f2ea]">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br from-[#00f2ea] to-[#ff0050] text-sm font-black text-black">
                    ♪
                  </span>
                  TikTok public visibility
                </p>

                <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {content.h1}
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#b8b8c5] sm:text-base">
                  {content.intro}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#34343e] bg-[#15151c] px-3 py-2 text-xs font-semibold text-[#d5d5df]">
                    No TikTok password
                  </span>
                  <span className="rounded-full border border-[#34343e] bg-[#15151c] px-3 py-2 text-xs font-semibold text-[#d5d5df]">
                    Public profile lookup
                  </span>
                  <span className="rounded-full border border-[#34343e] bg-[#15151c] px-3 py-2 text-xs font-semibold text-[#d5d5df]">
                    Optional video URL
                  </span>
                </div>

                <p className="mt-5 text-xs font-medium text-[#00cfc8]">
                  {content.method}
                </p>
              </div>

              <aside className="relative overflow-hidden rounded-[26px] border border-[#33333d] bg-[#15151c] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.25)] sm:p-6">
                <div
                  aria-hidden="true"
                  className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#ff0050]/15 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-[#00f2ea]/10 blur-3xl"
                />

                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-bold text-white">
                      What gets checked?
                    </h2>
                    <span className="rounded-full bg-[#00f2ea]/10 px-3 py-1 text-[10px] font-bold text-[#00f2ea]">
                      PUBLIC SIGNALS
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="flex gap-3 border-b border-white/10 pb-4">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#00f2ea]/10 text-xs font-black text-[#00f2ea]">
                        01
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Profile response
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-[#a5a5b1]">
                          Attempts to confirm whether TikTok returns a public
                          profile response.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 border-b border-white/10 pb-4">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#ff0050]/10 text-xs font-black text-[#ff6b97]">
                        02
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Optional video lookup
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-[#a5a5b1]">
                          Uses TikTok's public oEmbed response for a supplied
                          video URL.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#c7a5ff]/10 text-xs font-black text-[#c7a5ff]">
                        03
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Hashtag pattern review
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-[#a5a5b1]">
                          Reviews selected engagement-bait patterns locally.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-[#92929e]">
                    These checks cannot measure personalized For You Page
                    distribution or confirm an official shadowban.
                  </p>
                </div>
              </aside>
            </div>
          ) : isRedditPlatform ? (
            <div className="grid items-center gap-8 rounded-[28px] border border-[#f0d7c8] bg-white p-5 shadow-[0_20px_55px_rgba(80,45,25,0.07)] sm:p-8 lg:grid-cols-[1.08fr_0.92fr]">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-[#f0d7c8] bg-[#fff8f2] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#d94112]">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-[#ff4500] text-sm font-black text-white">
                    r
                  </span>
                  REDDIT PUBLIC PROFILE VISIBILITY
                </p>

                <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-[#292321] sm:text-5xl lg:text-6xl">
                  {content.h1}
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#705d52] sm:text-base">
                  {content.intro}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#f0d7c8] bg-[#fff8f2] px-3 py-2 text-xs font-semibold text-[#705d52]">
                    No Reddit password
                  </span>
                  <span className="rounded-full border border-[#f0d7c8] bg-[#fff8f2] px-3 py-2 text-xs font-semibold text-[#705d52]">
                    Logged-out check
                  </span>
                  <span className="rounded-full border border-[#f0d7c8] bg-[#fff8f2] px-3 py-2 text-xs font-semibold text-[#705d52]">
                    Public profile signals
                  </span>
                </div>

                <p className="mt-5 text-xs font-semibold text-[#d94112]">
                  {content.method}
                </p>
              </div>

              <aside className="relative overflow-hidden rounded-[24px] border border-[#f0d7c8] bg-[#fff8f2] p-5 sm:p-6">
                <div
                  aria-hidden="true"
                  className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-[#ff4500]/10 blur-3xl"
                />

                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-bold text-[#292321]">
                      What gets checked?
                    </h2>
                    <span className="rounded-full bg-[#ff4500]/10 px-3 py-1 text-[10px] font-bold text-[#d94112]">
                      PUBLIC SIGNALS
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="flex gap-3 border-b border-[#ead8cd] pb-4">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#ff4500]/10 text-xs font-black text-[#ff4500]">
                        01
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-[#292321]">
                          Profile response
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-[#786c65]">
                          Checks whether Reddit returns a public profile
                          response to a logged-out request.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 border-b border-[#ead8cd] pb-4">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#ff4500]/10 text-xs font-black text-[#ff4500]">
                        02
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-[#292321]">
                          Public account details
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-[#786c65]">
                          Displays available account age and karma details
                          when Reddit returns them.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#ff4500]/10 text-xs font-black text-[#ff4500]">
                        03
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-[#292321]">
                          Inconclusive responses
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-[#786c65]">
                          Separates unavailable requests from confirmed
                          profile responses.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 border-t border-[#ead8cd] pt-4 text-xs leading-5 text-[#786c65]">
                    A logged-out profile check cannot prove every type of
                    Reddit restriction or explain why content was removed.
                  </p>
                </div>
              </aside>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                {content.h1}
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
                {content.intro}
              </p>

              <p className="mt-3 text-xs font-medium text-stone-500">
                {content.method}
              </p>
            </>
          )}
        </header>
      )}

      <div>{checker}</div>

      <article
        className={`mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 ${
          isTikTokPlatform
            ? "text-white"
            : isRedditPlatform
              ? "text-[#292321]"
              : ""
        }`}
      >
        {!needsPageHeading && (
          <section className="mb-10 max-w-3xl">
            <p
              className={`text-xs font-semibold uppercase tracking-wider ${
                isTikTokPlatform
                  ? "text-[#00d9d2]"
                  : isRedditPlatform
                    ? "text-[#d94112]"
                    : "text-violet-700"
              }`}
            >
              {content.method}
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              How the {content.name} tool works
            </h2>

            <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">
              {content.intro}
            </p>
          </section>
        )}

        <section
          id="methodology"
          className={`border-t py-8 ${sectionBorderClass}`}
        >
          <h2 className={sectionHeadingClass}>
            What this checker actually checks
          </h2>

          <ul className="mt-5 space-y-3">
            {content.checks.map((item, index) => (
              <li
                key={item}
                className={`flex gap-3 rounded-xl border p-4 text-sm leading-6 ${
                  isTikTokPlatform
                    ? "border-white/10 bg-[#15151c] text-[#d5d5df]"
                    : isRedditPlatform
                      ? "border-[#f0d7c8] bg-white text-[#705d52]"
                      : "border-stone-200 bg-white text-stone-700"
                }`}
              >
                <span
                  className={`font-bold ${
                    isTikTokPlatform
                      ? "text-[#00f2ea]"
                      : isRedditPlatform
                        ? "text-[#ff4500]"
                        : "text-violet-700"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="limitations"
          className={`border-t py-8 ${sectionBorderClass}`}
        >
          <h2 className={sectionHeadingClass}>
            What this checker cannot determine
          </h2>

          <ul className={`mt-5 list-disc space-y-3 pl-6 ${sectionTextClass}`}>
            {content.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <p
            className={`mt-5 rounded-xl border p-4 text-sm leading-6 ${
              isTikTokPlatform
                ? "border-[#f0b44d]/30 bg-[#f0b44d]/10 text-[#f5d8a3]"
                : isRedditPlatform
                  ? "border-[#f0d7c8] bg-[#fff8f2] text-[#8d3b1e]"
                  : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            Important: An unavailable result, missing search result, or
            change in engagement does not automatically mean an account
            has been shadowbanned.
          </p>
        </section>

        <section
          id="next-steps"
          className={`border-t py-8 ${sectionBorderClass}`}
        >
          <h2 className={sectionHeadingClass}>
            Recommended next steps
          </h2>

          <ol className={`mt-5 list-decimal space-y-3 pl-6 ${sectionTextClass}`}>
            {content.nextSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section
          id="faq"
          className={`border-t py-8 ${sectionBorderClass}`}
        >
          <h2 className={sectionHeadingClass}>
            Frequently asked questions about {content.name} visibility
          </h2>

          <div className="mt-6 space-y-3">
            {content.faqs.map((faq) => (
              <details
                key={faq.question}
                className={`group rounded-xl border p-4 ${
                  isTikTokPlatform
                    ? "border-white/10 bg-[#15151c]"
                    : isRedditPlatform
                      ? "border-[#f0d7c8] bg-white"
                      : "border-stone-200 bg-white"
                }`}
              >
                <summary
                  className={`cursor-pointer list-none font-semibold ${
                    isTikTokPlatform
                      ? "text-white"
                      : isRedditPlatform
                        ? "text-[#292321]"
                        : "text-stone-900"
                  }`}
                >
                  {faq.question}
                </summary>

                <p className={`mt-3 ${sectionTextClass}`}>
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section
          id="official-resources"
          className={`border-t py-8 ${sectionBorderClass}`}
        >
          <h2 className={sectionHeadingClass}>
            Official {content.name} resources
          </h2>

          <p className={`mt-3 ${sectionTextClass}`}>
            Consult the platform's own documentation for account status,
            search visibility, recommendations and appeals. These sources
            are more authoritative for account-specific decisions than an
            independent checker.
          </p>

          <ul className="mt-5 space-y-3">
            {content.resources.map((resource) => (
              <li key={resource.url}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm font-semibold underline underline-offset-4 ${
                    isTikTokPlatform
                      ? "text-[#00f2ea] decoration-[#00f2ea]/40 hover:text-[#ff6b97]"
                      : isRedditPlatform
                        ? "text-[#d94112] decoration-[#ffb49c] hover:text-[#a93613]"
                        : "text-violet-700 decoration-violet-300 hover:text-violet-900"
                  }`}
                >
                  {resource.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className={`border-t py-8 ${sectionBorderClass}`}>
          <h2
            className={`text-xl font-bold ${
              isTikTokPlatform
                ? "text-white"
                : isRedditPlatform
                  ? "text-[#292321]"
                  : "text-stone-900"
            }`}
          >
            Explore other checker tools
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {platforms
              .filter((item) => item !== platform)
              .map((item) => {
                const destinations: Record<Platform, string> = {
                  twitter: "/",
                  instagram: "/instagram",
                  tiktok: "/checker/tiktok",
                  facebook: "/facebook-shadowban-checker",
                  youtube: "/youtube",
                  reddit: "/checker/reddit",
                };

                const labels: Record<Platform, string> = {
                  twitter: "X visibility checker",
                  instagram: "Instagram hashtag review",
                  tiktok: "TikTok checker",
                  facebook: "Facebook content review",
                  youtube: "YouTube content review",
                  reddit: "Reddit content review",
                };

                return (
                  <a
                    key={item}
                    href={destinations[item]}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      isTikTokPlatform
                        ? "border-white/15 bg-[#15151c] text-[#d5d5df] hover:border-[#00f2ea] hover:text-[#00f2ea]"
                        : isRedditPlatform
                          ? "border-[#f0d7c8] bg-white text-[#705d52] hover:border-[#ff4500] hover:text-[#d94112]"
                          : "border-stone-300 bg-white text-stone-700 hover:border-violet-300 hover:text-violet-700"
                    }`}
                  >
                    {labels[item]}
                  </a>
                );
              })}
          </div>
        </section>

        <p
          className={`border-t pt-6 text-xs leading-6 ${
            isTikTokPlatform
              ? "border-white/10 text-[#858592]"
              : isRedditPlatform
                ? "border-[#ead8cd] text-[#8a7d75]"
                : "border-stone-200 text-stone-500"
          }`}
        >
          Shadowban.online is an independent service and is not affiliated
          with or endorsed by X, Instagram, TikTok, Facebook, YouTube or
          Reddit. Platform names are used only to identify the services
          discussed.
        </p>
      </article>
    </div>
  );
}
