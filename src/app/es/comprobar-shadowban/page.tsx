import LocalizedLanding from "../../../components/LocalizedLanding";
import { getLocaleMetadata } from "../../../lib/i18n/metadata";

export const dynamic = "force-static";
export const metadata = getLocaleMetadata("es");

export default function SpanishShadowbanCheckPage() {
  return <LocalizedLanding locale="es" />;
}