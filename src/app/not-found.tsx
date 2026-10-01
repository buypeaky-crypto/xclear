import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found | ShadowbannChecker",
  description: "This ShadowbannChecker page could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFFBEB] px-4 py-16 text-stone-900">
      <section className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase text-violet-700">404</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Page not found</h1>
        <p className="mt-4 text-base leading-7 text-stone-600">
          This page may have moved or no longer exists.
        </p>
        <Link
          className="mt-7 inline-flex rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black"
          href="/"
        >
          Return to checker
        </Link>
      </section>
    </main>
  );
}