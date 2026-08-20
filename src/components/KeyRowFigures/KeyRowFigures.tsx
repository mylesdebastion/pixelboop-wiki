import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import {
  BY_PITCH_CLASS,
  COLUMNS,
  FIRST_COLUMN,
  SCALES,
  TONIC_COLUMN,
  columnsFor,
  equalLuminanceOpacity,
  fifthsOffset,
  pieceCount,
  pitchClassAt,
  type ScaleDef,
} from '../HarmonyFigures/noteColors';

/**
 * Figures for docs/MakingSound/KeyRow.mdx.
 *
 * TWO RULES THESE FIGURES OBEY, BOTH LOAD-BEARING
 *
 * 1. A figure that depicts the key row may only use capabilities the app has:
 *    solid color per pixel, and timing. No borders, no outlines, no rings, no
 *    glyphs inside a pixel. Anything that points at a pixel goes in a gutter
 *    BELOW the row and is labeled as a reading aid for this page.
 *
 * 2. Fifths ordering is an INTERNAL-ONLY prototype
 *    (FeatureFlags.enableHarmonicRowFifthsOrder, #if INTERNAL_BUILD, default
 *    off). The shipped public row is chromatic: column 11 + n selects pitch
 *    class n. The page says so; these figures illustrate the prototype.
 *
 * Numbers come from ../HarmonyFigures/noteColors, which carries its own
 * provenance notes back to the app source.
 */

/* ------------------------------------------------------------------ */
/* shared bits                                                         */
/* ------------------------------------------------------------------ */

const SANS = 'system-ui, -apple-system, sans-serif';

/** Screen-reader friendly note name. "F♯" reads badly; "F sharp" does not. */
const spoken = (name: string) => name.replace('♯', ' sharp');

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return reduced;
}

