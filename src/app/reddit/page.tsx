import type { Metadata } from "next";
import RedditChecker from "../../components/RedditChecker";
import { getRedditMetadata, redditFaqs } from "../../lib/i18n/reddit";

export const dynamic = "force-static";
export const metadata: Metadata = getRedditMetadata();

export default function RedditPage() {
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: redditFaqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <div className="bg-platform-reddit">
      <RedditChecker />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </div>
  );
}