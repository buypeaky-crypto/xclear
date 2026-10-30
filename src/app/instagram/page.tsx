
import type { Metadata } from "next";
import Home from "../page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Instagram Hashtag Checker and Pattern Review",
  description:
    "Review submitted Instagram hashtags against a local reference list. Identify repeated hashtags and selected patterns. This free tool does not query Instagram or confirm account restrictions.",

  alternates: {
    canonical: "https://shadowban.online/instagram",
  },

  openGraph: {
    type: "website",
    title: "Instagram Hashtag Checker and Pattern Review",
    description:
      "Review Instagram hashtags for selected patterns using a local reference list. No Instagram login or password required.",
    url: "https://shadowban.online/instagram",
    siteName: "Shadowban.online",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Instagram hashtag checker by Shadowban.online",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Instagram Hashtag Checker | Shadowban.online",
    description:
      "Review submitted Instagram hashtags against a local reference list. No Instagram password required.",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return (
    <div className="bg-platform-instagram">
      <Home
        platform="instagram"
        backgroundClassName="bg-transparent"
      />
    </div>
  );
}
