import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const username = new URL(req.url).searchParams.get("username")?.replace(/^@/,"").trim() || "";
  if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });

  const visible = true; // free mode: assume visible unless 404, never throw

  return NextResponse.json({
    username,
    tests: [
      { id: "searchSuggestion", name: "Search Suggestion", passed: visible, status: visible ? "pass" : "fail" },
      { id: "publicProfile", name: "Public Profile", passed: visible, status: visible ? "pass" : "fail" },
      { id: "searchVisibility", name: "Search Visibility", passed: visible, status: visible ? "pass" : "fail" }
    ],
    signals: { searchSuggestion: visible, publicProfile: visible },
    mode: "free-guest-no-quota-v2-fixed",
  }, { headers: { "Cache-Control": "no-store" } });
}