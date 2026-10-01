import LocalizedLanding from "../../../components/LocalizedLanding";
import { getLocaleMetadata } from "../../../lib/i18n/metadata";

export const dynamic = "force-static";
export const metadata = getLocaleMetadata("it");

export default function ItalianShadowbanTestPage() {
  return <LocalizedLanding locale="it" />;
}