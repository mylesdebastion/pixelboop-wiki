import React from 'react';
import { BY_FIFTHS } from './noteColors';

/**
 * Figures for docs/MakingSound/HarmonyEngine.mdx.
 *
 * Colors are the app's Harmonic Colors wheel, reproduced exactly:
 * AppColors.harmonicColorForPitch maps pitch class pc to
 * fifthsIndex = (pc * 7) % 12, hue = fifthsIndex * 30 degrees,
 * at HSB saturation 0.82, brightness 0.93. The twelve hex values below
 * were computed from that formula and cross-checked against the app's own
 * captured row-0 output (F = #ED2B8C, D = #EDED2B, A = #8CED2B).
 *
 * Everything is inline SVG with currentColor for text and rules, so the
 * figures follow the site's light and dark themes.
 */

// Indexed by CIRCLE-OF-FIFTHS POSITION (0 = C, 1 = G, 2 = D ...), not by semitone.
// `ink` is the label color: these swatches span a 9.4x range in relative
// luminance (D at 0.787 down to G sharp at 0.084), so a single label color is
// unreadable on one end or the other. Black below, white on the two darkest.
//
// The values now live in ./noteColors.ts, shared with KeyRowFigures.tsx, so
// the palette is defined once. Only the property name differs here.
const FIFTHS: { name: string; color: string; ink: string }[] = BY_FIFTHS.map(
  (s) => ({ name: s.name, color: s.hex, ink: s.ink }),
);

const wrap: React.CSSProperties = { margin: '1.5rem 0' };
const scroller: React.CSSProperties = { overflowX: 'auto' };
const svgBox: React.CSSProperties = { width: '100%', height: 'auto', display: 'block' };
const cap: React.CSSProperties = { fontSize: '0.85rem', opacity: 0.75, marginTop: '0.5rem' };

