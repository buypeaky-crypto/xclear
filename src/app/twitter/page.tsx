import type { Metadata } from "next";
import Home from "../page";

export const metadata: Metadata = {
  title: "X / Twitter Shadowban Checker - Free & Instant | XClear",
  description: "Check if you're shadowbanned on X (Twitter) in 5 seconds. Real guest-token check. Free.",
};

export default function Page() {
  return (
    <div className="bg-platform-twitter">
      <Home platform="x" backgroundClassName="bg-transparent" />
    </div>
  );
}
