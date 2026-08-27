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

/**
 * The GAP this file exists to close: `classifyZone` above was fed
 * `z.name.toUpperCase()` -- pbgrid's own zone name, written for a screen
 * reader's listbox entry, not a margin label. Adjacent single-column zones
 * (scaleMajor/scaleMinor/scaleType) each got their own tab and collided.
 *
 * The app never had this problem because its legend was never built from
 * pbgrid's a11y-grained zones in the first place: LegendOverlayView.swift's
 * one label per mark comes from `IntroTutorialStep.legendLabel`
 * (LegendOverlayView.swift:36-52, derived from the case name -- `.scaleType`
 * -> "SCALE TYPE", `.undoRedo` -> "UNDO REDO"), and one tutorial step's
 * `highlightRegion` (IntroTutorialController.swift) routinely spans several
 * of pbgrid's finer-grained accessibility zones at once.
 *
 * This table is the bridge: for each `IntroTutorialStep` whose
 * `highlightRegion` exactly tiles a set of real pbgrid zone ids, it names
 * that set and the label `legendLabel` produces for it. `groupLegendZones`
 * below merges the named zones into ONE mark for the margin legend; the
 * region list (this file's caller, PbGridFigure.tsx) keeps listing every
 * zone individually with its own pbgrid a11y name -- this table only ever
 * feeds the VISIBLE label, never the a11y one.
 *
 * A pbgrid zone id absent from this table has no group: `groupLegendZones`
 * falls back to that zone's own pbgrid name (uppercased), same as before
 * this file existed. Two zones are documented, deliberate gaps, not
 * oversights:
 *   - `shakeUsb` (cols 34-35, row 0): no `IntroTutorialStep` case highlights
 *     it at all.
 *   - `col3RhythmBankSelector` (col 3, rows 18-21): `.intervalModes`'s own
 *     region stops at row 17 (IntroTutorialController.swift:182-183),
 *     deliberately excluding the rhythm track's drum-bank selector from the
 *     "INTERVAL MODES" label that covers melody/chords/bass on the same
 *     column.
 * Melody/chord/bass/rhythm LANE labels are NOT ported: their
 * `highlightRegion`s (IntroTutorialController.swift:166-173) span the FULL
 * grid width (cols 0-43) for one lane's row band, but `col1SoloIndicator`
 * and `trackSections` are each ONE pbgrid zone shared across all four lanes
 * -- there is no set of real zone ids whose union reproduces a single lane's
 * region without also pulling in the other three lanes' rows. No current
 * page focuses a full lane, so this is left undone rather than approximated;
 * a page that needs it should widen this comment, not guess.
 */
export interface LegendLabelGroup {
  /** pbgrid zone ids this ONE label covers (src/vendor/pbgrid/pbgrid.js). */
  zoneIds: string[];
  /** Exactly what `IntroTutorialStep.legendLabel` produces for the step
   * whose `highlightRegion` these zone ids' cells union to. */
  label: string;
  /** file:line for the case, its region, and the derivation rule, so every
   * label traces to the app rather than to an invented shortening. */
  citation: string;
}

