import LocalizedLanding from "../../../components/LocalizedLanding";
import { getLocaleMetadata } from "../../../lib/i18n/metadata";

export const dynamic = "force-static";
export const metadata = getLocaleMetadata("pt");

export default function PortugueseShadowbanTestPage() {
  return <LocalizedLanding locale="pt" />;
}