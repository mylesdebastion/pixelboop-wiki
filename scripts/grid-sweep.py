#!/usr/bin/env python3
"""
Sweep EVERY MystrixVisualizer grid in docs/ against one live capture of the app.

Captures the running simulator once, then parses every `{ "pos": [c,r], "size":
[w,h], "color": ... }` element out of the .mdx files and compares each declared
cell colour to the real pixel.

IMPORTANT, read before trusting the output:
  * Only grids depicting the DEFAULT IDLE screen can be judged this way. A grid
    that deliberately shows another state (drum bank 2, a soloed track, the
    preset-cycling display, a placed note) will mismatch for a legitimate reason.
    Those are reported separately as NEEDS-STATE, not as defects.
  * Cells the app draws as empty/background are near-black. A declared colour
    sitting on a background cell usually means the grid is illustrative rather
    than wrong; that is reported as ON-EMPTY.
  * Works in VISUAL coordinates. The row flip (cols 0-35 swap rows 0 and 23) is
    already baked into what the camera sees, and the wiki grids reproduce it, so
    no conversion is applied.

Usage: python3 scripts/grid-sweep.py <udid>
"""
import json, os, re, subprocess, sys, tempfile
from collections import defaultdict

ORIGIN_X, ORIGIN_Y = 249.0, 26.0
CELL_W, CELL_H = 47.9, 47.5
COLS, ROWS = 44, 24
DOCS = "docs"

# Grids whose whole point is a non-default state. Matched against the enclosing
# export function name; keeps false "defects" out of the headline number.
STATE_HINTS = re.compile(
    r"bank[123]|solo|mute|preset|cycl|accent|erase|drag|sustain|section|"
    r"sync|device|config|midi|wled|link|playing|record|jam|follow",
    re.I)


def capture(udid):
    tmp = os.path.join(tempfile.gettempdir(), "pb_sweep.png")
    subprocess.run(["xcrun", "simctl", "io", udid, "screenshot", tmp],
                   capture_output=True, check=True)
    subprocess.run(["sips", "-r", "270", tmp], capture_output=True, check=True)
    from PIL import Image
    im = Image.open(tmp).convert("RGB")
    grid = {}
    for c in range(COLS):
        for r in range(ROWS):
            x = int(ORIGIN_X + (c + 0.5) * CELL_W)
            y = int(ORIGIN_Y + (r + 0.5) * CELL_H)
            grid[(c, r)] = im.getpixel((x, y))
    return grid


def hex2rgb(h):
    h = h.lstrip("#")
    if len(h) == 8:            # #RRGGBBAA
        h = h[:6]
    if len(h) != 6:
        return None
    try:
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
    except ValueError:
        return None


def dist(a, b):
    return max(abs(a[i] - b[i]) for i in range(3))


ELEM = re.compile(
    r'\{\s*"pos"\s*:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]\s*,\s*'
    r'"size"\s*:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]\s*,\s*'
    r'"color"\s*:\s*("#[0-9A-Fa-f]{3,8}"|\[[^\]]*\])')
FUNC = re.compile(r'export function (\w+)')


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    grid = capture(sys.argv[1])

    EMPTY_MAX = 40   # channel value below which the app cell is background
    TOL = 12         # per-channel tolerance for "matches"

    per_page = defaultdict(lambda: dict(match=0, mismatch=0, on_empty=0,
                                        needs_state=0, bad=[]))
    for root, _, files in os.walk(DOCS):
        for fn in sorted(files):
            if not fn.endswith((".mdx", ".md")):
                continue
            path = os.path.join(root, fn)
            src = open(path, errors="replace").read()
            # map char offset -> enclosing export function name
            funcs = [(m.start(), m.group(1)) for m in FUNC.finditer(src)]

            def fname(pos):
                name = "?"
                for s, n in funcs:
                    if s <= pos:
                        name = n
                    else:
                        break
                return name

            st = per_page[path]
            for m in ELEM.finditer(src):
                c0, r0, w, h = (int(m.group(i)) for i in range(1, 5))
                raw = m.group(5)
                colors = ([raw.strip('"')] if raw.startswith('"')
                          else re.findall(r'#[0-9A-Fa-f]{3,8}', raw))
                fn_name = fname(m.start())
                stateful = bool(STATE_HINTS.search(fn_name))
                idx = 0
                for dr in range(h):
                    for dc in range(w):
                        c, r = c0 + dc, r0 + dr
                        # MystrixVisualizer.tsx:116 applies the app's row flip
                        # when it RENDERS, so a grid authored at data-row 0 is
                        # drawn at visual row 23 (cols 0-35 only). Compare against
                        # the visual cell, or every control row reads as broken.
                        if c <= 35 and r in (0, 23):
                            r = 23 - r
                        if (c, r) not in grid:
                            continue
                        want = hex2rgb(colors[idx % len(colors)]) if colors else None
                        idx += 1
                        if want is None:
                            continue
                        got = grid[(c, r)]
                        if max(got) <= EMPTY_MAX and max(want) > EMPTY_MAX:
                            st["on_empty"] += 1
                        elif dist(want, got) <= TOL:
                            st["match"] += 1
                        elif stateful:
                            st["needs_state"] += 1
                        else:
                            st["mismatch"] += 1
                            if len(st["bad"]) < 6:
                                st["bad"].append(
                                    (fn_name, c, r,
                                     "#%02X%02X%02X" % want,
                                     "#%02X%02X%02X" % got))

    tot = defaultdict(int)
    print(f"  {'page':44s} {'match':>6s} {'MISMATCH':>9s} {'state':>6s} {'empty':>6s}")
    for path, st in sorted(per_page.items()):
        if not any((st["match"], st["mismatch"], st["needs_state"], st["on_empty"])):
            continue
        for k in ("match", "mismatch", "needs_state", "on_empty"):
            tot[k] += st[k]
        print(f"  {path[5:]:44s} {st['match']:6d} {st['mismatch']:9d} "
              f"{st['needs_state']:6d} {st['on_empty']:6d}")
    print(f"\n  TOTALS  match={tot['match']}  MISMATCH={tot['mismatch']}  "
          f"needs-state={tot['needs_state']}  on-empty={tot['on_empty']}")

    print("\n  Concrete mismatches on idle-state grids (declared vs actual):")
    n = 0
    for path, st in sorted(per_page.items()):
        for fn_name, c, r, want, got in st["bad"]:
            print(f"    {path[5:]:38s} {fn_name:22s} ({c:2d},{r:2d})  "
                  f"declared {want}  actual {got}")
            n += 1
    if not n:
        print("    none")


if __name__ == "__main__":
    main()
