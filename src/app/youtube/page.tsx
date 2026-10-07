import type { Metadata } from "next";
import YouTubeLanding from "../../components/YouTubeLanding";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "YouTube Shadowban Checker - Free & Instant | XClear",
  description: "Check if your YouTube channel is shadowbanned. Test search visibility, recommendations and comment suppression. Free.",
};

export default function YouTubePage() {
  return <YouTubeLanding locale="en" />;
}
