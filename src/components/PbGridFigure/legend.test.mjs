// node --test src/components/PbGridFigure/legend.test.mjs
// node:test + node:assert only. No dependency, no runner, no config.
// Fixtures are REAL pbgrid zones (imported from the vendored pbgrid.js, the
// same generated source of truth PbGridFigure renders from) wherever one of
// the right shape exists; two branches (H1, H2) have no matching real zone
// today, so those two fixtures are synthetic -- marked below.
import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyZone, coordinateString, columnLabelFontSize, directionWords, legendLabelCenters } from './legend.ts';
// eslint-disable-next-line import/no-unresolved -- vendored plain JS, see src/vendor/pbgrid/pbgrid.js header
import { ZONES, GRID_LAYOUT } from '../../vendor/pbgrid/pbgrid.js';

const { columns: COLS, rows: ROWS } = GRID_LAYOUT;
const zone = (id) => { const z = ZONES.find((x) => x.id === id); assert.ok(z, `fixture zone ${id} must exist in ZONES`); return z; };
const classify = (id) => { const z = zone(id); return classifyZone(z.id, z.name.toUpperCase(), z.cells, COLS, ROWS); };

test('H3: playStop (cols 0-2, row 0) is a filled tab at the BOTTOM edge (cols 0-35 flip)', () => {
  const m = classify('playStop');
  assert.deepEqual(m, { kind: 'filledTab', zoneId: 'playStop', colStart: 0, colEnd: 2, top: false, label: 'PLAY / STOP' });
});

test('H3: jams (cols 40-43, row 0) is a filled tab at the TOP edge (cols >= 36 never flip)', () => {
  const m = classify('jams');
  assert.equal(m.kind, 'filledTab');
  assert.equal(m.top, true);
  assert.equal(m.colStart, 40);
  assert.equal(m.colEnd, 43);
});

test('H4: trackSections (cols 36-43, rows 2-21) is a right-side bracket', () => {
  const m = classify('trackSections');
  assert.equal(m.kind, 'sideBracket');
  assert.equal(m.rightSide, true);
  assert.equal(m.rowStart, 2);
});

test('H5: col1SoloIndicator (col 1, rows 2-21) is a rotated column label', () => {
  const m = classify('col1SoloIndicator');
  assert.deepEqual(m, { kind: 'columnLabel', zoneId: 'col1SoloIndicator', col: 1, label: 'SOLO INDICATOR (COL 1)' });
});

test('H6: melodyFx (col 2, rows 2-7) is a hollow tab, 2 rows shy of the top', () => {
  const m = classify('melodyFx');
  // zone.name for this one is just "Melody" (col2FxColumnZone names it after
  // the track, not the column function -- describe() says "FX column", name
  // does not). Noted as a real zone-naming gap in the migration report;
  // out of scope for THIS page (TopControls never uses this zone).
  assert.deepEqual(m, {
    kind: 'hollowTab', zoneId: 'melodyFx', colStart: 2, colEnd: 2, top: true,
    label: 'MELODY', detail: '2 ROWS IN', depth: 2,
  });
});

test('H2: a full-width row range touching neither edge is a side bracket (synthetic -- no current zone is literally full-width)', () => {
  const cells = []; for (let c = 0; c <= 43; c++) cells.push([c, 22]);
  const m = classifyZone('synthetic', 'INDICATOR LANE', cells, COLS, ROWS);
  assert.deepEqual(m, { kind: 'sideBracket', zoneId: 'synthetic', rowStart: 22, rowEnd: 22, rightSide: false, label: 'INDICATOR LANE' });
});

test('H1: a near-full-grid zone is skipped, not force-labelled (synthetic)', () => {
  const cells = []; for (let c = 4; c <= 35; c++) for (let r = 2; r <= 21; r++) cells.push([c, r]);
  const m = classifyZone('synthetic', 'SEQUENCER GRID', cells, COLS, ROWS);
  assert.equal(m.reason.includes('suppresses'), true);
});

test('directionWords matches LegendOverlayView.swift:360-363', () => {
  assert.equal(directionWords(1, true), 'ROW BELOW');
  assert.equal(directionWords(1, false), 'ROW ABOVE');
  assert.equal(directionWords(4, true), '4 ROWS IN');
});

test('coordinateString reads as prose, in logical coordinates', () => {
  assert.equal(coordinateString(zone('playStop').cells), 'row 0, columns 0 to 2');
  assert.equal(coordinateString(zone('col1SoloIndicator').cells), 'rows 2 to 21, column 1');
});

test('legendLabelCenters: overlapping neighbours are pushed apart, never past half a cell', () => {
  const tabs = [
    { colStart: 0, colEnd: 0, top: true, tier: 0, label: 'UNDO' },
    { colStart: 1, colEnd: 1, top: true, tier: 0, label: 'REDO' },
  ];
  const [a, b] = legendLabelCenters(tabs, 0.85);
  assert.ok(a < b);
  assert.ok(Math.abs(a - 0.5) <= 0.5 + 1e-9);
  assert.ok(Math.abs(b - 1.5) <= 0.5 + 1e-9);
});

test('columnLabelFontSize: full size when the room fits, shrunk only when it does not', () => {
  assert.equal(columnLabelFontSize(['SHORT'], 100, 0.85), 0.85);
  const shrunk = columnLabelFontSize(['A VERY LONG COLUMN LABEL'], 2, 0.85);
  assert.ok(shrunk < 0.85 && shrunk > 0);
});
