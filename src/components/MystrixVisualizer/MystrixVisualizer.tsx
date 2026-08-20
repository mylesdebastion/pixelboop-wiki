import React, { useCallback, useId, useMemo, useRef, useState } from 'react';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import styles from './styles.module.css';
import {
  BAR_COLS, COLS, ROWS, ROW_BANDS, coordinateString, colorName, crop, elide,
  expand, flipBoundary, labelInk, regionStates, stateNames, stripLeadingCoord,
  toVisual, type UiElement,
} from './geometry';

interface UIProps {
  uiName: string;
  uiDescription: string;
  uiElements: UiElement[];
  /** @deprecated no-op. Kept so the 64 existing call sites still type-check. */
  uiParentLink?: string;
}

const PAD = '#323232'; // rgb(50,50,50), the unlit pad (styles.module.css:495 before this rewrite)
const GUTTER = '#808080'; // lifted from rgb(20,20,20): 3.25:1 against the unlit pad
const SEAM_COL = 36;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** "rows 0 and 3 to 22" from a sorted list of logical row numbers. */
function rowSentence(rows: number[]): string {
  const parts: string[] = [];
  for (let i = 0; i < rows.length;) {
    let j = i; while (j + 1 < rows.length && rows[j + 1] === rows[j] + 1) j++;
    parts.push(i === j ? `${rows[i]}` : `${rows[i]} to ${rows[j]}`);
    i = j + 1;
  }
  const word = rows.length === 1 ? 'row' : 'rows';
  return `${word} ${parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0]}`;
}

