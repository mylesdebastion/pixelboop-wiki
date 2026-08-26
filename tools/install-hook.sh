#!/bin/sh
# Installs the pixelboop-wiki pre-commit hook (see tools/pre-commit).
#
# .git/hooks/ is not version-controlled, so a fresh clone needs this run
# once: sh tools/install-hook.sh
#
# Repo root is derived from this script's OWN location (not the caller's
# cwd) so it works no matter where you run it from.
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cp "$SCRIPT_DIR/pre-commit" "$REPO_ROOT/.git/hooks/pre-commit"
chmod +x "$REPO_ROOT/.git/hooks/pre-commit"
echo "Installed: $REPO_ROOT/.git/hooks/pre-commit"
