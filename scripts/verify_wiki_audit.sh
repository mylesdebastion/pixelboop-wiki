#!/usr/bin/env bash
# Verifies wiki-audit-001: PAGE_AUDIT.md exists with substantive content.
# Audit lives in the Starseed project dir (not the wiki repo) — this
# predicate produces a Starseed artifact, not a wiki commit.
set -euo pipefail

AUDIT="$HOME/.starseed/projects/pixelboop-wiki-sync/PAGE_AUDIT.md"
[ -f "$AUDIT" ] || { echo "FAIL: $AUDIT not found"; exit 1; }

rows=$(grep -cE '^\| docs/.*\.(mdx|md)' "$AUDIT" || true)
[ "$rows" -ge 14 ] \
  || { echo "FAIL: audit has only $rows page rows (expected ≥14)"; exit 1; }

grep -qi "decision queue" "$AUDIT" \
  || { echo "FAIL: 'Decision Queue' section missing"; exit 1; }

grep -qiE "commit[- ]impact" "$AUDIT" \
  || { echo "FAIL: 'Commit-impact' (or 'Commit impact') section missing"; exit 1; }

swift_refs=$(grep -oE '[A-Za-z_][A-Za-z0-9_]*\.swift' "$AUDIT" | sort -u | wc -l | tr -d ' ')
[ "$swift_refs" -ge 10 ] \
  || { echo "FAIL: only $swift_refs distinct Swift refs (expected ≥10 — every row should cite code)"; exit 1; }

echo "PASS: $rows page rows, $swift_refs distinct Swift refs, Decision Queue + Commit-impact sections present"
