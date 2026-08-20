/**
 * Pure layout maths for MystrixVisualizer. No React, no DOM, no I/O.
 * Everything the figure draws is derived from the authored props by these
 * functions, so the picture is identical in the server-rendered HTML and
 * after hydration. Tested by ./geometry.test.mjs (node:test, no dependency).
 */

export type Position = [number | 't' | 'u' | 'c', number?];
export type Dimension = [number, number] | number;

export interface UiDisplayElement {
  pos: Position;
  size?: Dimension;
  color?: string | string[];
  /** Optional state name -> fill. The op draws only in the states it names. */
  states?: Record<string, string>;
}

export interface UiElement {
  name?: string;
  desc?: string;
  /** @deprecated no-op, kept so existing call sites still type-check. */
  link?: string;
  elements: UiDisplayElement[];
}

export interface Cell { col: number; visualRow: number; dataRow: number; color?: string; region: number; }
export interface Rect { x: number; y: number; w: number; h: number; color?: string; region: number; }
export interface Dropped { region: number; reason: string; detail: string; }
export interface Crop { c0: number; r0: number; c1: number; r1: number; }
export interface Break { from: number; to: number; }

export const COLS = 44;
export const ROWS = 24;

/**
 * Mirror the iPad app's visual swap: for cols 0-35, row 0 <-> row 23
 * (PixelGridUIView.swift:1019-1037 - "Top controls draw at bottom").
 * Cols 36-43 (USB/BT/section buttons) keep original positions.
 * Copied verbatim from MystrixVisualizer.tsx:109-118. Do not widen the scope.
 */
export function toVisual(dataCol: number, dataRow: number): number {
  let visualRow = dataRow;
  if (dataCol >= 0 && dataCol <= 35) {
    if (dataRow === 0) visualRow = 23;
    else if (dataRow === 23) visualRow = 0;
  }
  return visualRow;
}

/** Inverse of toVisual: the logical row number to print for a visual row. */
export function toLogical(dataCol: number, visualRow: number): number {
  return toVisual(dataCol, visualRow);
}

/**
 * Row bands, indexed by LOGICAL row. Hand-written with provenance, like
 * noteColors.ts; deliberately NOT generated from the app source.
 * 0      docs/MakingSound/TopControls.mdx:47
 * 1      docs/GettingStarted/GettingStarted.mdx:60-72
 * 2-7    GridConstants.swift:22-26   @ 52f702b922e4feb78b808ac50fb02774ebb7ad6c
 * 8-13   GridConstants.swift:29-33   @ same
 * 14-17  GridConstants.swift:36-40   @ same
 * 18-21  GridConstants.swift:43-47   @ same
 * 22     GridConstants.swift:52 + docs/MakingSound/Tracks.mdx:79-81
 * 23     GridConstants.swift:57
 */
export const ROW_BANDS: string[] = [
  'Top Controls', 'Timeline',
  'Melody', 'Melody', 'Melody', 'Melody', 'Melody', 'Melody',
  'Chords', 'Chords', 'Chords', 'Chords', 'Chords', 'Chords',
  'Bass', 'Bass', 'Bass', 'Bass',
  'Rhythm', 'Rhythm', 'Rhythm', 'Rhythm',
  'Indicator Lane', 'Bottom Controls',
];

/** Bar boundaries, docs/GettingStarted/GettingStarted.mdx:61-66. */
export const BAR_COLS = [4, 12, 20, 28];

/** Every state name declared anywhere in the figure, in document order. */
export function stateNames(uiElements: UiElement[]): string[] {
  const seen: string[] = [];
  for (const region of uiElements || []) {
    for (const de of region?.elements || []) {
      for (const k of Object.keys(de?.states || {})) if (!seen.includes(k)) seen.push(k);
    }
  }
  return seen;
}

/** The states one region can be seen in, or [] if it is always drawn. */
export function regionStates(region: UiElement): string[] {
  const ops = region?.elements || [];
  if (!ops.length || ops.some((de) => !de?.states)) return [];
  return [...new Set(ops.flatMap((de) => Object.keys(de.states || {})))];
}

/**
 * Expand draw-ops into visual-space rects and cells, keeping the four
 * documented silent-drop paths (MystrixVisualizer.tsx:98-99, :103, :105, :113)
 * as reported drops instead of discarding them.
 */
