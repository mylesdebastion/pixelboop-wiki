#!/usr/bin/env python3
"""
Rewrite hard-coded grid hexes to the colours actually sampled from the app.

Scoped deliberately. Only grids named on ALLOW are touched, because a blanket
rewrite would destroy the illustrative grids (TapDemo, TracksDemo and friends
draw example notes onto cells the app leaves empty; "correcting" those to black
would delete the illustration). ALLOW holds grids that depict the persistent
control rows, which are always on screen in the idle state and therefore safe
to compare cell-for-cell.

Cells whose live pixel is background (near-black) are left alone even inside an
allowed grid: a swatch drawn on an empty cell is illustration, not a wrong value.

Usage:
    python3 scripts/grid-fix.py <udid> [--apply]     # default is a dry run
"""
import os, re, subprocess, sys, tempfile
from collections import defaultdict

ORIGIN_X, ORIGIN_Y = 249.0, 26.0
CELL_W, CELL_H = 47.9, 47.5
COLS, ROWS = 44, 24
EMPTY_MAX, TOL = 40, 12

ALLOW = {
    "ControlRowOverview", "EditControlsDemo", "KeyDemo", "ScaleDemo",
    "BPMDemo", "PatternLengthDemo",          # TopControls, persistent row 0
    "BottomRowOverview", "ModeButtonDemo",   # BottomControls, persistent row 23
}

ELEM = re.compile(
    r'(\{\s*"pos"\s*:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]\s*,\s*'
    r'"size"\s*:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]\s*,\s*'
    r'"color"\s*:\s*)("#[0-9A-Fa-f]{3,8}")')
FUNC = re.compile(r'export function (\w+)')


def capture(udid):
    tmp = os.path.join(tempfile.gettempdir(), "pb_fix.png")
    subprocess.run(["xcrun", "simctl", "io", udid, "screenshot", tmp],
                   capture_output=True, check=True)
    subprocess.run(["sips", "-r", "270", tmp], capture_output=True, check=True)
    from PIL import Image
    im = Image.open(tmp).convert("RGB")
    return {(c, r): im.getpixel((int(ORIGIN_X + (c + .5) * CELL_W),
                                 int(ORIGIN_Y + (r + .5) * CELL_H)))
            for c in range(COLS) for r in range(ROWS)}


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    udid = sys.argv[1]
    apply_ = "--apply" in sys.argv
    live = capture(udid)
    total = 0

    for root, _, files in os.walk("docs"):
        for fn in sorted(files):
            if not fn.endswith((".mdx", ".md")):
                continue
            path = os.path.join(root, fn)
            src = open(path, errors="replace").read()
            funcs = [(m.start(), m.group(1)) for m in FUNC.finditer(src)]

            def fname(pos):
                name = "?"
                for s, n in funcs:
                    if s <= pos:
                        name = n
                    else:
                        break
                return name

            out, last, changed = [], 0, 0
            for m in ELEM.finditer(src):
                head, c0, r0, w, h = m.group(1), *(int(m.group(i)) for i in range(2, 6))
                if fname(m.start()) not in ALLOW or w != 1 or h != 1:
                    continue
                c, r = c0, r0
                # MystrixVisualizer renders data-row 0 at visual row 23 (cols 0-35)
                vr = 23 - r if (c <= 35 and r in (0, 23)) else r
                if (c, vr) not in live:
                    continue
                got = live[(c, vr)]
                if max(got) <= EMPTY_MAX:
                    continue                      # illustration on an empty cell
                want = m.group(6).strip('"').lstrip("#")
                if len(want) not in (6, 8):
                    continue
                cur = tuple(int(want[i:i + 2], 16) for i in (0, 2, 4))
                if max(abs(cur[i] - got[i]) for i in range(3)) <= TOL:
                    continue
                new = '"#%02X%02X%02X"' % got
                print(f"    {path[5:]:36s} {fname(m.start()):20s} "
                      f"({c:2d},{r:2d})  {m.group(6)} -> {new}")
                out.append(src[last:m.start(6)]); out.append(new)
                last = m.end(6); changed += 1
            if changed:
                out.append(src[last:])
                total += changed
                if apply_:
                    open(path, "w").write("".join(out))

    print(f"\n  {total} cell colours {'rewritten' if apply_ else 'would change (dry run)'}")


if __name__ == "__main__":
    main()
