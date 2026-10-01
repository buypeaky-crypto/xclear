import type { Metadata } from "next";
import InstagramLanding from "../../../components/InstagramLanding";
import { getInstagramMetadata } from "../../../lib/i18n/instagram";

export const dynamic = "force-static";
export const metadata: Metadata = getInstagramMetadata("it");

export default function ItalianInstagramPage() {
  return <InstagramLanding locale="it" />;
}