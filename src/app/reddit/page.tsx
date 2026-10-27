import type { Metadata } from "next";
import Home from "../page";
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: "Reddit Shadowban Checker - Free & Instant | XClear" };
export default function Page() {
  return <div className="bg-platform-reddit"><Home platform="reddit" backgroundClassName="bg-transparent" /></div>;
}
