// node --test src/components/MystrixVisualizer/geometry.test.mjs
// node:test + node:assert only. No dependency, no runner, no config.
// Fixtures are the real authored geometry of the 6 flip-straddling figures and
// the 7 figures with a run of >= 4 empty visual rows, measured from docs/.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toVisual, expand, crop, elide, flipBoundary, coordinateString,
  stripLeadingCoord, ratio, labelInk, strokeInk, ROW_BANDS,
} from './geometry.ts';

const R = (ops) => [{ name: 'r', elements: ops.map(([pos, size]) => ({ pos, size, color: '#101010' })) }];
const shape = (ops) => { const c = expand(R(ops)).cells; return { cr: crop(c), c }; };

// ---- (a) the flip, verbatim scope: cols 0-35 only, rows 0 and 23 only ------
test('toVisual mirrors only rows 0 and 23 and only for cols 0-35', () => {
  assert.equal(toVisual(0, 0), 23);
  assert.equal(toVisual(35, 0), 23);
  assert.equal(toVisual(36, 0), 0);
  assert.equal(toVisual(43, 0), 0);
  assert.equal(toVisual(0, 23), 0);
  assert.equal(toVisual(35, 23), 0);
  assert.equal(toVisual(36, 23), 23);
  for (let c = 0; c <= 43; c++) for (const r of [1, 11, 22]) assert.equal(toVisual(c, r), r);
});

// ---- (e) flip boundary: exactly the 6 measured fixtures --------------------
const SEAM = [
  ['GettingStarted HardwareDemo', [[[0, 0], [36, 1]], [[36, 0], [8, 1]], [[0, 1], [44, 22]], [[0, 23], [36, 1]], [[36, 23], [8, 1]]], true],
  ['SongSections SectionPlayDemo', [[[36, 23], [2, 1]], [[36, 22], [1, 1]], [[37, 22], [1, 1]], [[38, 22], [1, 1]]], true],
  ['SongSections SectionPlayButtonDemo', [[[36, 23], [2, 1]], [[36, 2], [8, 20]]], true],
  ['SongSections ClearSectionsButtonDemo', [[[38, 23], [6, 1]], [[36, 23], [2, 1]], [[36, 2], [8, 20]]], true],
  ['TopControls ControlRowOverview', [[[0, 0], [3, 1]], [[34, 0], [2, 1]], [[36, 0], [2, 1]], [[40, 0], [4, 1]]], true],
  ['TopControls EditControlsDemo', [[[4, 0], [1, 1]], [[5, 0], [1, 1]], [[40, 0], [4, 1]]], true],
];
const NO_SEAM = [
  ['TopControls BPMDemo', [[[26, 0], [1, 1]], [[27, 0], [1, 1]], [[28, 0], [1, 1]]]],
  ['SongSections SectionMergeDemo', [[[36, 3], [1, 1]], [[37, 12], [1, 1]]]],
  ['Tracks IndicatorLaneDemo', [[[4, 22], [8, 1]], [[28, 22], [4, 1]]]],
];

for (const [name, ops, want] of SEAM) {
  test(`flip boundary fires: ${name}`, () => {
    const { cr, c } = shape(ops);
    const fb = flipBoundary(cr, c);
    assert.equal(fb.seam, want, `crop ${JSON.stringify(cr)}`);
    assert.ok(fb.rows.length > 0);
    // The ruler must never renumber: a visual row carries a different logical
    // number on each side of the seam, and both are printed.
    for (const r of fb.rows) assert.notEqual(toVisual(0, r), toVisual(36, r));
  });
}
for (const [name, ops] of NO_SEAM) {
  test(`flip boundary stays quiet: ${name}`, () => {
    const { cr, c } = shape(ops);
    assert.equal(flipBoundary(cr, c).seam, false);
  });
}

