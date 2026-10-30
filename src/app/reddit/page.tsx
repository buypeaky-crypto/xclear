
import type { Metadata } from "next";
import Home from "../page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reddit Public Profile Visibility Checker",
  description:
    "Check public Reddit profile availability and returned account details when accessible. An inaccessible profile alone does not prove a shadowban.",

  alternates: {
    canonical: "https://shadowban.online/checker/reddit",
  },

  openGraph: {
    type: "website",
    title: "Reddit Public Profile Visibility Checker",
    description:
      "Investigate public Reddit profile availability using a logged-out lookup. Understand what the results can and cannot tell you.",
    url: "https://shadowban.online/checker/reddit",
    siteName: "Shadowban.online",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Reddit public profile visibility checker",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Reddit Public Profile Visibility Checker",
    description:
      "Review public Reddit profile availability and returned account information. No Reddit password required.",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return (
    <div className="bg-platform-reddit">
      <Home
        platform="reddit"
        backgroundClassName="bg-transparent"
      />
    </div>
  );
}
