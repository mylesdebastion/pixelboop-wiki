#!/usr/bin/env bash
# Verifies wiki-report-001: board-level report exists with required
# sections and visual evidence.
set -euo pipefail

REPORT="$HOME/starseed/artifacts/pixelboop-wiki-sync-board-report.md"
[ -f "$REPORT" ] || { echo "FAIL: $REPORT not found"; exit 1; }

# Required sections (case-insensitive)
required=("executive summary" "version dropdown" "representative pages" "audit summary" "decision queue" "deploy checklist" "honest gaps")
for section in "${required[@]}"; do
  grep -qi "$section" "$REPORT" || { echo "FAIL: section '$section' missing"; exit 1; }
done

# At least 8 image references
img_refs=$(grep -cE '!\[[^]]*\]\([^)]+\)' "$REPORT" || true)
[ "$img_refs" -ge 8 ] \
  || { echo "FAIL: only $img_refs image refs (expected ≥8)"; exit 1; }

# At least one referenced image file actually exists
ok=0
while IFS= read -r path; do
  # Strip optional ./ or leading slash; resolve relative to artifacts/
  if [[ "$path" == /* ]]; then
    full="$path"
  else
    full="$HOME/starseed/artifacts/$path"
  fi
  [ -f "$full" ] && ok=$((ok+1))
done < <(grep -oE '!\[[^]]*\]\(([^)]+)\)' "$REPORT" | sed -E 's/.*\(([^)]+)\)/\1/' | head -10)
[ "$ok" -gt 0 ] \
  || { echo "FAIL: no image refs resolve to actual files (checked first 10)"; exit 1; }

# Deploy checklist must explicitly mention manual deploy
grep -qiE "manual|vercel --prod|vercel deploy" "$REPORT" \
  || { echo "FAIL: deploy section doesn't mention manual deploy"; exit 1; }

echo "PASS: report has all 7 sections, $img_refs images ($ok resolved), manual deploy noted"
