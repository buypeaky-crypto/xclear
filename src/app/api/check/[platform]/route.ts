import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get("username")?.replace(/^@/, "")?.trim() || "";
    if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });

    let suggestionVisible = false;
    let profileVisible = false;

    try {
      const p = await fetch(`https://x.com/${username}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      profileVisible = p.status === 200;
    } catch {}

    return NextResponse.json({
      username,
      signals: { searchSuggestion: suggestionVisible, publicProfile: profileVisible },
      mode: "free-guest-no-quota"
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}