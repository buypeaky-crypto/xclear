import type { Metadata } from "next";
import Home from "../page";
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: "Facebook Shadowban Checker - Free & Instant | XClear" };
export default function Page() {
  return <div className="bg-platform-facebook"><Home platform="facebook" backgroundClassName="bg-transparent" /></div>;
}
