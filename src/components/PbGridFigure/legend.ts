/**
 * Pure layout maths for PbGridFigure. No React, no DOM, no I/O -- same
 * discipline as MystrixVisualizer/geometry.ts, and tested the same way
 * (./legend.test.mjs, node:test, no dependency).
 *
 * This is the ported LegendOverlayView.swift shape heuristic
 * (pixelboop/Views/LegendOverlayView.swift's `marks()`, H1-H6) and its
 * collision-avoidance (`labelCenter()`), generalized to work from a pbgrid
 * ZONE's own cell list instead of MystrixVisualizer's hand-authored
 * `UiElement`. A page using PbGridFigure names ZONE IDS, never a coordinate
 * or a hex -- geometry, colour and span all come from
 * src/vendor/pbgrid/pbgrid.js's ZONES, the same generated-from-Swift source
 * of truth the canvas substrate already draws from. See PbGridFigure.tsx's
 * header comment for the fuller "why a new component" note.
 */

export interface Box { c0: number; r0: number; c1: number; r1: number; }

export type LegendMark =
  | { kind: 'filledTab'; zoneId: string; colStart: number; colEnd: number; top: boolean; label: string }
  | { kind: 'hollowTab'; zoneId: string; colStart: number; colEnd: number; top: boolean; label: string; detail: string; depth: number }
  | { kind: 'sideBracket'; zoneId: string; rowStart: number; rowEnd: number; rightSide: boolean; label: string }
  | { kind: 'columnLabel'; zoneId: string; col: number; label: string };

export interface LegendSkip { zoneId: string; label: string; reason: string; }

/** LegendOverlayView.swift:360-363, verbatim. */
export function directionWords(depth: number, top: boolean): string {
  if (depth <= 1) return top ? 'ROW BELOW' : 'ROW ABOVE';
  return `${depth} ROWS IN`;
}

function boxOf(cells: [number, number][]): Box {
  let c0 = Infinity, c1 = -Infinity, r0 = Infinity, r1 = -Infinity;
  for (const [c, r] of cells) { c0 = Math.min(c0, c); c1 = Math.max(c1, c); r0 = Math.min(r0, r); r1 = Math.max(r1, r); }
  return { c0, r0, c1, r1 };
}

/**
 * Visual row span of one zone's own cells -- used both for H6's depth score
 * below and by PbGridFigure.tsx to position a zone's SVG outline over the
 * canvas. Scoped to a single zone's own (already-uniform) side of the col
 * 35/36 seam; see classifyZone's doc comment for why this is deliberately
 * narrower than a general per-cell coordinate transform.
 */
export function visualRowSpan(cells: [number, number][], rows: number): { vTop: number; vBottom: number } {
  const colsLow = Math.max(...cells.map(([c]) => c)) <= 35;
  const toVis = (r: number) => (colsLow ? (r === 0 ? rows - 1 : r === rows - 1 ? 0 : r) : r);
  const vs = cells.map(([, r]) => toVis(r));
  return { vTop: Math.min(...vs), vBottom: Math.max(...vs) };
}

/**
 * Classify one zone's cells into exactly one mark (or a skip reason).
 * Branch order and thresholds copied from LegendOverlayView.swift:210-256
 * (H1 dropped -- see PbGridFigure.tsx's header note on why: wiki figures
 * carry prose in <figcaption>, never inside the grid).
 *
 * The row 0 <-> row 23 swap (PixelGridUIView.swift:1019-1037, "top controls
 * draw at bottom") applies only to columns 0-35. No pbgrid ZONES entry
 * straddles the column 35/36 seam (every zone lives entirely on one side --
 * true of the whole vendored ZONES list as of this writing), so a zone's own
 * column range plus whether it touches data row 0/23 is enough to know which
 * screen EDGE it draws at. This is deliberately narrower than a general
 * per-cell coordinate transform: GridLegendGeometry.swift already carries
 * one hand-mirrored copy of that transform and its own comment warns
 * "do not let a THIRD appear" (pbgrid's own internal, unexported
 * `visualRowForCell` is that third). Adding a fourth general copy here would
 * be exactly what that comment warns against; this file only ever asks
 * "does THIS zone's own row range touch an edge", never "what visual row is
 * row N for an arbitrary cell" -- if a genuine need for the latter shows up,
 * the fix is exporting pbgrid's existing `visualRowForCell`, not a new copy.
 */
