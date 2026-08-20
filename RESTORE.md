# How to put the live wiki back

The live site is <https://wiki.pixelboop.com>. Vercel builds it from the
`master` branch of this repo. Any push to `master` deploys.

## The safety point

Before the 1.2.0 update started, the live commit was tagged.

| | |
|---|---|
| Tag | `restore/wiki-live-2026-08-18` |
| Commit | `1ab7753ef07b492c1a30e54cad48272f26c8c295` |
| Date | 2026-08-18 |
| On GitHub | yes, pushed |

The tag was checked against `origin/master` on the day it was made. Both point
to the same commit.

## Restore, one command

```bash
git -C ~/Documents/GitHub/pixelboop-wiki fetch origin --tags && git -C ~/Documents/GitHub/pixelboop-wiki push --force-with-lease origin restore/wiki-live-2026-08-18^{commit}:master
```

Vercel sees the push and rebuilds. Wait about two minutes, then check the site.

`--force-with-lease` is deliberate. It refuses to run if someone else pushed to
`master` after you last fetched. If it refuses, fetch again and look at what
changed before you force it.

You do not need this repo on disk. From any machine:

```bash
git clone https://github.com/mylesdebastion/pixelboop-wiki.git /tmp/pbwiki-restore && git -C /tmp/pbwiki-restore push --force-with-lease origin restore/wiki-live-2026-08-18^{commit}:master
```

## Restore without git

Vercel keeps every past build. Open the Vercel dashboard, go to the
`pixelboop-wiki` project, open Deployments, find the build made from commit
`1ab7753`, and use **Promote to Production**. This is instant. It does not
change git, so the next push to `master` will overwrite it. Use the git path
for a permanent restore.

## Check it worked

```bash
git ls-remote origin master
```

The SHA it prints must be `1ab7753ef07b492c1a30e54cad48272f26c8c295`.

## What this tag does not cover

- Comments on doc pages. Those live in GitHub Discussions (giscus), not in this
  repo. A restore does not touch them.
- The `wiki/v1.1.3-audit-fixes` branch. That branch holds 27 commits of 1.1.3
  fix work that never reached `master`. It is separate and is not affected.
