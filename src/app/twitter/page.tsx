import type { Metadata } from "next";
import Home from "../page";
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: "X / Twitter Shadowban Checker - Free & Instant | XClear" };
export default function Page() {
  return <div className="bg-platform-x"><Home platform="x" backgroundClassName="bg-transparent" /></div>;
}