export function classifyZone(
  zoneId: string, label: string, cells: [number, number][], cols: number, rows: number,
): LegendMark | LegendSkip | null {
  if (!cells.length) return null;
  const { c0, r0, c1, r1 } = boxOf(cells);
  const cw = c1 - c0 + 1, rh = r1 - r0 + 1;
  const colsLow = c1 <= 35; // this zone's columns are entirely on the flipping side of the seam
  const hasRow0 = cells.some(([, r]) => r === 0);
  const hasRow23 = cells.some(([, r]) => r === rows - 1);
  const touchesTop = colsLow ? hasRow23 : hasRow0;
  const touchesBottom = colsLow ? hasRow0 : hasRow23;
  const touchesLeft = c0 === 0, touchesRight = c1 === cols - 1;

  // H1 -- spans nearly the whole grid: the shape the app suppresses outright
  // rather than mark (LegendOverlayView.swift:172-173, :210-214). Still
  // reachable via focus/dim and the region list; just no margin label.
  if (r0 <= 2 && r1 >= rows - 3 && cw >= Math.round(cols * 0.7)) {
    return {
      zoneId, label,
      reason: 'spans nearly the whole grid -- the shape LegendOverlayView.swift '
        + 'suppresses outright rather than label (H1 / suppressedSteps); left '
        + 'reachable via focus/dim and the region list only',
    };
  }
  // H2 -- full width, a row range touching neither horizontal edge: a lane.
  if (touchesLeft && touchesRight && !touchesTop && !touchesBottom) {
    return { kind: 'sideBracket', zoneId, rowStart: r0, rowEnd: r1, rightSide: false, label };
  }
  // H3 -- touches exactly one horizontal edge: a band tab.
  if (touchesTop !== touchesBottom) {
    return { kind: 'filledTab', zoneId, colStart: c0, colEnd: c1, top: touchesTop, label };
  }
  // H4 -- a tall block anchored to a vertical edge: margin tab.
  if (touchesLeft !== touchesRight && rh > cw && cw >= 4) {
    return { kind: 'sideBracket', zoneId, rowStart: r0, rowEnd: r1, rightSide: touchesRight, label };
  }
  // H5 -- a narrow tall column: rotated label in its own corridor.
  if (!touchesTop && !touchesBottom && cw <= 4 && rh >= 8) {
    return { kind: 'columnLabel', zoneId, col: c0, label };
  }
  // H6 -- everything else: hollow tab on the nearest edge, cap reaching in.
  const { vTop, vBottom } = visualRowSpan(cells, rows);
  const topGap = vTop, bottomGap = rows - 1 - vBottom;
  const nearTop = topGap <= bottomGap;
  const depth = Math.max(1, nearTop ? topGap : bottomGap);
  return {
    kind: 'hollowTab', zoneId, colStart: c0, colEnd: c1, top: nearTop, label,
    detail: directionWords(depth, nearTop), depth,
  };
}

/** Natural centre, in cell units, of a span of columns (LegendOverlayView.swift:603). */
export function tabCenter(colStart: number, colEnd: number): number {
  return (colStart + colEnd + 1) / 2;
}

/**
 * Nudge each tab's label centre away from same-tier, same-side neighbours
 * that would otherwise overlap -- LegendOverlayView.swift:601-624's
 * `labelCenter`, ported verbatim including its bound: a label never travels
 * more than half a cell pitch from the span it names.
 */
export function legendLabelCenters(
  tabs: { colStart: number; colEnd: number; top: boolean; tier: number; label: string }[],
  fontSize: number,
): number[] {
  const widthOf = (label: string) => label.length * fontSize * 0.60;
  return tabs.map((t, i) => {
    const natural = tabCenter(t.colStart, t.colEnd);
    const width = widthOf(t.label);
    let lo = -Infinity, hi = Infinity;
    tabs.forEach((o, j) => {
      if (j === i || o.top !== t.top || o.tier !== t.tier) return;
      const oc = tabCenter(o.colStart, o.colEnd);
      const ow = widthOf(o.label);
      if (oc < natural) lo = Math.max(lo, oc + ow / 2 + fontSize * 0.5 + width / 2);
      else hi = Math.min(hi, oc - ow / 2 - fontSize * 0.5 - width / 2);
    });
    if (lo > hi) return natural; // no room; leave it honest
    const limit = 0.5; // half a cell pitch
    return Math.min(Math.max(Math.min(Math.max(natural, lo), hi), natural - limit), natural + limit);
  });
}

/**
 * Font size for a shared column-label start line: full size wherever the
 * longest label fits the room, shrunk only where the band is genuinely too
 * short. LegendOverlayView.swift:461-477, "size to fit", never clipped.
 */
export function columnLabelFontSize(labels: string[], room: number, maxSize: number): number {
  const longest = Math.max(1, ...labels.map((l) => l.length));
  return Math.min(maxSize, room / (longest * 0.60));
}

/** "row 0, columns 0 to 2", always in LOGICAL (data) coordinates. */
export function coordinateString(cells: [number, number][]): string {
  const { c0, r0, c1, r1 } = boxOf(cells);
  const span = (a: number, b: number, one: string, many: string) => (a === b ? `${one} ${a}` : `${many} ${a} to ${b}`);
  return `${span(r0, r1, 'row', 'rows')}, ${span(c0, c1, 'column', 'columns')}`;
}
