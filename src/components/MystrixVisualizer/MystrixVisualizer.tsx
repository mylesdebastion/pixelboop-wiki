import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import styles from './styles.module.css';
import {
  BAR_COLS, COLS, ROWS, ROW_BANDS, coordinateString, colorName, expand, flipBoundary,
  labelInk, regionStates, stateNames, stripLeadingCoord, toVisual, type UiElement,
} from './geometry';
// eslint-disable-next-line import/no-unresolved -- vendored plain JS, see src/vendor/pbgrid/pbgrid.js header
import { COLORS, ZONES, renderPbGrid } from '../../vendor/pbgrid/pbgrid.js';

interface UIProps {
  uiName: string;
  uiDescription: string;
  uiElements: UiElement[];
  /** @deprecated no-op. Kept so the 64 existing call sites still type-check. */
  uiParentLink?: string;
}

// The substrate (checkerboard pad/gutter background) is drawn by pbgrid's
// renderPbGrid onto a <canvas>, not hand-rolled here: pbgrid is the SAME
// renderer verified pixel-identical against the real iOS app, and it already
// carries the scale-aware PAD/GUTTER contrast lift this component used to
// hardcode (src/vendor/pbgrid/pbgrid.js's DEVIATIONS, cited at the constant
// below). What THIS file still owns is the annotation layer drawn in SVG on
// top: per-figure highlighted regions, badges/leader lines, the row/column
// rulers, selection rings, and all of the accessibility surface.
const PAD_FALLBACK = COLORS.cellOffColor.hex; // '#1A1A1A', used only when an authored element omits a color
const SEAM_COL = 36;
// The figure ALWAYS draws the full 44x24 device, never a crop of it: the
// empty space is part of what a reader learns (row 2-7 is Melody, row 23 is
// Bottom Controls, etc). See gauntlet-pixelgrid-FAILURE-EVIDENCE.md.
const FULL_CROP = { c0: 0, r0: 0, c1: COLS - 1, r1: ROWS - 1 };

// (col,row) -> real pbgrid zone id, built once from pbgrid's own zone list
// (never hand-maintained -- if a zone's cells move, this moves with it).
// Used to translate a figure's authored uiElements into present.focus.zones
// so "highlight this" dims the rest of the device via pbgrid's own focus
// mechanism instead of a second, hand-rolled dimming layer.
const ZONE_AT = new Map<string, string>();
for (const z of ZONES as unknown as { id: string; cells: [number, number][] }[]) {
  for (const [c, r] of z.cells) ZONE_AT.set(`${c},${r}`, z.id);
}
const TOTAL_ZONES = (ZONES as unknown as unknown[]).length;