const Figure: React.FC<UIProps> = ({ uiName, uiDescription, uiElements, uiParentLink }) => {
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '');
  const states = useMemo(() => stateNames(uiElements), [uiElements]);
  const [state, setState] = useState<string | undefined>(states[0]);
  const [sel, setSel] = useState(-1);
  const optRefs = useRef<(HTMLLIElement | null)[]>([]);
  const typed = useRef({ buf: '', at: 0 });

  if (process.env.NODE_ENV !== 'production' && uiParentLink) {
    console.warn(`MystrixVisualizer: uiParentLink is a deprecated no-op (${uiName}).`);
  }

  const { cells, rects, dropped } = useMemo(
    () => expand(uiElements, states.length ? state : undefined), [uiElements, states, state]);
  const cr = useMemo(() => crop(cells), [cells]);
  const breaks = useMemo(() => elide(cr, cells), [cr, cells]);
  const fb = useMemo(() => flipBoundary(cr, cells), [cr, cells]);

  // Named regions are the semantic unit; unnamed ones are backdrop only.
  const named = uiElements.map((r, i) => ({ r, i })).filter((x) => x.r && x.r.name);
  const badgeOf = new Map(named.map((x, n) => [x.i, n + 1]));
  const fillOf = new Map<number, string>();
  for (const rc of rects) if (rc.color && !fillOf.has(rc.region)) fillOf.set(rc.region, rc.color);
  const area = new Map<number, number>();
  for (const c of cells) area.set(c.region, (area.get(c.region) || 0) + 1);
  // Largest first, so the smallest region wins the pointer hit test.
  const order = [...new Set(rects.map((rc) => rc.region))].sort((a, b) => (area.get(b) || 0) - (area.get(a) || 0));

  // ---- layout, in cell units. Type is a fraction of the TOTAL width, so a
  // 3-column crop and a 44-column crop render text at the same on-screen size;
  // in-picture rulers are then capped at 0.85 of a row so they cannot collide.
  const C = cr.c1 - cr.c0 + 1;
  const side = cr.c0 >= SEAM_COL ? SEAM_COL : 0;
  const logical = (r: number, s = side) => toVisual(s, r);

  const shown: number[] = [];
  for (let r = cr.r0; r <= cr.r1; r++) if (!breaks.some((b) => r >= b.from && r <= b.to)) shown.push(r);

  // Row-band runs: one name per contiguous run, like Ableton's track names.
  const runs: { name: string; from: number; to: number }[] = [];
  for (const r of shown) {
    const nm = ROW_BANDS[logical(r)];
    const last = runs[runs.length - 1];
    if (last && last.name === nm && last.to === r - 1) last.to = r;
    else runs.push({ name: nm, from: r, to: r });
  }
  const runLabel = (r: { from: number; to: number }) =>
    logical(r.from) === logical(r.to) ? `${logical(r.from)}` : `${logical(r.from)}-${logical(r.to)}`;
  const gutChars = Math.max(...runs.map((r) => r.name.length + runLabel(r).length)) + 2;

  // The gutter must hold the longest band name at the chosen size; two passes
  // are enough, because capping at 0.85 makes the second one a fixed point.
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
  const full = cr.c0 === 0 && cr.r0 === 0 && cr.c1 === COLS - 1 && cr.r1 === ROWS - 1;
  const insetH = full ? 0 : Math.min(F * 2.4, gut * 0.5);
  const insetW = insetH * COLS / ROWS;
  const top = Math.max(showLabel ? F * 2.9 : showCallout ? F * 2.0 : F * 0.4,
    insetH ? insetH + F * 0.35 : 0);
  const ruler = F * 2.1;

  const rowY = new Map<number, number>();
  const bands: { y: number; h: number }[] = [];
  const gaps: number[] = [];
  let y = top, band: { y: number; h: number } | null = null;
  for (let r = cr.r0; r <= cr.r1; r++) {
    if (!shown.includes(r)) { if (band) { band = null; gaps.push(y); y += 1; } continue; }
    if (!band) { band = { y, h: 0 }; bands.push(band); }
    rowY.set(r, y); band.h += 1; y += 1;
  }
  const H = y + ruler;
  const X = (col: number) => gut + (col - cr.c0);

  const Fc = Math.min(F, C <= 16 ? 0.9 : 3.4); // column ruler must fit its own step
  const cols: number[] = [];
  for (let c = cr.c0; c <= cr.c1; c++) {
    const end = c === cr.c0 || c === cr.c1;
    if (C <= 16 || c % 4 === 0 || (end && Math.min(c % 4, 4 - (c % 4)) > 1)) cols.push(c);
  }

  const gid = (i: number) => `${uid}r${i}`;
  const coordOf = (r: UiElement) => {
    const f = fillOf.get(uiElements.indexOf(r));
    return coordinateString(r) + (f ? `, ${colorName(f)} ${f.toUpperCase()}` : '');
  };

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

  const badgeAt = (i: number) => {
    const rc = rects.filter((x) => x.region === i);
    if (!rc.length) return null;
    const first = rc.reduce((a, b) => (b.y < a.y || (b.y === a.y && b.x < a.x) ? b : a));
    return rowY.has(first.y) ? { x: X(first.x) + first.w / 2, y: rowY.get(first.y)! + 0.5 } : null;
  };

  const caption = [
    uiDescription && !/[.!?]$/.test(uiDescription.trim()) ? uiDescription.trim() + '.' : uiDescription,
    `Showing ${C === COLS ? 'all 44 columns' : `columns ${cr.c0} to ${cr.c1}`}, ${rowSentence([...new Set(shown.map((r) => logical(r)))].sort((a, b) => a - b))} of the 44 by 24 grid.`,
    fb.seam ? 'Row 0 is drawn along the bottom edge of the screen; columns 36 to 43 stay at the top.' : '',
    breaks.length ? 'Empty rows are cut out; the row numbers on the left stay true.' : '',
  ].filter(Boolean).join(' ');

  return (
    <figure className={styles.fig} data-pbfig data-region-count={named.length}>
      <figcaption className={styles.cap}><b>{uiName}.</b> {caption}</figcaption>

      {states.length > 0 && (
        <div role="radiogroup" aria-label={`States shown in ${uiName}`} className={styles.states}
          onKeyDown={(e) => {
            const n = states.length, cur = Math.max(0, states.indexOf(state!));
            if (['ArrowRight', 'ArrowDown'].includes(e.key)) { e.preventDefault(); setState(states[(cur + 1) % n]); }
            else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); setState(states[(cur + n - 1) % n]); }
          }}>
          {states.map((s) => (
            <span key={s} role="radio" aria-checked={s === state} tabIndex={s === state ? 0 : -1}
              className={styles.state} onClick={() => setState(s)}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setState(s); } }}>{s}</span>
          ))}
        </div>
      )}

      <div className={styles.pic}>
        <svg className={styles.grid} data-pbgrid data-crop={`${cr.c0},${cr.r0},${cr.c1},${cr.r1}`}
          viewBox={`0 0 ${W.toFixed(3)} ${H.toFixed(3)}`} style={{ maxWidth: `${Math.round(56 * W)}px` }}
          role="img" preserveAspectRatio="xMidYMid meet"
          aria-label={`Diagram of ${uiName} on the Pixelboop 44 by 24 pad grid. ${named.length} named ${named.length === 1 ? 'region' : 'regions'}${named.length ? ': ' + named.map((x) => x.r.name).join(', ') : ''}. Every region is listed below with its coordinates, colour and function.`}>
          <defs>
            <pattern id={`${uid}p`} width="1" height="1" patternUnits="userSpaceOnUse" x={gut} y={top}>
              <rect width="1" height="1" fill={GUTTER} />
              <rect x="0.09" y="0.09" width="0.82" height="0.82" fill={PAD} />
            </pattern>
            {order.map((i) => (
              <g key={i} id={gid(i)}>
                {rects.filter((rc) => rc.region === i && rowY.has(rc.y)).map((rc, k) => (
                  // vector-effect does not inherit through <use>, so it lives here,
                  // where it keeps the ring widths in device px at any crop scale.
                  <rect key={k} x={X(rc.x)} y={rowY.get(rc.y)} width={rc.w} height={rc.h}
                    fill={rc.color || PAD} vectorEffect="non-scaling-stroke" />
                ))}
              </g>
            ))}
          </defs>

          {bands.map((b, k) => (
            <rect key={k} x={gut} y={b.y} width={C} height={b.h} fill={`url(#${uid}p)`} />
          ))}
          {gaps.map((gy, k) => (
            <path key={k} className={styles.rule} fill="none" strokeWidth={1.5} vectorEffect="non-scaling-stroke"
              d={`M${gut} ${gy + 0.5}` + Array.from({ length: Math.ceil(C / 2) },
                (_, j) => `l1 ${j % 2 ? 0.3 : -0.3} l1 ${j % 2 ? -0.3 : 0.3}`).join(' ')} />
          ))}

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
          {fb.seam && cr.c0 <= 35 && cr.c1 >= SEAM_COL && (
            <line className={styles.rule} x1={X(SEAM_COL)} y1={top - F * 0.2} x2={X(SEAM_COL)} y2={H - ruler + F * 0.2}
              strokeWidth={2} vectorEffect="non-scaling-stroke" strokeDasharray="4 3" />
          )}

          {/* numbered badges, where a badge fits inside its own region */}
          {showBadge && named.map((x) => { const p = badgeAt(x.i); if (!p) return null;
            const f = fillOf.get(x.i) || PAD; const ink = labelInk(f);
            return (
              <g key={x.i} className={styles.badge}>
                <circle cx={p.x} cy={p.y} r={badgeR} fill={f} stroke={ink} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
                <text x={p.x} y={p.y} fontSize={badgeR * 1.15} fill={ink} data-on-fill data-fill={f}
                  textAnchor="middle" dominantBaseline="central">{badgeOf.get(x.i)}</text>
              </g>
            ); })}

          {/* direct labels with leader lines, on the 59 figures with <= 6 regions;
              numbered callouts on the dense ones, the anatomical-diagram fallback */}
          {(showLabel || showCallout) && named.map((x, n) => { const p = badgeAt(x.i); if (!p) return null;
            const x0 = insetH ? insetW + 0.6 : 0.2;
            const slot = (W - 0.2 - x0) / named.length, lx = x0 + slot * (n + 0.5);
            const max = Math.max(3, Math.floor(slot / (F * 0.55)) - 3);
            const nm = (x.r.name || '').length > max ? (x.r.name || '').slice(0, max) + '…' : x.r.name;
            return (
              <g key={x.i} className={styles.leader}>
                <path className={styles.halo} d={`M${lx} ${top - F * 0.55} L${lx} ${p.y - 0.55} L${p.x} ${p.y - 0.5}`}
                  fill="none" strokeWidth={3.5} vectorEffect="non-scaling-stroke" />
                <path d={`M${lx} ${top - F * 0.55} L${lx} ${p.y - 0.55} L${p.x} ${p.y - 0.5}`} fill="none"
                  strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
                <text x={lx} y={top - F} fontSize={F} textAnchor="middle">
                  {showLabel ? `${n + 1}. ${nm}` : n + 1}
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
            {BAR_COLS.filter((c) => c >= cr.c0 && c <= cr.c1).map((c) => (
              <line key={`t${c}`} className={styles.rule} x1={X(c)} y1={top} x2={X(c)} y2={H - ruler}
                strokeWidth={1} vectorEffect="non-scaling-stroke" opacity={0.5} />
            ))}
          </g>

          {/* locator inset: this crop's place on the whole instrument */}
          {insetH > 0 && (
            <g className={styles.inset}>
              <rect x={0.2} y={F * 0.2} width={insetW} height={insetH} fill="currentColor" fillOpacity={0.09}
                strokeWidth={1} vectorEffect="non-scaling-stroke" opacity={0.6} />
              <rect x={0.2 + insetW * cr.c0 / COLS} y={F * 0.2 + insetH * cr.r0 / ROWS}
                width={insetW * C / COLS} height={insetH * (cr.r1 - cr.r0 + 1) / ROWS}
                fill="currentColor" fillOpacity={0.5} stroke="none" />
            </g>
          )}

          {dropped.length > 0 && (
            <g className={styles.dropped}>
              <rect x={W - right - F * 2.6} y={F * 0.2} width={F * 2.4} height={F * 1.3} fill="#FF00FF" fillOpacity={0.5} />
              <text x={W - right - F * 1.4} y={F * 0.85} fontSize={F * 0.9} fill="#FF00FF" textAnchor="middle"
                dominantBaseline="central">{dropped.length} dropped</text>
            </g>
          )}
        </svg>
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
                  if (st.length && state !== undefined && !st.includes(state)) setState(st[0]);
                }} className={styles.opt}>
                <span aria-hidden="true" className={styles.num}>{n + 1}</span>
                <span aria-hidden="true" className={styles.sw} style={{ backgroundColor: f || PAD }} />
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
