# Pixelboop Wiki

Docusaurus documentation site for [Pixelboop](https://pixelboop.com).
Lives at **https://wiki.pixelboop.com**.

## Development

```
yarn          # install
yarn start    # dev server with live reload
yarn build    # static build to ./build
```

## Deployment

Pushes to `master` auto-deploy to wiki.pixelboop.com via the Vercel project `pixelboop-wiki`. Manual deploy:

```
vercel deploy --prod --yes
```

### Pre-deploy guard — read this once

Before any manual deploy, confirm the local Vercel link is correct:

```
jq -r .projectName .vercel/project.json
# expected: pixelboop-wiki
```

If it says **`web`** instead of `pixelboop-wiki`, **stop**. `web` is an orphan Vercel project linked to this same repo that on 2026-05-18 captured `coach.pixelboop.com` and replaced the coach chat UI with a Docusaurus build. Re-link before deploying:

```
rm -rf .vercel
vercel link --project pixelboop-wiki --yes
```

Full background and recovery steps are in the pixelboop repo at `docs/incidents/2026-05-19-coach-wiki-domain-capture.md`. Agent-specific guidance is in `CLAUDE.md` in this directory.
