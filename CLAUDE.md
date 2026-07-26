# Pixelboop Wiki — agent instructions

Docusaurus site that ships to **wiki.pixelboop.com**.

## Project info
- Vercel Project: `pixelboop-wiki` (NOT `web`)
- Vercel Project ID: `prj_QrdLDX559lN3SOhnxTwxE2oBkgEr`
- GitHub source: `mylesdebastion/pixelboop-wiki`, production branch `master`
- Repo path: `/Users/dbi/Documents/GitHub/pixelboop-wiki`

## Deploy guard (READ BEFORE ANY DEPLOY)

Before `vercel deploy --prod` or before pushing to `master` (which auto-deploys), verify:

```bash
# 1. .vercel/project.json must point to pixelboop-wiki
jq -r .projectName .vercel/project.json
# expected: pixelboop-wiki
# if it says 'web': STOP. See the incident note below.

# 2. After deploy, smoke-test:
curl -sI https://wiki.pixelboop.com         | head -1   # expect 200
curl -sI https://coach.pixelboop.com/chat   | head -1   # expect 200 — must NOT have changed
```

## The `web` project trap (2026-05-18 incident)

There is an orphan Vercel project named `web` (id `prj_f3m4kxoQZq9cMe8U3a1qaKHjU5ja`) that is also git-linked to this same `pixelboop-wiki` GitHub repo. It does not own any custom domains today, but on 2026-05-18 it briefly owned `coach.pixelboop.com` — a wiki push then auto-built Docusaurus and shipped it to coach, taking the chat UI offline.

**If you ever see `.vercel/project.json` here naming `web` instead of `pixelboop-wiki`, do not run `vercel deploy --prod`.** Re-link first:

```bash
rm -rf .vercel
vercel link --project pixelboop-wiki --yes
```

Likewise, if `vercel link` ever prompts you to choose between `web` and `pixelboop-wiki`, choose `pixelboop-wiki`.

Full incident notes: `~/Documents/GitHub/pixelboop/docs/incidents/2026-05-19-coach-wiki-domain-capture.md`.

## Domains attached here
- `wiki.pixelboop.com` (production)
- `pixelboop-wiki.vercel.app` (Vercel default)

Any other `*.pixelboop.com` showing up on this project is a misconfiguration — the coach / tester / www subdomains all belong to the `pixelboop` Vercel project.
