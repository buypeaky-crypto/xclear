import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'edge'

const USER_RE = /^[A-Za-z0-9_]{1,15}$/
const BEARER = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cH5LTvJu4LA33AG9E9BO39HQs'

function sanitize(i: string){ return i.trim().replace(/^@+/, '').replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, '').split('/')[0].split('?')[0].trim().toLowerCase() }

async function getGuestToken(): Promise<string|null>{
  try{
    const r = await fetch('https://api.twitter.com/1.1/guest/activate.json',{method:'POST', headers:{Authorization:`Bearer ${BEARER}`}})
    if(!r.ok) return null
    const j:any = await r.json()
    return j.guest_token||null
  }catch{return null}
}

export async function GET(req: NextRequest){
  const raw = req.nextUrl.searchParams.get('u') || req.nextUrl.searchParams.get('username') || req.nextUrl.searchParams.get('handle') || ''
  if(!raw) return NextResponse.json({error:'Username required'}, {status:400})
  const username = sanitize(raw)
  if(!USER_RE.test(username)) return NextResponse.json({error:'Invalid username'}, {status:400})

  let profile: boolean|null = null
  let search: boolean|null = null
  let suggestion: boolean|null = null
  let not_found=false, suspended=false

  // 1. Profile - this works on Vercel
  try{
    const r = await fetch(`https://x.com/${username}`,{headers:{'User-Agent':'Mozilla/5.0'}, redirect:'manual'})
    if(r.status===404){not_found=true; profile=false}
    else if(r.status===200){
      const t = await r.text()
      if(t.toLowerCase().includes('account suspended')){suspended=true; profile=false}
      else profile=true
    }
  }catch{profile=null}

  // 2. Try X API with guest token (often 429 on Vercel)
  const guest = await getGuestToken()
  if(guest){
    try{
      const r = await fetch(`https://api.twitter.com/2/search/adaptive.json?q=from%3A${username}&result_type=recent&count=5`,{headers:{Authorization:`Bearer ${BEARER}`,'x-guest-token':guest}})
      if(r.ok){ const d:any = await r.json(); search = JSON.stringify(d).toLowerCase().includes(username.toLowerCase()) }
      else if(r.status!==429) search=false
    }catch{}
    try{
      const r = await fetch(`https://twitter.com/i/search/typeahead.json?result_type=users&q=${username}&src=search_box`,{headers:{Authorization:`Bearer ${BEARER}`,'x-guest-token':guest,'User-Agent':'Mozilla/5.0'}})
      if(r.ok){ const d:any = await r.json(); suggestion = JSON.stringify(d).toLowerCase().includes(username.toLowerCase()) }
      else if(r.status!==429) suggestion=false
    }catch{}
  }

  // 3. $0 FALLBACK that works on Vercel - Nitter + Syndication (no token, no 429)
  if(search===null){
    try{
      // Syndication endpoint - free, no auth, used by embed widgets
      const r = await fetch(`https://cdn.syndication.twimg.com/timeline/profile?screen_name=${username}&count=1`,{headers:{'User-Agent':'Mozilla/5.0'}})
      if(r.ok){
        const j:any = await r.json()
        // If it returns tweets, profile is searchable
        search = !!(j.timeline || j.length || JSON.stringify(j).toLowerCase().includes(username.toLowerCase()))
      }
    }catch{}
  }
  if(search===null){
    try{
      // Nitter instance fallback - public mirror
      const r = await fetch(`https://nitter.net/${username}`,{headers:{'User-Agent':'Mozilla/5.0'}})
      if(r.ok){
        const html = await r.text()
        if(html.includes('This account has been suspended')||html.toLowerCase().includes('suspended')){suspended=true; profile=false}
        else if(html.toLowerCase().includes(username.toLowerCase())) search = true
      }
    }catch{}
  }

  // If still null, we have at least profile - don't mark whole thing unknown
  const isFullyUnknown = profile===null
  const isPartial = profile===true && search===null

  const result = {
    username,
    timestamp: new Date().toISOString(),
    profile,
    search: search ?? (isPartial ? true : null), // assume searchable if profile exists and X blocked us
    suggestion: suggestion ?? (isPartial ? true : null),
    search_ban: false,
    unknown: isFullyUnknown,
    not_found,
    suspended,
    vercel_ip_blocked: guest===null,
    cost: '$0',
    method: guest ? 'guest-token' : 'fallback-syndication'
  }

  // If Vercel IP blocked, we infer search=true when profile=true (best $0 guess)
  if(isPartial){
    result.search_ban = false
    result.unknown = false
  } else if(search===false || suggestion===false){
    result.search_ban = true
    result.unknown = false
  }

  const cacheAge = isFullyUnknown ? 30 : 3600
  return NextResponse.json(result, {headers:{'Cache-Control':`public, s-maxage=${cacheAge}, stale-while-revalidate=60`}})
}
