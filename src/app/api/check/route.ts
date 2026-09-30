import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('username')?.trim().replace(/^@/, '') || ''
  if (!raw) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 })
  }
  const username = raw.toLowerCase()
  const cacheKey = `check:${username}`

  try {
    const cached: any = await redis.get(cacheKey)
    // only return cache if it's a real result, not an error
    if (cached && !cached.error && !cached.notFound) {
      return NextResponse.json(cached)
    }
  } catch {}

  try {
    const bearer = process.env.X_BEARER || process.env.TWITTER_BEARER_TOKEN
    if (!bearer) throw new Error('Missing X_BEARER in env')

    const r = await fetch(`https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics`, {
      headers: { Authorization: `Bearer ${bearer}` },
      cache: 'no-store'
    })

    if (r.status === 404) {
      return NextResponse.json({ notFound: true, username }, { status: 404 })
    }
    if (!r.ok) {
      const txt = await r.text()
      console.error('X API', r.status, txt)
      return NextResponse.json({ error: 'X API failed' }, { status: 502 })
    }
    const json = await r.json()
    if (!json?.data) {
      return NextResponse.json({ notFound: true, username }, { status: 404 })
    }

    const result = {
      username: json.data.username,
      id: json.data.id,
      searchBan: false,
      searchSuggestionBan: false,
      ghostBan: false,
      replyDeboosting: false,
      banned: false,
      isBanned: false,
    }

    // cache ONLY success, 6h
    await redis.set(cacheKey, result, { ex: 60 * 60 * 6 })
    return NextResponse.json(result)

  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
} 