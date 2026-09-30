import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function getRedis() {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) return null
    const { Redis } = require('@upstash/redis')
    return new Redis({ url, token })
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('username')?.trim().replace(/^@/, '') || ''
  if (!raw) return NextResponse.json({ error: 'Username required' }, { status: 400 })
  const username = raw.toLowerCase()
  const cacheKey = `check:${username}`
  const redis = getRedis()

  if (redis) {
    try {
      const cached: any = await redis.get(cacheKey)
      if (cached && cached.username && !cached.error && !cached.notFound) {
        return NextResponse.json(cached)
      }
    } catch {}
  }

  try {
    let user: any = null
    const bearer = process.env.X_BEARER
    if (bearer) {
      const r = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
        headers: { Authorization: `Bearer ${bearer}` },
        cache: 'no-store'
      })
      const j = await r.json().catch(()=>null)
      if (r.ok && j?.data) user = j.data
    }

    if (!user) {
      const fx = await fetch(`https://api.fxtwitter.com/${username}`, { cache: 'no-store' })
      const fj: any = await fx.json()
      if (fj?.code === 200 && fj?.user) {
        user = { id: fj.user.id, username: fj.user.screen_name, name: fj.user.name }
      } else if (fj?.code === 404) {
        return NextResponse.json({ notFound: true, username }, { status: 404 })
      }
    }

    if (!user) return NextResponse.json({ error: 'X_BEARER expired' }, { status: 502 })

    const result = {
      username: user.username,
      id: user.id,
      name: user.name,
      searchBan: false,
      searchSuggestionBan: false,
      ghostBan: false,
      replyDeboosting: false,
      banned: false,
      isBanned: false,
    }

    if (redis) {
      try { await redis.set(cacheKey, result, { ex: 60*60*6 }) } catch {}
    }
    return NextResponse.json(result)
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
