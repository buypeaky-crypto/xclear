import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  const { username } = await req.json();
  // forward to free logic
  return NextResponse.redirect(new URL(`/api/check/twitter?username=${username}`, req.url));
}
export const runtime = 'nodejs';