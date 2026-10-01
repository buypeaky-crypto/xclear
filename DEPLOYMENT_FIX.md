# Vercel Deployment Fix

## Why the deployment is stale

The Vercel project `shadowbannchecker-...` is connected to `buypeaky-crypto/shadowbannchecker`, while the current SEO changes are pushed to `buypeaky-crypto/xclear` on `main` at commit `89b7b1c`. This Codespace's GitHub token has write access to `xclear` but not `shadowbannchecker`, so pushing to the latter fails with HTTP 403. Renaming `xclear` to `shadowbannchecker` is also unavailable while a repository with that name already exists.

## Solution A: connect Vercel to xclear (recommended)

1. Open the Vercel Dashboard and select the `shadowbannchecker-...` project.
2. Go to **Settings > Git** and disconnect `buypeaky-crypto/shadowbannchecker`.
3. Choose **Connect Git Repository**, select `buypeaky-crypto/xclear`, and save.

Vercel should then deploy `main`, including commit `89b7b1c`.

## Solution B: make the repository name shadowbannchecker

1. Rename `buypeaky-crypto/shadowbannchecker` to `shadowbannchecker-old` in GitHub Settings.
2. Rename `buypeaky-crypto/xclear` to `shadowbannchecker`.
3. Reconnect the Vercel project to the renamed repository in **Settings > Git**.

## Verify after deployment

- Open <https://shadowbannchecker.vercel.app/sitemap.xml> and check the URL entries.
- View source for <https://shadowbannchecker.vercel.app/de/instagram-shadowban-test> and confirm the title is `Instagram-Shadowban-Test | ShadowbannChecker`.

The current `xclear` build successfully emits the English, German, Indonesian, Portuguese, Spanish, and Italian Instagram URLs and has 19 valid indexable page URLs in total. The repository currently has 19 public page routes, so it cannot truthfully emit 20 distinct indexable URLs without adding another page. Do not count API, robots, sitemap, or not-found endpoints toward that total. If exactly 20 is required, identify the intended twentieth page before treating the URL-count check as passed.
