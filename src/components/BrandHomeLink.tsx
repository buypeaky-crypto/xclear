import Link from "next/link";

export default function BrandHomeLink() {
  return (
    <p className="text-sm font-semibold uppercase text-violet-700">
      <Link
        href="/"
        className="rounded-sm transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
      >
        ShadowbannChecker
      </Link>
    </p>
  );
}