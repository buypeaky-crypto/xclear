import LocalizedLanding from "../../components/LocalizedLanding";
import { getLocaleMetadata } from "../../lib/i18n/metadata";

export const dynamic = "force-static";
export const metadata = getLocaleMetadata("id");

export default function IndonesianLandingPage() {
  return <LocalizedLanding locale="id" />;
}