import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv()

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('username')?.trim().replace(/^@/, '') || ''
  if (!raw) return NextResponse.json({ error: 'Username required' }, { status: 400 })
  const username = raw.toLowerCase()
  const cacheKey = `check:${username}`

  // DISABLED READ - comment this out until X_BEARER is fixed
  // try {
  //   const cached:any = await redis.get(cacheKey)
  //   if (cached && !cached.error && !cached.notFound && cached.username) {
  //     return NextResponse.json(cached)
  //   }
  // } catch {}

  try {
    let user: any = null
    const bearer = process.env.X_BEARER || process.env.TWITTER_BEARER_TOKEN
    if (bearer) {
      const r = await fetch(`https://api.twitter.com/2/users/by/username/${username}?user.fields=id,username,name`, {
        headers: { Authorization: `Bearer ${bearer}` },
        cache: 'no-store'
      })
      const j = await r.json().catch(()=>({}))
      if (r.ok && j?.data) user = j.data
      else console.log('X API fail', r.status, JSON.stringify(j).slice(0,300))
    }

    if (!user) {
      const fx = await fetch(`https://api.fxtwitter.com/${username}`, { cache: 'no-store' })
      const fj: any = await fx.json()
      if (fj?.code === 200 && fj?.user?.screen_name) {
        user = { id: fj.user.id, username: fj.user.screen_name, name: fj.user.name }
      } else if (fj?.code === 404) {
        return NextResponse.json({ notFound: true, username }, { status: 404 })
      }
    }

    if (!user) return NextResponse.json({ error: 'X_BEARER expired and fallback failed' }, { status: 502 })

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
    await redis.set(cacheKey, result, { ex: 60 * 60 * 6 })
    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
