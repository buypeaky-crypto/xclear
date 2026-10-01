import type { Metadata } from "next";
import TikTokLanding from "../../../components/TikTokLanding";
import { getTikTokMetadata } from "../../../lib/i18n/tiktok";

export const dynamic = "force-static";
export const metadata: Metadata = getTikTokMetadata("es");

export default function SpanishTikTokPage() {
  return <TikTokLanding locale="es" />;
}