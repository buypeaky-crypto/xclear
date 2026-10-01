import LocalizedLanding from "../../../components/LocalizedLanding";
import { getLocaleMetadata } from "../../../lib/i18n/metadata";

export const dynamic = "force-static";
export const metadata = getLocaleMetadata("th");

export default function ThaiShadowbanCheckPage() {
  return <LocalizedLanding locale="th" />;
}