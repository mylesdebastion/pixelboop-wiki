#!/usr/bin/env bash
# Verifies wiki-dropdown-001: docsVersionDropdown is wired in the navbar
# and the site still builds + typechecks.
set -euo pipefail
cd "$(dirname "$0")/.."

grep -q "docsVersionDropdown" docusaurus.config.ts \
  || { echo "FAIL: docsVersionDropdown not found in docusaurus.config.ts"; exit 1; }

npm run typecheck > /tmp/wiki-typecheck.log 2>&1 \
  || { echo "FAIL: typecheck — see /tmp/wiki-typecheck.log"; tail -20 /tmp/wiki-typecheck.log; exit 1; }

npm run build > /tmp/wiki-build.log 2>&1 \
  || { echo "FAIL: build — see /tmp/wiki-build.log"; tail -20 /tmp/wiki-build.log; exit 1; }

echo "PASS: docsVersionDropdown wired + typecheck + build green"