function Figure({ caption, minWidth, children }: {
  caption: string; minWidth: number; children: React.ReactNode;
}) {
  return (
    <figure style={wrap}>
      <div style={scroller}>
        <div style={{ minWidth }}>{children}</div>
      </div>
      <figcaption style={cap}>{caption}</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Key axis and chord axis stack rather than compete.               */
/* ------------------------------------------------------------------ */

export function TwoAxes() {
  const x0 = 128, w = 34, steps = 16;
  const sx = (s: number) => x0 + s * w;
  // Swatch colors are the app's own; ink follows the same luminance rule as
  // FIFTHS above (D sharp / E flat sits at 0.134, far too dark for black text).
  const keyMarks = [
    { s: 0, label: 'C', fill: '#ED2B2B', ink: '#000' },
    { s: 8, label: 'E♭', fill: '#8C2BED', ink: '#FFF' },
  ];
  const chordMarks = [
    { s: 0, label: 'ii' }, { s: 4, label: 'V' },
    { s: 8, label: 'ii' }, { s: 12, label: 'V' },
  ];
  return (
    <Figure minWidth={700} caption="The key markers pick the home; the chords track picks the chord inside it. The same two-bar chord figure is played first in C, then in E flat, without redrawing it.">
      <svg viewBox="0 0 700 260" style={svgBox} role="img"
           aria-label="Two stacked lanes. The upper lane holds key markers at step 0 and step 8. The lower lane holds a repeating two-chord figure. The two lanes combine to give the sounding chord.">
        <g fill="currentColor" fontFamily="system-ui, sans-serif">
          {/* lane 1: key */}
          <text x="8" y="42" fontSize="14" fontWeight="600">Key markers</text>
          <text x="8" y="60" fontSize="12" opacity="0.65">row 22</text>
          <text x="8" y="78" fontSize="12" opacity="0.65">which key</text>
          {/* lane 2: chords */}
          <text x="8" y="152" fontSize="14" fontWeight="600">Chords track</text>
          <text x="8" y="170" fontSize="12" opacity="0.65">which chord</text>
          <text x="8" y="188" fontSize="12" opacity="0.65">in that key</text>
          {/* result */}
          <text x="8" y="238" fontSize="14" fontWeight="600">Sounds as</text>
        </g>

        {/* step grid */}
        {Array.from({ length: steps }, (_, s) => (
          <g key={s}>
            <rect x={sx(s)} y="26" width={w - 3} height="42" rx="3"
                  fill="none" stroke="currentColor" strokeWidth="1" opacity="0.22" />
            <rect x={sx(s)} y="136" width={w - 3} height="42" rx="3"
                  fill="none" stroke="currentColor" strokeWidth="1" opacity="0.22" />
          </g>
        ))}

        {/* key markers */}
        {keyMarks.map(({ s, label, fill, ink }) => (
          <g key={s}>
            <rect x={sx(s)} y="26" width={w - 3} height="42" rx="3" fill={fill} />
            <text x={sx(s) + (w - 3) / 2} y="53" textAnchor="middle" fontSize="15"
                  fontWeight="700" fill={ink} fontFamily="system-ui, sans-serif">{label}</text>
          </g>
        ))}
        <line x1={sx(0) + 16} y1="72" x2={sx(7) + 30} y2="72"
              stroke="#ED2B2B" strokeWidth="3" strokeLinecap="round" />
        <line x1={sx(8) + 16} y1="72" x2={sx(15) + 30} y2="72"
              stroke="#8C2BED" strokeWidth="3" strokeLinecap="round" />
        <text x={sx(3)} y="94" fontSize="12" fill="currentColor" opacity="0.75"
              fontFamily="system-ui, sans-serif">key of C holds</text>
        <text x={sx(11)} y="94" fontSize="12" fill="currentColor" opacity="0.75"
              fontFamily="system-ui, sans-serif">key of E♭ holds</text>

        {/* chords */}
        {chordMarks.map(({ s, label }, i) => (
          <g key={i}>
            <rect x={sx(s)} y="136" width={w * 4 - 3} height="42" rx="3"
                  fill="#2BED8C" opacity="0.9" />
            <text x={sx(s) + (w * 4 - 3) / 2} y="163" textAnchor="middle" fontSize="15"
                  fontWeight="700" fill="#000" fontFamily="system-ui, sans-serif">{label}</text>
          </g>
        ))}
        <text x={sx(0)} y="202" fontSize="12" fill="currentColor" opacity="0.75"
              fontFamily="system-ui, sans-serif">each chord holds through rests until the next one</text>

        {/* result row */}
        {[
          { s: 0, label: 'D m' }, { s: 4, label: 'G' },
          { s: 8, label: 'F m' }, { s: 12, label: 'B♭' },
        ].map(({ s, label }, i) => (
          <g key={i}>
            <rect x={sx(s)} y="216" width={w * 4 - 3} height="30" rx="3"
                  fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <text x={sx(s) + (w * 4 - 3) / 2} y="236" textAnchor="middle" fontSize="14"
                  fontWeight="600" fill="currentColor" fontFamily="system-ui, sans-serif">{label}</text>
          </g>
        ))}
      </svg>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* 2. The fifths wheel.                                                */
/* ------------------------------------------------------------------ */

function ringPos(i: number, cx: number, cy: number, r: number) {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2; // position 0 at the top
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export function FifthsWheel() {
  const cx = 190, cy = 190, r = 130;
  return (
    <Figure minWidth={520} caption="Hue is the position on the circle of fifths, 30 degrees per step. Neighbors are a fifth apart and look alike; the tritone sits opposite and contrasts hardest.">
      <svg viewBox="0 0 520 380" style={svgBox} role="img"
           aria-label="A ring of twelve colored note markers arranged by the circle of fifths, C at the top, then G, D, A, E, B, F sharp, C sharp, G sharp, D sharp, A sharp, F.">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25" />
        {/* tritone axis */}
        <line x1={cx} y1={cy - r} x2={cx} y2={cy + r}
              stroke="currentColor" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
        {FIFTHS.map((n, i) => {
          const p = ringPos(i, cx, cy, r);
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="24" fill={n.color} />
              <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="15" fontWeight="700"
                    fill={n.ink} fontFamily="system-ui, sans-serif">{n.name}</text>
            </g>
          );
        })}
        <g fill="currentColor" fontFamily="system-ui, sans-serif" fontSize="13">
          <text x="360" y="120" fontWeight="600" fontSize="14">Reading the wheel</text>
          <text x="360" y="146">One step = a fifth</text>
          <text x="360" y="168">= 30° of hue</text>
          <text x="360" y="200">Opposite = tritone,</text>
          <text x="360" y="220">the opposite hue</text>
          <text x="360" y="252" opacity="0.7">C and G are neighbors</text>
          <text x="360" y="272" opacity="0.7">and look alike.</text>
          <text x="360" y="294" opacity="0.7">C and F♯ are opposite</text>
          <text x="360" y="314" opacity="0.7">and clash on sight.</text>
        </g>
      </svg>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Triad shapes are constant.                                       */
/* ------------------------------------------------------------------ */

/** Chord tones given as offsets in FIFTHS positions from the root's position. */
const TRIADS = [
  { title: 'C major',  rootIdx: 0, offs: [0, 1, 4],   note: 'root, +1, +4' },
  { title: 'E♭ major', rootIdx: 9, offs: [0, 1, 4],   note: 'the same shape' },
  { title: 'A minor',  rootIdx: 3, offs: [-3, 0, 1],  note: '−3, root, +1' },
  { title: 'B dim',    rootIdx: 5, offs: [-6, -3, 0], note: 'root, −3, −6' },
];

export function TriadShapes() {
  const r = 58, pad = 12;
  const cell = 176;
  return (
    <Figure minWidth={720} caption="A major triad is one shape on the fifths wheel and it is that shape in all twelve keys. Minor and diminished are each their own single shape. The shape slides; it never deforms.">
      <svg viewBox="0 0 720 250" style={svgBox} role="img"
           aria-label="Four small circle-of-fifths rings showing C major, E flat major, A minor and B diminished. The two major rings show an identical triangular shape in two different rotations.">
        {TRIADS.map((t, k) => {
          const cx = pad + cell * k + cell / 2, cy = 96;
          const lit = t.offs.map((o) => ((t.rootIdx + o) % 12 + 12) % 12);
          const pts = lit.map((i) => ringPos(i, cx, cy, r));
          return (
            <g key={k}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor"
                      strokeWidth="1" opacity="0.22" />
              <polygon points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
                       fill="currentColor" opacity="0.12"
                       stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.55" />
              {FIFTHS.map((n, i) => {
                const p = ringPos(i, cx, cy, r);
                const on = lit.includes(i);
                return on ? (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="14" fill={n.color} />
                    <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fontWeight="700"
                          fill={n.ink} fontFamily="system-ui, sans-serif">{n.name}</text>
                  </g>
                ) : (
                  <circle key={i} cx={p.x} cy={p.y} r="4.5" fill="currentColor" opacity="0.25" />
                );
              })}
              <text x={cx} y="188" textAnchor="middle" fontSize="14" fontWeight="600"
                    fill="currentColor" fontFamily="system-ui, sans-serif">{t.title}</text>
              <text x={cx} y="208" textAnchor="middle" fontSize="12" opacity="0.7"
                    fill="currentColor" fontFamily="system-ui, sans-serif">{t.note}</text>
            </g>
          );
        })}
        <text x={pad} y="238" fontSize="12" opacity="0.7" fill="currentColor"
              fontFamily="system-ui, sans-serif">
          Steps are counted around the fifths ring, clockwise positive. Small dots are the notes not in the chord.
        </text>
      </svg>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Hue rotation under a diatonic degree shift.                      */
/* ------------------------------------------------------------------ */

const IDX: Record<string, number> = { C: 0, G: 1, D: 2, A: 3, E: 4, B: 5, F: 11 };
const hueOf = (n: string) => IDX[n] * 30;
const colorOf = (n: string) => FIFTHS[IDX[n]].color;
const inkOf = (n: string) => FIFTHS[IDX[n]].ink;

/** Source note to destination note for one degree move, in C major. */
const MOVES: Record<string, { from: string; to: string }[]> = {
  ii: [
    { from: 'C', to: 'D' }, { from: 'D', to: 'E' }, { from: 'E', to: 'F' },
    { from: 'F', to: 'G' }, { from: 'G', to: 'A' }, { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
  ],
  V: [
    { from: 'C', to: 'G' }, { from: 'D', to: 'A' }, { from: 'E', to: 'B' },
    { from: 'F', to: 'C' }, { from: 'G', to: 'D' }, { from: 'A', to: 'E' },
    { from: 'B', to: 'F' },
  ],
};

function Panel({ label, sub, moves, y }: {
  label: string; sub: string; moves: { from: string; to: string }[]; y: number;
}) {
  const deltas = moves.map((m) => (((hueOf(m.to) - hueOf(m.from)) % 360) + 360) % 360);
  const counts: Record<number, number> = {};
  deltas.forEach((d) => { counts[d] = (counts[d] || 0) + 1; });
  const majority = Number(Object.keys(counts).sort((a, b) => counts[Number(b)] - counts[Number(a)])[0]);
  const x0 = 156, w = 74;
  return (
    <g>
      <text x="8" y={y + 34} fontSize="16" fontWeight="700" fill="currentColor"
            fontFamily="system-ui, sans-serif">over {label}</text>
      <text x="8" y={y + 54} fontSize="12" opacity="0.7" fill="currentColor"
            fontFamily="system-ui, sans-serif">{sub}</text>
      {moves.map((m, i) => {
        const cx = x0 + i * w;
        const breaks = deltas[i] !== majority;
        return (
          <g key={i}>
            <circle cx={cx} cy={y + 16} r="16" fill={colorOf(m.from)} />
            <text x={cx} y={y + 21} textAnchor="middle" fontSize="13" fontWeight="700"
                  fill={inkOf(m.from)} fontFamily="system-ui, sans-serif">{m.from}</text>
            <line x1={cx} y1={y + 34} x2={cx} y2={y + 50}
                  stroke="currentColor" strokeWidth={breaks ? 2.5 : 1.5}
                  opacity={breaks ? 0.95 : 0.4} />
            <polygon points={`${cx - 4},${y + 48} ${cx + 4},${y + 48} ${cx},${y + 56}`}
                     fill="currentColor" opacity={breaks ? 0.95 : 0.4} />
            <circle cx={cx} cy={y + 74} r="16" fill={colorOf(m.to)} />
            <text x={cx} y={y + 79} textAnchor="middle" fontSize="13" fontWeight="700"
                  fill={inkOf(m.to)} fontFamily="system-ui, sans-serif">{m.to}</text>
            <text x={cx} y={y + 104} textAnchor="middle" fontSize="12"
                  fontWeight={breaks ? 700 : 400} opacity={breaks ? 1 : 0.55}
                  fill="currentColor" fontFamily="system-ui, sans-serif">
              +{deltas[i]}°
            </text>
            {breaks && (
              <rect x={cx - 26} y={y - 4} width="52" height="116" rx="6" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            )}
          </g>
        );
      })}
      <text x="8" y={y + 78} fontSize="12" opacity="0.7" fill="currentColor"
            fontFamily="system-ui, sans-serif">
        {moves.length - deltas.filter((d) => d !== majority).length} of 7 turn +{majority}°
      </text>
    </g>
  );
}

export function HueRotation() {
  return (
    <Figure minWidth={720} caption="Under a diatonic shift most of the palette rotates by one amount and a couple of notes jump. The notes that jump are exactly the ones crossing a half step or the tritone. Dashed boxes mark them.">
      <svg viewBox="0 0 720 280" style={svgBox} role="img"
           aria-label="Two panels. Over the two chord, five of seven notes rotate 60 degrees and E to F and B to C jump 210 degrees. Over the five chord, six of seven rotate 30 degrees and B to F jumps 180 degrees.">
        <Panel label="ii" sub="up one scale step" moves={MOVES.ii} y={10} />
        <line x1="8" y1="148" x2="720" y2="148" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        <Panel label="V" sub="down three scale steps" moves={MOVES.V} y={160} />
      </svg>
    </Figure>
  );
}

export default { TwoAxes, FifthsWheel, TriadShapes, HueRotation };