export const LEGEND_LABEL_GROUPS: readonly LegendLabelGroup[] = [
  {
    zoneIds: ['playStop'],
    label: 'PLAY/PAUSE/STOP',
    citation: 'IntroTutorialController.swift:32 (case playPauseStop), :184-185 (region cols 0-2 row 0 '
      + '= pbgrid playStop) + LegendOverlayView.swift:40-52 (legendLabel; the "PLAY PAUSE STOP" -> '
      + '"PLAY/PAUSE/STOP" punctuation rule is line 51)',
  },
  {
    zoneIds: ['undo', 'redo'],
    label: 'UNDO REDO',
    citation: 'IntroTutorialController.swift:33 (case undoRedo), :186-187 (region cols 4-5 row 0 = '
      + 'pbgrid undo col 4 + redo col 5) + LegendOverlayView.swift:40-45 (legendLabel)',
  },
  {
    zoneIds: ['scaleMajor', 'scaleMinor', 'scaleType'],
    label: 'SCALE TYPE',
    citation: 'IntroTutorialController.swift:34 (case scaleType), :188-192 (region cols 7-9 row 0 = '
      + 'pbgrid scaleMajor col 7 + scaleMinor col 8 + scaleType col 9) + LegendOverlayView.swift:40-45',
  },
  {
    zoneIds: ['rootNoteWheel'],
    label: 'KEY',
    citation: 'IntroTutorialController.swift:35 (case key), :193-194 (region cols 11-22 row 0 = pbgrid '
      + 'rootNoteWheel) + LegendOverlayView.swift:40-45',
  },
  {
    zoneIds: ['ghost'],
    label: 'GHOST NOTES',
    citation: 'IntroTutorialController.swift:37 (case ghostNotes), :197-198 (region col 24 row 0 = '
      + 'pbgrid ghost) + LegendOverlayView.swift:40-45',
  },
  {
    zoneIds: ['bpm'],
    label: 'BPM',
    citation: 'IntroTutorialController.swift:38 (case bpm), :199-200 (region cols 26-28 row 0 = pbgrid '
      + 'bpm) + LegendOverlayView.swift:40-45',
  },
  {
    zoneIds: ['patternLength'],
    label: 'SECTION LENGTH',
    citation: 'IntroTutorialController.swift:39 (case sectionLength), :201-202 (region cols 30-32 row 0 '
      + '= pbgrid patternLength) + LegendOverlayView.swift:40-45',
  },
  {
    zoneIds: ['trackSections'],
    label: 'SECTION GRID',
    citation: 'IntroTutorialController.swift:40 (case sectionGrid), :203-204 (region cols 36-43 rows '
      + '2-21 = pbgrid trackSections) + LegendOverlayView.swift:40-45',
  },
  {
    zoneIds: ['rowOneBankSelector'],
    label: 'SECTION BANKS',
    citation: 'IntroTutorialController.swift:41 (case sectionBanks), :205-206 (region cols 36-43 row 1 '
      + '= pbgrid rowOneBankSelector) + LegendOverlayView.swift:40-45 (the "· ROW BELOW" detail suffix '
      + 'is this file\'s own directionWords, unrelated to the label text)',
  },
  {
    zoneIds: ['controlBarSectionsActive'],
    label: 'SECTION LOOP',
    citation: 'IntroTutorialController.swift:42 (case sectionLoop), :207-208 (region cols 36-37 row 23 '
      + '= pbgrid controlBarSectionsActive) + LegendOverlayView.swift:40-45',
  },
  {
    zoneIds: ['controlBarSectionsClear'],
    label: 'SECTION CLEAR',
    citation: 'IntroTutorialController.swift:43 (case sectionClear), :209-210 (region cols 38-43 row 23 '
      + '= pbgrid controlBarSectionsClear) + LegendOverlayView.swift:40-45',
  },
  {
    zoneIds: ['controlBarSync'],
    label: 'JAM SYNC',
    citation: 'IntroTutorialController.swift:44 (case jamSync), :211-212 (region cols 10-12 row 23 = '
      + 'pbgrid controlBarSync) + LegendOverlayView.swift:40-45',
  },
  {
    zoneIds: ['usbIndicator'],
    label: 'USB',
    citation: 'IntroTutorialController.swift:45 (case usb), :213-219 (region cols 36-37 row 0 = pbgrid '
      + 'usbIndicator) + LegendOverlayView.swift:40-45',
  },
  {
    zoneIds: ['btIndicator'],
    label: 'BT MIDI',
    citation: 'IntroTutorialController.swift:46 (case btMidi), :220-221 (region cols 38-39 row 0 = '
      + 'pbgrid btIndicator) + LegendOverlayView.swift:40-45 (camelCase split: "btMidi" -> "BT MIDI")',
  },
  {
    zoneIds: ['jams'],
    label: 'JAMS',
    citation: 'IntroTutorialController.swift:47 (case jams), :222-228 (region cols 40-43 row 0 = pbgrid '
      + 'jams) + LegendOverlayView.swift:40-45',
  },
  {
    zoneIds: ['controlBarWled'],
    label: 'RAINBOW MENU',
    citation: 'IntroTutorialController.swift:48 (case rainbowMenu), :229-230 (region cols 0-3 row 23 = '
      + 'pbgrid controlBarWled) + LegendOverlayView.swift:40-45',
  },
  {
    zoneIds: ['col1SoloIndicator'],
    label: 'SOLO TRACK',
    citation: 'IntroTutorialController.swift:29 (case soloTrack), :176-177 (region col 1 rows 2-21 = '
      + 'pbgrid col1SoloIndicator) + LegendOverlayView.swift:40-45',
  },
  {
    zoneIds: ['melodyKey', 'chordsKey', 'bassKey', 'rhythmKeyColumn'],
    label: 'TRACK ON/OFF',
    citation: 'IntroTutorialController.swift:28 (case trackOnOff), :174-175 (region col 0 rows 2-21 = '
      + 'pbgrid melodyKey+chordsKey+bassKey+rhythmKeyColumn, which tile rows 2-7/8-13/14-17/18-21) + '
      + 'LegendOverlayView.swift:40-52 (the " ON OFF" -> " ON/OFF" punctuation rule is line 50)',
  },
  {
    zoneIds: ['melodyFx', 'chordsFx', 'bassFx', 'rhythmFx'],
    label: 'FX COLUMN',
    citation: 'IntroTutorialController.swift:30 (case fxColumn), :178-181 (region col 2 rows 2-21 = '
      + 'pbgrid melodyFx+chordsFx+bassFx+rhythmFx) + LegendOverlayView.swift:40-45',
  },
  {
    zoneIds: ['melodyNote3', 'chordsNote3', 'bassNote3'],
    label: 'INTERVAL MODES',
    citation: 'IntroTutorialController.swift:31 (case intervalModes), :182-183 (region col 3 rows 2-17 '
      + '= pbgrid melodyNote3+chordsNote3+bassNote3; rhythm\'s col3RhythmBankSelector, rows 18-21, is '
      + 'deliberately excluded by the region\'s own rowEnd:17) + LegendOverlayView.swift:40-45',
  },
];

