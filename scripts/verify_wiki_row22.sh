#!/usr/bin/env bash
# Verifies wiki-row22-lane-001: row 22 is documented as the Indicator Lane
# (Track Colors + Key Automation), not as 'unused' or 'reserved'.
# Source of truth: FeatureFlags.swift "MARK: - Row 22 Indicator Lane" section.
set -euo pipefail
cd "$(dirname "$0")/.."

# AC 1: no doc describes row 22 as unused/empty
bad_matches=$(grep -ri 'row 22.*unused\|unused.*row 22\|row 22 is empty\|Row 22: Reserved for future' docs/ || true)
if [ -n "$bad_matches" ]; then
  echo "FAIL: stale 'unused/reserved' language still present:"
  echo "$bad_matches"
  exit 1
fi
echo "PASS: no 'unused/reserved' language for row 22"

# AC 2: at least one .mdx page mentions both 'Track Colors' and 'Key Automation'
track_colors_file=$(grep -rl 'Track Colors' docs/ | head -1 || true)
key_auto_file=$(grep -rl 'Key Automation' docs/ | head -1 || true)

if [ -z "$track_colors_file" ]; then
  echo "FAIL: no .mdx file mentions 'Track Colors'"
  exit 1
fi
if [ -z "$key_auto_file" ]; then
  echo "FAIL: no .mdx file mentions 'Key Automation'"
  exit 1
fi

# Check they co-occur in the same file
combined_file=$(grep -rl 'Track Colors' docs/ | while read f; do
  grep -l 'Key Automation' "$f" 2>/dev/null && break || true
done | head -1 || true)

if [ -z "$combined_file" ]; then
  echo "FAIL: no single .mdx file contains both 'Track Colors' and 'Key Automation'"
  exit 1
fi
echo "PASS: '$combined_file' contains both 'Track Colors' and 'Key Automation'"

# AC 3: GettingStarted.mdx visualizer uses 'Indicator Lane' for row 22
indicator_match=$(grep -c 'Indicator Lane' docs/GettingStarted/GettingStarted.mdx || true)
if [ "$indicator_match" -eq 0 ]; then
  echo "FAIL: GettingStarted.mdx visualizer still does not label row 22 as 'Indicator Lane'"
  exit 1
fi
echo "PASS: GettingStarted.mdx labels row 22 as 'Indicator Lane'"

# AC 4: build exits 0
echo "Running npm run build..."
npm run build > /tmp/wiki-row22-build.log 2>&1 \
  || { echo "FAIL: npm run build failed"; tail -30 /tmp/wiki-row22-build.log; exit 1; }
echo "PASS: npm run build succeeded"

echo ""
echo "ALL CHECKS PASSED — wiki-row22-lane-001 is closed"
