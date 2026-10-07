import type { Metadata } from "next";
import TikTokLanding from "../../components/TikTokLanding";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "TikTok Shadowban Checker - Instant Test | XClear",
  description: "Test if your TikTok account is shadowbanned. Check visibility, search and For You page suppression.",
};

export default function TikTokPage() {
  return (
    <div className="bg-platform-tiktok">
      <TikTokLanding locale="en" />
    </div>
  );
}
