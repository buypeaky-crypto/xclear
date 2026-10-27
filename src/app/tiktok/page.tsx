import type { Metadata } from "next";
import Home from "../page";
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: "TikTok Shadowban Checker - Free & Instant | XClear" };
export default function Page() {
  return <div className="bg-platform-tiktok"><Home platform="tiktok" backgroundClassName="bg-transparent" /></div>;
}
