import LocalizedLanding from "../../components/LocalizedLanding";
import { getLocaleMetadata } from "../../lib/i18n/metadata";

export const dynamic = "force-static";
export const metadata = getLocaleMetadata("de");

export default function GermanLandingPage() {
  return <LocalizedLanding locale="de" />;
}