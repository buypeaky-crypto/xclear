import type { Metadata } from "next";
import InstagramLanding from "../../components/InstagramLanding";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Instagram Shadowban Checker - Free & Instant | XClear",
  description: "Check if you're shadowbanned on Instagram in 5 seconds. Tests search, hashtag, story and ghost ban. Free, no login required.",
};

export default function InstagramPage() {
  return (
    <div className="bg-platform-instagram">
      <InstagramLanding locale="en" />
    </div>
  );
}
