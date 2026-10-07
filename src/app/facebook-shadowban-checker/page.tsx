import type { Metadata } from "next";
import FacebookLanding from "../../components/FacebookLanding";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Facebook Shadowban Checker - Free & Instant | XClear",
  description: "Check if you're shadowbanned on Facebook. Test page visibility, search and comment suppression. Free, no login.",
};

export default function EnglishFacebookPage() {
  return <FacebookLanding locale="en" />;
}
