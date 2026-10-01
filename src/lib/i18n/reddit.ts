import type { Metadata } from "next";
import { baseUrl, getEnglishLanguageAlternates } from "./config";

export const redditMetadata = {
  title: "Reddit Shadowban Checker | ShadowbannChecker",
  description:
    "Free Reddit shadowban checker. Enter a username to see if the profile is visible logged out, if recent comments show, and what was removed.",
};

export const redditKeywords = [
  "reddit shadowban checker free",
  "reddit account checker",
  "check Reddit shadowban",
  "Reddit profile visibility checker",
  "Reddit shadowban appeal",
];

export const redditFaqs = [
  {
    question: "How long does a Reddit shadowban last?",
    answer:
      "There is no fixed duration. A restriction may remain until Reddit reviews an appeal or the underlying issue is resolved. Check account notices and the appeal process for your case.",
  },
  {
    question: "How do I appeal a Reddit shadowban?",
    answer:
      "Use Reddit's official appeal form at reddit.com/appeal. Explain the issue clearly and include relevant context; never share your password with a third-party checker.",
  },
  {
    question: "Is a Reddit shadowban permanent?",
    answer:
      "Not necessarily. Outcomes depend on the account and policy issue. Only Reddit can confirm or change an account restriction, so use its official appeal and account-status notices.",
  },
  {
    question: "Can a new Reddit account be shadowbanned?",
    answer:
      "A new account can have limited visibility or be caught by spam controls, but a new account or low karma alone does not prove a shadowban.",
  },
];

export function getRedditMetadata(): Metadata {
  const url = `${baseUrl}/reddit`;
  return {
    ...redditMetadata,
    keywords: redditKeywords,
    alternates: {
      canonical: url,
      languages: getEnglishLanguageAlternates("/reddit"),
    },
    openGraph: {
      type: "website",
      url,
      siteName: "ShadowbannChecker",
      ...redditMetadata,
    },
    twitter: {
      card: "summary_large_image",
      ...redditMetadata,
      images: ["/og-image.png"],
    },
  };
}