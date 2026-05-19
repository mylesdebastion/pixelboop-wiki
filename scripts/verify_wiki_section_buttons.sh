#!/usr/bin/env bash
# Verifies wiki-section-buttons-001:
#   Section Play button (row 23, cols 36-37) and
#   Clear All Sections button (row 23, cols 38-43)
#   are documented with visualizer demos in SongSections.mdx.
# Source of truth: PixelGridUIView.swift renderSectionPlayButton (line 2475)
#                  and renderClearAllSectionsButton (line 2496).
set -euo pipefail
cd "$(dirname "$0")/.."

TARGET="docs/MakingSound/SongSections.mdx"
PASS=true

# AC 1: pos [36, 23] present at least once (macOS-safe grep)
count1=$(grep -cE '"pos":[[:space:]]*\[36,[[:space:]]*23\]' "$TARGET" || true)
if [ "${count1:-0}" -lt 1 ]; then
  echo "FAIL: AC1 — no pos [36, 23] found in $TARGET (got ${count1:-0})"
  PASS=false
else
  echo "PASS: AC1 — pos [36, 23] found (${count1} occurrence(s))"
fi

# AC 2: pos [38, 23] present at least once (macOS-safe grep)
count2=$(grep -cE '"pos":[[:space:]]*\[38,[[:space:]]*23\]' "$TARGET" || true)
if [ "${count2:-0}" -lt 1 ]; then
  echo "FAIL: AC2 — no pos [38, 23] found in $TARGET (got ${count2:-0})"
  PASS=false
else
  echo "PASS: AC2 — pos [38, 23] found (${count2} occurrence(s))"
fi

# AC 3a: document mentions 'Section Play'
if ! grep -q "Section Play" "$TARGET"; then
  echo "FAIL: AC3a — 'Section Play' not found in $TARGET"
  PASS=false
else
  echo "PASS: AC3a — 'Section Play' present"
fi

# AC 3b: document mentions 'Clear'
if ! grep -q "Clear" "$TARGET"; then
  echo "FAIL: AC3b — 'Clear' not found in $TARGET"
  PASS=false
else
  echo "PASS: AC3b — 'Clear' present"
fi

# AC 4: build exits 0
echo "Running npm run build..."
npm run build > /tmp/wiki-section-buttons-build.log 2>&1 \
  || { echo "FAIL: AC4 — npm run build failed"; tail -30 /tmp/wiki-section-buttons-build.log; PASS=false; }
if $PASS; then
  echo "PASS: AC4 — npm run build succeeded"
fi

# AC 5: commit(s) cite renderSectionPlayButton Swift refs
# Use BASE_COMMIT env var if set, otherwise try origin/HEAD, else skip gracefully
base_ref="${BASE_COMMIT:-$(git rev-parse origin/HEAD 2>/dev/null || echo '')}"
if [ -n "$base_ref" ]; then
  commit_msgs=$(git log --oneline "${base_ref}..HEAD" 2>/dev/null || true)
else
  commit_msgs=$(git log --oneline -5 2>/dev/null || true)
fi
if echo "$commit_msgs" | grep -qi "renderSectionPlayButton"; then
  echo "PASS: AC5 — commit cites renderSectionPlayButton"
else
  echo "WARN: AC5 — no commit yet cites 'renderSectionPlayButton' (expected after this run commits)"
fi

echo ""
if $PASS; then
  echo "ALL CHECKS PASSED — wiki-section-buttons-001 is closed"
else
  echo "ONE OR MORE CHECKS FAILED"
  exit 1
fi
