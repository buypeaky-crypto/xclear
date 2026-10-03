# xclear
Shadowban check tool - Next.js + Tailwind + Edge API

## Checker API environment

Configure these variables in the local environment and the Vercel project settings:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `X_BEARER_TOKEN`

The shared checker API requires Upstash Redis for rate limits and its one-hour result cache.
X checks also require an X API bearer token. Keep credentials server-side; do not prefix
them with `NEXT_PUBLIC_` or commit real values. Without the X token, X checks return an
unavailable response rather than a clean result.