// ---- (d) elision: exactly the 7 measured fixtures --------------------------
const ELIDE = [
  ['MultiDeviceSync SyncButtonStates', [[[10, 23], [3, 1]], [[10, 22], [3, 1]], [[10, 21], [3, 1]]], [[1, 20]]],
  ['BottomControls ModeButtonDemo', [[[8, 23], [2, 1]], [[8, 22], [2, 1]], [[8, 21], [2, 1]], [[8, 20], [2, 1]]], [[1, 19]]],
  ['BottomControls SyncButtonDemo', [[[10, 23], [3, 1]], [[10, 22], [3, 1]], [[10, 21], [3, 1]], [[11, 21], [1, 1]]], [[1, 20]]],
  ['SongSections SectionMergeDemo', [[[36, 3], [1, 1]], [[36, 10], [1, 1]], [[37, 5], [1, 1]], [[37, 12], [1, 1]]], [[6, 9]]],
  ['TopControls ControlRowOverview', [[[0, 0], [3, 1]], [[36, 0], [2, 1]], [[40, 0], [4, 1]]], [[1, 22]]],
  ['TopControls EditControlsDemo', [[[4, 0], [1, 1]], [[40, 0], [4, 1]]], [[1, 22]]],
  ['TopControls GhostDemo', [[[24, 0], [1, 1]], [[10, 5], [1, 1]], [[14, 6], [1, 1]], [[18, 4], [1, 1]]], [[7, 22]]],
];
for (const [name, ops, want] of ELIDE) {
  test(`elision: ${name}`, () => {
    const { cr, c } = shape(ops);
    const breaks = elide(cr, c).map((b) => [b.from, b.to]);
    assert.deepEqual(breaks, want);
    for (const [f, t] of breaks) assert.ok(t - f + 1 >= 4, 'never elide fewer than 4 rows');
  });
}
test('elision leaves short gaps alone', () => {
  const { cr, c } = shape([[[4, 2], [1, 1]], [[4, 5], [1, 1]]]);
  assert.deepEqual(elide(cr, c), []);
});

// ---- (b)(c) expansion, drops and crop -------------------------------------
test('a run-length op is one rect; the seam splits it', () => {
  assert.equal(expand(R([[[0, 5], [3, 1]]])).rects.length, 1);
  assert.equal(expand(R([[[34, 0], [4, 1]]])).rects.length, 2); // cols 34-35 flip, 36-37 do not
});
test('the four silent-drop paths are reported, not discarded', () => {
  const reasons = (el) => expand([{ name: 'x', elements: [el] }]).dropped.map((d) => d.reason);
  assert.deepEqual(reasons({ pos: ['t', 0] }), ['hardware']);
  assert.deepEqual(reasons({ pos: [0, 0], size: 3 }), ['size']);
  assert.deepEqual(reasons({ pos: [0, 0], size: [2, 1], color: ['#fff'] }), ['colorLength']);
  assert.deepEqual(reasons({ pos: [0] }), ['nan']);
});
test('crop pads one cell and clamps to the grid', () => {
  assert.deepEqual(shape([[[26, 0], [1, 1]]]).cr, { c0: 25, r0: 22, c1: 27, r1: 23 });
  assert.deepEqual(shape([[[0, 1], [44, 22]]]).cr, { c0: 0, r0: 0, c1: 43, r1: 23 });
});
test('a per-cell colour array expands, a string colour does not', () => {
  const arr = [{ name: 'k', elements: [{ pos: [11, 0], size: [12, 1], color: Array(12).fill(0).map((_, i) => `#00000${i}`) }] }];
  assert.equal(expand(arr).rects.length, 12);
  assert.equal(expand([{ name: 'k', elements: [{ pos: [11, 0], size: [12, 1], color: '#000000' }] }]).rects.length, 1);
});

// ---- (f)(g)(h) bands, coordinates, ink ------------------------------------
test('row bands cover every logical row', () => {
  assert.equal(ROW_BANDS.length, 24);
  assert.equal(ROW_BANDS[0], 'Top Controls');
  assert.equal(ROW_BANDS[7], 'Melody');
  assert.equal(ROW_BANDS[22], 'Indicator Lane');
  assert.equal(ROW_BANDS[23], 'Bottom Controls');
});
test('coordinates are logical and read as prose', () => {
  assert.equal(coordinateString({ elements: [{ pos: [0, 0], size: [3, 1] }] }), 'row 0, columns 0 to 2');
  assert.equal(coordinateString({ elements: [{ pos: [4, 0] }] }), 'row 0, column 4');
  assert.equal(coordinateString({ elements: [{ pos: [4, 2], size: [8, 20] }] }), 'rows 2 to 21, columns 4 to 11');
});
test('display-time coordinate strip is exact-shape only', () => {
  assert.equal(stripLeadingCoord('Cols 0-2: Tap to start'), 'Tap to start');
  assert.equal(stripLeadingCoord('Col 4: Undo'), 'Undo');
  assert.equal(stripLeadingCoord('Colors shift as you play'), 'Colors shift as you play');
  assert.equal(stripLeadingCoord('Column 26. Tap to decrease.'), 'Column 26. Tap to decrease.');
});
test('one of the two stroke inks always clears 3:1, for every authored fill', () => {
  const ink = strokeInk();
  for (const fill of ['#CC4229', '#333333', '#45FF45', '#212121', '#FFFFFF', '#000000', 'rgb(50,50,50)']) {
    assert.ok(Math.max(ratio(ink.outer, fill), ratio(ink.inner, fill)) >= 3.0, fill);
    assert.ok(ratio(labelInk(fill), fill) >= 4.5, `label on ${fill}`);
  }
});
test('the lifted lattice resolves against the unlit pad', () => {
  assert.ok(ratio('rgb(50,50,50)', '#808080') >= 3.0);
});
