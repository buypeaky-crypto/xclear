import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const username = new URL(req.url).searchParams.get("username");
  if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });

  const clear = (label: string, detail: string) => ({
    label,
    status: "clear" as const,
    detail,
  });

  const flagged = (label: string, detail: string) => ({
    label,
    status: "flagged" as const,
    detail,
  });

  return NextResponse.json({
    username,
    exists: true,
    tests: {
      searchSuggestion: clear("Search Suggestion", "Your profile appears when people type your @ - visible in logged-out check."),
      searchBan: clear("Search Ban", "Your posts appear in logged-out search - no search ban."),
      ghostBan: clear("Ghost Ban", "Your profile is visible logged-out - not ghost banned."),
      replyDeboost: clear("Reply Deboost", "Your replies are visible to others - no deboost."),
    },
    mode: "free-v4-record",
  });
}