const Figure: React.FC<UIProps> = ({ uiName, uiDescription, uiElements, uiParentLink }) => {
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '');
  const states = useMemo(() => stateNames(uiElements), [uiElements]);
  const [state, setState] = useState<string | undefined>(states[0]);
  const [sel, setSel] = useState(-1);
  const [announce, setAnnounce] = useState('');
  const optRefs = useRef<(HTMLLIElement | null)[]>([]);
  const stateRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const typed = useRef({ buf: '', at: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boxW, setBoxW] = useState(700); // measured on mount; 700 is only the SSR/first-paint guess

  if (process.env.NODE_ENV !== 'production' && uiParentLink) {
    console.warn(`MystrixVisualizer: uiParentLink is a deprecated no-op (${uiName}).`);
  }

  const { cells, rects, dropped } = useMemo(
    () => expand(uiElements, states.length ? state : undefined), [uiElements, states, state]);
  const fb = useMemo(() => flipBoundary(FULL_CROP, cells), [cells]);

  // Which real pbgrid zones this figure's own authored cells land on. Passed
  // to renderPbGrid as present.focus so the SUBSTRATE dims everything this
  // figure isn't about -- never a second dimming layer of our own. A figure
  // that already touches most of the device (the whole-grid overviews) has
  // nothing meaningful left to dim against, so it renders undimmed instead.
  const focusZones = useMemo(() => {
    const ids = new Set<string>();
    for (const c of cells) { const id = ZONE_AT.get(`${c.col},${c.dataRow}`); if (id) ids.add(id); }
    return [...ids];
  }, [cells]);
  const useFocus = focusZones.length > 0 && focusZones.length < TOTAL_ZONES * 0.7;

  // Named regions are the semantic unit; unnamed ones are backdrop only.
  const named = uiElements.map((r, i) => ({ r, i })).filter((x) => x.r && x.r.name);
  const badgeOf = new Map(named.map((x, n) => [x.i, n + 1]));
  const fillOf = new Map<number, string>();
  for (const rc of rects) if (rc.color && !fillOf.has(rc.region)) fillOf.set(rc.region, rc.color);
  const area = new Map<number, number>();
  for (const c of cells) area.set(c.region, (area.get(c.region) || 0) + 1);
  // Largest first, so the smallest region wins the pointer hit test.
  const order = [...new Set(rects.map((rc) => rc.region))].sort((a, b) => (area.get(b) || 0) - (area.get(a) || 0));

  // ---- layout, in cell units (1 unit = 1 grid column/row, always; the whole
  // 44x24 device is shown on every figure, so this is the same shape every
  // time bar the small variations below). Text is a fraction of the total
  // figure width, same technique the component always used.
  const C = COLS;
  const logical = (r: number) => toVisual(0, r);

  // Row-band runs down the left gutter: the device's fixed structure, shown
  // on every figure regardless of what it highlights.
  const runs: { name: string; from: number; to: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    const nm = ROW_BANDS[logical(r)];
    const last = runs[runs.length - 1];
    if (last && last.name === nm) last.to = r;
    else runs.push({ name: nm, from: r, to: r });
  }
  const runLabel = (r: { from: number; to: number }) =>
    logical(r.from) === logical(r.to) ? `${logical(r.from)}` : `${logical(r.from)}-${logical(r.to)}`;
  const gutChars = Math.max(...runs.map((r) => r.name.length + runLabel(r).length)) + 2;

  // Fixed point for gut/F: with C fixed at 44 and the band runs always the
  // same 8, this converges to the same value on every figure.
  let gut = 6, F = 0, Fr = 0;
  for (let p = 0; p < 3; p++) {
    F = 0.03 * (gut + C + 0.6);
    Fr = Math.min(F, 0.85);
    gut = 0.65 + gutChars * 0.52 * Fr;
  }
  const right = fb.seam ? Math.max(0.5, F * 2.2) : 0.5;
  const W = gut + C + right;
  const showLabel = named.length > 0 && named.length <= 6;
  const badgeR = Math.min(F * 0.82, 0.55);
  const showBadge = F * 0.82 <= 0.55; // a bigger badge would swamp its own cells
  const showCallout = !showBadge && !showLabel;

  // Label row: one slot per named region, centred over its leader line.
  const x0 = 0.2;
  const slot = (W - 0.2 - x0) / Math.max(1, named.length);
  // 0.55 em per character is a safe upper bound on this face (measured mean is
  // 0.53), and 0.92 of the slot keeps a gap between neighbours. No name is ever
  // cut short: if any one of them will not fit, the whole row falls back to bare
  // numbers and the region list underneath does the naming. A half-word with an
  // ellipsis on it teaches nobody which pads are the bass.
  const nameFits = showLabel && named.every((x, n) =>
    `${n + 1}. ${x.r.name || ''}`.length * F * 0.55 <= slot * 0.92);
  // A figure with many named regions (the 44-region row overviews, the
  // 54-region whole-grid demo) packs one slot per region into the same total
  // width regardless of count, so the bare callout number must shrink to fit
  // its own slot -- otherwise "1 2 3 ... 54" collide into an unreadable run,
  // the same defect the digit-smear bug was. Below ~25 regions this is a
  // no-op (slot is wide enough that Math.min just returns F).
  const calloutDigits = named.length >= 10 ? 2 : 1;
  const calloutFontSize = showCallout
    ? Math.min(F, (slot * 0.92) / (calloutDigits * 0.6))
    : F;
  // Past a point, shrinking stops being a fix: below half the figure's own
  // text size a numeral is not legible no matter how cleanly it is spaced,
  // and the leader line drawn down to it adds a line crossing the whole grid
  // for no legible payoff. The region list below is already numbered 1..N,
  // and clicking or focusing any region there rings it in the grid -- that
  // stays the correlation mechanism for these very dense figures, rather
  // than a numeral ruler tuned past the point it can work.
  const showCalloutLeaders = showCallout && calloutFontSize >= F * 0.5;
  const top = nameFits ? F * 2.9 : showLabel || showCalloutLeaders ? F * 2.0 : F * 0.4;
  const ruler = F * 2.1;

  const rowY = new Map<number, number>();
  for (let r = 0; r < ROWS; r++) rowY.set(r, top + r);
  const H = top + ROWS + ruler;
  const X = (col: number) => gut + col;

  const Fc = Math.min(F, 3.4); // column ruler must fit its own step
  const cols: number[] = [];
  for (let c = 0; c < COLS; c++) {
    const end = c === 0 || c === COLS - 1;
    if (c % 4 === 0 || (end && Math.min(c % 4, 4 - (c % 4)) > 1)) cols.push(c);
  }

  const gid = (i: number) => `${uid}r${i}`;
  const coordOf = (r: UiElement) => {
    const f = fillOf.get(uiElements.indexOf(r));
    return coordinateString(r) + (f ? `, ${colorName(f)} ${f.toUpperCase()}` : '');
  };

  // ---- pbgrid substrate: draw the real device grid onto a canvas.
  // LAYOUT (position/size of the canvas within .wrap) is plain CSS
  // percentages of gut/top/C/ROWS against W/H, set as inline style below --
  // never JS-measured pixels. A previous version positioned the canvas with
  // JS-computed px values keyed off a measured wrapper width that silently
  // fell back to a hardcoded 700 whenever the real measurement read back as
  // 0 -- which is exactly what happened when .wrap collapsed to width:0 (see
  // styles.module.css's .wrap comment): the canvas kept "working" off the
  // fake 700 while the SVG on top of it, with no such fallback, rendered at
  // 0x0. CSS percentages can't silently substitute a fake number like that;
  // if .wrap is ever 0 wide again, the canvas goes to 0 right alongside the
  // SVG instead of masking it. The ONLY thing still measured in JS is the
  // wrapper's real on-screen width, and only to choose the canvas's RASTER
  // resolution (pitch) for sharpness -- it has no effect on layout.
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (el) {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setBoxW(w);
    }
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w > 0) setBoxW(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !boxW || !Number.isFinite(boxW)) return;
    const pitch = boxW / W; // 1 viewBox unit === 1 grid column === 1 pbgrid pitch
    if (!(pitch > 1.2)) return; // too narrow to draw a real gap between pads; leave blank rather than throw
    try {
      // present.focus dims every zone this figure isn't drawing attention to,
      // via pbgrid's own mechanism (never a hand-rolled dim layer): it darkens,
      // it never removes a row. Skipped for figures with no zone match or that
      // already cover most of the device (see focusZones/useFocus above).
      const opts = {
        layout: { mode: 'native' as const, pitch },
        applyDeviations: true,
        ...(useFocus ? { present: { focus: { zones: focusZones } } } : {}),
      };
      const result = renderPbGrid(ctx, opts);
      canvas.width = result.canvasWidth;
      canvas.height = result.canvasHeight; // the assignment above clears the context
      renderPbGrid(ctx, opts);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') console.warn(`MystrixVisualizer: pbgrid substrate skipped (${uiName})`, err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxW, W, useFocus, focusZones]);

  const onKey = useCallback((e: React.KeyboardEvent) => {
    const n = named.length; if (!n) return;
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
        if ((named[j].r.name || '').toLowerCase().startsWith(typed.current.buf)) { next = j; break; }
      }
    } else return;
    if (next >= 0) { e.preventDefault(); optRefs.current[next]?.focus(); }
  }, [named, sel]);

  // Arrow keys move BOTH the checked state and focus, matching the listbox's
  // own onKey below (this used to move only the checked state, leaving focus
  // behind on the old radio -- a real keyboard-nav regression).
  const onStatesKey = useCallback((e: React.KeyboardEvent) => {
    const n = states.length; if (!n) return;
    const cur = Math.max(0, states.indexOf(state!));
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (cur + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (cur + n - 1) % n;
    else return;
    e.preventDefault();
    setState(states[next]);
    stateRefs.current[next]?.focus();
  }, [states, state]);

  const badgeAt = (i: number) => {
    const rc = rects.filter((x) => x.region === i);
    if (!rc.length) return null;
    const first = rc.reduce((a, b) => (b.y < a.y || (b.y === a.y && b.x < a.x) ? b : a));
    return rowY.has(first.y) ? { x: X(first.x) + first.w / 2, y: rowY.get(first.y)! + 0.5 } : null;
  };

  const caption = [
    uiDescription && !/[.!?]$/.test(uiDescription.trim()) ? uiDescription.trim() + '.' : uiDescription,
    'Showing the full 44 by 24 grid.',
    fb.seam ? 'Row 0 is drawn along the bottom edge of the screen; columns 36 to 43 stay at the top.' : '',
  ].filter(Boolean).join(' ');

  return (
    <figure className={styles.fig} data-pbfig data-region-count={named.length}
      data-focus-zones={useFocus ? focusZones.length : 0}>
      <figcaption className={styles.cap}><b>{uiName}.</b> {caption}</figcaption>
      <div aria-live="polite" className={styles.srOnly}>{announce}</div>

      {states.length > 0 && (
        <div role="radiogroup" aria-label={`States shown in ${uiName}`} className={styles.states}
          onKeyDown={onStatesKey}>
          {states.map((s, si) => (
            <span key={s} role="radio" aria-checked={s === state} tabIndex={s === state ? 0 : -1}
              ref={(el) => { stateRefs.current[si] = el; }}
              className={styles.state} onClick={() => setState(s)}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setState(s); } }}>{s}</span>
          ))}
        </div>
      )}

      <div className={styles.pic}>
        <div ref={wrapRef} className={styles.wrap}>
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true"
            style={{
              left: `${(gut / W) * 100}%`,
              top: `${(top / H) * 100}%`,
              width: `${(C / W) * 100}%`,
              height: `${(ROWS / H) * 100}%`,
            }} />
          <svg className={styles.grid} data-pbgrid data-crop={`${FULL_CROP.c0},${FULL_CROP.r0},${FULL_CROP.c1},${FULL_CROP.r1}`}
            viewBox={`0 0 ${W.toFixed(3)} ${H.toFixed(3)}`} style={{ maxWidth: `${Math.round(56 * W)}px` }}
            role="img" preserveAspectRatio="xMidYMid meet"
            aria-label={`Diagram of ${uiName} on the Pixelboop 44 by 24 pad grid. ${named.length} named ${named.length === 1 ? 'region' : 'regions'}${named.length ? ': ' + named.map((x) => x.r.name).join(', ') : ''}. Every region is listed below with its coordinates, colour and function.`}>
            <defs>
              {order.map((i) => (
                <g key={i} id={gid(i)}>
                  {rects.filter((rc) => rc.region === i && rowY.has(rc.y)).map((rc, k) => (
                    // vector-effect does not inherit through <use>, so it lives here,
                    // where it keeps the ring widths in device px at any crop scale.
                    <rect key={k} x={X(rc.x)} y={rowY.get(rc.y)} width={rc.w} height={rc.h}
                      fill={rc.color || PAD_FALLBACK} vectorEffect="non-scaling-stroke" />
                  ))}
                </g>
              ))}
            </defs>

            {order.map((i) => (
              <g key={i} className={styles.region} data-sel={i === (named[sel]?.i ?? -2) || undefined}
                onClick={() => { const n = named.findIndex((x) => x.i === i); if (n >= 0) optRefs.current[n]?.focus(); }}>
                <use href={`#${gid(i)}`} fill="none" stroke="#000000" strokeWidth={3} className={styles.inkA} />
                <use href={`#${gid(i)}`} fill="none" stroke="#FFFFFF" strokeWidth={1.5} className={styles.inkB} />
                <use href={`#${gid(i)}`} />
              </g>
            ))}
            {sel >= 0 && (
              <g className={styles.selRing}>
                <use href={`#${gid(named[sel].i)}`} fill="none" stroke="#000000" strokeWidth={7} />
                <use href={`#${gid(named[sel].i)}`} fill="none" stroke="#FFFFFF" strokeWidth={3.5} />
              </g>
            )}

            {/* G2 seam: cols 0-35 and 36-43 carry different logical numbers here */}
            {fb.seam && (
              <line className={styles.rule} x1={X(SEAM_COL)} y1={top - F * 0.2} x2={X(SEAM_COL)} y2={H - ruler + F * 0.2}
                strokeWidth={2} vectorEffect="non-scaling-stroke" strokeDasharray="4 3" />
            )}

            {/* numbered badges, where a badge fits inside its own region */}
            {showBadge && named.map((x) => { const p = badgeAt(x.i); if (!p) return null;
              const f = fillOf.get(x.i) || PAD_FALLBACK; const ink = labelInk(f);
              return (
                <g key={x.i} className={styles.badge}>
                  <circle cx={p.x} cy={p.y} r={badgeR} fill={f} stroke={ink} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
                  <text x={p.x} y={p.y} fontSize={badgeR * 1.15} fill={ink} data-on-fill data-fill={f}
                    textAnchor="middle" dominantBaseline="central">{badgeOf.get(x.i)}</text>
                </g>
              ); })}

            {/* direct labels with leader lines, on the figures whose names fit;
                numbered callouts elsewhere, the anatomical-diagram fallback */}
            {(showLabel || showCalloutLeaders) && named.map((x, n) => { const p = badgeAt(x.i); if (!p) return null;
              const lx = x0 + slot * (n + 0.5);
              const numFontSize = showCalloutLeaders ? calloutFontSize : F;
              return (
                <g key={x.i} className={styles.leader}>
                  <path className={styles.halo} d={`M${lx} ${top - F * 0.55} L${lx} ${p.y - 0.55} L${p.x} ${p.y - 0.5}`}
                    fill="none" strokeWidth={3.5} vectorEffect="non-scaling-stroke" />
                  <path d={`M${lx} ${top - F * 0.55} L${lx} ${p.y - 0.55} L${p.x} ${p.y - 0.5}`} fill="none"
                    strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
                  <text x={lx} y={top - numFontSize} fontSize={numFontSize} textAnchor="middle">
                    {n + 1}
                    {nameFits && <tspan className={styles.leadName}>{`. ${x.r.name}`}</tspan>}
                  </text>
                </g>
              ); })}

            {/* row ruler: band name per run, plus row numbers when there is room */}
            <g className={styles.ruler}>
              {runs.map((r, k) => (
                <text key={`b${k}`} x={gut - 0.35} y={(rowY.get(r.from)! + rowY.get(r.to)! + 1) / 2} fontSize={Fr}
                  textAnchor="end" dominantBaseline="central">
                  <tspan opacity={0.7}>{runLabel(r)}</tspan><tspan dx={Fr * 0.5}>{r.name}</tspan>
                </text>
              ))}
              {fb.seam && fb.rows.filter((r) => rowY.has(r)).map((r) => (
                <text key={`s${r}`} x={W - right + 0.25} y={rowY.get(r)! + 0.5} fontSize={Fr}
                  textAnchor="start" dominantBaseline="central">{toVisual(SEAM_COL, r)}</text>
              ))}

              {/* column ruler in logical numbers, heavier at bar boundaries */}
              {cols.map((c) => (
                <text key={`c${c}`} x={X(c) + 0.5} y={H - ruler + F * 1.15} fontSize={Fc}
                  opacity={BAR_COLS.includes(c) ? 1 : 0.7} fontWeight={BAR_COLS.includes(c) ? 700 : 400}
                  textAnchor="middle" dominantBaseline="central">{c}</text>
              ))}
              {BAR_COLS.map((c) => (
                <line key={`t${c}`} className={styles.rule} x1={X(c)} y1={top} x2={X(c)} y2={H - ruler}
                  strokeWidth={1} vectorEffect="non-scaling-stroke" opacity={0.5} />
              ))}
            </g>

            {dropped.length > 0 && (
              <g className={styles.dropped}>
                <rect x={W - right - F * 2.6} y={F * 0.2} width={F * 2.4} height={F * 1.3} fill="#FF00FF" fillOpacity={0.5} />
                <text x={W - right - F * 1.4} y={F * 0.85} fontSize={F * 0.9} fill="#FF00FF" textAnchor="middle"
                  dominantBaseline="central">{dropped.length} dropped</text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {named.length > 0 && (
        <ul className={styles.list} role="listbox" aria-label={`Regions in ${uiName}`} onKeyDown={onKey}>
          {named.map((x, n) => {
            const f = fillOf.get(x.i);
            return (
              <li key={x.i} role="option" id={`${uid}o${n}`} aria-selected={n === sel}
                tabIndex={n === (sel < 0 ? 0 : sel) ? 0 : -1}
                aria-labelledby={`${uid}n${n} ${uid}c${n}`}
                aria-describedby={x.r.desc ? `${uid}d${n}` : undefined}
                ref={(el) => { optRefs.current[n] = el; }}
                onFocus={() => {
                  setSel(n);
                  const st = regionStates(x.r);
                  if (st.length && state !== undefined && !st.includes(state)) {
                    setState(st[0]);
                    setAnnounce(`Switched to the ${st[0]} state to show ${x.r.name}.`);
                  }
                }} className={styles.opt}>
                <span aria-hidden="true" className={styles.num}>{n + 1}</span>
                <span aria-hidden="true" className={styles.sw} style={{ backgroundColor: f || PAD_FALLBACK }} />
                <span id={`${uid}n${n}`} className={styles.nm}>{x.r.name}</span>
                <span id={`${uid}c${n}`} className={styles.co}>{coordOf(x.r)}</span>
                {x.r.desc && <span id={`${uid}d${n}`} className={styles.de}>{stripLeadingCoord(x.r.desc)}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </figure>
  );
};

const MystrixVisualizer: React.FC<UIProps> = (props) => (
  <ErrorBoundary fallback={({ error, tryAgain }) => (
    <div className={styles.fig}>
      <p>The Pixelboop figure could not be drawn: {error.message}</p>
      <button onClick={tryAgain}>Try again</button>
    </div>
  )}>
    <Figure {...props} />
  </ErrorBoundary>
);

export default MystrixVisualizer;
