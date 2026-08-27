// PbGridFigure.tsx — the canonical Pixelboop-grid figure. A page names ZONE
// IDS; geometry, colour, and span all come from pbgrid's own ZONES (the
// generated-from-Swift source of truth the canvas substrate already draws
// from). The page never types a hex or a coordinate again.
//
// WHY THIS EXISTS, AND WHY IT IS A NEW COMPONENT RATHER THAN MORE WORK ON
// MystrixVisualizer. MystrixVisualizer's `uiElements` are hand-authored per
// figure: `{ "pos":[27,0], "size":[1,1], "color":"#595959" }`. Every one of
// those hexes and coordinates is a hand-copied Swift constant with nothing
// checking it against the real app -- a FIFTH copy of the grid constants
// (Swift is the first; GridLegendGeometry.swift's own hand-mirror is a
// second, flagged in its own comment; pbgrid's generated
// grid-constants.ts/ZONES is the third, generated and drift-checked;
// MystrixVisualizer/geometry.ts's ROW_BANDS/BAR_COLS are a fourth, hand-
// written with citations). Porting the app's legend (LegendOverlayView.swift)
// INTO MystrixVisualizer would have made it read that fifth copy more
// beautifully. It would still be a fifth copy. This component reads zone ids
// and renders from pbgrid's ZONES directly -- nothing here is hand-copied.
//
// MystrixVisualizer stays in place, untouched, serving the pages not yet
// migrated (see each page's own migration note). It is deleted once every
// call site points here instead.
//
// The five-primitive margin vocabulary (filledTab, hollowTab, sideBracket,
// columnLabel; screenprint has no use here -- see legend.ts's header) and
// its H1-H6 shape heuristic are ported from
// pixelboop/Views/LegendOverlayView.swift in ./legend.ts, generalized to
// classify a pbgrid ZONE's own cell list instead of a hand-authored region.
// See legend.ts for the full port notes and citations.
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import styles from './styles.module.css';
import {
  classifyZone, columnLabelFontSize, coordinateString, groupLegendZones, legendLabelCenters,
  visualRowSpan, type LegendMark,
} from './legend';
// eslint-disable-next-line import/no-unresolved -- vendored plain JS, see src/vendor/pbgrid/pbgrid.js header
import { DEFAULT_EMPTY_STATE_OPTIONS, GRID_LAYOUT, ZONES, renderPbGrid } from '../../vendor/pbgrid/pbgrid.js';

const { columns: COLS, rows: ROWS } = GRID_LAYOUT;

interface PbGridResolved { hex: string; }
interface PbGridZone {
  id: string;
  name: string;
  cells: [number, number][];
  resolve: (col: number, row: number, opts: unknown) => PbGridResolved | undefined;
  describe: (opts: unknown) => string;
}
const ZONE_BY_ID = new Map((ZONES as unknown as PbGridZone[]).map((z) => [z.id, z]));

export interface PbGridFigureProps {
  /** pbgrid zone ids (src/vendor/pbgrid/pbgrid.js's ZONES). Order is the
   * region list's order. */
  focus: string[];
  /** The page's own teaching prose. The only thing a page still authors. */
  caption: string;
  /** How far non-focused zones dim, 0-1. Defaults to pbgrid's own
   * DEFAULT_FOCUS_DIM (0.6) by omission. */
  dim?: number;
}

