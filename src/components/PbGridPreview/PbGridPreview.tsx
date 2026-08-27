// PbGridPreview.tsx — proof-of-concept wrapper around @pixelboop/pbgrid's
// renderPbGrid, the SAME renderer verified pixel-identical against real iOS
// screenshots in the pixelboop repo (see packages/pbgrid/CLAUDE task notes
// there). MystrixVisualizer (../MystrixVisualizer) stays the renderer for
// all 64 existing doc figures — this is an ADDITIVE, side-by-side component
// proving the real renderer works inside Docusaurus's webpack build. It is
// not wired into any existing figure and does not replace anything.
//
// Vendoring: pixelboop-wiki is a SEPARATE git repo from pixelboop, and
// Vercel builds it from a fresh git clone that does not have the pixelboop
// monorepo checked out alongside it — an npm `file:` dependency pointing at
// ../pixelboop/packages/pbgrid would resolve locally and fail in that
// remote build. So ../../vendor/pbgrid/pbgrid.js is a checked-in, BYTE-
// IDENTICAL copy of packages/pbgrid/dist/pbgrid.js (compiled, dependency-
// free ES2020 — no bundler-specific syntax, so webpack processes it as
// plain JS with no transform needed). It carries NO automated drift check
// yet (that is cross-repo and is exactly the kind of thing a full
// migration — see the "migration cost" note in the PR/task report — would
// need to build, e.g. a CI job here that diffs against a published
// @pixelboop/pbgrid release). Refresh by hand:
//   cp packages/pbgrid/dist/pbgrid.js pixelboop-wiki/src/vendor/pbgrid/pbgrid.js
//
// Only the 'empty' state is rendered here (SUPPORTED_STATES in pbgrid's
// render.ts) — the state pbgrid actually supports today, with zero
// invented note/pattern data.
import React, { useEffect, useRef } from 'react';
// eslint-disable-next-line import/no-unresolved -- vendored plain JS, see note above
import { renderPbGrid, mountA11y } from '../../vendor/pbgrid/pbgrid.js';

export const PbGridPreview: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const list = listRef.current;
    if (!canvas || !list) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const boundsWidth = Math.max(320, canvas.clientWidth || 700);
    const boundsHeight = Math.round(boundsWidth * (24 / 44)); // GRID_LAYOUT.rows / .columns
    const options = { layout: { mode: 'fit' as const, boundsWidth, boundsHeight } };

    const result = renderPbGrid(ctx, options);
    canvas.width = result.canvasWidth;
    canvas.height = result.canvasHeight;
    renderPbGrid(ctx, options); // canvas dimension assignment above clears the context; draw again

    const handle = mountA11y(canvas, list, { rootNote: 0 }, 'empty');
    return () => handle.destroy();
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100%', display: 'block', imageRendering: 'pixelated' }} />
      <div ref={listRef} />
    </div>
  );
};

export default PbGridPreview;
