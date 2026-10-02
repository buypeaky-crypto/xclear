import type { Metadata } from "next";
import YouTubeLanding from "../../../components/YouTubeLanding";
import { getYouTubeMetadata } from "../../../lib/i18n/youtube";

export const dynamic = "force-static";
export const metadata: Metadata = getYouTubeMetadata("id");

export default function IndonesianYouTubePage() {
  return <YouTubeLanding locale="id" />;
}