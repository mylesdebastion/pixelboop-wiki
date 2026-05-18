#!/usr/bin/env bash
# Verifies wiki-snapshot-1.1.0-001: 1.1.0 snapshot created,
# legacy template snapshots removed, build still green.
set -euo pipefail
cd "$(dirname "$0")/.."

grep -q '"1.1.0"' versions.json \
  || { echo "FAIL: 1.1.0 not in versions.json"; cat versions.json; exit 1; }

if grep -qE '"(2\.6|3\.0|3\.1)"' versions.json; then
  echo "FAIL: legacy version still listed in versions.json"; cat versions.json; exit 1
fi

[ -d "versioned_docs/version-1.1.0" ] \
  || { echo "FAIL: versioned_docs/version-1.1.0 missing"; exit 1; }

for v in 2.6 3.0 3.1; do
  if [ -d "versioned_docs/version-$v" ]; then
    echo "FAIL: legacy versioned_docs/version-$v still present"; exit 1
  fi
done

count=$(find versioned_docs/version-1.1.0 -type f \( -name "*.mdx" -o -name "*.md" \) | wc -l | tr -d ' ')
[ "$count" -ge 14 ] \
  || { echo "FAIL: only $count files in 1.1.0 snapshot (expected ≥14)"; exit 1; }

npm run build > /tmp/wiki-build.log 2>&1 \
  || { echo "FAIL: build — see /tmp/wiki-build.log"; tail -20 /tmp/wiki-build.log; exit 1; }

echo "PASS: 1.1.0 snapshot ($count files), legacy versions removed, build green"
