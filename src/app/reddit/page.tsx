import type { Metadata } from "next";
import RedditChecker from "../../components/RedditChecker";
import { getRedditMetadata, redditFaqs, redditKeywords, redditMetadata } from "../../lib/i18n/reddit";
import CheckerSchemas from "../../components/CheckerSchemas";
import { baseUrl } from "../../lib/i18n/config";

export const dynamic = "force-static";
export const metadata: Metadata = getRedditMetadata();

export default function RedditPage() {
  return (
    <div className="bg-platform-reddit">
      <RedditChecker />
      <CheckerSchemas
        name="Reddit Shadowban Checker"
        url={`${baseUrl}/reddit`}
        description={redditMetadata.description}
        keywords={redditKeywords}
        inLanguage="en"
        faqs={redditFaqs}
      />
    </div>
  );
}