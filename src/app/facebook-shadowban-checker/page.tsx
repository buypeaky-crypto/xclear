
import type { Metadata } from "next";
import FacebookLanding from "@/components/FacebookLanding";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Facebook Content Pattern Checker",
  description:
    "Review submitted Facebook text for selected content patterns, including follow-exchange and engagement-bait phrases. This free local tool does not access Facebook account or Page data.",

  alternates: {
    canonical: "https://shadowban.online/facebook-shadowban-checker",
  },

  openGraph: {
    type: "website",
    title: "Facebook Content Pattern Checker",
    description:
      "Review Facebook text and keywords for selected content patterns. No Facebook login or password required.",
    url: "https://shadowban.online/facebook-shadowban-checker",
    siteName: "Shadowban.online",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Facebook content pattern checker by Shadowban.online",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Facebook Content Pattern Checker",
    description:
      "Review submitted Facebook text for selected patterns. No Facebook password required.",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return <FacebookLanding locale="en" />;
}
