import type { Metadata } from "next";
import Home from "../page";
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: "Instagram Shadowban Checker - Free & Instant | XClear" };
export default function Page() {
  return <div className="bg-platform-instagram"><Home platform="instagram" backgroundClassName="bg-transparent" /></div>;
}
