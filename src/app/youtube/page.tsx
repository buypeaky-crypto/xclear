
import type { Metadata } from "next";
import Home from "../page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "YouTube Content Pattern Checker",
  description:
    "Review submitted YouTube tags and keywords for selected text patterns. This free local checker does not inspect channel status, search rankings or video recommendations.",

  alternates: {
    canonical: "https://shadowban.online/youtube",
  },

  openGraph: {
    type: "website",
    title: "YouTube Content Pattern Checker",
    description:
      "Review submitted YouTube tags and keywords using local content-pattern rules. No YouTube login or password required.",
    url: "https://shadowban.online/youtube",
    siteName: "Shadowban.online",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YouTube content pattern checker by Shadowban.online",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "YouTube Content Pattern Checker",
    description:
      "Review YouTube tags and keywords for selected patterns. No YouTube password required.",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return (
    <div className="bg-platform-youtube">
      <Home
        platform="youtube"
        backgroundClassName="bg-transparent"
      />
    </div>
  );
}
