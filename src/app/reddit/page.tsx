import type { Metadata } from "next";
import RedditChecker from "../../components/RedditChecker";
import CheckerSchemas from "../../components/CheckerSchemas";
import { redditFaqs, redditKeywords } from "../../lib/i18n/reddit";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Reddit Shadowban Checker - Instant Test | XClear",
  description: "Check if you're shadowbanned on Reddit. Instant account visibility test. Free, no login required.",
};

export default function RedditPage() {
  const baseUrl = "https://shadowbannchecker.vercel.app";
  return (
    <div className="bg-platform-reddit">
      <RedditChecker />
      <CheckerSchemas
        name="Reddit Shadowban Checker"
        url={`${baseUrl}/reddit`}
        description="Check if you're shadowbanned on Reddit. Instant account visibility test."
        keywords={redditKeywords}
        inLanguage="en"
        faqs={redditFaqs}
      />
    </div>
  );
} 