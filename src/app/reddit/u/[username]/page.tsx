import type { Metadata } from "next";
import RedditChecker from "../../../../components/RedditChecker";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `Is u/${username} shadowbanned? | XClear`,
    description: `Check if Reddit user u/${username} is shadowbanned. Instant visibility test.`,
    robots: { index: false, follow: true },
  };
}

export default async function RedditUsernamePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <RedditChecker initialUsername={username} />;
} 