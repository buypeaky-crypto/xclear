import type { Metadata } from "next";
import RedditChecker from "../../../../components/RedditChecker";
import { getRedditMetadata } from "../../../../lib/i18n/reddit";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...getRedditMetadata(),
  title: "Reddit Profile Visibility Check | ShadowbanChecker",
  robots: { index: false, follow: true },
};

export default async function RedditUsernamePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <RedditChecker initialUsername={username} autoCheck />;
}