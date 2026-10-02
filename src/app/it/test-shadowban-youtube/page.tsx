import type { Metadata } from "next";
import YouTubeLanding from "../../../components/YouTubeLanding";
import { getYouTubeMetadata } from "../../../lib/i18n/youtube";

export const dynamic = "force-static";
export const metadata: Metadata = getYouTubeMetadata("it");

export default function ItalianYouTubePage() {
  return <YouTubeLanding locale="it" />;
}