function legendGroupFor(zoneId: string): LegendLabelGroup | undefined {
  return LEGEND_LABEL_GROUPS.find((g) => g.zoneIds.includes(zoneId));
}

export interface LegendGroupResult {
  /** Zone ids merged into this one mark, in `zones`' own order. */
  zoneIds: string[];
  /** The app's label (`fromApp: true`), or the zone's own pbgrid name,
   * uppercased, when no `IntroTutorialStep` covers it (`fromApp: false`) --
   * never an invented shortening. */
  label: string;
  /** Union of every merged zone's own cells. */
  cells: [number, number][];
  fromApp: boolean;
}

/**
 * Collapse a page's focused pbgrid zones down to what the app's legend
 * actually shows: one label per control, not one per accessibility zone.
 * `PbGridFigure.tsx` feeds this file's `classifyZone` from the RESULT of
 * this function (merged cells, merged id, app label) rather than from each
 * zone individually -- this is the only thing that changes; the outline per
 * zone, the focus ring per zone, and the region list per zone (this file's
 * caller keeps all three keyed on the ORIGINAL `zones` array) are untouched.
 *
 * A group applies only to the zones from its table entry that are actually
 * present in this page's `zones` -- a page that focuses one member of a
 * group alone still gets that control's real name (e.g. focusing only
 * `scaleMajor` still reads "SCALE TYPE", the name of the physical control
 * that cell is part of), it just merges nothing. Every zone keeps its own
 * position in the OUTPUT order (first zone of each group, in `zones`'
 * order) so page authors can list focused zones in any order.
 */
export function groupLegendZones(
  zones: { id: string; name: string; cells: [number, number][] }[],
): LegendGroupResult[] {
  const byId = new Map(zones.map((z) => [z.id, z]));
  const seen = new Set<string>();
  const out: LegendGroupResult[] = [];
  for (const z of zones) {
    if (seen.has(z.id)) continue;
    const group = legendGroupFor(z.id);
    if (!group) {
      seen.add(z.id);
      out.push({ zoneIds: [z.id], label: z.name.toUpperCase(), cells: z.cells, fromApp: false });
      continue;
    }
    const memberIds = group.zoneIds.filter((id) => byId.has(id) && !seen.has(id));
    memberIds.forEach((id) => seen.add(id));
    out.push({ zoneIds: memberIds, label: group.label, cells: memberIds.flatMap((id) => byId.get(id)!.cells), fromApp: true });
  }
  return out;
}
