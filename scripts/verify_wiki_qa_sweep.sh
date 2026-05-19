#!/usr/bin/env bash
# verify_wiki_qa_sweep.sh
# Verifier for predicate wiki-qa-sweep-001
# Checks all 5 acceptance criteria.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SWEEP_DOC="$HOME/.starseed/projects/pixelboop-wiki-sync/QA_SWEEP_2026-05-18.md"

PASS=0
FAIL=0

check() {
    local desc="$1"
    local result="$2"
    if [ "$result" = "0" ]; then
        echo "  ✅ $desc"
        PASS=$((PASS + 1))
    else
        echo "  ❌ $desc"
        FAIL=$((FAIL + 1))
    fi
}

echo "=== wiki-qa-sweep-001 verifier ==="
echo ""

# AC1: QA_SWEEP_2026-05-18.md exists
echo "AC1: Sweep doc exists"
check "~/.starseed/projects/pixelboop-wiki-sync/QA_SWEEP_2026-05-18.md exists" \
    "$([ -f "$SWEEP_DOC" ] && echo 0 || echo 1)"

# AC2: Has table with at least 5 rows (counting non-header rows in main table)
echo ""
echo "AC2: Table has ≥5 rows"
TABLE_ROWS=$(grep -c "^| " "$SWEEP_DOC" 2>/dev/null || echo 0)
check "Table rows ≥5 (found: $TABLE_ROWS)" \
    "$([ "$TABLE_ROWS" -ge 5 ] && echo 0 || echo 1)"

# AC3: At least 3 distinct Swift refs cited (file:line format)
echo ""
echo "AC3: ≥3 distinct Swift refs"
SWIFT_REFS=$(grep -oE '(PixelGridUIView|FeatureFlags|SequencerViewModel)[^:]*\.[a-z]+:[0-9]+' "$SWEEP_DOC" 2>/dev/null | sort -u | wc -l | tr -d ' ')
check "≥3 distinct Swift refs (found: $SWIFT_REFS)" \
    "$([ "$SWIFT_REFS" -ge 3 ] && echo 0 || echo 1)"

# AC4: Applied fixes are committed; npm run build exits 0
echo ""
echo "AC4: npm run build"
cd "$REPO_ROOT"
if npm run build --silent 2>/dev/null; then
    check "npm run build exits 0" "0"
else
    check "npm run build exits 0" "1"
fi

# AC5: Decision Queue section present
echo ""
echo "AC5: Decision Queue section present"
check "Sweep doc contains 'Decision Queue' section" \
    "$(grep -q 'Decision Queue' "$SWEEP_DOC" && echo 0 || echo 1)"

# Additional: Verify melody color fix was applied (no old broken hex remains)
echo ""
echo "BONUS: Melody color correctness"
if grep -qr "4D2DF2\|4C2EF2" "$REPO_ROOT/docs/" 2>/dev/null; then
    check "No old broken melody hex (#4D2DF2 / #4C2EF2) in docs/" "1"
else
    check "No old broken melody hex (#4D2DF2 / #4C2EF2) in docs/" "0"
fi

# Additional: Verify device indicators fix
WRONG_DEVICE=$(grep "Columns 13-20" "$REPO_ROOT/docs/MakingSound/BottomControls.mdx" 2>/dev/null || true)
check "Device indicators no longer described as cols 13-20" \
    "$([ -z "$WRONG_DEVICE" ] && echo 0 || echo 1)"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
