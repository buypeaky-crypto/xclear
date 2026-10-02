import type { Metadata } from "next";
import YouTubeLanding from "../../../components/YouTubeLanding";
import { getYouTubeMetadata } from "../../../lib/i18n/youtube";

export const dynamic = "force-static";
export const metadata: Metadata = getYouTubeMetadata("de");

export default function GermanYouTubePage() {
  return <YouTubeLanding locale="de" />;
}