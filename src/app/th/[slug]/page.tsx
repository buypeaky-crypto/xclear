import type { Metadata } from "next";
import FacebookLanding from "../../../components/FacebookLanding";
import { facebookMetadata } from "../../../lib/i18n/facebook";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: "ตรวจสอบ-shadowban-facebook" }];
}

export const metadata: Metadata = facebookMetadata.th;

export default function ThaiFacebookPage() {
  return <FacebookLanding locale="th" />;
}
