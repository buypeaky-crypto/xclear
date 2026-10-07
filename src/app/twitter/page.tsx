import type { Metadata } from "next";
import Home from "../page";

export const metadata: Metadata = {
  title: "X / Twitter Shadowban Checker - Free & Instant | XClear",
  description: "Check if you're shadowbanned on X (Twitter) in 5 seconds. Tests search ban, ghost ban, reply deboost. Free, no login required.",
};

export default function TwitterPage() {
  return (
    <div className="bg-platform-twitter">
      <Home backgroundClassName="bg-transparent" />
    </div>
  );
}
