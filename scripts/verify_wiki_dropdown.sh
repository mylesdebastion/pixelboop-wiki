#!/usr/bin/env bash
# Verifies wiki-dropdown-001: docsVersionDropdown is wired in the navbar
# and the site still builds without introducing new typecheck errors.
#
# NOTE: The codebase has 6 pre-existing typecheck errors (CommentSection,
# DocLink, MystrixVisualizer, PaletteVisualizer, BlogPostPaginator) that
# predate this predicate. This script verifies the count doesn't grow
# rather than requiring exit 0 from tsc.
set -euo pipefail
cd "$(dirname "$0")/.."

# AC: docsVersionDropdown is present in config
grep -q "docsVersionDropdown" docusaurus.config.ts \
  || { echo "FAIL: docsVersionDropdown not found in docusaurus.config.ts"; exit 1; }
echo "PASS: docsVersionDropdown found in docusaurus.config.ts"

# AC: position + dropdownActiveClassDisabled wired correctly
grep -A2 "docsVersionDropdown" docusaurus.config.ts | grep -q "position: 'right'" \
  || { echo "FAIL: docsVersionDropdown missing position: 'right'"; exit 1; }
echo "PASS: position: 'right' confirmed"

grep -A3 "docsVersionDropdown" docusaurus.config.ts | grep -q "dropdownActiveClassDisabled: true" \
  || { echo "FAIL: dropdownActiveClassDisabled: true not set"; exit 1; }
echo "PASS: dropdownActiveClassDisabled: true confirmed"

# AC: no new typecheck errors introduced (baseline = 6 pre-existing errors)
BASELINE_ERRORS=6
npm run typecheck > /tmp/wiki-typecheck.log 2>&1 || true   # don't fail on pre-existing
ACTUAL_ERRORS=$(grep -c "^src/" /tmp/wiki-typecheck.log || echo "0")
if [ "$ACTUAL_ERRORS" -gt "$BASELINE_ERRORS" ]; then
  echo "FAIL: typecheck regression — $ACTUAL_ERRORS errors (baseline $BASELINE_ERRORS)"
  tail -20 /tmp/wiki-typecheck.log
  exit 1
fi
echo "PASS: typecheck errors $ACTUAL_ERRORS (within baseline $BASELINE_ERRORS)"

# AC: build exits 0
npm run build > /tmp/wiki-build.log 2>&1 \
  || { echo "FAIL: build — see /tmp/wiki-build.log"; tail -20 /tmp/wiki-build.log; exit 1; }
echo "PASS: build green"

echo ""
echo "ALL CHECKS PASSED — wiki-dropdown-001 verified"
