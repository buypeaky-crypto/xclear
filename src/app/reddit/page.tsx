import type { Metadata } from "next";
import Home from "../page";

export const metadata: Metadata = {
  title: "Reddit Shadowban Checker - Free & Instant | XClear",
  description: "Check if you're shadowbanned on Reddit. Free, no login.",
};

export default function Page() {
  return (
    <div className="bg-platform-reddit">
      <Home platform="reddit" backgroundClassName="bg-transparent" />
    </div>
  );
}
