import type { Metadata } from "next";
import Home from "../page";

export const metadata: Metadata = {
  title: "Facebook Shadowban Checker - Free & Instant | XClear",
  description: "Check Facebook Page/profile visibility. Free, no login.",
};

export default function Page() {
  return (
    <div className="bg-platform-facebook">
      <Home platform="facebook" backgroundClassName="bg-transparent" />
    </div>
  );
}
