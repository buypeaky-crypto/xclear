import type { Metadata } from "next";
import Home from "../page";

export const metadata: Metadata = {
  title: "YouTube Shadowban Checker - Free & Instant | XClear",
  description: "Check if you're shadowbanned on YouTube. Tests comment & Shorts visibility. Free.",
};

export default function Page() {
  return (
    <div className="bg-platform-youtube">
      <Home platform="youtube" backgroundClassName="bg-transparent" />
    </div>
  );
}