const Figure: React.FC<PbGridFigureProps> = ({ focus, caption, dim }) => {
  const [sel, setSel] = useState(-1);
  const optRefs = useRef<(HTMLLIElement | null)[]>([]);
  const typed = useRef({ buf: '', at: 0 });
  const figRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boxW, setBoxW] = useState(700);
  const [breakoutPx, setBreakoutPx] = useState(0);

  const zones = useMemo(
    () => focus.map((id) => ZONE_BY_ID.get(id)).filter((z): z is NonNullable<typeof z> => {
      if (!z && process.env.NODE_ENV !== 'production') console.warn(`PbGridFigure: unknown zone id in focus: ${z}`);
      return !!z;
    }),
    [focus],
  );

  // The margin legend groups pbgrid's finer-grained accessibility zones the
  // same way the app's own legend does (LegendOverlayView.swift's labels
  // come from IntroTutorialStep regions, which routinely span several pbgrid
  // zones at once) -- see legend.ts's groupLegendZones for the full port
  // note and citations. This is a LABELLING merge only: the outline per
  // zone, the focus ring per zone, and the region list below all still key
  // on `zones` directly, one entry per pbgrid zone, untouched.
  const legendGroups = useMemo(() => groupLegendZones(zones), [zones]);
  const marks = useMemo(
    () => legendGroups.map((g) => classifyZone(g.zoneIds.join('+'), g.label, g.cells, COLS, ROWS)),
    [legendGroups],
  );
  const tabMarks = marks.filter((m): m is Extract<LegendMark, { kind: 'filledTab' | 'hollowTab' }> =>
    !!m && 'kind' in m && (m.kind === 'filledTab' || m.kind === 'hollowTab'));
  const sideMarks = marks.filter((m): m is Extract<LegendMark, { kind: 'sideBracket' }> => !!m && 'kind' in m && m.kind === 'sideBracket');
  const colMarks = marks.filter((m): m is Extract<LegendMark, { kind: 'columnLabel' }> => !!m && 'kind' in m && m.kind === 'columnLabel');
  const hasLeftBracket = sideMarks.some((m) => !m.rightSide);
  const hasRightBracket = sideMarks.some((m) => m.rightSide);

  // ---- layout, in cell units (1 unit = 1 grid column/row). No row/column
  // coordinate ruler here (MystrixVisualizer's) -- the app's own legend has
  // none either, and margin labels plus focus/dim answer "where is this"
  // without printing raw numbers nobody reading the app ever sees.
  //
  // LT is a CELL-UNIT size, so its rendered pixel size is LT * (px per cell
  // unit) -- and px-per-cell-unit grows with the box's own rendered width,
  // since the SVG is one fixed viewBox stretched by CSS `width: 100%`. A
  // breakout that widens the box (see the breakoutPx effect above) therefore
  // does NOTHING for overlap on its own: verified live, widening `.pic` from
  // 812px to 1093px made "SECTION LENGTH"/"SHAKE INDICATOR" overlap grow
  // from 59.29px to 79.81px, not shrink -- font size and column pitch scale
  // up TOGETHER, so the relative (cell-unit) crowding, which is what
  // actually causes overlap, is exactly unchanged; only the absolute pixel
  // count of that same crowding grew with it.
  //
  // So LT itself has to shrink when a breakout widens the box, by exactly
  // enough to hold the ABSOLUTE (px) font size at whatever it would have
  // rendered at this figure's own natural, un-widened width -- turning the
  // reclaimed pixels into real relative room instead of uniform zoom.
  // `boxW - breakoutPx` recovers that natural width without a hardcoded
  // reference (boxW IS `.wrap`'s measured width, and breakoutPx is exactly
  // how much wider than natural `.pic`/`.wrap` were made) -- when
  // breakoutPx is 0 (every figure that isn't wide enough to need one) the
  // ratio is exactly 1 and LT is exactly 0.85, unchanged from before this
  // existed.
  const naturalBoxW = Math.max(1, boxW - breakoutPx);
  const LT = 0.85 * Math.min(1, naturalBoxW / boxW); // filledTab / hollowTab / sideBracket / columnLabel text size
  const OFFSET0 = 0.35;
  const TIER_GAP = LT * 1.8;
  const topBandTabs = OFFSET0 + TIER_GAP + LT * 1.3;
  const CAP0 = 0.28;
  const SIDE_MARGIN = 1.3;

  // Tab label centres, in COLUMN SPACE (0..COLS), independent of gut -- the
  // collision pass (legendLabelCenters) never needed to know about a left
  // margin that does not exist yet, so it runs first.
  const tabLabelOf = (m: typeof tabMarks[number]) => (m.kind === 'hollowTab' ? `${m.label}  ·  ${m.detail}` : m.label);
  const tabCentersCol = legendLabelCenters(
    tabMarks.map((m) => ({ colStart: m.colStart, colEnd: m.colEnd, top: m.top, tier: m.kind === 'filledTab' ? 0 : 1, label: tabLabelOf(m) })),
    LT,
  );

  // A label centred near column 0 or column COLS-1 routinely needs to hang
  // part of its own width out past the grid's edge (e.g. "JAMS BUTTON" over
  // cols 40-43, or "PLAY / STOP" over cols 0-2) -- LegendOverlayView.swift
  // never needed a margin for this because its legend is a fixed full-screen
  // overlay, not a document-flow box with sibling content beside it. Here it
  // would otherwise spill into whatever sits next to the figure on the page.
  // Reserved only as far as the widest edge label actually needs.
  let leftOverhang = 0, rightOverhang = 0;
  tabMarks.forEach((m, i) => {
    const halfWidth = tabLabelOf(m).length * LT * 0.60 / 2;
    const c = tabCentersCol[i];
    leftOverhang = Math.max(leftOverhang, halfWidth - c);
    rightOverhang = Math.max(rightOverhang, c + halfWidth - COLS);
  });

  const gut = Math.max(hasLeftBracket ? SIDE_MARGIN : 0, leftOverhang);
  const right = Math.max(hasRightBracket ? SIDE_MARGIN : 0, rightOverhang);
  const W = gut + COLS + right;

  const colLabelCap = 3.0;
  const colLabelFont = colMarks.length ? columnLabelFontSize(colMarks.map((m) => m.label), colLabelCap, LT) : LT;
  const colLabelRoom = colMarks.length
    ? Math.max(...colMarks.map((m) => m.label.length)) * colLabelFont * 0.60 + LT * 0.6
    : 0;

  const top = topBandTabs + colLabelRoom;
  const bottomBand = topBandTabs;
  const H = top + ROWS + bottomBand;
  const X = (col: number) => gut + col;
  const Y = (row: number) => top + row;
  const gridLeft = gut, gridRight = gut + COLS, gridTop = top, gridBottom = top + ROWS;
  const tabCenters = tabCentersCol.map(X);

  // ---- pbgrid substrate: same technique as MystrixVisualizer's (already
  // fixed there for the .wrap 0-width bug) -- canvas positioned by plain CSS
  // percentages of gut/top/COLS/ROWS against W/H, never JS-measured pixels;
  // the SVG stays the normal-flow sizing element.
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (el) { const w = el.getBoundingClientRect().width; if (w > 0) setBoxW(w); }
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver((entries) => { const w = entries[0]?.contentRect.width; if (w > 0) setBoxW(w); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---- breakout: a busy figure (e.g. TopControls' 14-zone row-0 overview)
  // needs more physical pixels per column than the article's own prose-width
  // reading column can spare -- see legend.ts's overlap-avoidance, which is
  // already at its citation-backed limit (LegendOverlayView.swift:617-624,
  // "no room, leave it honest": never shrink a label, never nudge it more
  // than half a cell). Reaching for more room here, not there, is the
  // faithful fix; MDN/CSS-tricks call this pattern a "breakout" or
  // "full-bleed" box -- widen ONLY the diagram (`.pic`), never the
  // <figcaption> or the region list beside/below it, which stay at normal
  // reading width.
  //
  // Bounded to whichever is TIGHTER: the doc's own <main> column (so a
  // breakout can never exceed the page's real content area or cause
  // horizontal scroll), or -- when this page renders a right-hand table of
  // contents -- that TOC's own live left edge. The TOC is a SIBLING column,
  // not an ancestor, so no CSS selector reaches it; this measures the real
  // DOM box rather than assuming a fixed grid ratio, which stays correct if
  // the reader collapses the left nav (changing <main>'s own width) or the
  // theme's column split ever changes.
  //
  // Bounding to the TOC's own rect (not just "leave some margin") matters
  // for a reason beyond good manners: `.pic` is `position: sticky` with
  // `z-index: 1` (so the diagram stays above the prose scrolling beneath
  // it), and the TOC's own nav is ALSO sticky, pinned near the top of the
  // viewport for as long as the reader is anywhere in this article. Verified
  // live: widen `.pic` far enough to cross into the TOC's own x-range and,
  // once both are stuck near the top, `.pic`'s z-index wins the stacking
  // fight and the diagram paints OVER the TOC's links -- exactly what must
  // never happen. Stopping strictly short of the TOC's left edge makes that
  // structurally impossible (the two boxes never share an x-range), rather
  // than relying on z-index or scroll position to keep them apart.
  useEffect(() => {
    const figEl = figRef.current;
    if (!figEl || typeof ResizeObserver === 'undefined') return undefined;
    const BUFFER = 16; // one --ifm-spacing-horizontal, a visual breathing gap
    const PHONE_BREAKPOINT = 639; // styles.module.css's own legend-text cutoff

    const recompute = () => {
      // Below the phone breakpoint the legend text is already hidden (see
      // styles.module.css) and the figure fits its column exactly as
      // before -- no breakout needed, and the doc layout itself usually
      // collapses to one column here anyway.
      if (window.innerWidth <= PHONE_BREAKPOINT) { setBreakoutPx(0); return; }
      const mainEl = figEl.closest('main');
      if (!mainEl) { setBreakoutPx(0); return; }
      // figEl's OWN rect, not .pic's -- .pic is what we resize, so measuring
      // it back would measure our own last write and drift. figEl is never
      // touched by this effect, so it is a stable, un-fed-back reference for
      // "where the figure naturally sits before any breakout."
      const figRect = figEl.getBoundingClientRect();
      const mainRect = mainEl.getBoundingClientRect();
      const toc = document.querySelector<HTMLElement>('[class*="tableOfContents"]');
      const tocRect = toc?.getBoundingClientRect();
      const tocVisible = !!tocRect && tocRect.width > 0;
      const safeRight = Math.min(mainRect.right, tocVisible ? tocRect.left : mainRect.right) - BUFFER;
      // Final defence-in-depth: never past the viewport's own scrollable
      // width, whatever <main>/the TOC measured (belt-and-suspenders against
      // ever introducing horizontal scroll).
      const hardRight = Math.min(safeRight, document.documentElement.clientWidth - BUFFER);
      setBreakoutPx(Math.max(0, Math.round(hardRight - figRect.right)));
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(figEl);
    const mainEl = figEl.closest('main');
    if (mainEl) ro.observe(mainEl);
    window.addEventListener('resize', recompute);
    return () => { ro.disconnect(); window.removeEventListener('resize', recompute); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !boxW || !Number.isFinite(boxW)) return;
    const pitch = boxW / W;
    if (!(pitch > 1.2)) return;
    try {
      const opts = {
        layout: { mode: 'native' as const, pitch },
        applyDeviations: true,
        ...(zones.length ? { present: { focus: { zones: zones.map((z) => z.id), ...(dim !== undefined ? { dim } : {}) } } } : {}),
      };
      const result = renderPbGrid(ctx, opts);
      canvas.width = result.canvasWidth;
      canvas.height = result.canvasHeight;
      renderPbGrid(ctx, opts);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') console.warn('PbGridFigure: pbgrid substrate skipped', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxW, W, zones, dim]);

  const onKey = useCallback((e: React.KeyboardEvent) => {
    const n = zones.length; if (!n) return;
    const cur = sel < 0 ? 0 : sel;
    let next = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (cur + 1) % n;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (cur + n - 1) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else if (e.key === 'Escape') { setSel(-1); e.preventDefault(); return; }
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const now = Date.now();
      typed.current.buf = (now - typed.current.at > 800 ? '' : typed.current.buf) + e.key.toLowerCase();
      typed.current.at = now;
      const from = typed.current.buf.length > 1 ? 0 : 1;
      for (let k = from; k < n + from; k++) {
        const j = (cur + k) % n;
        if (zones[j].name.toLowerCase().startsWith(typed.current.buf)) { next = j; break; }
      }
    } else return;
    if (next >= 0) { e.preventDefault(); optRefs.current[next]?.focus(); }
  }, [zones, sel]);

  const gid = (i: number) => `pbf${i}`;

  return (
    <figure ref={figRef} className={styles.fig} data-pbgridfigure data-zone-count={zones.length}>
      <figcaption className={styles.cap}>{caption}</figcaption>
      <div aria-live="polite" className={styles.srOnly} />

      <div className={styles.pic} style={breakoutPx > 0 ? { width: `calc(100% + ${breakoutPx}px)` } : undefined}>
        <div ref={wrapRef} className={styles.wrap}>
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true"
            style={{
              left: `${(gut / W) * 100}%`,
              top: `${(top / H) * 100}%`,
              width: `${(COLS / W) * 100}%`,
              height: `${(ROWS / H) * 100}%`,
            }} />
          <svg className={styles.grid} viewBox={`0 0 ${W.toFixed(3)} ${H.toFixed(3)}`}
            style={{ maxWidth: `${Math.round(56 * W)}px` }} role="img" preserveAspectRatio="xMidYMid meet"
            aria-label={`Diagram of the Pixelboop 44 by 24 pad grid, showing ${zones.length} named ${zones.length === 1 ? 'region' : 'regions'}: ${zones.map((z) => z.name).join(', ')}. Every region is listed below with its coordinates, colour and function.`}>
            <defs>
              {zones.map((z, i) => {
                const { vTop, vBottom } = visualRowSpan(z.cells, ROWS);
                const c0 = Math.min(...z.cells.map(([c]: [number, number]) => c));
                const c1 = Math.max(...z.cells.map(([c]: [number, number]) => c));
                return (
                  <rect key={i} id={gid(i)} x={X(c0)} y={Y(vTop)} width={c1 - c0 + 1} height={vBottom - vTop + 1}
                    vectorEffect="non-scaling-stroke" />
                );
              })}
            </defs>

            {zones.map((z, i) => (
              <g key={i} className={styles.region} data-sel={i === sel || undefined}
                onClick={() => optRefs.current[i]?.focus()}>
                <use href={`#${gid(i)}`} fill="none" stroke="#000000" strokeWidth={3} className="inkA" />
                <use href={`#${gid(i)}`} fill="none" stroke="#FFFFFF" strokeWidth={1.5} className="inkB" />
              </g>
            ))}
            {sel >= 0 && (
              <g>
                <use href={`#${gid(sel)}`} fill="none" stroke="#000000" strokeWidth={7} />
                <use href={`#${gid(sel)}`} fill="none" stroke="#FFFFFF" strokeWidth={3.5} />
              </g>
            )}

            {/* filledTab / hollowTab: touches an edge, or recessed with a cap
                reaching in to the row it means. One label-collision pass. */}
            {tabMarks.map((m, idx) => {
              const tier = m.kind === 'filledTab' ? 0 : 1;
              const barY = m.top ? gridTop - (tier === 0 ? OFFSET0 : OFFSET0 + TIER_GAP)
                                  : gridBottom + (tier === 0 ? OFFSET0 : OFFSET0 + TIER_GAP);
              const labelY = m.top ? barY - LT * 0.9 : barY + LT * 0.9;
              const x0 = X(m.colStart), x1 = X(m.colEnd) + 1;
              const capEnd = m.kind === 'hollowTab'
                ? (m.top ? gridTop + m.depth : gridBottom - m.depth)
                : (m.top ? barY + CAP0 : barY - CAP0);
              const d = `M${x0} ${barY} L${x1} ${barY} M${x0} ${barY} L${x0} ${capEnd} M${x1} ${barY} L${x1} ${capEnd}`;
              const dash = m.kind === 'hollowTab' ? '4 3' : undefined;
              return (
                <g key={`t${idx}`} className={styles.legendMark}>
                  <path className={styles.halo} d={d} fill="none" strokeWidth={3} strokeDasharray={dash} vectorEffect="non-scaling-stroke" />
                  <path d={d} fill="none" strokeWidth={1.25} strokeDasharray={dash} vectorEffect="non-scaling-stroke" />
                  <text x={tabCenters[idx]} y={labelY} fontSize={LT} textAnchor="middle" dominantBaseline="central">
                    {m.label}
                    {m.kind === 'hollowTab' && (
                      <tspan className={styles.legendDetail} dx={LT * 0.4} fontSize={LT * 0.8}>{`·  ${m.detail}`}</tspan>
                    )}
                  </text>
                </g>
              );
            })}

            {/* sideBracket: a lane (H2) or a margin block (H4) -- the only
                mark that can name a ROW range, beside (never over) the grid. */}
            {sideMarks.map((m, idx) => {
              const bx = m.rightSide ? gridRight + 0.15 : gridLeft - 0.15;
              const capX = m.rightSide ? bx - CAP0 : bx + CAP0;
              const labelX = m.rightSide ? bx + LT * 0.9 : bx - LT * 0.9;
              const vTop = Y(m.rowStart), vBot = Y(m.rowEnd) + 1;
              const d = `M${bx} ${vTop} L${bx} ${vBot} M${bx} ${vTop} L${capX} ${vTop} M${bx} ${vBot} L${capX} ${vBot}`;
              const cy = (vTop + vBot) / 2;
              return (
                <g key={`s${idx}`} className={styles.legendMark}>
                  <path className={styles.halo} d={d} fill="none" strokeWidth={3} vectorEffect="non-scaling-stroke" />
                  <path d={d} fill="none" strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
                  <text x={labelX} y={cy} fontSize={LT} textAnchor="middle" dominantBaseline="central"
                    transform={`rotate(-90 ${labelX} ${cy})`}>{m.label}</text>
                </g>
              );
            })}

            {/* columnLabel: a narrow tall column, rotated in its own
                corridor, always in the top band (LegendOverlayView.swift:243). */}
            {colMarks.map((m, idx) => {
              const cx = X(m.col) + 0.5;
              const startY = colLabelRoom;
              return (
                <g key={`c${idx}`} className={styles.legendMark}>
                  <text x={cx} y={startY} fontSize={colLabelFont} textAnchor="start" dominantBaseline="central"
                    transform={`rotate(-90 ${cx} ${startY})`}>{m.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {zones.length > 0 && (
        <ul className={styles.list} role="listbox" aria-label="Regions in this figure" onKeyDown={onKey}>
          {zones.map((z, i) => {
            const first = z.cells[0];
            const resolved = z.resolve(first[0], first[1], DEFAULT_EMPTY_STATE_OPTIONS);
            const hex = resolved ? resolved.hex : '#1A1A1A';
            return (
              <li key={z.id} role="option" id={`pbf-o${i}`} aria-selected={i === sel}
                tabIndex={i === (sel < 0 ? 0 : sel) ? 0 : -1}
                aria-label={`${z.name}. ${coordinateString(z.cells)}. Color ${hex}. ${z.describe(DEFAULT_EMPTY_STATE_OPTIONS)}`}
                ref={(el) => { optRefs.current[i] = el; }}
                onFocus={() => setSel(i)} className={styles.opt}>
                <span aria-hidden="true" className={styles.num}>{i + 1}</span>
                <span aria-hidden="true" className={styles.sw} style={{ backgroundColor: hex }} />
                <span className={styles.nm}>{z.name}</span>
                <span className={styles.co}>{coordinateString(z.cells)}</span>
                <span className={styles.de}>{z.describe(DEFAULT_EMPTY_STATE_OPTIONS)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </figure>
  );
};

const PbGridFigure: React.FC<PbGridFigureProps> = (props) => (
  <ErrorBoundary fallback={({ error, tryAgain }) => (
    <div className={styles.fig}>
      <p>The Pixelboop figure could not be drawn: {error.message}</p>
      <button onClick={tryAgain}>Try again</button>
    </div>
  )}>
    <Figure {...props} />
  </ErrorBoundary>
);

export default PbGridFigure;
