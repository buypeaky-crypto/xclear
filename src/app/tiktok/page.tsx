
import type { Metadata } from "next";
import Home from "../page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TikTok Public Profile Visibility Checker",
  description:
    "Check public TikTok profile availability and optionally review a public video URL. Includes selected content-pattern checks. Does not measure For You recommendations or confirm account restrictions.",

  alternates: {
    canonical: "https://shadowban.online/checker/tiktok",
  },

  openGraph: {
    type: "website",
    title: "TikTok Public Profile Visibility Checker",
    description:
      "Review public TikTok profile information and optionally check a public video URL. Understand what the results can and cannot tell you.",
    url: "https://shadowban.online/checker/tiktok",
    siteName: "Shadowban.online",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TikTok public profile visibility checker",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "TikTok Public Profile Visibility Checker",
    description:
      "Review public TikTok profile availability and optional video URL checks. No TikTok password required.",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return (
    <div className="bg-platform-tiktok">
      <Home
        platform="tiktok"
        backgroundClassName="bg-transparent"
      />
    </div>
  );
}