export function expand(uiElements: UiElement[], activeState?: string):
  { cells: Cell[]; rects: Rect[]; dropped: Dropped[] } {
  const cells: Cell[] = [];
  const rects: Rect[] = [];
  const dropped: Dropped[] = [];
  (uiElements || []).forEach((region, ri) => {
    if (!region || !Array.isArray(region.elements)) return;
    for (const de of region.elements) {
      if (!de || !Array.isArray(de.pos)) { dropped.push({ region: ri, reason: 'pos', detail: 'missing pos' }); continue; }
      if (de.pos[0] === 't' || de.pos[0] === 'u' || de.pos[0] === 'c') {
        dropped.push({ region: ri, reason: 'hardware', detail: `pos[0] "${de.pos[0]}" is Matrix-only` }); continue;
      }
      const size = de.size === undefined ? [1, 1] : de.size;
      if (!Array.isArray(size)) { dropped.push({ region: ri, reason: 'size', detail: `size ${size} is not [w,h]` }); continue; }
      if (Array.isArray(de.color) && de.color.length !== size[0] * size[1]) {
        dropped.push({ region: ri, reason: 'colorLength', detail: `${de.color.length} colours for ${size[0]}x${size[1]}` }); continue;
      }
      const baseCol = de.pos[0] as number, baseRow = de.pos[1] as number;
      if (!Number.isFinite(baseCol) || !Number.isFinite(baseRow)) {
        dropped.push({ region: ri, reason: 'nan', detail: `pos [${de.pos[0]}, ${de.pos[1]}]` }); continue;
      }
      if (de.states && activeState !== undefined && !(activeState in de.states)) continue;
      const stateColor = de.states && activeState !== undefined ? de.states[activeState] : undefined;
      for (let y = 0; y < size[1]; y++) {
        let run: Rect | null = null;
        for (let x = 0; x < size[0]; x++) {
          const col = baseCol + x, dataRow = baseRow + y;
          const visualRow = toVisual(col, dataRow);
          const color = stateColor !== undefined ? stateColor
            : Array.isArray(de.color) ? de.color[y * size[0] + x] : de.color;
          if (col < 0 || col >= COLS || visualRow < 0 || visualRow >= ROWS) { run = null; continue; }
          cells.push({ col, visualRow, dataRow, color, region: ri });
          if (run && run.y === visualRow && run.color === color && run.x + run.w === col) run.w++;
          else { run = { x: col, y: visualRow, w: 1, h: 1, color, region: ri }; rects.push(run); }
        }
      }
    }
  });
  // Merge vertically too: a 32x6 wash becomes one rect, not six, which removes
  // the antialiasing hairlines between abutting same-colour rows.
  const merged: Rect[] = [];
  for (const r of rects) {
    const up = merged.find((m) => m.region === r.region && m.x === r.x && m.w === r.w
      && m.color === r.color && m.y + m.h === r.y);
    if (up) up.h += r.h; else merged.push(r);
  }
  return { cells, rects: merged, dropped };
}

/** Visual-space bounding box of the lit cells, padded 1 cell, clamped. */
export function crop(cells: Cell[]): Crop {
  if (!cells.length) return { c0: 0, r0: 0, c1: COLS - 1, r1: ROWS - 1 };
  let c0 = COLS, c1 = -1, r0 = ROWS, r1 = -1;
  for (const c of cells) {
    if (c.col < c0) c0 = c.col; if (c.col > c1) c1 = c.col;
    if (c.visualRow < r0) r0 = c.visualRow; if (c.visualRow > r1) r1 = c.visualRow;
  }
  return {
    c0: Math.max(0, c0 - 1), r0: Math.max(0, r0 - 1),
    c1: Math.min(COLS - 1, c1 + 1), r1: Math.min(ROWS - 1, r1 + 1),
  };
}

/** Runs of >= 4 consecutive empty visual rows inside the crop. */
export function elide(cr: Crop, cells: Cell[]): Break[] {
  const used = new Set(cells.map((c) => c.visualRow));
  const out: Break[] = [];
  let start = -1;
  for (let r = cr.r0; r <= cr.r1 + 1; r++) {
    const empty = r <= cr.r1 && !used.has(r);
    if (empty && start < 0) start = r;
    if (!empty && start >= 0) { if (r - start >= 4) out.push({ from: start, to: r - 1 }); start = -1; }
  }
  return out;
}