function Figure({
  caption,
  children,
}: {
  caption: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <figure className={styles.wrap}>
      {children}
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}

/** Note names and column numbers, plus the tonic caret. Gutter only. */
function ColumnGutter({
  root = 0,
  showCaret = true,
}: {
  root?: number;
  showCaret?: boolean;
}) {
  return (
    <>
      <div className={styles.gutter} aria-hidden="true">
        {COLUMNS.map((col) => (
          <div key={col} className={styles.colCap}>
            <b>{BY_PITCH_CLASS[pitchClassAt(col, root)].name}</b>
            {col}
          </div>
        ))}
      </div>
      {showCaret && (
        <div className={styles.gutter} aria-hidden="true">
          {COLUMNS.map((col) => (
            <div key={col} className={styles.caret}>
              {col === TONIC_COLUMN ? '▲' : ''}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 1. ScaleBlocks: all eight scales at rest                            */
/* ------------------------------------------------------------------ */

/** Geometry shared by the two static SVG block figures. */
const LABEL_W = 138;
const CELL = 42;
const CELL_W = 37;
const gx = (col: number) => LABEL_W + (col - FIRST_COLUMN) * CELL;

function BlockRow({
  y,
  label,
  sub,
  cols,
  root = 0,
  dimLabel = false,
}: {
  y: number;
  label: string;
  sub?: string;
  cols: number[];
  root?: number;
  dimLabel?: boolean;
}) {
  const lit = new Set(cols);
  return (
    <g>
      <text
        x="0"
        y={y + 22}
        fontSize="14"
        fontWeight="600"
        fill="currentColor"
        fontFamily={SANS}
        opacity={dimLabel ? 0.55 : 1}
      >
        {label}
      </text>
      {sub && (
        <text
          x="0"
          y={y + 38}
          fontSize="11"
          fill="currentColor"
          opacity="0.6"
          fontFamily={SANS}
        >
          {sub}
        </text>
      )}
      {COLUMNS.map((col) => {
        const on = lit.has(col);
        const pc = pitchClassAt(col, root);
        return (
          <rect
            key={col}
            x={gx(col)}
            y={y}
            width={CELL_W}
            height="30"
            rx="3"
            fill={on ? BY_PITCH_CLASS[pc].hex : 'currentColor'}
            opacity={on ? 1 : 0.12}
          />
        );
      })}
    </g>
  );
}

/**
 * Display order for ScaleBlocks.
 *
 * NOT Scale.swift definition order. The four seven-note modes are listed in
 * staircase order (each block one or more columns right of the one above), so
 * the "same block, slid right" claim in the prose is visible in the figure
 * rather than merely asserted next to it. Pentatonic follows Major and Lydian
 * because it is a subset of Major. The three fragmented scales come last.
 */
const BLOCK_ORDER = [
  'Minor',
  'Dorian',
  'Major',
  'Lydian',
  'Pentatonic',
  'Blues',
  'Hirajoshi',
  'Hungarian',
];

export function ScaleBlocks() {
  const rows = BLOCK_ORDER.map((name) => {
    const s = SCALES.find((x) => x.name === name) as ScaleDef;
    const cols = columnsFor(s);
    return { scale: s, cols, pieces: pieceCount(cols) };
  });
  const top = 46;
  const rowH = 44;
  const height = top + rows.length * rowH + 58;
  const width = LABEL_W + 12 * CELL + 96;

  return (
    <Figure
      caption={
        <>
          All eight scales on the prototype key row, in the key of C. Five form
          one unbroken block. Blues and Hirajoshi break into two pieces,
          Hungarian into three. The top four rows are ordered to show the
          staircase: the same seven pixels, one step right each time. The caret
          below the row is a reading aid for this page: the app draws no marker
          on the tonic.
        </>
      }
    >
      <div className={styles.scroller}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block', minWidth: 660 }}
          role="img"
          aria-label={
            'Eight scales drawn across the twelve key row columns, 11 to 22, in the key of C. ' +
            rows
              .map(
                (r) =>
                  `${r.scale.name} lights columns ${r.cols.join(', ')}, ${
                    r.pieces === 1 ? 'one unbroken block' : `${r.pieces} separate pieces`
                  }`,
              )
              .join('. ') +
            '. The tonic is at column 15 in every case.'
          }
        >
          {/* header: note names and column numbers */}
          {COLUMNS.map((col) => (
            <g key={col}>
              <text
                x={gx(col) + CELL_W / 2}
                y="16"
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="currentColor"
                fontFamily={SANS}
              >
                {BY_PITCH_CLASS[pitchClassAt(col, 0)].name}
              </text>
              <text
                x={gx(col) + CELL_W / 2}
                y="31"
                textAnchor="middle"
                fontSize="11"
                fill="currentColor"
                opacity="0.6"
                fontFamily={SANS}
              >
                {col}
              </text>
            </g>
          ))}

          {rows.map((r, i) => (
            <g key={r.scale.name}>
              <BlockRow
                y={top + i * rowH}
                label={r.scale.name}
                sub={`${r.scale.intervals.length} notes`}
                cols={r.cols}
              />
              {r.pieces > 1 && (
                <text
                  x={gx(23) + 8}
                  y={top + i * rowH + 20}
                  fontSize="12"
                  fill="currentColor"
                  opacity="0.75"
                  fontFamily={SANS}
                >
                  {r.pieces} pieces
                </text>
              )}
            </g>
          ))}

          {/* tonic caret, in the gutter, never on a pixel */}
          <g>
            <text
              x={gx(TONIC_COLUMN) + CELL_W / 2}
              y={top + rows.length * rowH + 16}
              textAnchor="middle"
              fontSize="15"
              fill="currentColor"
              fontFamily={SANS}
            >
              ▲
            </text>
            <text
              x={gx(TONIC_COLUMN) + CELL_W / 2}
              y={top + rows.length * rowH + 34}
              textAnchor="middle"
              fontSize="11.5"
              fill="currentColor"
              opacity="0.75"
              fontFamily={SANS}
            >
              tonic, column 15
            </text>
            <text
              x="0"
              y={top + rows.length * rowH + 52}
              fontSize="11.5"
              fill="currentColor"
              opacity="0.6"
              fontFamily={SANS}
            >
              The caret is drawn by this page, not by the app. Pixelboop renders flat color only.
            </text>
          </g>
        </svg>
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* 2. ModeLadder: the block's asymmetry counts the flats               */
/* ------------------------------------------------------------------ */

const LADDER: (ScaleDef & { flats: number })[] = [
  { name: 'Lydian', intervals: [0, 2, 4, 6, 7, 9, 11], flats: 0 },
  { name: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11], flats: 1 },
  { name: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10], flats: 2, notInApp: true },
  { name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10], flats: 3 },
  { name: 'Minor', intervals: [0, 2, 3, 5, 7, 8, 10], flats: 4 },
];

export function ModeLadder() {
  const top = 40;
  const rowH = 44;
  const height = top + LADDER.length * rowH + 54;
  const width = LABEL_W + 12 * CELL + 150;
  const divX = gx(TONIC_COLUMN) - 3;

  return (
    <Figure
      caption={
        <>
          The same seven pixels, sliding one column left with each flat added,
          so the count of lit pixels to the left of column 15 is exactly the
          number of flats. Mixolydian is drawn dimmed because the app does not
          offer it; it is the gap between Dorian and Major.
        </>
      }
    >
      <div className={styles.scroller}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block', minWidth: 680 }}
          role="img"
          aria-label={
            'Five modes stacked as blocks on the key row. ' +
            LADDER.map(
              (m) =>
                `${m.name}${m.notInApp ? ', not offered by the app,' : ''} lights columns ${columnsFor(
                  m,
                ).join(', ')} and has ${m.flats} pixels left of column 15, matching its ${
                  m.flats
                } flats`,
            ).join('. ') +
            '. Each block sits one column right of the one above it.'
          }
        >
          {/* flat side / sharp side headers */}
          <text
            x={gx(FIRST_COLUMN)}
            y="16"
            fontSize="12"
            fontWeight="600"
            fill="currentColor"
            opacity="0.8"
            fontFamily={SANS}
          >
            flat side (4 columns)
          </text>
          <text
            x={gx(TONIC_COLUMN + 1)}
            y="16"
            fontSize="12"
            fontWeight="600"
            fill="currentColor"
            opacity="0.8"
            fontFamily={SANS}
          >
            sharp side (7 columns)
          </text>
          <line
            x1={divX}
            y1="22"
            x2={divX}
            y2={top + LADDER.length * rowH + 4}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.45"
          />

          {COLUMNS.map((col) => (
            <text
              key={col}
              x={gx(col) + CELL_W / 2}
              y="34"
              textAnchor="middle"
              fontSize="11"
              fill="currentColor"
              opacity="0.6"
              fontFamily={SANS}
            >
              {col}
            </text>
          ))}

          {LADDER.map((m, i) => (
            <g key={m.name} opacity={m.notInApp ? 0.45 : 1}>
              <BlockRow
                y={top + i * rowH}
                label={m.name}
                sub={m.notInApp ? 'not in the app' : undefined}
                cols={columnsFor(m)}
                dimLabel={m.notInApp}
              />
              <text
                x={gx(23) + 8}
                y={top + i * rowH + 20}
                fontSize="12.5"
                fill="currentColor"
                opacity="0.85"
                fontFamily={SANS}
              >
                {m.flats} {m.flats === 1 ? 'flat' : 'flats'}
              </text>
            </g>
          ))}

          <text
            x="0"
            y={top + LADDER.length * rowH + 26}
            fontSize="11.5"
            fill="currentColor"
            opacity="0.7"
            fontFamily={SANS}
          >
            Phrygian needs a fifth flat column and Locrian a sixth. The row has only four, so both
            wrap to the far right.
          </text>
          <text
            x="0"
            y={top + LADDER.length * rowH + 44}
            fontSize="11.5"
            fill="currentColor"
            opacity="0.55"
            fontFamily={SANS}
          >
            Derived from tonicOffset = 4 in KeyRowLayout.swift.
          </text>
        </svg>
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* 3. KeyRowExplorer: the interactive one                              */
/* ------------------------------------------------------------------ */

const CHORD_LABELS = ['I', 'IV', 'V'];

/** Roots of the scale's own I, IV and V, as pitch classes. */
function chordRoots(scale: ScaleDef, root: number): number[] {
  const iv = scale.intervals;
  const n = iv.length;
  return [iv[0], iv[Math.min(3, n - 2)], iv[Math.min(4, n - 1)]].map(
    (i) => (i + root) % 12,
  );
}

export function KeyRowExplorer() {
  const reduced = useReducedMotion();
  const [root, setRoot] = useState(0);
  const [scaleIdx, setScaleIdx] = useState(0);
  const [chordIdx, setChordIdx] = useState(0);

  const scale = SCALES[scaleIdx];
  const lit = new Set(columnsFor(scale));
  const roots = chordRoots(scale, root);
  const chordRoot = roots[chordIdx];

  return (
    <Figure
      caption={
        <>
          Click or tab to any pixel to move the song to that key. The lit block
          does not move and the tonic stays on column 15; only the colors
          rotate. Change the scale and the opposite happens: the colors stay
          and the block slides.
        </>
      }
    >
      <div className={styles.controls}>
        <span className={styles.groupLabel}>Scale</span>
        {SCALES.map((s, i) => (
          <button
            key={s.name}
            type="button"
            className={styles.btn}
            aria-pressed={i === scaleIdx}
            onClick={() => {
              setScaleIdx(i);
              setChordIdx(0);
            }}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <span className={styles.groupLabel}>Chord</span>
        {CHORD_LABELS.map((label, i) => (
          <button
            key={label}
            type="button"
            className={styles.btn}
            aria-pressed={i === chordIdx}
            onClick={() => setChordIdx(i)}
          >
            {label} ({BY_PITCH_CLASS[roots[i]].name})
          </button>
        ))}
      </div>

      <p className={styles.state} aria-live="polite">
        Key of <strong>{BY_PITCH_CLASS[root].name}</strong>, scale{' '}
        <strong>{scale.name}</strong>, chord{' '}
        <strong>{BY_PITCH_CLASS[chordRoot].name}</strong>. Lit columns:{' '}
        <strong>{columnsFor(scale).join(', ')}</strong>.
      </p>

      <div className={styles.scroller}>
        <div className={styles.row} role="group" aria-label="Key row, columns 11 to 22">
          {COLUMNS.map((col) => {
            const pc = pitchClassAt(col, root);
            const on = lit.has(col);
            const isTonic = pc === root;
            const isChordRoot = pc === chordRoot;
            return (
              <button
                key={col}
                type="button"
                className={styles.pixel}
                style={{
                  background: on ? BY_PITCH_CLASS[pc].hex : undefined,
                  opacity: on && !reduced && isChordRoot ? 1 : on ? 0.85 : 1,
                }}
                aria-current={isTonic ? 'true' : undefined}
                aria-label={
                  `Set key to ${spoken(BY_PITCH_CLASS[pc].name)}, column ${col}. ` +
                  `${on ? 'In scale' : 'Out of scale'}.` +
                  (isTonic ? ' Current key, the tonic.' : '')
                }
                onClick={() => {
                  setRoot(pc);
                  setChordIdx(0);
                }}
              />
            );
          })}
        </div>
        <ColumnGutter root={root} />
      </div>
      <p className={styles.aidNote}>
        The caret marks column 15. It is drawn by this page as a reading aid;
        the app draws no marker, because the tonic is always in that column.
      </p>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* 4. LuminanceEvidence: why brightness cannot rank                    */
/* ------------------------------------------------------------------ */

const DM = [
  { name: 'F', pc: 5, role: 'the minor third' },
  { name: 'A', pc: 9, role: 'the fifth' },
  { name: 'D', pc: 2, role: 'the root' },
];

export function LuminanceEvidence() {
  const width = 700;
  // barX clears the widest role string. At 250 the F row's descriptor ran
  // under the bar track.
  const barX = 300;
  const barW = 300;
  const rowH = 62;
  const top = 52;
  const height = top + DM.length * rowH + 60;
  const maxLum = 0.787;

  return (
    <Figure
      caption={
        <>
          The three chord tones of D minor, all rendered at full brightness by
          the app. They read at 0.216, 0.663 and 0.787 relative luminance, a
          3.64x spread. Nothing is dimming the F: the spread is the hue itself.
        </>
      }
    >
      <div className={styles.scroller}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block', minWidth: 560 }}
          role="img"
          aria-label={
            'Three swatches for the chord tones of D minor, all at full brightness. ' +
            'F reads at 0.216 relative luminance, A at 0.663, D at 0.787. ' +
            'The spread between the brightest and dimmest is 3.64 times.'
          }
        >
          <text x="0" y="16" fontSize="13" fontWeight="600" fill="currentColor" fontFamily={SANS}>
            D minor, all three tones at 100% brightness
          </text>
          <text x="0" y="34" fontSize="11.5" fill="currentColor" opacity="0.65" fontFamily={SANS}>
            WCAG relative luminance of the color the app actually renders
          </text>

          {DM.map((n, i) => {
            const s = BY_PITCH_CLASS[n.pc];
            const y = top + i * rowH;
            return (
              <g key={n.name}>
                <rect x="0" y={y} width="54" height="40" rx="4" fill={s.hex} />
                <text
                  x="27"
                  y={y + 26}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="700"
                  fill={s.ink}
                  fontFamily={SANS}
                >
                  {n.name}
                </text>
                <text
                  x="66"
                  y={y + 17}
                  fontSize="12"
                  fill="currentColor"
                  fontFamily={SANS}
                  opacity="0.9"
                >
                  {s.hex}
                </text>
                <text
                  x="66"
                  y={y + 33}
                  fontSize="11"
                  fill="currentColor"
                  opacity="0.62"
                  fontFamily={SANS}
                >
                  {n.role}
                </text>
                {/* bar track */}
                <rect
                  x={barX}
                  y={y + 10}
                  width={barW}
                  height="20"
                  rx="3"
                  fill="currentColor"
                  opacity="0.12"
                />
                <rect
                  x={barX}
                  y={y + 10}
                  width={(s.lum / maxLum) * barW}
                  height="20"
                  rx="3"
                  fill={s.hex}
                />
                <text
                  x={barX + (s.lum / maxLum) * barW + 8}
                  y={y + 25}
                  fontSize="13"
                  fontWeight="600"
                  fill="currentColor"
                  fontFamily={SANS}
                >
                  {s.lum.toFixed(3)}
                </text>
              </g>
            );
          })}

          <text
            x="0"
            y={top + DM.length * rowH + 22}
            fontSize="12.5"
            fill="currentColor"
            fontFamily={SANS}
          >
            Brightest over dimmest: 0.787 / 0.216 = 3.64x, on notes the app treats as equals.
          </text>
          <text
            x="0"
            y={top + DM.length * rowH + 42}
            fontSize="11.5"
            fill="currentColor"
            opacity="0.65"
            fontFamily={SANS}
          >
            Across all twelve pitch classes the range is 9.4x, from G sharp at 0.084 to D at 0.787.
          </text>
        </svg>
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Cascade: the proposal, not built                                 */
/* ------------------------------------------------------------------ */

const SPAN = 0.26;
const RISE = 0.045;
const FALL = 0.3;

/** Column index a pitch class occupies, for measuring harmonic distance. */
function columnOfPitch(pc: number, root: number): number {
  for (const col of COLUMNS) if (pitchClassAt(col, root) === pc) return col;
  return TONIC_COLUMN;
}

/** Distance ranks of a scale's notes from a chord root, nearest first. */
function ranksFor(scale: ScaleDef, root: number, chordRoot: number) {
  const pcs = scale.intervals.map((i) => (i + root) % 12);
  const cr = columnOfPitch(chordRoot, root);
  const dists = [...new Set(pcs.map((p) => Math.abs(columnOfPitch(p, root) - cr)))].sort(
    (a, b) => a - b,
  );
  const rankOf = new Map<number, number>();
  pcs.forEach((p) => {
    rankOf.set(p, dists.indexOf(Math.abs(columnOfPitch(p, root) - cr)));
  });
  return { rankOf, steps: dists.length };
}

/** Opacity of one pixel at phase u (0 to 1) through the bar. */
function waveOpacity(lum: number, rank: number, steps: number, u: number): number {
  const floor = equalLuminanceOpacity(lum);
  if (rank === 0) return 1;
  const step = SPAN / Math.max(1, steps - 1);
  const x = u - rank * step;
  let w = 0;
  if (x >= -RISE && x <= FALL) {
    const ww = x < 0 ? RISE : FALL;
    w = Math.pow(0.5 * (1 + Math.cos((Math.PI * x) / ww)), 1 + rank * 0.22);
  }
  return floor + (1 - floor) * w;
}

export function Cascade() {
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [u, setU] = useState(0);
  const [chordIdx, setChordIdx] = useState(0);
  const raf = useRef<number | null>(null);
  const t0 = useRef<number>(0);

  const root = 0;
  const scale = SCALES[0]; // Major
  const roots = chordRoots(scale, root);
  const chordRoot = roots[chordIdx];
  const { rankOf, steps } = ranksFor(scale, root, chordRoot);

  // Autoplay only when motion is welcome. Under reduced motion the still
  // state below is the whole figure, and nothing ever animates.
  useEffect(() => {
    setPlaying(!reduced);
  }, [reduced]);

  const tick = useCallback((now: number) => {
    if (!t0.current) t0.current = now;
    const T = (now - t0.current) / 3000;
    setChordIdx(Math.floor(T) % 3);
    setU(T % 1);
    raf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!playing) {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      return;
    }
    t0.current = 0;
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [playing, tick]);

  // The still state is the downbeat: the chord root at full, every other note
  // of the scale resting on the equal-luminance floor, and the radiation order
  // spelled out in the gutter. That is the whole idea of the figure, held
  // still, rather than an animation stopped at an arbitrary frame.
  const phase = playing ? u : 0;

  return (
    <Figure
      caption={
        <>
          A design direction, not a feature. The chord root peaks on the
          downbeat and the wave radiates outward in order of harmonic distance,
          over a dim floor held at equal luminance so the scale stays readable
          throughout. Nothing in any Pixelboop build does this. The panel is
          black because the resting floor is computed to composite against the
          app's black grid, and it only behaves correctly over that.
        </>
      }
    >
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => setPlaying((p) => !p)}
          aria-pressed={playing}
        >
          {playing ? 'Pause' : 'Play'} the cascade
        </button>
        <span className={styles.groupLabel}>
          {playing
            ? `chord ${CHORD_LABELS[chordIdx]} (${BY_PITCH_CLASS[chordRoot].name})`
            : 'showing the downbeat, with the radiation order below'}
        </span>
      </div>

      <div className={`${styles.scroller} ${styles.darkPanel}`}>
        <div className={styles.row} aria-hidden="true">
          {COLUMNS.map((col) => {
            const pc = pitchClassAt(col, root);
            const rank = rankOf.get(pc);
            const inScale = rank !== undefined;
            return (
              <div
                key={col}
                className={`${styles.pixel} ${styles.static}`}
                style={
                  inScale
                    ? {
                        background: BY_PITCH_CLASS[pc].hex,
                        opacity: waveOpacity(
                          BY_PITCH_CLASS[pc].lum,
                          rank as number,
                          steps,
                          phase,
                        ),
                      }
                    : undefined
                }
              />
            );
          })}
        </div>

        {/* radiation order, in the gutter, only while still */}
        {!playing && (
          <div className={styles.gutter} aria-hidden="true">
            {COLUMNS.map((col) => {
              const rank = rankOf.get(pitchClassAt(col, root));
              return (
                <div key={col} className={styles.caret}>
                  {rank === undefined ? '' : rank}
                </div>
              );
            })}
          </div>
        )}
        <ColumnGutter root={root} showCaret={playing} />
      </div>

      <p className={styles.aidNote}>
        {playing
          ? 'Numbers showing the radiation order appear when the cascade is paused.'
          : 'Numbers are the radiation order: 0 peaks on the downbeat, then 1, then 2. The caret and these numbers are reading aids for this page, not app output.'}
      </p>
      <p className={styles.srOnly}>
        In the proposal, the chord root lights fully on the downbeat and holds.
        The remaining notes of the scale brighten in waves ordered by their
        distance from the chord root along the circle of fifths, each falling
        back to a dim floor. The floor opacity is set per note so that every
        unlit pixel reads at the same luminance, which is what the current
        color system cannot do.
      </p>
    </Figure>
  );
}

export default {
  ScaleBlocks,
  ModeLadder,
  KeyRowExplorer,
  LuminanceEvidence,
  Cascade,
};
