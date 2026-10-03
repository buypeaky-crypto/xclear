import { NextRequest, NextResponse } from "next/server";
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0
export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username")?.trim().replace(/^@/, "");
  if (!username) return NextResponse.json({ error: "Username required." }, { status: 400 });
  const destination = new URL(`/api/check/twitter?username=${encodeURIComponent(username)}`, req.url);
  return NextResponse.redirect(destination, 307);
}