/**
 * G2: does the crop span both sides of the col 35/36 seam while touching a
 * flipped row? If so rows 0 and 23 carry a different logical number on each
 * side and the figure must say so.
 */
export function flipBoundary(cr: Crop, cells: Cell[]): { seam: boolean; rows: number[] } {
  const used = new Set(cells.map((c) => c.visualRow));
  const rows = [0, 23].filter((r) => used.has(r) && r >= cr.r0 && r <= cr.r1);
  return { seam: cr.c0 <= 35 && cr.c1 >= 36 && rows.length > 0, rows };
}

/** Logical bounding box of one region, in the author's own coordinates. */
export function regionBox(region: UiElement): { c0: number; r0: number; c1: number; r1: number } | null {
  let c0 = Infinity, c1 = -Infinity, r0 = Infinity, r1 = -Infinity;
  for (const de of region?.elements || []) {
    if (!de || !Array.isArray(de.pos) || typeof de.pos[0] !== 'number') continue;
    const size = Array.isArray(de.size) ? de.size : [1, 1];
    const bc = de.pos[0], br = de.pos[1] as number;
    if (!Number.isFinite(br)) continue;
    c0 = Math.min(c0, bc); c1 = Math.max(c1, bc + size[0] - 1);
    r0 = Math.min(r0, br); r1 = Math.max(r1, br + size[1] - 1);
  }
  return c1 < 0 ? null : { c0, r0, c1, r1 };
}

const span = (a: number, b: number, one: string, many: string) =>
  a === b ? `${one} ${a}` : `${many} ${a} to ${b}`;

/** "row 0, columns 0 to 2", always in LOGICAL coordinates. */
export function coordinateString(region: UiElement): string {
  const b = regionBox(region);
  if (!b) return '';
  return `${span(b.r0, b.r1, 'row', 'rows')}, ${span(b.c0, b.c1, 'column', 'columns')}`;
}

/** Strip an author-written coordinate prefix at display time only. */
export function stripLeadingCoord(desc: string): string {
  return (desc || '').replace(/^(Cols?|Rows?)\s+\d+(\s*[-–]\s*\d+)?:\s*/, '');
}

// ---------------------------------------------------------------- colour ---

export function parseColor(c?: string): [number, number, number] | null {
  if (!c) return null;
  const hex = c.trim();
  if (/^#[0-9a-f]{6}$/i.test(hex)) return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
  if (/^#[0-9a-f]{3}$/i.test(hex)) return [1, 2, 3].map((i) => parseInt(hex[i] + hex[i], 16)) as [number, number, number];
  const m = hex.match(/(\d+(?:\.\d+)?)/g);
  return m && m.length >= 3 ? [+m[0], +m[1], +m[2]] : null;
}

export function relativeLuminance(c: string): number {
  const rgb = parseColor(c);
  if (!rgb) return 0;
  const f = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
}

export function ratio(a: string, b: string): number {
  const la = relativeLuminance(a), lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Both inks, always. Painted as a 3px black outer plus 1.5px white inner
 * stroke under the fill: for any fill luminance L, white clears 3:1 at
 * L <= 0.30 and black at L >= 0.10, and those intervals cover [0,1].
 */
export function strokeInk(): { outer: string; inner: string } {
  return { outer: '#000000', inner: '#FFFFFF' };
}

/** White below L 0.1833, black above: >= 4.5:1 against any fill. */
export function labelInk(fill: string): string {
  return relativeLuminance(fill) <= 0.1833 ? '#FFFFFF' : '#000000';
}

const HUES = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'spring green', 'teal',
  'cyan', 'sky blue', 'blue', 'indigo', 'violet', 'purple', 'magenta', 'pink'];

/** A hue name plus a lightness band, always printed beside the hex. */
export function colorName(hex: string): string {
  const rgb = parseColor(hex);
  if (!rgb) return '';
  const [r, g, b] = rgb.map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const l = (max + min) / 2;
  if (d < 0.04) return l < 0.18 ? 'near black' : l < 0.45 ? 'dark grey' : l < 0.75 ? 'grey' : 'white';
  let h = 0;
  if (max === r) h = ((g - b) / d + 6) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  const name = HUES[Math.round((h * 60) / 22.5) % 16];
  return (l < 0.22 ? 'dark ' : l > 0.72 ? 'light ' : '') + name;
}
