#!/usr/bin/env bash
# Verifies wiki-version-label-001: current version label is '1.1.0 b3' (not '1.1.1 b3').
# One-character typo fix — no baseline tolerance; build must pass cleanly.
set -euo pipefail
cd "$(dirname "$0")/.."

# AC 1: exactly 1 occurrence of '1.1.0 b3'
count_correct=$(grep -c "1.1.0 b3" docusaurus.config.ts || true)
[ "$count_correct" -eq 1 ] \
  || { echo "FAIL: expected 1 match for '1.1.0 b3', got $count_correct"; exit 1; }
echo "PASS: '1.1.0 b3' found exactly once in docusaurus.config.ts"

# AC 2: zero occurrences of the typo '1.1.1 b3'
count_typo=$(grep -c "1.1.1 b3" docusaurus.config.ts || true)
[ "$count_typo" -eq 0 ] \
  || { echo "FAIL: typo '1.1.1 b3' still present ($count_typo match(es))"; exit 1; }
echo "PASS: typo '1.1.1 b3' not present"

# AC 3: build exits 0
echo "Running npm run build..."
npm run build > /tmp/wiki-version-label-build.log 2>&1 \
  || { echo "FAIL: npm run build failed"; tail -30 /tmp/wiki-version-label-build.log; exit 1; }
echo "PASS: npm run build succeeded"

echo ""
echo "ALL CHECKS PASSED — wiki-version-label-001 is closed"
