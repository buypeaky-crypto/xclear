import type { Metadata } from "next";
import Home from "../page";
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: "YouTube Shadowban Checker - Free & Instant | XClear" };
export default function Page() {
  return <div className="bg-platform-youtube"><Home platform="youtube" backgroundClassName="bg-transparent" /></div>;
}
