import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv()

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('username')?.trim().replace(/@/,'') || ''
  if(!raw) return NextResponse.json({ error: 'Username required' }, {status:400})
  const username = raw.toLowerCase()
  const cacheKey = `check:${username}`

  try {
    const cached:any = await redis.get(cacheKey)
    if(cached && !cached.error && !cached.notFound && cached.username) {
      return NextResponse.json(cached)
    }
  } catch {}

  try {
    const bearer = process.env.X_BEARER || process.env.TWITTER_BEARER_TOKEN || ''
    console.log('Using bearer len:', bearer.length)
    const r = await fetch(`https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics`, {
      headers: { Authorization: `Bearer ${bearer}` },
      cache: 'no-store'
    })
    const text = await r.text()
    let json:any = {}
    try { json = JSON.parse(text) } catch { json = { raw: text } }
    
    console.log('X API', r.status, text.slice(0,800))

    if(r.status === 404) {
      return NextResponse.json({ notFound: true, username }, {status:404})
    }
    if(!r.ok) {
      // DON'T return notFound, return the real error
      return NextResponse.json({ error: `X API ${r.status}`, details: json }, {status:502})
    }
    if(!json?.data) {
      return NextResponse.json({ error: 'No data from X', details: json }, {status:502})
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
    await redis.set(cacheKey, result, { ex: 60*60*6 })
    return NextResponse.json(result)
  } catch(e:any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, {status:500})
  }
}
