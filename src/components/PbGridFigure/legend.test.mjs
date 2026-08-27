// node --test src/components/PbGridFigure/legend.test.mjs
// node:test + node:assert only. No dependency, no runner, no config.
// Fixtures are REAL pbgrid zones (imported from the vendored pbgrid.js, the
// same generated source of truth PbGridFigure renders from) wherever one of
// the right shape exists; two branches (H1, H2) have no matching real zone
// today, so those two fixtures are synthetic -- marked below.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyZone, coordinateString, columnLabelFontSize, directionWords, legendLabelCenters,
  groupLegendZones,
} from './legend.ts';
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

// ---- groupLegendZones: the fix for the overlap bug itself. pbgrid's a11y
// zones are finer-grained than the app's own legend controls; these merge
// them the same way LegendOverlayView.swift's IntroTutorialStep regions do.
// Real zones throughout -- ZONE_BY_ID-shaped objects pulled straight out of
// pbgrid.js, same discipline as the rest of this file.

test('groupLegendZones: scaleMajor+scaleMinor+scaleType merge into ONE "SCALE TYPE" mark -- the exact ScaleDemo overlap case', () => {
  const zs = [zone('scaleMajor'), zone('scaleMinor'), zone('scaleType')];
  const groups = groupLegendZones(zs);
  assert.equal(groups.length, 1, 'three adjacent a11y zones must collapse to one legend mark');
  const [g] = groups;
  assert.equal(g.label, 'SCALE TYPE');
  assert.equal(g.fromApp, true);
  assert.deepEqual(g.zoneIds, ['scaleMajor', 'scaleMinor', 'scaleType']);
  assert.deepEqual(g.cells.sort(), [[7, 0], [8, 0], [9, 0]].sort());
  // Feed the merge into classifyZone exactly as PbGridFigure.tsx does: one
  // filledTab spanning the whole cols 7-9 span, not three overlapping ones.
  const mark = classifyZone(g.zoneIds.join('+'), g.label, g.cells, COLS, ROWS);
  assert.deepEqual(mark, { kind: 'filledTab', zoneId: 'scaleMajor+scaleMinor+scaleType', colStart: 7, colEnd: 9, top: false, label: 'SCALE TYPE' });
});

test('groupLegendZones: undo+redo merge into ONE "UNDO REDO" mark regardless of input order', () => {
  const forward = groupLegendZones([zone('undo'), zone('redo')]);
  const backward = groupLegendZones([zone('redo'), zone('undo')]);
  for (const groups of [forward, backward]) {
    assert.equal(groups.length, 1);
    assert.equal(groups[0].label, 'UNDO REDO');
    assert.deepEqual(groups[0].cells.sort(), [[4, 0], [5, 0]].sort());
  }
});

test('groupLegendZones: a page focusing only ONE member of a group still gets that control\'s real name, unmerged', () => {
  const groups = groupLegendZones([zone('scaleMajor')]);
  assert.deepEqual(groups, [{ zoneIds: ['scaleMajor'], label: 'SCALE TYPE', cells: [[7, 0]], fromApp: true }]);
});

test('groupLegendZones: a zone with no IntroTutorialStep (shakeUsb) falls back to its own pbgrid name, not an invented label', () => {
  const groups = groupLegendZones([zone('shakeUsb')]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].fromApp, false);
  assert.equal(groups[0].label, zone('shakeUsb').name.toUpperCase());
});

test('groupLegendZones: renames a singleton zone to the app\'s own control name (rootNoteWheel -> KEY, bpm -> BPM)', () => {
  assert.equal(groupLegendZones([zone('rootNoteWheel')])[0].label, 'KEY');
  assert.equal(groupLegendZones([zone('bpm')])[0].label, 'BPM');
  assert.equal(groupLegendZones([zone('ghost')])[0].label, 'GHOST NOTES');
});

test('groupLegendZones: the four per-track key columns merge into ONE "TRACK ON/OFF" mark tiling col 0, rows 2-21', () => {
  const zs = ['melodyKey', 'chordsKey', 'bassKey', 'rhythmKeyColumn'].map(zone);
  const groups = groupLegendZones(zs);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].label, 'TRACK ON/OFF');
  const rows = groups[0].cells.map(([, r]) => r).sort((a, b) => a - b);
  assert.deepEqual(rows, Array.from({ length: 20 }, (_, i) => i + 2), 'must tile rows 2-21 with no gap or overlap');
});

test('groupLegendZones: TopControls\' ControlRowOverview (14 pbgrid zones) collapses to 11 legend marks -- the worst-case figure', () => {
  const ids = [
    'playStop', 'undo', 'redo', 'scaleMajor', 'scaleMinor', 'scaleType',
    'rootNoteWheel', 'ghost', 'bpm', 'patternLength', 'shakeUsb',
    'usbIndicator', 'btIndicator', 'jams',
  ];
  const groups = groupLegendZones(ids.map(zone));
  assert.equal(groups.length, 11);
  const labels = groups.map((g) => g.label);
  assert.deepEqual(labels, [
    'PLAY/PAUSE/STOP', 'UNDO REDO', 'SCALE TYPE', 'KEY', 'GHOST NOTES', 'BPM',
    'SECTION LENGTH', zone('shakeUsb').name.toUpperCase(), 'USB', 'BT MIDI', 'JAMS',
  ]);
  assert.equal(new Set(labels).size, labels.length, 'no two marks may share a label (that would just move the collision)');
});
