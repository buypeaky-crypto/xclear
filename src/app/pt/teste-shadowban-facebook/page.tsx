import type { Metadata } from "next";
import FacebookLanding from "../../../components/FacebookLanding";
import { facebookMetadata } from "../../../lib/i18n/facebook";

export const dynamic = "force-static";
export const metadata: Metadata = facebookMetadata.pt;

export default function PortugueseFacebookPage() {
  return <FacebookLanding locale="pt" />;
}
