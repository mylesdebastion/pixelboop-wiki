#!/usr/bin/env bash
# Verifies wiki-rewrite-001: integration branch has commits applying the audit,
# all changes are in-scope, build still green.
set -euo pipefail
cd "$(dirname "$0")/.."

git rev-parse feat/wiki-rewrite-1.1.0 > /dev/null 2>&1 \
  || { echo "FAIL: branch feat/wiki-rewrite-1.1.0 missing"; exit 1; }

# Count commits ahead of master
commits=$(git log master..feat/wiki-rewrite-1.1.0 --oneline 2>/dev/null | wc -l | tr -d ' ')
[ "$commits" -gt 0 ] \
  || { echo "FAIL: no commits on integration branch ahead of master"; exit 1; }

# Out-of-scope guard — only docs/, sidebars.ts, scripts/, versioned_docs/,
# versioned_sidebars/, versions.json, docusaurus.config.ts are fair game.
out_of_scope=$(git diff master..feat/wiki-rewrite-1.1.0 --name-only \
  | grep -vE '^(docs/|sidebars\.ts$|scripts/|versioned_docs/|versioned_sidebars/|versions\.json$|docusaurus\.config\.ts$)' \
  || true)
if [ -n "$out_of_scope" ]; then
  echo "FAIL: out-of-scope files changed:"
  echo "$out_of_scope"
  exit 1
fi

npm run build > /tmp/wiki-build.log 2>&1 \
  || { echo "FAIL: build — see /tmp/wiki-build.log"; tail -20 /tmp/wiki-build.log; exit 1; }

echo "PASS: $commits commits on integration branch, scope clean, build green"
