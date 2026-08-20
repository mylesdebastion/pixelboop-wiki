#!/usr/bin/env python3
"""
Sample real pixel colours from a running Pixelboop simulator and compare them
against the hard-coded hexes in the wiki's MystrixVisualizer grids.

Why this exists: the wiki's 64 preview grids are hand-authored. Checking them by
eye passes grids that are hue-correct but brightness-wrong. On 2026-08-12 the
SynthPresets mute-column grid looked like an exact match by eye; sampling showed
only 3 of 20 cells actually matched, because the app darkens down each track band
and the hand-authored gradient did not.

Usage:
    python3 scripts/grid-sample.py <udid> <col>,<row> [<col>,<row> ...]
    python3 scripts/grid-sample.py <udid> --col 0        # whole column
    python3 scripts/grid-sample.py <udid> --row 23       # whole row

Requires Pillow. Captures via `xcrun simctl io <udid> screenshot`, then rotates
270 degrees because the app is landscape-locked while the device is portrait.

COORDINATE NOTES (the part that is easy to get wrong):
  * After rotation the image is 44 cells wide (columns) by 24 tall (rows).
  * THE ROW FLIP: for cols 0-35 the app draws logical row 0 at visual row 23 and
    logical row 23 at visual row 0. Cols 36-43 are NOT flipped. This script works
    in VISUAL coordinates, i.e. what you see. Convert before citing logical rows.
"""
import subprocess, sys, tempfile, os

# Grid geometry measured from a 2622x1206 rotated capture (iPhone 16 Pro).
ORIGIN_X, ORIGIN_Y = 249.0, 26.0
CELL_W, CELL_H = 47.9, 47.5
COLS, ROWS = 44, 24


def capture(udid):
    tmp = os.path.join(tempfile.gettempdir(), "pb_grid_sample.png")
    subprocess.run(["xcrun", "simctl", "io", udid, "screenshot", tmp],
                   capture_output=True, check=True)
    subprocess.run(["sips", "-r", "270", tmp], capture_output=True, check=True)
    return tmp


def sampler(path):
    from PIL import Image
    im = Image.open(path).convert("RGB")
    w, h = im.size

    def cell(c, r):
        if not (0 <= c < COLS and 0 <= r < ROWS):
            raise ValueError(f"cell ({c},{r}) is outside the {COLS}x{ROWS} grid")
        x = int(ORIGIN_X + (c + 0.5) * CELL_W)
        y = int(ORIGIN_Y + (r + 0.5) * CELL_H)
        if not (0 <= x < w and 0 <= y < h):
            raise ValueError(f"cell ({c},{r}) maps to ({x},{y}), outside the {w}x{h} image")
        return "#%02X%02X%02X" % im.getpixel((x, y))

    return cell


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    udid, args = sys.argv[1], sys.argv[2:]
    cell = sampler(capture(udid))

    targets = []
    if args[0] == "--col":
        c = int(args[1]); targets = [(c, r) for r in range(ROWS)]
    elif args[0] == "--row":
        r = int(args[1]); targets = [(c, r) for c in range(COLS)]
    else:
        for a in args:
            c, r = a.split(",")
            targets.append((int(c), int(r)))

    for c, r in targets:
        flipped = " (logical row %d)" % (23 - r) if c <= 35 and r in (0, 23) else ""
        print(f"  visual col {c:2d} row {r:2d}  {cell(c, r)}{flipped}")


if __name__ == "__main__":
    main()
