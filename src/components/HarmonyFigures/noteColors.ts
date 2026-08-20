/**
 * Shared note-color and key-row geometry for the harmony figures.
 *
 * Single source of truth for HarmonyFigures.tsx and KeyRowFigures.tsx.
 *
 * PROVENANCE OF EVERY NUMBER IN THIS FILE
 *
 * Colors: AppColors.harmonicColorForPitch, pixelboop/Core/PixelGridUIView.swift:311-316
 *
 *     let fifthsIndex = (pc * 7) % 12
 *     let hue = CGFloat(fifthsIndex) / 12.0
 *     UIColor(hue: hue, saturation: 0.82, brightness: 0.93, alpha: 1.0)
 *
 * The twelve hex values were computed from that formula (HSB to sRGB, rounded
 * to 8 bits) and cross-checked against the app's own captured row-0 output.
 *
 * Luminance: WCAG 2.1 relative luminance of the 8-bit value above, which is
 * what actually reaches the screen. Recomputed rather than copied.
 *
 * Layout: pixelboop/Core/KeyRowLayout.swift:18-19,34,43-51
 *     firstColumn = 11, lastColumn = 22, tonicOffset = 4
 *     pitchClass(forColumn:rootNote:) = (root + 7 * (col - 11 - 4)) mod 12
 *
 * Scale intervals: pixelboop/Core/Scale.swift:40-59 (eight cases), duplicated
 * identically at pixelboop/Core/IntervalMode.swift:78-88.
 */

export type NoteSwatch = {
  /** Note name, sharps spelled with the Unicode sharp sign. */
  name: string;
  /** sRGB hex as rendered. */
  hex: string;
  /** WCAG relative luminance of `hex`, 0 to 1. */
  lum: number;
  /** Label color that stays legible on `hex`. */
  ink: string;
};

/**
 * Indexed by PITCH CLASS (0 = C, 1 = C sharp, 2 = D ...).
 *
 * `ink` is white only where relative luminance falls below 0.18. Two swatches
 * qualify: G sharp at 0.084 and D sharp at 0.134. The row spans a 9.4x range
 * in luminance, so no single label color works across all twelve.
 */
export const BY_PITCH_CLASS: NoteSwatch[] = [
  { name: 'C', hex: '#ED2B2B', lum: 0.199, ink: '#000' },
  { name: 'C♯', hex: '#2B8CED', lum: 0.254, ink: '#000' },
  { name: 'D', hex: '#EDED2B', lum: 0.787, ink: '#000' },
  { name: 'D♯', hex: '#8C2BED', lum: 0.134, ink: '#FFF' },
  { name: 'E', hex: '#2BED2B', lum: 0.613, ink: '#000' },
  { name: 'F', hex: '#ED2B8C', lum: 0.216, ink: '#000' },
  { name: 'F♯', hex: '#2BEDED', lum: 0.672, ink: '#000' },
  { name: 'G', hex: '#ED8C2B', lum: 0.369, ink: '#000' },
  { name: 'G♯', hex: '#2B2BED', lum: 0.084, ink: '#FFF' },
  { name: 'A', hex: '#8CED2B', lum: 0.663, ink: '#000' },
  { name: 'A♯', hex: '#ED2BED', lum: 0.258, ink: '#000' },
  { name: 'B', hex: '#2BED8C', lum: 0.630, ink: '#000' },
];

/**
 * The same twelve swatches indexed by CIRCLE-OF-FIFTHS POSITION
 * (0 = C, 1 = G, 2 = D ...). Derived, not retyped: position i holds the pitch
 * class p for which (p * 7) mod 12 === i, and since 7 is its own inverse mod
 * 12 that is simply p = (i * 7) mod 12.
 */
export const BY_FIFTHS: NoteSwatch[] = Array.from(
  { length: 12 },
  (_, i) => BY_PITCH_CLASS[(i * 7) % 12],
);

/* ------------------------------------------------------------------ */
/* Key row geometry                                                    */
/* ------------------------------------------------------------------ */

export const FIRST_COLUMN = 11;
export const LAST_COLUMN = 22;
/** KeyRowLayout.tonicOffset. The tonic sits at FIRST_COLUMN + 4 = column 15. */
export const TONIC_OFFSET = 4;
export const TONIC_COLUMN = FIRST_COLUMN + TONIC_OFFSET;
export const COLUMNS = Array.from({ length: 12 }, (_, i) => FIRST_COLUMN + i);

/** Pitch class shown at `col` for a given root, under fifths ordering. */
export function pitchClassAt(col: number, root: number): number {
  const fifths = col - FIRST_COLUMN - TONIC_OFFSET;
  return (((root + 7 * fifths) % 12) + 12) % 12;
}

/**
 * Signed distance in fifths from the tonic for an interval of `semitones`,
 * placed inside the row's window of -4 to +7.
 *
 * 7 is its own inverse modulo 12, so the fifths distance of an interval i is
 * (7 * i) mod 12. Values above +7 are the same note reached flatward, so they
 * fold to the negative side, which is what puts the flat notes to the left.
 */
export function fifthsOffset(semitones: number): number {
  const f = (((7 * semitones) % 12) + 12) % 12;
  return f > 7 ? f - 12 : f;
}

/** Column that an interval lands on. */
export function columnFor(semitones: number): number {
  return TONIC_COLUMN + fifthsOffset(semitones);
}

export type ScaleDef = {
  name: string;
  /** Semitone offsets from the root, exactly as in Scale.swift. */
  intervals: number[];
  /** True for the scales the app does not offer, shown for comparison only. */
  notInApp?: boolean;
};

/** The app's eight scales, in Scale.swift order of definition. */
export const SCALES: ScaleDef[] = [
  { name: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11] },
  { name: 'Minor', intervals: [0, 2, 3, 5, 7, 8, 10] },
  { name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10] },
  { name: 'Lydian', intervals: [0, 2, 4, 6, 7, 9, 11] },
  { name: 'Pentatonic', intervals: [0, 2, 4, 7, 9] },
  { name: 'Blues', intervals: [0, 3, 5, 6, 7, 10] },
  { name: 'Hirajoshi', intervals: [0, 2, 3, 7, 8] },
  { name: 'Hungarian', intervals: [0, 2, 3, 6, 7, 8, 11] },
];

/** Columns a scale lights, ascending. Independent of key, by construction. */
export function columnsFor(scale: ScaleDef): number[] {
  return scale.intervals.map(columnFor).sort((a, b) => a - b);
}

/** How many separate runs of adjacent columns a scale forms. 1 = contiguous. */
export function pieceCount(cols: number[]): number {
  let n = 1;
  for (let i = 1; i < cols.length; i++) if (cols[i] !== cols[i - 1] + 1) n++;
  return n;
}

/**
 * Opacity that lands any swatch on a common perceived luminance.
 *
 * Composited over black, a layer at opacity o reads at about lum * o^2.2, so
 * solving for a shared target gives o = (target / lum) ^ (1 / 2.2). This is
 * the proposal's answer to the spread documented in LuminanceEvidence: the
 * dim floor is equal-luminance rather than equal-opacity.
 */
export function equalLuminanceOpacity(lum: number, target = 0.04): number {
  return Math.min(1, Math.pow(target / lum, 1 / 2.2));
}
