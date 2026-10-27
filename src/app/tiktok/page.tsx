import type { Metadata } from "next";
import Home from "../page";

export const metadata: Metadata = {
  title: "TikTok Shadowban Checker - Free & Instant | XClear",
  description: "Check if you're shadowbanned on TikTok. Tests For You visibility. Free, no login.",
};

export default function Page() {
  return (
    <div className="bg-platform-tiktok">
      <Home platform="tiktok" backgroundClassName="bg-transparent" />
    </div>
  );
}
