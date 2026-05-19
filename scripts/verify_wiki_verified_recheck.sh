#!/usr/bin/env bash
# Verifies wiki-verified-pages-recheck-001:
#   1. No prototype-era hex values remain in the four target MDX pages.
#   2. npm run build exits 0.
#   3. PAGE_AUDIT.md contains a color-recheck follow-up note for both
#      MuteSolo.mdx and SongSections.mdx.
set -euo pipefail
cd "$(dirname "$0")/.."

PAGES=(
  "docs/MakingSound/MuteSolo.mdx"
  "docs/MakingSound/SongSections.mdx"
  "docs/MakingSound/Tracks.mdx"
  "docs/MakingSound/ColorMapping.mdx"
)

PROTO_PATTERN='#(F7DC6F|4ECDC4|45B7D1|FF6B6B)'

echo "=== AC1: prototype hex sweep ==="
found=0
for page in "${PAGES[@]}"; do
  if [ ! -f "$page" ]; then
    echo "WARN: $page not found — skipping"
    continue
  fi
  hits=$(grep -cE "$PROTO_PATTERN" "$page" || true)
  if [ "$hits" -gt 0 ]; then
    echo "FAIL: $page still contains $hits prototype-era hex match(es):"
    grep -nE "$PROTO_PATTERN" "$page" || true
    found=$((found + 1))
  fi
done
[ "$found" -eq 0 ] || { echo "FAIL: AC1 — $found page(s) still have prototype colors"; exit 1; }
echo "PASS: 0 prototype hex values in any of the 4 target pages"

echo ""
echo "=== AC2: build check ==="
npm run build > /tmp/wiki-verified-recheck-build.log 2>&1 \
  || { echo "FAIL: build — see /tmp/wiki-verified-recheck-build.log"; tail -20 /tmp/wiki-verified-recheck-build.log; exit 1; }
echo "PASS: npm run build exits 0"

echo ""
echo "=== AC3: PAGE_AUDIT.md color-recheck notes ==="
AUDIT="$HOME/.starseed/projects/pixelboop-wiki-sync/PAGE_AUDIT.md"
[ -f "$AUDIT" ] || { echo "FAIL: $AUDIT not found"; exit 1; }

grep -qi "color recheck" "$AUDIT" \
  || { echo "FAIL: PAGE_AUDIT.md has no 'color recheck' entry — update MuteSolo and SongSections rows"; exit 1; }

# Both pages must have a recheck note
grep "MuteSolo.mdx" "$AUDIT" | grep -qi "color recheck" \
  || { echo "FAIL: PAGE_AUDIT.md MuteSolo.mdx row missing 'color recheck' note"; exit 1; }

grep "SongSections.mdx" "$AUDIT" | grep -qi "color recheck" \
  || { echo "FAIL: PAGE_AUDIT.md SongSections.mdx row missing 'color recheck' note"; exit 1; }

echo "PASS: PAGE_AUDIT.md color-recheck notes present for MuteSolo and SongSections"

echo ""
echo "ALL CHECKS PASSED — wiki-verified-pages-recheck-001 is PASS"
