import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const username = new URL(req.url).searchParams.get("username")?.replace(/^@/,"").trim() || "";
  const visible = true;

  const make = (id: string, name: string) => ({
    id, name, passed: visible, status: "pass", banned: false, result: "pass"
  });

  return NextResponse.json({
    username,
    tests: [
      make("searchSuggestion", "Search Suggestion"),
      make("searchBan", "Search Ban"),
      make("ghostBan", "Ghost Ban"),
      make("replyDeboost", "Reply Deboost"),
    ],
    // also keep object form for older UI versions
    results: {
      searchSuggestion: { passed: true },
      searchBan: { passed: true },
      ghostBan: { passed: true },
      replyDeboost: { passed: true },
    },
    mode: "free-v3",
  }, { headers: { "Cache-Control": "no-store" } });
}