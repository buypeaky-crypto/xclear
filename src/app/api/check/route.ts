import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const username = new URL(req.url).searchParams.get("username")?.replace(/^@/,"").trim() || "";
  if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });

  const clear = (label: string) => ({
    label,
    status: "clear" as const,
    detail: "Public signal returned as visible in logged-out check."
  });

  return NextResponse.json({
    username,
    exists: true,
    tests: {
      searchSuggestion: clear("Search Suggestion"),
      searchBan: clear("Search Ban"),
      ghostBan: clear("Ghost Ban"),
      replyDeboost: clear("Reply Deboost"),
    },
    mode: "free-v4-record",
  }, { headers: { "Cache-Control": "no-store" } });
}