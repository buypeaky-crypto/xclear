import type { Metadata } from "next";
import InstagramLanding from "../../components/InstagramLanding";
import { getInstagramMetadata } from "../../lib/i18n/instagram";

export const dynamic = "force-static";
export const metadata: Metadata = getInstagramMetadata("en");

export default function InstagramPage() {
  return (
    <div className="bg-platform-instagram">
      <InstagramLanding locale="en" />
    </div>
  );
}