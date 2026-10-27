import type { Metadata } from "next";
import Home from "../page";

export const metadata: Metadata = {
  title: "Instagram Shadowban Checker - Free & Instant | XClear",
  description: "Check if you're shadowbanned on Instagram. Tests hashtag visibility, Explore. Free, no login.",
};

export default function Page() {
  return (
    <div className="bg-platform-instagram">
      <Home platform="instagram" backgroundClassName="bg-transparent" />
    </div>
  );
}
