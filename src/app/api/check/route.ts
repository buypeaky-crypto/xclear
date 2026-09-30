export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const handle = searchParams.get('handle')
  
  if (!handle) {
    return new Response(JSON.stringify({ error: 'handle required' }), { status: 400 })
  }

  const data = {
    handle,
    status: 'clear',
    checkedAt: new Date().toISOString(),
  }

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
