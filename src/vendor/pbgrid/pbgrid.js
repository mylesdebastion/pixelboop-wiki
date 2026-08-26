// GENERATED FILE — do not edit directly. Built by packages/pbgrid/build.mjs.
// Provenance: pixelboop@d682f8730141c53f958cb5a87731a5be0dfcb474+dirty (source-hash sha256:679a075148b3286b6f0c89106cebf886e52ee7dddb02f01ba708c7b54db16f32)
// Every vendored copy (pixelboop-wiki, pixelboop-web, web/generator/lib) must
// byte-match this header+body exactly — see packages/pbgrid/tools/check-vendored.mjs.
// src/generated/grid-constants.ts
var GRID_LAYOUT = {
  columns: 44,
  rows: 24,
  tracks: {
    melody: {
      startRow: 2,
      endRow: 7,
      height: 6
    },
    chords: {
      startRow: 8,
      endRow: 13,
      height: 6
    },
    bass: {
      startRow: 14,
      endRow: 17,
      height: 4
    },
    rhythm: {
      startRow: 18,
      endRow: 21,
      height: 4
    }
  },
  chordHarmonicDegrees: [
    0,
    7,
    2,
    9,
    4,
    11
  ],
  controlBarRow: 23,
  overviewRow1: 22,
  overviewRow2: 23,
  jamsButton: {
    row: 0,
    colStart: 40,
    colEnd: 43
  },
  controlBar: {
    wled: {
      startCol: 0,
      endCol: 3
    },
    link: {
      startCol: 5,
      endCol: 7
    },
    mode: {
      startCol: 8,
      endCol: 9
    },
    sync: {
      startCol: 10,
      endCol: 12
    }
  },
  stepColumns: {
    startCol: 4,
    endCol: 35
  },
  stepPatternLength: 32,
  sections: {
    startCol: 36,
    endCol: 43,
    count: 8
  },
  drumBankSlots: [
    [
      0,
      3,
      7,
      2
    ],
    [
      1,
      4,
      8,
      10
    ],
    [
      6,
      5,
      11,
      9
    ],
    [
      0,
      3,
      8,
      9
    ]
  ]
};
var COLORS = {
  gapSize: 1,
  noteColorsChromaticFallback: [
    {
      r: 1,
      g: 0,
      b: 0,
      a: 1,
      hex: "#FF0000"
    },
    {
      r: 1,
      g: 0.27,
      b: 0,
      a: 1,
      hex: "#FF4500"
    },
    {
      r: 1,
      g: 0.55,
      b: 0,
      a: 1,
      hex: "#FF8C00"
    },
    {
      r: 1,
      g: 0.78,
      b: 0,
      a: 1,
      hex: "#FFC700"
    },
    {
      r: 1,
      g: 1,
      b: 0,
      a: 1,
      hex: "#FFFF00"
    },
    {
      r: 0.6,
      g: 0.8,
      b: 0.2,
      a: 1,
      hex: "#99CC33"
    },
    {
      r: 0,
      g: 1,
      b: 0,
      a: 1,
      hex: "#00FF00"
    },
    {
      r: 0,
      g: 1,
      b: 0.67,
      a: 1,
      hex: "#00FFAB"
    },
    {
      r: 0,
      g: 1,
      b: 1,
      a: 1,
      hex: "#00FFFF"
    },
    {
      r: 0,
      g: 0.67,
      b: 1,
      a: 1,
      hex: "#00ABFF"
    },
    {
      r: 0,
      g: 0.33,
      b: 1,
      a: 1,
      hex: "#0054FF"
    },
    {
      r: 0.54,
      g: 0.17,
      b: 0.89,
      a: 1,
      hex: "#8A2BE3"
    }
  ],
  harmonicColorModeDefault: true,
  harmonicColorFormula: {
    saturation: 0.82,
    brightness: 0.93
  },
  drumColorFormula: {
    saturation: 0.88,
    brightness: 0.95
  },
  trackColors: {
    melody: {
      r: 0.3,
      g: 0.18,
      b: 0.95,
      a: 1,
      hex: "#4D2EF2"
    },
    chords: {
      r: 0,
      g: 0.9,
      b: 0.55,
      a: 1,
      hex: "#00E68C"
    },
    bass: {
      r: 0.95,
      g: 0.9,
      b: 0,
      a: 1,
      hex: "#F2E600"
    },
    rhythm: {
      r: 1,
      g: 0.19,
      b: 0,
      a: 1,
      hex: "#FF3000"
    }
  },
  trackGradientBottom: {
    melody: {
      r: 0.05,
      g: 0.25,
      b: 1,
      hex: "#0D40FF"
    },
    chords: {
      r: 0,
      g: 0.95,
      b: 0.05,
      hex: "#00F20D"
    },
    bass: {
      r: 1,
      g: 0.82,
      b: 0,
      hex: "#FFD100"
    },
    rhythm: {
      r: 1,
      g: 0,
      b: 0,
      hex: "#FF0000"
    }
  },
  trackGradientTop: {
    melody: {
      r: 0.55,
      g: 0.1,
      b: 0.9,
      hex: "#8C1AE6"
    },
    chords: {
      r: 0,
      g: 0.85,
      b: 1,
      hex: "#00D9FF"
    },
    bass: {
      r: 0.9,
      g: 1,
      b: 0,
      hex: "#E6FF00"
    },
    rhythm: {
      r: 1,
      g: 0.38,
      b: 0,
      hex: "#FF6100"
    }
  },
  gridBackgroundColor: {
    white: 0.04,
    alpha: 1,
    hex: "#0A0A0A"
  },
  cellOffColor: {
    white: 0.1,
    alpha: 1,
    hex: "#1A1A1A"
  },
  controlColors: {
    play: {
      r: 0.27,
      g: 1,
      b: 0.27,
      a: 1,
      hex: "#45FF45"
    },
    stop: {
      r: 1,
      g: 0.27,
      b: 0.27,
      a: 1,
      hex: "#FF4545"
    },
    scaleMajor: {
      r: 1,
      g: 0.67,
      b: 0,
      a: 1,
      hex: "#FFAB00"
    },
    scaleMinor: {
      r: 0,
      g: 0.67,
      b: 1,
      a: 1,
      hex: "#00ABFF"
    },
    scalePenta: {
      r: 0.67,
      g: 0,
      b: 1,
      a: 1,
      hex: "#AB00FF"
    },
    scaleBlues: {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1,
      hex: "#3366E6"
    },
    scaleDorian: {
      r: 0,
      g: 0.8,
      b: 0.6,
      a: 1,
      hex: "#00CC99"
    },
    scaleLydian: {
      r: 1,
      g: 0.9,
      b: 0.3,
      a: 1,
      hex: "#FFE64D"
    },
    scaleHira: {
      r: 1,
      g: 0.3,
      b: 0.5,
      a: 1,
      hex: "#FF4D80"
    },
    scaleHung: {
      r: 0.9,
      g: 0.2,
      b: 0.2,
      a: 1,
      hex: "#E63333"
    },
    active: {
      white: 0.53,
      alpha: 1,
      hex: "#878787"
    },
    inactive: {
      white: 0.2,
      alpha: 1,
      hex: "#333333"
    },
    ghostEnabled: {
      white: 0.4,
      alpha: 1,
      hex: "#666666"
    },
    ghostDisabled: {
      white: 0.13,
      alpha: 1,
      hex: "#212121"
    },
    controlButton: {
      white: 0.27,
      alpha: 1,
      hex: "#454545"
    },
    jamsDim: {
      r: 0.25,
      g: 0.15,
      b: 0.4,
      a: 1,
      hex: "#402666"
    },
    jamsActive: {
      r: 0.5,
      g: 0.3,
      b: 0.7,
      a: 1,
      hex: "#804DB3"
    },
    clearSections: {
      r: 0.4,
      g: 0.13,
      b: 0.13,
      a: 1,
      hex: "#662121"
    }
  },
  controlColorPlay: {
    r: 0.27,
    g: 1,
    b: 0.27,
    a: 1,
    hex: "#45FF45"
  },
  controlColorStop: {
    r: 1,
    g: 0.27,
    b: 0.27,
    a: 1,
    hex: "#FF4545"
  },
  cellMuteAlpha: 0.4,
  vuLevelOverlayMuteAlpha: 0.12,
  playheadLineColor: {
    white: 0.1,
    alpha: 1,
    hex: "#1A1A1A"
  },
  barMarkerShade: {
    white: 0.07,
    alpha: 1,
    hex: "#121212"
  },
  overviewStepMarkerColors: {
    pulse: {
      hex: "#FFFFFF"
    },
    playheadPlaying: {
      white: 0.67,
      alpha: 1,
      hex: "#ABABAB"
    },
    playheadPaused: {
      hex: "#FFFFFF"
    },
    bar: {
      white: 0.33,
      alpha: 1,
      hex: "#545454"
    },
    beat: {
      white: 0.2,
      alpha: 1,
      hex: "#333333"
    },
    idle: {
      white: 0.1,
      alpha: 1,
      hex: "#1A1A1A"
    }
  },
  historyOverlay: {
    fill: {
      white: 0,
      alpha: 0.25,
      hex: "#000000"
    },
    stroke: {
      white: 0.5,
      alpha: 0.4,
      hex: "#808080"
    },
    lineWidth: 2
  },
  gifBlendFactor: 0.4,
  marchingAnts: {
    lit: 0.4,
    unlit: 0.2
  },
  ghostTouchCircleScale: 0.8,
  noteCellAdsrReleaseAlpha: 0.3,
  noteCellNormalAlpha: 0.73,
  ghostNoteAlpha: 0.13,
  siblingNoteAlpha: {
    dim: 0.15,
    brighter: 0.22
  },
  siblingFlashAlpha: 0.95,
  pixelSize: {
    minMargin: 8
  },
  drumSpectrumEnabled: true,
  drumHueByIndex: [
    0,
    0.042,
    0.083,
    0.333,
    0.389,
    0.472,
    0.153,
    0.806,
    0.736,
    0.639,
    0.694,
    0.556
  ],
  dimColorFactor: 0.3,
  lassoBrightness: {
    pulseBase: 0.8,
    pulseAmplitude: 0.2,
    dim: 0.6
  }
};
var HARMONIC_COLOR_WHEEL = [
  {
    r: 0.93,
    g: 0.1674000000000001,
    b: 0.1674000000000001,
    a: 1,
    hex: "#ED2B2B"
  },
  {
    r: 0.1674000000000001,
    g: 0.5486999999999994,
    b: 0.93,
    a: 1,
    hex: "#2B8CED"
  },
  {
    r: 0.9299999999999997,
    g: 0.93,
    b: 0.1674000000000001,
    a: 1,
    hex: "#EDED2B"
  },
  {
    r: 0.5487000000000001,
    g: 0.1674000000000001,
    b: 0.93,
    a: 1,
    hex: "#8C2BED"
  },
  {
    r: 0.16740000000000044,
    g: 0.93,
    b: 0.1674000000000001,
    a: 1,
    hex: "#2BED2B"
  },
  {
    r: 0.93,
    g: 0.1674000000000001,
    b: 0.5487000000000007,
    a: 1,
    hex: "#ED2B8C"
  },
  {
    r: 0.1674000000000001,
    g: 0.93,
    b: 0.93,
    a: 1,
    hex: "#2BEDED"
  },
  {
    r: 0.93,
    g: 0.5486999999999997,
    b: 0.1674000000000001,
    a: 1,
    hex: "#ED8C2B"
  },
  {
    r: 0.1674000000000001,
    g: 0.16740000000000077,
    b: 0.93,
    a: 1,
    hex: "#2B2BED"
  },
  {
    r: 0.5487000000000001,
    g: 0.93,
    b: 0.1674000000000001,
    a: 1,
    hex: "#8CED2B"
  },
  {
    r: 0.93,
    g: 0.1674000000000001,
    b: 0.9299999999999994,
    a: 1,
    hex: "#ED2BED"
  },
  {
    r: 0.1674000000000001,
    g: 0.93,
    b: 0.5487000000000004,
    a: 1,
    hex: "#2BED8C"
  }
];
var DRUM_SPECTRUM_COLORS = [
  {
    r: 0.95,
    g: 0.11399999999999999,
    b: 0.11399999999999999,
    a: 1,
    hex: "#F21D1D"
  },
  {
    r: 0.95,
    g: 0.3246720000000002,
    b: 0.11399999999999999,
    a: 1,
    hex: "#F2531D"
  },
  {
    r: 0.95,
    g: 0.5303279999999998,
    b: 0.11399999999999999,
    a: 1,
    hex: "#F2871D"
  },
  {
    r: 0.11567200000000018,
    g: 0.95,
    b: 0.11399999999999999,
    a: 1,
    hex: "#1DF21D"
  },
  {
    r: 0.11399999999999999,
    g: 0.95,
    b: 0.393224,
    a: 1,
    hex: "#1DF264"
  },
  {
    r: 0.11399999999999999,
    g: 0.95,
    b: 0.8095519999999998,
    a: 1,
    hex: "#1DF2CE"
  },
  {
    r: 0.95,
    g: 0.8814480000000001,
    b: 0.11399999999999999,
    a: 1,
    hex: "#F2E11D"
  },
  {
    r: 0.8128960000000002,
    g: 0.11399999999999999,
    b: 0.95,
    a: 1,
    hex: "#CF1DF2"
  },
  {
    r: 0.4617760000000003,
    g: 0.11399999999999999,
    b: 0.95,
    a: 1,
    hex: "#761DF2"
  },
  {
    r: 0.11399999999999999,
    g: 0.2527759999999999,
    b: 0.95,
    a: 1,
    hex: "#1D40F2"
  },
  {
    r: 0.25110399999999977,
    g: 0.11399999999999999,
    b: 0.95,
    a: 1,
    hex: "#401DF2"
  },
  {
    r: 0.11399999999999999,
    g: 0.6691039999999997,
    b: 0.95,
    a: 1,
    hex: "#1DABF2"
  }
];
function colorForPitch(pitch, harmonicMode = COLORS.harmonicColorModeDefault) {
  const index = (pitch % 12 + 12) % 12;
  return harmonicMode ? HARMONIC_COLOR_WHEEL[index] : COLORS.noteColorsChromaticFallback[index];
}
function colorForDrum(drumIndex, harmonicMode = COLORS.harmonicColorModeDefault) {
  const idx = (drumIndex % 12 + 12) % 12;
  if (!COLORS.drumSpectrumEnabled) return colorForPitch(drumIndex, harmonicMode);
  return DRUM_SPECTRUM_COLORS[idx];
}
function dimColor(color) {
  const factor = COLORS.dimColorFactor;
  return { r: color.r * factor, g: color.g * factor, b: color.b * factor, a: color.a };
}
function calculatePixelSize(boundsWidth, boundsHeight) {
  const minMargin = 8;
  const GAP_SIZE = COLORS.gapSize;
  const COLS = GRID_LAYOUT.columns;
  const ROWS = GRID_LAYOUT.rows;
  const availableWidth = boundsWidth - minMargin * 2;
  const availableHeight = boundsHeight - minMargin * 2;
  const pixelSizeFromWidth = (availableWidth - (COLS - 1) * GAP_SIZE) / COLS;
  const pixelSizeFromHeight = (availableHeight - (ROWS - 1) * GAP_SIZE) / ROWS;
  const pixelSize = Math.floor(Math.min(pixelSizeFromWidth, pixelSizeFromHeight));
  const gridWidth = COLS * pixelSize + (COLS - 1) * GAP_SIZE;
  const gridHeight = ROWS * pixelSize + (ROWS - 1) * GAP_SIZE;
  const gridOffsetX = Math.floor((boundsWidth - gridWidth) / 2);
  const gridOffsetY = Math.floor((boundsHeight - gridHeight) / 2);
  return { pixelSize, gridOffsetX, gridOffsetY };
}
function visualRowForCell(col, row) {
  if (col >= 0 && col <= 35) {
    if (row === 0) return 23;
    if (row === 23) return 0;
    return row;
  }
  return row;
}
function overviewStepMarkerColor(opts) {
  const c = COLORS.overviewStepMarkerColors;
  if (opts.isPulse) return c.pulse;
  if (opts.isPlayhead) return opts.isPlaying ? c.playheadPlaying : c.playheadPaused;
  if (opts.isBar) return c.bar;
  if (opts.isBeat) return c.beat;
  return c.idle;
}

// src/deviations.ts
var DEVIATIONS = [
  {
    constant: "PAD (unlit pad / cell-off color) \u2014 MystrixVisualizer.tsx:18",
    swiftPath: "COLORS.cellOffColor.hex",
    appValueHex: "#1A1A1A",
    deviatingValueHex: "#323232",
    contrastRatio: null,
    minPadSizePxForTrueColors: 24,
    measuredContext: "~10px pad, pixelboop-wiki MystrixVisualizer figure embedded in flowing text on a light docs page.",
    reason: "The app's real unlit-pad color is UIColor(white: 0.1) = #1A1A1A (generated/grid-constants.ts COLORS.cellOffColor). On a SMALL (sub-24px) figure that color reads as almost indistinguishable from the surrounding page chrome and from other near-black UI states, so the wiki grid visualizer lightens it to #323232 to keep the unlit pad, the grid gutter, and lit pads visually distinct at a glance. At native app scale (pad >= 24px, see MIN_PAD_SIZE_TRUE_COLOR_ARITHMETIC) this deviation no longer applies \u2014 the renderer draws the app's true #1A1A1A instead."
  },
  {
    constant: "GUTTER (grid gap/gutter color) \u2014 MystrixVisualizer.tsx:19",
    swiftPath: null,
    appValueHex: "#141414",
    deviatingValueHex: "#808080",
    contrastRatio: 3.25,
    minPadSizePxForTrueColors: 24,
    measuredContext: "~10px pad, pixelboop-wiki MystrixVisualizer figure embedded in flowing text on a light docs page.",
    reason: "Not backed by any single named app constant: the app draws the gap between pads as GAP_SIZE spacing over gridBackgroundColor, not as a distinct 'gutter' color, so there is nothing in generated/grid-constants.ts for this to check against (swiftPath is null on purpose). #141414 is the original component author's approximate reference point for what that gap reads as, not an extracted Swift value. Lifted to #808080 to reach 3.25:1 contrast against the (also deviated) unlit pad above, for the SAME sub-24px figure context as PAD. At native app scale (pad >= 24px) this deviation no longer applies \u2014 the renderer draws the app's true gridBackgroundColor (#0A0A0A) instead. If the app's grid/gap rendering changes, a human has to re-derive this by hand \u2014 it is not covered by the automated drift check."
  }
];
function isDeviationActive(deviation, padSizePx) {
  if (deviation.minPadSizePxForTrueColors == null) return true;
  if (padSizePx == null) return true;
  return padSizePx < deviation.minPadSizePxForTrueColors;
}
function describeDeviations(padSizePx = null) {
  return DEVIATIONS.map((d) => {
    const active = isDeviationActive(d, padSizePx);
    const contrast = d.contrastRatio != null ? ` (${d.contrastRatio}:1 contrast)` : "";
    const status = active ? `ACTIVE${padSizePx != null ? ` at padSize=${padSizePx}px` : ""}: drawing ${d.deviatingValueHex} instead of the app's ${d.appValueHex}${contrast}` : `NOT applied at padSize=${padSizePx}px (>= ${d.minPadSizePxForTrueColors}px threshold): drawing the app's true ${d.appValueHex}, not the ${d.deviatingValueHex} deviation`;
    return `${d.constant}: ${status} \u2014 measured context: ${d.measuredContext} \u2014 ${d.reason}`;
  });
}

// src/ported-formulas.ts
function rgbToHex({ r, g, b }) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}
function unitRgbToRgb(c) {
  return { r: c.r * 255, g: c.g * 255, b: c.b * 255 };
}
function trackGradientColor(track, localRow, trackHeight) {
  const top = COLORS.trackGradientTop[track];
  const bot = COLORS.trackGradientBottom[track];
  const t = localRow / Math.max(1, trackHeight - 1);
  return {
    r: (top.r * (1 - t) + bot.r * t) * 255,
    g: (top.g * (1 - t) + bot.g * t) * 255,
    b: (top.b * (1 - t) + bot.b * t) * 255
  };
}
function relativeLuminance(c) {
  const f = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
}
function labelInk(fill) {
  return relativeLuminance(fill) <= 0.1833 ? "#FFFFFF" : "#000000";
}
function div255(x) {
  return Math.round(x / 255);
}
function compositeOverBackground(fg, alpha, bg) {
  const a8 = Math.round(alpha * 255);
  const channel = (fgC, bgC) => {
    return Math.round(fgC * alpha) + div255((255 - a8) * bgC);
  };
  return {
    r: channel(fg.r, bg.r),
    g: channel(fg.g, bg.g),
    b: channel(fg.b, bg.b)
  };
}
function keyColumnIntensity(localRow, height) {
  return 1 - localRow / height * 0.5;
}
var RHYTHM_VOLUME_DEFAULT = 1.2;
var TRACK_VOLUME_DEFAULTS = {
  melody: 1,
  // SequencerViewModel.swift:1268
  chords: 1,
  // SequencerViewModel.swift:1269
  bass: 0.85,
  // SequencerViewModel.swift:1270
  rhythm: RHYTHM_VOLUME_DEFAULT
  // SequencerViewModel.swift:1271
};
function volumeFillHeight(volumeLevel, height) {
  const v = Math.fround(volumeLevel);
  return Math.ceil(Math.fround(height * v));
}
function volumeAlphaMultiplier(volumeLevel, rowFromBottom, height) {
  const v = Math.fround(volumeLevel);
  if (v < 0.01) return 0.25;
  if (v < 1) {
    const fillHeight = volumeFillHeight(v, height);
    return rowFromBottom < fillHeight ? 1 : 0.25;
  }
  return 1;
}
function volumeWhiteBlendAmount(volumeLevel) {
  if (volumeLevel <= 1) return 0;
  const v = Math.fround(volumeLevel);
  const excessVolume = Math.fround(Math.fround(v - 1) / 0.5);
  return Math.min(0.75, excessVolume * 0.75);
}
function blendTowardWhite(rgb, amount) {
  return {
    r: rgb.r * (1 - amount) + 255 * amount,
    g: rgb.g * (1 - amount) + 255 * amount,
    b: rgb.b * (1 - amount) + 255 * amount
  };
}
function rhythmKeyColumnSaturation(rgb, localRow, currentDrumBank) {
  const s = localRow === currentDrumBank ? 1.5 : 0.6;
  return { r: Math.min(255, rgb.r * s), g: Math.min(255, rgb.g * s), b: Math.min(255, rgb.b * s) };
}
function rhythmFlashBoost(row, isPlaying, currentStep, patternNotes) {
  if (!isPlaying) return 0;
  const fires = patternNotes.some((n) => n.track === "rhythm" && n.row === row && n.step === currentStep);
  return fires ? 0.8 * 255 : 0;
}
function vuGlow(rgb, level, rowFromBottom, height) {
  if (level <= 0.01) return rgb;
  const cappedLevel = Math.min(1, level);
  const vuFillHeight = Math.floor(height * cappedLevel);
  if (rowFromBottom >= vuFillHeight) return rgb;
  const glow255 = level * 0.35 * 255;
  return { r: Math.min(255, rgb.r + glow255), g: Math.min(255, rgb.g + glow255), b: Math.min(255, rgb.b + glow255) };
}
var SOLO_INDICATOR_OFF_WHITE = 0.06;
var SOLO_INDICATOR_ON_WHITE = 0.28;
function isTrackMuted(track, mutePerTrack, soloedTrack) {
  if (soloedTrack !== null) return track !== soloedTrack;
  return mutePerTrack[track] ?? false;
}
function isTrackSoloed(track, soloedTrack) {
  return soloedTrack === track;
}
var FX_COLUMN_HUE = {
  send: { r: 0.3 * 255, g: 0.85 * 255, b: 1 * 255 },
  // :22
  drive: { r: 1 * 255, g: 0.62 * 255, b: 0.1 * 255 },
  // :25
  filter: { r: 0.62 * 255, g: 0.4 * 255, b: 1 * 255 }
  // :29 (unreachable in the empty state — no track's default FX mode is filter)
};
var FX_TRACK_DEFAULTS = {
  melody: { mode: "send", amount: 0.15 },
  chords: { mode: "send", amount: 0.1 },
  bass: { mode: "drive", amount: 0.25 },
  rhythm: { mode: "drive", amount: 0.15 }
};
var FX_COLUMN_DISENGAGED_ALPHA = 0.12;
function fxColumnFillAlpha(amount, localRow, height) {
  const rowFromBottom = height - 1 - localRow;
  const exact = amount * height;
  const fullCells = Math.floor(exact);
  const partial = exact - fullCells;
  if (rowFromBottom < fullCells) return 1;
  if (rowFromBottom === fullCells) return 0.25 + partial * 0.75;
  return 0.25;
}
function fxColumnRestColor(mode) {
  return FX_COLUMN_HUE[mode];
}
function fxSendGhostAlpha(fillAlpha, physics) {
  if (physics <= 0) return fillAlpha;
  const ghost = physics * 0.08;
  return Math.min(1, fillAlpha + ghost);
}
function rhythmBankSelectorLevel(localRow, currentDrumBank = 0) {
  return localRow === currentDrumBank ? 0.85 : 0.22;
}
var MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
var NOTE_INDICATOR_PENTA_TABLES = {
  major: { six: [0, 2, 4, 7, 9, 12], four: [0, 4, 7, 12] },
  minor: { six: [0, 3, 5, 7, 10, 12], four: [0, 3, 7, 12] }
};
var NOTE_INDICATOR_PENTA_TENSION_TABLES = {
  major: { six: [5, 11, 14, 5, 11, 14], four: [2, 5, 9, 11] },
  minor: { six: [2, 8, 14, 2, 8, 14], four: [2, 5, 10, 8] }
};
var NOTE_INDICATOR_DEFAULT_MODE = {
  melody: "thirds",
  chords: "musical",
  bass: "musical",
  rhythm: "musical"
};
var THIRDS_DEGREE_SKIP = 2;
var SECONDS_DEGREE_SKIP = 1;
function noteIndicatorPitchClass(track, localRow, trackHeight, rootNote, isMajorQuality, melodyModeMusical = false, setOffset = 0, modeOverride) {
  const rowsFromBottom = trackHeight - 1 - localRow;
  const mode = modeOverride ?? (track === "melody" && melodyModeMusical ? "musical" : NOTE_INDICATOR_DEFAULT_MODE[track]);
  let semitoneOffset;
  if (mode === "musical") {
    const table = (setOffset === 1 ? NOTE_INDICATOR_PENTA_TENSION_TABLES : NOTE_INDICATOR_PENTA_TABLES)[isMajorQuality ? "major" : "minor"];
    const arr = trackHeight === 6 ? table.six : table.four;
    const safeRow = Math.max(0, Math.min(rowsFromBottom, arr.length - 1));
    semitoneOffset = arr[safeRow];
  } else if (mode === "seconds") {
    const totalDegree = rowsFromBottom * SECONDS_DEGREE_SKIP + setOffset * trackHeight * SECONDS_DEGREE_SKIP;
    semitoneOffset = MAJOR_SCALE_INTERVALS[totalDegree % MAJOR_SCALE_INTERVALS.length];
  } else {
    const totalDegree = rowsFromBottom * THIRDS_DEGREE_SKIP + setOffset * trackHeight * THIRDS_DEGREE_SKIP;
    semitoneOffset = MAJOR_SCALE_INTERVALS[totalDegree % MAJOR_SCALE_INTERVALS.length];
  }
  const pitch = rootNote + semitoneOffset;
  return (pitch % 12 + 12) % 12;
}
var STEP_NOTE_ACCENT_ALPHA = 1;
var STEP_NOTE_NORMAL_ALPHA = 0.73;
var GHOST_NOTE_ALPHA = 0.13;
function calculateSustainFade(vel, step, patternLength = vel.length) {
  let sustainStart = step;
  let sustainLength = 1;
  for (let s = 1; s < patternLength; s++) {
    const prevStep = ((step - s) % patternLength + patternLength) % patternLength;
    const prevVel = vel[prevStep];
    if (prevVel === 3) {
      sustainStart = prevStep;
      sustainLength += 1;
    } else if (prevVel === 1 || prevVel === 2) {
      sustainStart = prevStep;
      sustainLength += 1;
      break;
    } else break;
  }
  for (let s = 1; s < patternLength; s++) {
    const nextStep = (step + s) % patternLength;
    if (vel[nextStep] === 3) sustainLength += 1;
    else break;
  }
  const positionInSustain = ((step - sustainStart) % patternLength + patternLength) % patternLength / sustainLength;
  if (positionInSustain < 0.4) return 0.85;
  return Math.max(0.25, 1 - positionInSustain * 0.9);
}
var SIBLING_ALPHA_DIM = COLORS.siblingNoteAlpha.dim;
var SIBLING_ALPHA_BRIGHTER = COLORS.siblingNoteAlpha.brighter;
var DRUM_BANK_SLOTS = [
  [0, 3, 7, 2],
  // Bank 0 (Core Kit): Kick, Snare, Closed Hat, Low Tom
  [1, 4, 8, 10],
  // Bank 1 (Alt Kit): Kick 2, Snare 2, Open Hat, Ride
  [6, 5, 11, 9],
  // Bank 2 (Percussion): Clap, Rimshot, Cowbell, Crash
  [0, 3, 8, 9]
  // Bank 3 (Hybrid): Kick, Snare, Open Hat, Crash
];
function drumSlotForRow(localRow, drumBank) {
  if (drumBank < 0 || drumBank >= DRUM_BANK_SLOTS.length) return 0;
  const bank = DRUM_BANK_SLOTS[drumBank];
  if (localRow < 0 || localRow >= bank.length) return 0;
  return bank[localRow];
}
var OVERVIEW_ROW22_ACTIVE_ALPHA = 0.35;
var SECTION_THUMBNAIL_WHITE = 0.1;
function sectionThumbnailAlpha(isActive) {
  return isActive ? 0.3 : 0.12;
}
var SECTION_THUMBNAIL_EMPTY_CELL_WHITE = 0.08;
var CONTROL_BAR_BASE_BLACK = { r: 0, g: 0, b: 0 };
var MODE_BUTTON_FREE = { r: 200, g: 150, b: 0 };
var MODE_BUTTON_FOLLOWER = { r: 150, g: 0, b: 200 };
var MODE_BUTTON_HOST = { r: 200, g: 0, b: 255 };
var MODE_BUTTON_REMOTE_ACTIVE = { r: 0, g: 0.9 * 255, b: 0 };
var SYNC_BUTTON_IDLE = { r: 0, g: 0.3 * 255, b: 0.4 * 255 };
var SYNC_BUTTON_CONNECTED = { r: 0, g: 0.9 * 255, b: 0.9 * 255 };
var SYNC_BUTTON_HOST_GOLD = { r: 1 * 255, g: 0.8 * 255, b: 0 };
var WLED_GRADIENT_BASE_HUE_IMAGE_DERIVED = 409 / 600;
var WLED_GRADIENT_BASE_HUE_ROOT_WHEEL_IMAGE_DERIVED = 508 / 600;
var WLED_GRADIENT_BASE_HUE_CONTROL_BAR_IMAGE_DERIVED = 63 / 600;
function wledGradientHue(index, pixelCount, baseHueOverride) {
  const span = 0.1;
  const offset = index / (pixelCount - 1) * span;
  const baseHue = baseHueOverride ?? WLED_GRADIENT_BASE_HUE_IMAGE_DERIVED;
  return (baseHue + offset) % 1;
}
function hsbToRgb(h, s, v) {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}
var SECTION_PLAY_DIM = { r: 0.1 * 255, g: 0.3 * 255, b: 0.15 * 255 };
var SECTION_PLAY_ACTIVE = { r: 0.2 * 255, g: 0.9 * 255, b: 0.3 * 255 };
var DEVICE_INDICATOR_HOST_GREEN = { r: 0, g: 255, b: 0 };
var DEVICE_INDICATOR_FOLLOWER_GREEN = { r: 0, g: 0.7 * 255, b: 0 };
var DEVICE_INDICATOR_START_COL = 12;
var DEVICE_INDICATOR_MAX_SLOTS = 24;
var SHAKE_INDICATOR_IDLE_WHITE = 0.13;
var USB_INDICATOR_OFF = { white: 0.15, alpha: 0.4 };
var BT_INDICATOR_OFF = { rgb: { r: 64, g: 128, b: 255 }, alpha: 0.4 };
function bankSelectorAlpha(bankIndex, activeBankIndex, hasData) {
  const isActive = bankIndex === activeBankIndex;
  if (isActive && hasData) return 0.9;
  if (isActive) return 0.25;
  if (hasData) return 0.45;
  return 0.12;
}
var ROW1_GUTTER_WHITE = 0.13;
function bpmReadoutColor(fade = 0) {
  return hsbToRgb(0, 0, 0.35 + fade);
}
function patternLengthReadoutColor(patternLength) {
  const normalizedHue = patternLength * 8 % 360 / 360;
  return hsbToRgb(normalizedHue, 0.7, 0.5);
}
var ROW22_PLAYHEAD_PAUSED_WHITE = 0.08;
var ROW22_PLAYHEAD_PLAYING_WHITE = 0.13;

// src/zones.ts
var DEFAULT_EMPTY_STATE_OPTIONS = {
  rootNote: 0,
  isMajorQuality: true,
  melodyIntervalModeMusical: false,
  noteIntervalMode: {},
  showGhostNotes: true,
  canUndo: false,
  canRedo: false,
  hasSavedJams: false,
  activeSectionIndex: 0,
  populatedSectionIndices: [],
  sectionThumbnailNoteRows: [],
  currentDrumBank: 0,
  activeBankIndex: 0,
  populatedBankIndices: [],
  patternLength: 32,
  syncMode: "free",
  remoteSessionActive: false,
  remoteParticipants: [],
  sectionPlayEnabled: false,
  wledBaseHueOverride: null,
  patternNotes: [],
  ghostStepNotes: [],
  siblingStepNotes: [],
  overviewActiveStepTrack: [],
  mutePerTrack: {},
  soloedTrack: null,
  trackSet: {},
  currentStep: 0,
  isPlaying: false,
  pulseStep: null,
  bpmPulseFadeOverride: null,
  trackLevelsOverride: null,
  fxPhysicsOverride: null,
  trackVolumes: {},
  fxAmount: {},
  fxMode: {}
};
var rect = (c0, c1, r0, r1) => {
  const out = [];
  for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) out.push([c, r]);
  return out;
};
var asRgb = (c) => unitRgbToRgb(c);
function hexRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 };
}
function constant(rgbSrc, citation) {
  return { rgb: hexRgb(rgbSrc.hex), hex: rgbSrc.hex, source: "constant", citation };
}
var CONTROL_BAR = GRID_LAYOUT.controlBar;
var SECTIONS = GRID_LAYOUT.sections;
var JAMS = GRID_LAYOUT.jamsButton;
var TRACKS = GRID_LAYOUT.tracks;
var CC = COLORS.controlColors;
var BG_RGB = hexRgb(COLORS.gridBackgroundColor.hex);
function composited(fg, alpha, source, citation) {
  const rgb = compositeOverBackground(fg, alpha, BG_RGB);
  return { rgb, hex: rgbToHex(rgb), source, citation };
}
function resolveTrackVolume(track, opts) {
  return opts.trackVolumes[track] ?? TRACK_VOLUME_DEFAULTS[track];
}
function resolveFxMode(track, opts) {
  return opts.fxMode[track] ?? FX_TRACK_DEFAULTS[track].mode;
}
function resolveFxAmount(track, opts) {
  return opts.fxAmount[track] ?? FX_TRACK_DEFAULTS[track].amount;
}
function trackKeyColumnZone(id, name, track) {
  const t = TRACKS[track];
  return {
    id,
    name,
    cells: rect(0, 0, t.startRow, t.endRow),
    resolve: (_col, row, opts) => {
      const localRow = row - t.startRow;
      const rowFromBottom = t.height - 1 - localRow;
      let rgb = trackGradientColor(track, localRow, t.height);
      const intensity = keyColumnIntensity(localRow, t.height);
      const muted = isTrackMuted(track, opts.mutePerTrack, opts.soloedTrack);
      const soloed = isTrackSoloed(track, opts.soloedTrack);
      const volumeLevel = resolveTrackVolume(track, opts);
      const whiteAmount = volumeWhiteBlendAmount(volumeLevel);
      if (whiteAmount > 0) rgb = blendTowardWhite(rgb, whiteAmount);
      const baseAlpha = muted ? COLORS.vuLevelOverlayMuteAlpha : soloed ? 1 : intensity;
      const alpha = baseAlpha * volumeAlphaMultiplier(volumeLevel, rowFromBottom, t.height);
      const level = muted ? 0 : opts.trackLevelsOverride?.[track] ?? 0;
      const glowing = level > 0.01;
      if (glowing) {
        rgb = vuGlow(rgb, level, rowFromBottom, t.height);
      }
      const volumePhrase = `ported-formulas.volumeAlphaMultiplier(opts.trackVolumes.${track} ?? TRACK_VOLUME_DEFAULTS.${track}=${TRACK_VOLUME_DEFAULTS[track]}) (:2828-2846)` + (whiteAmount > 0 ? " + volumeWhiteBlendAmount (:2848-2856)" : "");
      const citation = muted ? `ported-formulas.trackGradientColor (PixelGridUIView.swift:265-277) + ${volumePhrase}, composited at COLORS.vuLevelOverlayMuteAlpha (PixelGridUIView.swift:2783, isMuted branch) x the above over COLORS.gridBackgroundColor` : soloed ? `ported-formulas.trackGradientColor (PixelGridUIView.swift:265-277) + ${volumePhrase}${glowing ? " + vuGlow(opts.trackLevelsOverride, image-derived, :2860-2879)" : ""}, opaque x the above (PixelGridUIView.swift:2783, isSoloed branch \u2014 no keyColumnIntensity fade)` : "ported-formulas.trackGradientColor (PixelGridUIView.swift:265-277), fed by COLORS.trackGradientTop/Bottom, " + (glowing ? "+ vuGlow(opts.trackLevelsOverride, image-derived, :2860-2879), " : "") + `+ ${volumePhrase}, alpha-faded by ported-formulas.keyColumnIntensity (PixelGridUIView.swift:2751) x the above and composited over COLORS.gridBackgroundColor`;
      return composited(rgb, alpha, "formula", citation);
    },
    describe: () => `${name} track key column, rows ${t.startRow}-${t.endRow}. Spectral gradient from ${COLORS.trackGradientTop[track].hex} (high) to ${COLORS.trackGradientBottom[track].hex} (low), fading toward the bottom row.`
  };
}
var rhythmKeyColumn = {
  id: "rhythmKeyColumn",
  name: "Rhythm track key column",
  cells: rect(0, 0, TRACKS.rhythm.startRow, TRACKS.rhythm.endRow),
  resolve: (_col, row, opts) => {
    const localRow = row - TRACKS.rhythm.startRow;
    const height = TRACKS.rhythm.height;
    const rowFromBottom = height - 1 - localRow;
    const grad = trackGradientColor("rhythm", localRow, height);
    const saturated = rhythmKeyColumnSaturation(grad, localRow, opts.currentDrumBank);
    const flashBoost255 = rhythmFlashBoost(row, opts.isPlaying, opts.currentStep, opts.patternNotes);
    const flashed = flashBoost255 > 0 ? {
      r: Math.min(255, saturated.r + flashBoost255),
      g: Math.min(255, saturated.g + flashBoost255),
      b: Math.min(255, saturated.b + flashBoost255)
    } : saturated;
    const volumeLevel = resolveTrackVolume("rhythm", opts);
    const whiteAmount = volumeWhiteBlendAmount(volumeLevel);
    const blended = whiteAmount > 0 ? blendTowardWhite(flashed, whiteAmount) : flashed;
    const intensity = keyColumnIntensity(localRow, height);
    const muted = isTrackMuted("rhythm", opts.mutePerTrack, opts.soloedTrack);
    const soloed = isTrackSoloed("rhythm", opts.soloedTrack);
    const level = muted ? 0 : opts.trackLevelsOverride?.rhythm ?? 0;
    const glowing = level > 0.01;
    const rgb = glowing ? vuGlow(blended, level, rowFromBottom, height) : blended;
    const baseAlpha = muted ? COLORS.vuLevelOverlayMuteAlpha : soloed ? 1 : intensity;
    const alpha = baseAlpha * volumeAlphaMultiplier(volumeLevel, rowFromBottom, height);
    const volumePhrase = `ported-formulas.volumeAlphaMultiplier(opts.trackVolumes.rhythm ?? RHYTHM_VOLUME_DEFAULT=${RHYTHM_VOLUME_DEFAULT}) (:2828-2846)` + (whiteAmount > 0 ? " + volumeWhiteBlendAmount (:2848-2856)" : "");
    const citation = muted ? `ported-formulas.trackGradientColor + rhythmKeyColumnSaturation + rhythmFlashBoost + ${volumePhrase} (as below), composited at COLORS.vuLevelOverlayMuteAlpha (PixelGridUIView.swift:2783, isMuted branch) x the above over COLORS.gridBackgroundColor` : soloed ? `ported-formulas.trackGradientColor + rhythmKeyColumnSaturation + rhythmFlashBoost + ${volumePhrase}${glowing ? " + vuGlow(opts.trackLevelsOverride, image-derived, :2860-2879)" : ""} (as below), opaque x the above (PixelGridUIView.swift:2783, isSoloed branch \u2014 no keyColumnIntensity fade)` : "ported-formulas.trackGradientColor (PixelGridUIView.swift:265-277) + rhythmKeyColumnSaturation (:2760-2766) + rhythmFlashBoost (:2761-2775) + " + volumePhrase + (glowing ? " + vuGlow(opts.trackLevelsOverride, image-derived, :2860-2879)" : "") + ", alpha-faded by keyColumnIntensity (:2751) x the above and composited over COLORS.gridBackgroundColor";
    return composited(rgb, alpha, "formula", citation);
  },
  describe: () => `Rhythm track key column, rows ${TRACKS.rhythm.startRow}-${TRACKS.rhythm.endRow}. Spectral gradient, saturation-boosted for the active drum bank, blended toward white for the track's 120% default volume.`
};
var col1SoloIndicator = {
  id: "col1SoloIndicator",
  name: "Solo indicator (col 1)",
  cells: rect(1, 1, 2, GRID_LAYOUT.rows - 3),
  resolve: (_col, row, opts) => {
    const info = trackForRow(row);
    const soloed = info ? isTrackSoloed(info.track, opts.soloedTrack) : false;
    const white = Math.round((soloed ? SOLO_INDICATOR_ON_WHITE : SOLO_INDICATOR_OFF_WHITE) * 255);
    const rgb = { r: white, g: white, b: white };
    return {
      rgb,
      hex: rgbToHex(rgb),
      source: "formula",
      citation: soloed ? "ported-formulas.SOLO_INDICATOR_ON_WHITE (PixelGridUIView.swift:2919-2920), opaque \u2014 this row's track is soloed" : "ported-formulas.SOLO_INDICATOR_OFF_WHITE (PixelGridUIView.swift:2921), opaque \u2014 not soloed"
    };
  },
  describe: (opts) => `Solo indicator, column 1, rows 2-21. ${opts.soloedTrack ? `${opts.soloedTrack} is soloed.` : "Nothing soloed."}`
};
function col2FxColumnZone(id, name, track, startRow, endRow, height) {
  return {
    id,
    name,
    cells: rect(2, 2, startRow, endRow),
    resolve: (_col, row, opts) => {
      const localRow = row - startRow;
      const mode = resolveFxMode(track, opts);
      const amount = resolveFxAmount(track, opts);
      const fg = fxColumnRestColor(mode);
      if (amount <= 0) {
        const citation2 = `ported-formulas.fxColumnRestColor(opts.fxMode.${track} ?? FX_TRACK_DEFAULTS.${track}.mode) at ported-formulas.FX_COLUMN_DISENGAGED_ALPHA (PixelGridUIView.swift:2944-2946, fxLayer2Color isFilled==false branch, at rest: heat/pump/physics all provably 0), composited over COLORS.gridBackgroundColor`;
        return composited(fg, FX_COLUMN_DISENGAGED_ALPHA, "formula", citation2);
      }
      const alpha = fxColumnFillAlpha(amount, localRow, height);
      const rowFromBottom = height - 1 - localRow;
      const exact = amount * height;
      const fullCells = Math.floor(exact);
      const igniteFullCells = mode === "drive" ? Math.min(fullCells, height - 1) : fullCells;
      const isFilled = rowFromBottom < igniteFullCells;
      const physics = mode === "send" && !isFilled ? opts.fxPhysicsOverride?.[track] ?? 0 : 0;
      const finalAlpha = physics > 0 ? fxSendGhostAlpha(alpha, physics) : alpha;
      const citation = physics > 0 ? `ported-formulas.fxColumnRestColor + fxSendGhostAlpha(fxColumnFillAlpha(opts.fxAmount.${track} ?? FX_TRACK_DEFAULTS.${track}.amount), opts.fxPhysicsOverride image-derived) (PixelGridUIView.swift:2926-3033, fxLayer2Color .send/isFilled==false branch, :2576-2578), composited over COLORS.gridBackgroundColor` : `ported-formulas.fxColumnRestColor(opts.fxMode.${track} ?? FX_TRACK_DEFAULTS.${track}.mode) + fxColumnFillAlpha(opts.fxAmount.${track} ?? FX_TRACK_DEFAULTS.${track}.amount) (PixelGridUIView.swift:2926-3033, fxLayer2Color :2498-2621, at rest: heat/pump/physics/gain-reduction all provably 0 \u2014 see fxColumnRestColor/fxColumnFillAlpha docs), composited over COLORS.gridBackgroundColor`;
      return composited(fg, finalAlpha, "formula", citation);
    },
    describe: () => `${name} track FX column (col 2), rows ${startRow}-${endRow}. At rest \u2014 no live audio.`
  };
}
var col3RhythmBankSelector = {
  id: "col3RhythmBankSelector",
  name: "Drum bank selector (col 3)",
  cells: rect(3, 3, TRACKS.rhythm.startRow, TRACKS.rhythm.endRow),
  resolve: (_col, row, opts) => {
    const localRow = row - TRACKS.rhythm.startRow;
    const level = rhythmBankSelectorLevel(localRow, opts.currentDrumBank);
    const representativeType = localRow * 4;
    const hue = representativeType < 12 ? colorForDrum(representativeType) : null;
    let rgb;
    let citation;
    if (hue) {
      rgb = { r: hue.r * 255 * level, g: hue.g * 255 * level, b: hue.b * 255 * level };
      citation = "generated colorForDrum() (AppColors.bankSelectorColor, PixelGridUIView.swift:406-411) scaled by ported-formulas.rhythmBankSelectorLevel (PixelGridUIView.swift:3151-3161), opaque";
    } else {
      const white = Math.round(level * 255);
      rgb = { r: white, g: white, b: white };
      citation = "ported-formulas.rhythmBankSelectorLevel white tier (PixelGridUIView.swift:3157-3159, bankSelectorColor out of range for localRow 3), opaque";
    }
    return { rgb, hex: rgbToHex(rgb), source: "formula", citation };
  },
  describe: (opts) => `Rhythm drum-bank selector, column 3, rows ${TRACKS.rhythm.startRow}-${TRACKS.rhythm.endRow}. Bank ${opts.currentDrumBank} active.`
};
function col3NoteIndicatorZone(id, name, track, startRow, endRow, height) {
  return {
    id,
    name,
    cells: rect(3, 3, startRow, endRow),
    resolve: (_col, row, opts) => {
      const localRow = row - startRow;
      const setOffset = (opts.trackSet[track] ?? 1) - 1;
      const pitchClass = noteIndicatorPitchClass(track, localRow, height, opts.rootNote, opts.isMajorQuality, opts.melodyIntervalModeMusical, setOffset, opts.noteIntervalMode[track]);
      const note = colorForPitch(pitchClass);
      if (opts.isPlaying) {
        const playingNote = opts.patternNotes.find((n) => n.track === track && n.row === row && n.step === opts.currentStep);
        if (playingNote) {
          if (playingNote.velocity === 2) {
            return composited(asRgb(note), STEP_NOTE_ACCENT_ALPHA, "formula", 'PixelGridUIView.swift:3086-3088 (col 3 playback indicator, velocity 2 "accent", same as the main grid) -> generated colorForPitch(), opaque');
          }
          if (playingNote.velocity === 3) {
            const patternLength = GRID_LAYOUT.stepColumns.endCol - GRID_LAYOUT.stepColumns.startCol + 1;
            const vel = new Array(patternLength).fill(0);
            for (const n of opts.patternNotes) {
              if (n.track === track && n.row === row) vel[n.step] = n.velocity;
            }
            const alpha = calculateSustainFade(vel, opts.currentStep, patternLength);
            return composited(asRgb(note), alpha, "formula", `PixelGridUIView.swift:3089-3091 (col 3 playback indicator, velocity 3 "sustain continuation", same ported-formulas.calculateSustainFade as the main grid, alpha=${alpha}) -> generated colorForPitch(), composited over COLORS.gridBackgroundColor`);
          }
          return composited(asRgb(note), STEP_NOTE_NORMAL_ALPHA, "formula", 'PixelGridUIView.swift:3092-3093, 3096 (col 3 playback indicator, velocity 1 "normal note", same 0.73 alpha as the main grid) -> generated colorForPitch(), composited over COLORS.gridBackgroundColor');
        }
      }
      return composited(
        asRgb(note),
        0.35,
        "formula",
        "ported-formulas.noteIndicatorPitchClass (IntervalMode.swift:267-383, PixelGridUIView.swift:3035-3124 default/rest branch) -> generated colorForPitch(), alpha 0.35 (PixelGridUIView.swift:3123), composited over COLORS.gridBackgroundColor"
      );
    },
    describe: (opts) => `${name} track note indicator, column 3, rows ${startRow}-${endRow}. ${opts.isPlaying ? `Playback indicator active at step ${opts.currentStep}.` : "Interval-mode preview at rest."}`
  };
}
var BAR_COLS = [0, 1, 2, 3].map((bar) => GRID_LAYOUT.stepColumns.startCol + bar * 8);
function trackStepsZone(id, name, track) {
  const t = TRACKS[track];
  const startRow = t.startRow, endRow = t.endRow;
  return {
    id,
    name,
    // Bar columns (12/20/28) are included here (round 9: previously ceded
    // whole-column to a separate always-shaded barMarkers zone) — see
    // ported-formulas.ts's "Bar-boundary columns carrying a real note"
    // doc: the bar shade and the real-note branch are the same Swift
    // else-if chain, so a note there must win; resolve() below falls back
    // to the shade itself when this cell has no note (see BAR_COLS.includes).
    cells: rect(GRID_LAYOUT.stepColumns.startCol, GRID_LAYOUT.stepColumns.endCol, startRow, endRow),
    resolve: (col, row, opts) => {
      const step = col - GRID_LAYOUT.stepColumns.startCol;
      const muted = isTrackMuted(track, opts.mutePerTrack, opts.soloedTrack);
      const isCurrentStepCol = step === opts.currentStep;
      const flashing = opts.isPlaying && isCurrentStepCol && !muted;
      const note = opts.patternNotes.find((n) => n.track === track && n.row === row && n.step === step);
      if (note) {
        const localRow = row - t.startRow;
        const noteColor = track === "rhythm" ? colorForDrum(drumSlotForRow(localRow, opts.currentDrumBank)) : colorForPitch(noteIndicatorPitchClass(track, localRow, t.height, opts.rootNote, opts.isMajorQuality, opts.melodyIntervalModeMusical, (opts.trackSet[track] ?? 1) - 1, opts.noteIntervalMode[track]));
        const colorCitation = track === "rhythm" ? `ported-formulas.drumSlotForRow(localRow=${localRow}, drumBank=${opts.currentDrumBank}) (SequencerViewModel.swift:105-208 compiled GridConstants.noteForRow/drumNoteForRow) -> generated colorForDrum() (PixelGridUIView.swift:2741-2743, 3283)` : `ported-formulas.noteIndicatorPitchClass (IntervalMode.swift:267-383) -> generated colorForPitch()`;
        if (muted) {
          return composited(
            asRgb(noteColor),
            COLORS.cellMuteAlpha,
            "formula",
            `COLORS.cellMuteAlpha (PixelGridUIView.swift:3312-3314, isMuted overrides velocity ${note.velocity}'s own alpha) -> ${colorCitation}, composited over COLORS.gridBackgroundColor`
          );
        }
        if (flashing) {
          const sib = opts.siblingStepNotes.find((s) => s.track === track && s.row === row && s.step === step);
          if (sib && sib.active) {
            const sibColor = track === "rhythm" ? colorForDrum(sib.pitchClass) : colorForPitch(sib.pitchClass);
            return composited(
              asRgb(sibColor),
              COLORS.siblingFlashAlpha,
              "formula",
              `COLORS.siblingFlashAlpha (PixelGridUIView.swift:3337-3345, playhead-triggered sibling flash overrides this cell's own velocity ${note.velocity} note, pitchClass=${sib.pitchClass} \u2014 only the single-active-sibling case is modeled, see doc), composited over COLORS.gridBackgroundColor`
            );
          }
        }
        if (note.velocity === 2) {
          return composited(
            asRgb(noteColor),
            STEP_NOTE_ACCENT_ALPHA,
            "formula",
            `ported-formulas.STEP_NOTE_ACCENT_ALPHA (PixelGridUIView.swift:3273-3277, velocity 2 "accent" \u2014 the note's own color, no alpha change) -> ${colorCitation}, opaque`
          );
        }
        if (note.velocity === 3) {
          const patternLength = GRID_LAYOUT.stepColumns.endCol - GRID_LAYOUT.stepColumns.startCol + 1;
          const vel = new Array(patternLength).fill(0);
          for (const n of opts.patternNotes) {
            if (n.track === track && n.row === row) vel[n.step] = n.velocity;
          }
          const baseAlpha = calculateSustainFade(vel, step, patternLength);
          const alpha = flashing ? Math.min(1, baseAlpha + 0.3) : baseAlpha;
          return composited(
            asRgb(noteColor),
            alpha,
            "formula",
            flashing ? `ported-formulas.calculateSustainFade=${baseAlpha} + PixelGridUIView.swift:3328 playhead trigger flash (min(1.0, alpha+0.3)) = ${alpha} -> ${colorCitation}, composited over COLORS.gridBackgroundColor` : `ported-formulas.calculateSustainFade (PixelGridUIView.swift:3291-3293, 3433-3472, velocity 3 "sustain continuation", alpha=${alpha}) -> ${colorCitation}, composited over COLORS.gridBackgroundColor`
          );
        }
        const v1Alpha = flashing ? 1 : STEP_NOTE_NORMAL_ALPHA;
        return composited(
          asRgb(noteColor),
          v1Alpha,
          "formula",
          flashing ? `PixelGridUIView.swift:3330 playhead trigger flash (velocity 1 boosted to alpha 1.0) -> ${colorCitation}, composited over COLORS.gridBackgroundColor` : `ported-formulas.STEP_NOTE_NORMAL_ALPHA (PixelGridUIView.swift:3296-3300, velocity 1 "normal note") -> ${colorCitation}, composited over COLORS.gridBackgroundColor`
        );
      }
      const ghost = opts.showGhostNotes ? opts.ghostStepNotes.find((g) => g.track === track && g.row === row && g.step === step) : void 0;
      if (ghost) {
        return composited(
          asRgb(COLORS.trackColors[ghost.sourceTrack]),
          GHOST_NOTE_ALPHA,
          "formula",
          `ported-formulas.GHOST_NOTE_ALPHA (PixelGridUIView.swift:3258-3268, ghost of ${ghost.sourceTrack}'s note at the same slot), COLORS.trackColors.${ghost.sourceTrack} composited over COLORS.gridBackgroundColor \u2014 NOT re-dimmed by this track's own mute (Swift never re-checks isMuted in the ghost branch)`
        );
      }
      const sibling = opts.siblingStepNotes.find((s) => s.track === track && s.row === row && s.step === step);
      if (sibling) {
        const sibColor = track === "rhythm" ? colorForDrum(sibling.pitchClass) : colorForPitch(sibling.pitchClass);
        if (muted) {
          return composited(
            asRgb(sibColor),
            COLORS.cellMuteAlpha,
            "formula",
            `COLORS.cellMuteAlpha (PixelGridUIView.swift:3366, isMuted overrides the sibling branch's own alpha), pitchClass=${sibling.pitchClass}, composited over COLORS.gridBackgroundColor`
          );
        }
        if (flashing && sibling.active) {
          return composited(
            asRgb(sibColor),
            COLORS.siblingFlashAlpha,
            "formula",
            `COLORS.siblingFlashAlpha (PixelGridUIView.swift:3353-3360, playhead-triggered sibling flash, pitchClass=${sibling.pitchClass} \u2014 only the single-active-sibling case is modeled, see doc), composited over COLORS.gridBackgroundColor`
          );
        }
        const alpha = sibling.active ? SIBLING_ALPHA_BRIGHTER : SIBLING_ALPHA_DIM;
        return composited(
          asRgb(sibColor),
          alpha,
          "formula",
          `ported-formulas.SIBLING_ALPHA_${sibling.active ? "BRIGHTER" : "DIM"} (PixelGridUIView.swift:3346-3365, out-of-set sibling note, pitchClass=${sibling.pitchClass}${sibling.active ? " with an active v1/v2 sibling" : ", sustain/other siblings only"}), composited over COLORS.gridBackgroundColor`
        );
      }
      if (isCurrentStepCol) {
        return literal(
          hexRgb(COLORS.playheadLineColor.hex),
          "COLORS.playheadLineColor (PixelGridUIView.swift:3372-3374, isPlayhead branch, checked ahead of the bar shade below in the same else-if chain), opaque"
        );
      }
      if (BAR_COLS.includes(col)) {
        return constant(COLORS.barMarkerShade, "COLORS.barMarkerShade (PixelGridUIView.swift:3374-3376, `step % 8 == 0` \u2014 same else-if chain as the real-note branch above, so only reached here when this cell has no note and is not the current step)");
      }
      return constant(COLORS.cellOffColor, "COLORS.cellOffColor");
    },
    describe: (opts) => {
      const hasContent = opts.patternNotes.some((n) => n.track === track) || opts.ghostStepNotes.some((g) => g.track === track);
      return `${name} track, ${endRow - startRow + 1} rows, 32 steps. ${hasContent ? "Has note content." : "Empty \u2014 no notes placed."}`;
    }
  };
}
var playStop = {
  id: "playStop",
  name: "Play / Stop",
  cells: rect(0, 2, 0, 0),
  // PixelGridUIView.swift:2076 (`let playColor = vm.isPlaying ? COLOR_STOP : COLOR_PLAY`).
  // The WLED-config-hold white fill-up overlay (:2079-2098, playButtonHoldPending)
  // is a rare in-progress touch gesture this renderer has no option for and none
  // of its reference states are mid-gesture — documented gap, not modeled.
  resolve: (_c, _r, opts) => constant(opts.isPlaying ? CC.stop : CC.play, `COLORS.controlColors.${opts.isPlaying ? "stop" : "play"} (PixelGridUIView.swift:2076)`),
  describe: (opts) => `Play button, columns 0 to 2. ${opts.isPlaying ? "Playing (stop icon)." : "Stopped."}`
};
var undo = {
  id: "undo",
  name: "Undo",
  cells: [[4, 0]],
  resolve: (_c, _r, o) => constant(o.canUndo ? CC.active : CC.inactive, "COLORS.controlColors.active/inactive"),
  describe: (o) => `Undo button. ${o.canUndo ? "Available" : "No history yet"}.`
};
var redo = {
  id: "redo",
  name: "Redo",
  cells: [[5, 0]],
  resolve: (_c, _r, o) => constant(o.canRedo ? CC.active : CC.inactive, "COLORS.controlColors.active/inactive"),
  describe: (o) => `Redo button. ${o.canRedo ? "Available" : "No history yet"}.`
};
var scaleMajor = {
  id: "scaleMajor",
  name: "Major quality",
  cells: [[7, 0]],
  resolve: (_c, _r, o) => {
    const bright = CC.scaleMajor;
    const rgb = o.isMajorQuality ? asRgb(bright) : asRgb(dimColor(bright));
    return { rgb, hex: rgbToHex(rgb), source: o.isMajorQuality ? "constant" : "formula", citation: "COLORS.controlColors.scaleMajor" + (o.isMajorQuality ? "" : " via generated dimColor()") };
  },
  describe: (o) => `Major scale quality. ${o.isMajorQuality ? "Selected" : "Not selected"}.`
};
var scaleMinor = {
  id: "scaleMinor",
  name: "Minor quality",
  cells: [[8, 0]],
  resolve: (_c, _r, o) => {
    const bright = CC.scaleMinor;
    const rgb = !o.isMajorQuality ? asRgb(bright) : asRgb(dimColor(bright));
    return { rgb, hex: rgbToHex(rgb), source: !o.isMajorQuality ? "constant" : "formula", citation: "COLORS.controlColors.scaleMinor" + (!o.isMajorQuality ? "" : " via generated dimColor()") };
  },
  describe: (o) => `Minor scale quality. ${!o.isMajorQuality ? "Selected" : "Not selected"}.`
};
var scaleType = {
  id: "scaleType",
  name: "Scale type",
  cells: [[9, 0]],
  resolve: () => constant(CC.scalePenta, "COLORS.controlColors.scalePenta (Pentatonic is the app default pentaScaleType; always drawn at full brightness)"),
  describe: () => "Scale type selector: Pentatonic (default)."
};
function rootNoteZone() {
  const cells = [];
  for (let n = 0; n < 12; n++) cells.push([11 + n, 0]);
  return {
    id: "rootNoteWheel",
    name: "Root note wheel",
    cells,
    resolve: (col, _row, opts) => {
      const noteIndex = col - 11;
      const isSelected = noteIndex === opts.rootNote;
      const bright = colorForPitch(noteIndex);
      const rgb = isSelected ? asRgb(bright) : asRgb(dimColor(bright));
      return {
        rgb,
        hex: rgbToHex(rgb),
        source: isSelected ? "constant" : "formula",
        citation: isSelected ? "generated colorForPitch() (harmonic mode, PixelGridUIView.swift:293-301)" : "generated dimColor(colorForPitch(...)) (PixelGridUIView+Touch.swift:5794-5797)"
      };
    },
    describe: (opts) => {
      const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      return `Root note selector, 12 keys, columns 11 to 22, harmonic (circle-of-fifths) color wheel. Current root: ${NOTE_NAMES[opts.rootNote]}.`;
    }
  };
}
var ghostToggle = {
  id: "ghost",
  name: "Ghost notes toggle",
  cells: [[24, 0]],
  resolve: (_c, _r, o) => constant(o.showGhostNotes ? CC.ghostEnabled : CC.ghostDisabled, "COLORS.controlColors.ghostEnabled/ghostDisabled"),
  describe: (o) => `Ghost notes toggle. ${o.showGhostNotes ? "On" : "Off"}.`
};
var bpmChrome = {
  id: "bpm",
  name: "Tempo controls",
  cells: rect(26, 28, 0, 0),
  resolve: (col, _row, opts) => {
    if (col === 26 || col === 28) return constant(CC.controlButton, "COLORS.controlColors.controlButton");
    const fade = opts.bpmPulseFadeOverride ?? 0;
    const rgb = bpmReadoutColor(fade);
    return {
      rgb,
      hex: rgbToHex(rgb),
      source: "formula",
      citation: fade === 0 ? "ported-formulas.bpmReadoutColor (PixelGridUIView.swift:2160-2168, bpmPulseFade at its rest value 0) via hsbToRgb, opaque" : `ported-formulas.bpmReadoutColor(fade=${fade}) (PixelGridUIView.swift:2160-2168, image-derived bpmPulseFade residual \u2014 see its doc) via hsbToRgb, opaque`
    };
  },
  describe: (opts) => `Tempo (BPM) controls, columns 26-28. The center readout (col 27) is ${(opts.bpmPulseFadeOverride ?? 0) === 0 ? "its rest-state gray \u2014 no pulse, nothing playing." : `pulsing (image-derived fade=${opts.bpmPulseFadeOverride}).`}`
};
var patternLengthChrome = {
  id: "patternLength",
  name: "Pattern length controls",
  cells: rect(30, 32, 0, 0),
  resolve: (col, _row, opts) => {
    if (col === 30 || col === 32) return constant(CC.controlButton, "COLORS.controlColors.controlButton");
    const rgb = patternLengthReadoutColor(opts.patternLength);
    return { rgb, hex: rgbToHex(rgb), source: "formula", citation: "ported-formulas.patternLengthReadoutColor (PixelGridUIView.swift:2170-2171, vm.patternLength default 32) via hsbToRgb, opaque" };
  },
  describe: (opts) => `Pattern length controls, columns 30-32. The center readout (col 31) encodes the current length (${opts.patternLength} steps) as a hue.`
};
var jams = {
  id: "jams",
  name: "Jams button",
  cells: rect(JAMS.colStart, JAMS.colEnd, JAMS.row, JAMS.row),
  resolve: (_c, _r, o) => constant(o.hasSavedJams ? CC.jamsActive : CC.jamsDim, "COLORS.controlColors.jamsDim/jamsActive"),
  describe: (o) => `Jams button, columns ${JAMS.colStart}-${JAMS.colEnd}. ${o.hasSavedJams ? "Saved jams exist." : "No saved jams."}`
};
function literal(rgb, citation) {
  return { rgb, hex: rgbToHex(rgb), source: "formula", citation };
}
var shakeUsb = {
  id: "shakeUsb",
  name: "Shake indicator",
  cells: rect(34, 35, 0, 0),
  resolve: () => {
    const white = Math.round(SHAKE_INDICATOR_IDLE_WHITE * 255);
    return literal({ r: white, g: white, b: white }, "ported-formulas.SHAKE_INDICATOR_IDLE_WHITE (PixelGridUIView.swift:2179-2180), opaque \u2014 not shaking");
  },
  describe: () => "Shake indicator, columns 34-35. Not shaking."
};
var usbIndicator = {
  id: "usbIndicator",
  name: "USB MIDI indicator",
  cells: rect(36, 37, 0, 0),
  resolve: () => {
    const white = Math.round(USB_INDICATOR_OFF.white * 255);
    return composited({ r: white, g: white, b: white }, USB_INDICATOR_OFF.alpha, "formula", "ported-formulas.USB_INDICATOR_OFF (PixelGridUIView.swift:2223, no USB devices), composited over COLORS.gridBackgroundColor");
  },
  describe: () => "USB MIDI indicator, columns 36-37. No USB devices connected. Cols 36-43 never row-swap, so this stays at the visual top."
};
var btIndicator = {
  id: "btIndicator",
  name: "Bluetooth MIDI indicator",
  cells: rect(38, 39, 0, 0),
  resolve: () => composited(BT_INDICATOR_OFF.rgb, BT_INDICATOR_OFF.alpha, "formula", "ported-formulas.BT_INDICATOR_OFF (PixelGridUIView.swift:2254, disconnected), composited over COLORS.gridBackgroundColor"),
  describe: () => "Bluetooth MIDI indicator, columns 38-39. No paired device."
};
function trackForRow(row) {
  for (const key of ["melody", "chords", "bass", "rhythm"]) {
    const t = TRACKS[key];
    if (row >= t.startRow && row <= t.endRow) return { track: key, localRow: row - t.startRow, height: t.height };
  }
  return null;
}
var trackSections = {
  id: "trackSections",
  name: "Section columns (track rows)",
  cells: rect(SECTIONS.startCol, SECTIONS.endCol, 2, GRID_LAYOUT.rows - 3),
  resolve: (col, row, opts) => {
    const sectionIndex = col - SECTIONS.startCol;
    const isActive = sectionIndex === opts.activeSectionIndex;
    if (opts.populatedSectionIndices.includes(sectionIndex)) {
      if (!isActive) {
        throw new Error(`trackSections: section ${sectionIndex} is in populatedSectionIndices but inactive (activeSectionIndex=${opts.activeSectionIndex}) \u2014 the "dim populated inactive section" branch (SequencerViewModel.swift:4658-4662) isn't ported (unverified, unexercised).`);
      }
      const hasNote = opts.sectionThumbnailNoteRows.includes(row);
      if (!hasNote) {
        const white2 = Math.round(SECTION_THUMBNAIL_EMPTY_CELL_WHITE * 255);
        return literal({ r: white2, g: white2, b: white2 }, "ported-formulas.SECTION_THUMBNAIL_EMPTY_CELL_WHITE (SequencerViewModel.swift:4649-4651, populated section, this row has no note onset), opaque");
      }
      const info = trackForRow(row);
      if (!info) {
        throw new Error(`trackSections: row ${row} is in sectionThumbnailNoteRows but doesn't map to any track (trackForRow returned null) \u2014 should be unreachable for rows 2-21.`);
      }
      if (info.track === "rhythm") {
        const slot = drumSlotForRow(info.localRow, opts.currentDrumBank);
        const note2 = colorForPitch(slot);
        return literal(asRgb(note2), `ported-formulas.drumSlotForRow(localRow=${info.localRow}, drumBank=${opts.currentDrumBank}) (SequencerViewModel.swift:4606-4608) -> generated colorForPitch(slot) (SequencerViewModel.swift:4626-4629, deliberately NOT colorForDrum), opaque`);
      }
      const pitchClass = noteIndicatorPitchClass(info.track, info.localRow, info.height, opts.rootNote, opts.isMajorQuality, opts.melodyIntervalModeMusical, (opts.trackSet[info.track] ?? 1) - 1, opts.noteIntervalMode[info.track]);
      const note = colorForPitch(pitchClass);
      return literal(asRgb(note), `ported-formulas.noteIndicatorPitchClass (reused: SequencerViewModel.swift:4627-4645 uses the SAME IntervalPitchMapper table this file already ports for col 3, at default set/scale) -> generated colorForPitch(), opaque (SequencerViewModel.swift:4635-4645/4661)`);
    }
    const white = Math.round(SECTION_THUMBNAIL_WHITE * 255);
    const alpha = sectionThumbnailAlpha(isActive);
    return composited(
      { r: white, g: white, b: white },
      alpha,
      "formula",
      "ported-formulas.SECTION_THUMBNAIL_WHITE + sectionThumbnailAlpha (SequencerViewModel.swift:4595-4604, empty-section branch), composited over COLORS.gridBackgroundColor"
    );
  },
  describe: (opts) => `Song section thumbnails, columns ${SECTIONS.startCol}-${SECTIONS.endCol}, rows 2-21. Section ${opts.activeSectionIndex} is active${opts.populatedSectionIndices.length ? `; populated: ${opts.populatedSectionIndices.join(", ")}` : "; all 8 sections empty"}.`
};
var wledControlBar = {
  id: "controlBarWled",
  name: "WLED",
  cells: rect(CONTROL_BAR.wled.startCol, CONTROL_BAR.wled.endCol, GRID_LAYOUT.controlBarRow, GRID_LAYOUT.controlBarRow),
  resolve: (col, _row, opts) => {
    const index = col - CONTROL_BAR.wled.startCol;
    const pixelCount = CONTROL_BAR.wled.endCol - CONTROL_BAR.wled.startCol + 1;
    const hue = wledGradientHue(index, pixelCount, opts.wledBaseHueOverride ?? void 0);
    const rgb = hsbToRgb(hue, 0.8, 0.8);
    return literal(rgb, "ported-formulas.wledGradientHue+hsbToRgb (PixelGridUIView.swift:3565-3577, enabled/rainbow-chase branch \u2014 masterEnabled was true in the reference capture); base hue is IMAGE-DERIVED (wall-clock animation phase, no fresh-session default \u2014 see ported-formulas.WLED_GRADIENT_BASE_HUE_IMAGE_DERIVED doc, or its per-state siblings when opts.wledBaseHueOverride is set), opaque");
  },
  describe: () => "WLED status, columns 0-3. Enabled, rainbow chase (animation phase captured from the reference, not a stable default)."
};
var linkControlBar = {
  id: "controlBarLink",
  name: "LINK",
  cells: rect(CONTROL_BAR.link.startCol, CONTROL_BAR.link.endCol, GRID_LAYOUT.controlBarRow, GRID_LAYOUT.controlBarRow),
  resolve: () => literal(CONTROL_BAR_BASE_BLACK, "ported-formulas.CONTROL_BAR_BASE_BLACK (PixelGridUIView.swift:3546, FeatureFlags.enableAbletonLink=false \u2014 never drawn, row-23 base clear shows through), opaque"),
  describe: () => "Ableton Link status, columns 5-7. Feature disabled at compile time \u2014 never drawn."
};
var modeControlBar = {
  id: "controlBarMode",
  name: "MODE",
  cells: rect(CONTROL_BAR.mode.startCol, CONTROL_BAR.mode.endCol, GRID_LAYOUT.controlBarRow, GRID_LAYOUT.controlBarRow),
  resolve: (_col, _row, opts) => {
    if (opts.remoteSessionActive) {
      return literal(MODE_BUTTON_REMOTE_ACTIVE, "ported-formulas.MODE_BUTTON_REMOTE_ACTIVE (PixelGridUIView.swift:3611-3613, currentRemoteRoomCode != nil \u2014 wins over vm.syncMode), opaque");
    }
    const bySyncMode = { free: MODE_BUTTON_FREE, orchestraHost: MODE_BUTTON_HOST, orchestraFollower: MODE_BUTTON_FOLLOWER };
    const citationBySyncMode = {
      free: "ported-formulas.MODE_BUTTON_FREE (PixelGridUIView.swift:3609-3630, vm.syncMode .free)",
      orchestraHost: "ported-formulas.MODE_BUTTON_HOST (PixelGridUIView.swift:3619-3621, vm.syncMode .orchestraHost)",
      orchestraFollower: "ported-formulas.MODE_BUTTON_FOLLOWER (PixelGridUIView.swift:3617-3618, vm.syncMode .orchestraFollower)"
    };
    return literal(bySyncMode[opts.syncMode], citationBySyncMode[opts.syncMode] + ", opaque");
  },
  describe: (opts) => `Sync mode, columns 8-9. ${opts.remoteSessionActive ? "Remote session active." : `${opts.syncMode} (no remote session).`}`
};
function deviceIndicatorColorFor(col, opts) {
  const index = col - DEVICE_INDICATOR_START_COL;
  if (index < 0 || index >= DEVICE_INDICATOR_MAX_SLOTS) return null;
  const participant = opts.remoteParticipants[index];
  if (!participant) return null;
  const rgb = participant.isHost ? DEVICE_INDICATOR_HOST_GREEN : DEVICE_INDICATOR_FOLLOWER_GREEN;
  return literal(
    rgb,
    `ported-formulas.DEVICE_INDICATOR_${participant.isHost ? "HOST" : "FOLLOWER"}_GREEN (PixelGridUIView.swift:3992-4026, participant ${index}${participant.isHost ? ", host" : ", follower"}), opaque`
  );
}
var syncControlBar = {
  id: "controlBarSync",
  name: "SYNC",
  cells: rect(CONTROL_BAR.sync.startCol, CONTROL_BAR.sync.endCol, GRID_LAYOUT.controlBarRow, GRID_LAYOUT.controlBarRow),
  resolve: (col, _row, opts) => {
    const deviceOverride = deviceIndicatorColorFor(col, opts);
    if (deviceOverride) return deviceOverride;
    const hasSession = opts.remoteSessionActive;
    const connected = hasSession && opts.remoteParticipants.length > 0;
    const middleCol = Math.floor((CONTROL_BAR.sync.startCol + CONTROL_BAR.sync.endCol) / 2);
    const isHostSelf = hasSession && (opts.remoteParticipants[0]?.isHost ?? false);
    if (isHostSelf && col === middleCol) {
      return literal(SYNC_BUTTON_HOST_GOLD, "ported-formulas.SYNC_BUTTON_HOST_GOLD (PixelGridUIView.swift:3675-3678, isHost && hasSession, middle column), opaque");
    }
    if (connected) {
      return literal(SYNC_BUTTON_CONNECTED, "ported-formulas.SYNC_BUTTON_CONNECTED (PixelGridUIView.swift:3657-3660, remoteParticipants non-empty && hasSession), opaque");
    }
    return literal(SYNC_BUTTON_IDLE, "ported-formulas.SYNC_BUTTON_IDLE (PixelGridUIView.swift:3645-3679, idle \u2014 no session, not advertising/browsing), opaque");
  },
  describe: (opts) => `Session sync, columns 10-12. ${opts.remoteSessionActive && opts.remoteParticipants.length > 0 ? "Connected." : "Idle (offline)."}`
};
var controlBarSectionsActive = {
  id: "controlBarSectionsActive",
  name: "Section buttons (cols 36-37)",
  cells: rect(36, 37, GRID_LAYOUT.controlBarRow, GRID_LAYOUT.controlBarRow),
  resolve: (_col, _row, opts) => opts.sectionPlayEnabled ? literal(SECTION_PLAY_ACTIVE, "ported-formulas.SECTION_PLAY_ACTIVE (PixelGridUIView.swift:3688-3714, section play active branch), opaque. Cols 36-37 never row-swap (visualRowForCell only swaps cols 0-35), so this draws at visual row 23.") : literal(SECTION_PLAY_DIM, "ported-formulas.SECTION_PLAY_DIM (PixelGridUIView.swift:3688-3714, dim-green branch \u2014 no bank loop, section play not active), opaque. Cols 36-37 never row-swap (visualRowForCell only swaps cols 0-35), so this draws at visual row 23."),
  describe: (opts) => `Section-play button, columns 36-37. ${opts.sectionPlayEnabled ? "Active." : "Not active."}`
};
function rowOneOverviewZone() {
  const barCols = new Set(BAR_COLS);
  const beatCols = /* @__PURE__ */ new Set([8, 16, 24, 32]);
  return {
    id: "rowOneOverview",
    name: "Step overview (row 1)",
    // Only the step columns (4-35) — cols 0-3 and 36-43 on row 1 are
    // claimed separately below (rowOneGutter / rowOneBankSelector) so no
    // two zones ever cover the same cell.
    cells: rect(GRID_LAYOUT.stepColumns.startCol, GRID_LAYOUT.stepColumns.endCol, 1, 1),
    resolve: (col, _row, opts) => {
      const isPlayhead = col === GRID_LAYOUT.stepColumns.startCol + opts.currentStep;
      const isPulse = opts.pulseStep !== null && col === GRID_LAYOUT.stepColumns.startCol + opts.pulseStep;
      const c = overviewStepMarkerColor({
        isPulse,
        isPlayhead,
        isBar: barCols.has(col),
        isBeat: beatCols.has(col),
        isPlaying: opts.isPlaying
      });
      return {
        rgb: hexRgb(c.hex),
        hex: c.hex,
        source: "formula",
        citation: `generated overviewStepMarkerColor() (PixelGridUIView.swift renderRow1StepMarkers) \u2014 isPulse=${isPulse}, isPlayhead=${isPlayhead}, isPlaying=${opts.isPlaying}`
      };
    },
    describe: (opts) => `Step-overview row: playhead at step ${opts.currentStep}${opts.isPlaying ? ` (playing${opts.pulseStep !== null ? `, pulse at step ${opts.pulseStep}` : ""})` : " (paused)"}, with bar/beat tick marks every 4 and 8 steps.`
  };
}
var rowOneGutter = {
  id: "rowOneGutter",
  name: "Step overview (key gutter, cols 0-3)",
  cells: rect(0, 3, 1, 1),
  resolve: () => literal({ r: ROW1_GUTTER_WHITE * 255, g: ROW1_GUTTER_WHITE * 255, b: ROW1_GUTTER_WHITE * 255 }, "ported-formulas.ROW1_GUTTER_WHITE (PixelGridUIView.swift:2452-2454), opaque"),
  describe: () => "Step overview, key gutter (cols 0-3). Flat white(0.13) \u2014 the track-label margin of the step-overview row."
};
var rowOneBankSelector = {
  id: "rowOneBankSelector",
  name: "Pattern bank selector (row 1, cols 36-43)",
  cells: rect(36, 43, 1, 1),
  resolve: (col, _row, opts) => {
    const bankIndex = col - 36;
    const hasData = opts.populatedBankIndices.includes(bankIndex);
    const alpha = bankSelectorAlpha(bankIndex, opts.activeBankIndex, hasData);
    const white = { r: 255, g: 255, b: 255 };
    return composited(
      white,
      alpha,
      "formula",
      "ported-formulas.bankSelectorAlpha (PixelGridUIView.swift:3406-3428, renderBankSelector) composited over COLORS.gridBackgroundColor"
    );
  },
  describe: (opts) => `Pattern bank selector, row 1, columns 36-43 (8 banks). Bank ${opts.activeBankIndex} active${opts.populatedBankIndices.length ? `; populated: ${opts.populatedBankIndices.join(", ")}` : "; none populated"}.`
};
var row22Overview = {
  id: "row22Overview",
  name: "Row 22 overview (cols 4-35)",
  cells: rect(GRID_LAYOUT.stepColumns.startCol, GRID_LAYOUT.stepColumns.endCol, 22, 22),
  resolve: (col, _row, opts) => {
    const step = col - GRID_LAYOUT.stepColumns.startCol;
    const active = opts.overviewActiveStepTrack.find((a) => a.step === step);
    if (active) {
      return composited(
        asRgb(COLORS.trackColors[active.track]),
        OVERVIEW_ROW22_ACTIVE_ALPHA,
        "formula",
        `ported-formulas.OVERVIEW_ROW22_ACTIVE_ALPHA (PixelGridUIView.swift:3498-3508, step ${step}'s first active track is ${active.track}), COLORS.trackColors.${active.track} composited over COLORS.gridBackgroundColor`
      );
    }
    if (step === opts.currentStep) {
      const white = (opts.isPlaying ? ROW22_PLAYHEAD_PLAYING_WHITE : ROW22_PLAYHEAD_PAUSED_WHITE) * 255;
      return literal(
        { r: white, g: white, b: white },
        `ported-formulas.ROW22_PLAYHEAD_${opts.isPlaying ? "PLAYING" : "PAUSED"}_WHITE (PixelGridUIView.swift:3502-3506, step ${step} is the current step with no active track), opaque`
      );
    }
    return null;
  },
  describe: (opts) => `Row 22 overview, columns 4-35. ${opts.overviewActiveStepTrack.length ? `${opts.overviewActiveStepTrack.length} step(s) with an active track.` : "No active-track steps (true empty pattern)."}`
};
var CONTROL_BAR_ZONES = ["wled", "link", "mode", "sync"];
var ZONES = [
  // row 0 (bottom controls)
  playStop,
  undo,
  redo,
  scaleMajor,
  scaleMinor,
  scaleType,
  rootNoteZone(),
  ghostToggle,
  bpmChrome,
  patternLengthChrome,
  shakeUsb,
  usbIndicator,
  btIndicator,
  jams,
  // row 1: step-overview markers (playhead/bar/beat) — see rowOneOverviewZone doc.
  rowOneOverviewZone(),
  rowOneGutter,
  rowOneBankSelector,
  // rows 2-21: track bands
  col1SoloIndicator,
  col2FxColumnZone("melodyFx", "Melody", "melody", TRACKS.melody.startRow, TRACKS.melody.endRow, TRACKS.melody.height),
  col2FxColumnZone("chordsFx", "Chords", "chords", TRACKS.chords.startRow, TRACKS.chords.endRow, TRACKS.chords.height),
  col2FxColumnZone("bassFx", "Bass", "bass", TRACKS.bass.startRow, TRACKS.bass.endRow, TRACKS.bass.height),
  col2FxColumnZone("rhythmFx", "Rhythm", "rhythm", TRACKS.rhythm.startRow, TRACKS.rhythm.endRow, TRACKS.rhythm.height),
  col3RhythmBankSelector,
  col3NoteIndicatorZone("melodyNote3", "Melody", "melody", TRACKS.melody.startRow, TRACKS.melody.endRow, TRACKS.melody.height),
  col3NoteIndicatorZone("chordsNote3", "Chords", "chords", TRACKS.chords.startRow, TRACKS.chords.endRow, TRACKS.chords.height),
  col3NoteIndicatorZone("bassNote3", "Bass", "bass", TRACKS.bass.startRow, TRACKS.bass.endRow, TRACKS.bass.height),
  trackKeyColumnZone("melodyKey", "Melody", "melody"),
  trackKeyColumnZone("chordsKey", "Chords", "chords"),
  trackKeyColumnZone("bassKey", "Bass", "bass"),
  rhythmKeyColumn,
  trackStepsZone("melodySteps", "Melody", "melody"),
  trackStepsZone("chordsSteps", "Chords", "chords"),
  trackStepsZone("bassSteps", "Bass", "bass"),
  trackStepsZone("rhythmSteps", "Rhythm", "rhythm"),
  trackSections,
  // row 22 (GRID_LAYOUT.overviewRow1): the in-track playhead/bar system.
  // row22Overview (cols 4-35) resolves active-track color first, the
  // assumed-parked-playhead marker at col 4 second, and a documented GAP
  // (same net COLORS.cellOffColor as the true empty pattern) otherwise —
  // see its own doc for the round-9 precedence fix.
  row22Overview,
  // row 23: control bar
  wledControlBar,
  linkControlBar,
  modeControlBar,
  syncControlBar,
  {
    id: "controlBarRest",
    name: "Control bar (unlabeled columns)",
    cells: rect(CONTROL_BAR.wled.endCol + 1, GRID_LAYOUT.stepColumns.endCol, GRID_LAYOUT.controlBarRow, GRID_LAYOUT.controlBarRow).filter(([c]) => !CONTROL_BAR_ZONES.some((z) => c >= GRID_LAYOUT.controlBar[z].startCol && c <= GRID_LAYOUT.controlBar[z].endCol)),
    resolve: (col, _row, opts) => deviceIndicatorColorFor(col, opts) ?? literal(CONTROL_BAR_BASE_BLACK, "ported-formulas.CONTROL_BAR_BASE_BLACK (PixelGridUIView.swift:3536-3538, row-23 base clear \u2014 no named zone covers this column here), opaque"),
    describe: () => "Control bar, unlabeled columns. Row-23 base clear (pure black), not COLORS.cellOffColor \u2014 or a device indicator dot if a sync participant claims this column (see DEVICE_INDICATOR_*)."
  },
  controlBarSectionsActive,
  {
    id: "controlBarSectionsClear",
    name: "Section buttons (cols 38-43)",
    cells: rect(38, 43, GRID_LAYOUT.controlBarRow, GRID_LAYOUT.controlBarRow),
    resolve: () => constant(CC.clearSections, "COLORS.controlColors.clearSections"),
    describe: () => "Section buttons 3-8: no content."
  }
];

// src/render.ts
var SUPPORTED_STATES = ["empty"];
function fail(message) {
  throw new Error(`renderPbGrid: ${message}`);
}
function validate(ctx, options) {
  if (!ctx || typeof ctx.fillRect !== "function") {
    fail("first argument must be a CanvasRenderingContext2D-like object with fillRect() (got " + typeof ctx + ")");
  }
  if (!options || typeof options !== "object") fail("options is required");
  const {
    layout,
    state,
    rootNote,
    isMajorQuality,
    showGhostNotes,
    canUndo,
    canRedo,
    hasSavedJams,
    applyDeviations,
    syncMode,
    remoteSessionActive,
    remoteParticipants,
    sectionPlayEnabled,
    wledBaseHueOverride,
    populatedBankIndices,
    populatedSectionIndices,
    sectionThumbnailNoteRows,
    mutePerTrack,
    soloedTrack,
    currentStep,
    isPlaying,
    pulseStep,
    bpmPulseFadeOverride,
    trackLevelsOverride,
    fxPhysicsOverride,
    trackVolumes,
    fxAmount,
    fxMode,
    trackSet,
    noteIntervalMode
  } = options;
  const TRACK_KEYS = ["melody", "chords", "bass", "rhythm"];
  if (!layout || layout.mode !== "native" && layout.mode !== "fit") {
    fail(`options.layout.mode must be "native" or "fit", got ${JSON.stringify(layout?.mode)}`);
  }
  if (layout.mode === "native") {
    if (!Number.isFinite(layout.pitch) || layout.pitch <= 0) fail(`options.layout.pitch must be a positive finite number, got ${layout.pitch}`);
  } else {
    if (!Number.isFinite(layout.boundsWidth) || layout.boundsWidth <= 0) fail(`options.layout.boundsWidth must be a positive finite number, got ${layout.boundsWidth}`);
    if (!Number.isFinite(layout.boundsHeight) || layout.boundsHeight <= 0) fail(`options.layout.boundsHeight must be a positive finite number, got ${layout.boundsHeight}`);
  }
  if (layout.scale !== void 0 && (!Number.isFinite(layout.scale) || layout.scale <= 0)) {
    fail(`options.layout.scale must be a positive finite number, got ${layout.scale}`);
  }
  if (layout.mode === "native") {
    if (layout.offsetX !== void 0 && !Number.isFinite(layout.offsetX)) fail(`options.layout.offsetX must be a finite number, got ${layout.offsetX}`);
    if (layout.offsetY !== void 0 && !Number.isFinite(layout.offsetY)) fail(`options.layout.offsetY must be a finite number, got ${layout.offsetY}`);
  }
  if (state !== void 0 && !SUPPORTED_STATES.includes(state)) {
    fail(`options.state ${JSON.stringify(state)} is not supported yet. Supported: ${SUPPORTED_STATES.join(", ")}`);
  }
  if (rootNote !== void 0 && (!Number.isInteger(rootNote) || rootNote < 0 || rootNote > 11)) {
    fail(`options.rootNote must be an integer 0-11 (0=C), got ${rootNote}`);
  }
  for (const [key, val] of Object.entries({ isMajorQuality, showGhostNotes, canUndo, canRedo, hasSavedJams, applyDeviations, remoteSessionActive, sectionPlayEnabled, isPlaying })) {
    if (val !== void 0 && typeof val !== "boolean") fail(`options.${key} must be a boolean, got ${typeof val}`);
  }
  if (currentStep !== void 0 && (!Number.isInteger(currentStep) || currentStep < 0 || currentStep > 31)) {
    fail(`options.currentStep must be an integer 0-31, got ${currentStep}`);
  }
  if (pulseStep !== void 0 && pulseStep !== null && (!Number.isInteger(pulseStep) || pulseStep < 0 || pulseStep > 31)) {
    fail(`options.pulseStep must be an integer 0-31 or null, got ${pulseStep}`);
  }
  if (bpmPulseFadeOverride !== void 0 && bpmPulseFadeOverride !== null && !Number.isFinite(bpmPulseFadeOverride)) {
    fail(`options.bpmPulseFadeOverride must be a finite number or null, got ${bpmPulseFadeOverride}`);
  }
  if (syncMode !== void 0 && !["free", "orchestraHost", "orchestraFollower"].includes(syncMode)) {
    fail(`options.syncMode must be "free", "orchestraHost" or "orchestraFollower", got ${JSON.stringify(syncMode)}`);
  }
  if (remoteParticipants !== void 0) {
    if (!Array.isArray(remoteParticipants) || remoteParticipants.some((p) => !p || typeof p !== "object" || typeof p.isHost !== "boolean")) {
      fail("options.remoteParticipants must be an array of { isHost: boolean }");
    }
  }
  if (wledBaseHueOverride !== void 0 && wledBaseHueOverride !== null && !Number.isFinite(wledBaseHueOverride)) {
    fail(`options.wledBaseHueOverride must be a finite number or null, got ${wledBaseHueOverride}`);
  }
  if (populatedBankIndices !== void 0) {
    if (!Array.isArray(populatedBankIndices) || populatedBankIndices.some((n) => !Number.isInteger(n) || n < 0 || n > 7)) {
      fail("options.populatedBankIndices must be an array of integers 0-7");
    }
  }
  if (populatedSectionIndices !== void 0) {
    if (!Array.isArray(populatedSectionIndices) || populatedSectionIndices.some((n) => !Number.isInteger(n) || n < 0 || n > 7)) {
      fail("options.populatedSectionIndices must be an array of integers 0-7");
    }
  }
  if (sectionThumbnailNoteRows !== void 0) {
    if (!Array.isArray(sectionThumbnailNoteRows) || sectionThumbnailNoteRows.some((n) => !Number.isInteger(n) || n < 2 || n > 21)) {
      fail("options.sectionThumbnailNoteRows must be an array of integers 2-21");
    }
  }
  if (mutePerTrack !== void 0) {
    if (!mutePerTrack || typeof mutePerTrack !== "object" || Object.entries(mutePerTrack).some(([k, v]) => !TRACK_KEYS.includes(k) || v !== void 0 && typeof v !== "boolean")) {
      fail("options.mutePerTrack must be an object of { melody?, chords?, bass?, rhythm?: boolean }");
    }
  }
  if (soloedTrack !== void 0 && soloedTrack !== null && !TRACK_KEYS.includes(soloedTrack)) {
    fail(`options.soloedTrack must be "melody", "chords", "bass", "rhythm" or null, got ${JSON.stringify(soloedTrack)}`);
  }
  const MAX_SETS = { melody: 2, chords: 2, bass: 3, rhythm: 1 };
  if (trackSet !== void 0) {
    if (!trackSet || typeof trackSet !== "object" || Object.entries(trackSet).some(([k, v]) => !TRACK_KEYS.includes(k) || v !== void 0 && (!Number.isInteger(v) || v < 1 || v > MAX_SETS[k]))) {
      fail("options.trackSet must be an object of { melody?, chords?, bass?, rhythm?: number }, each an integer within that track's SetToggleManager.maxSets (melody/chords 1-2, bass 1-3, rhythm 1)");
    }
  }
  for (const [key, val] of Object.entries({ trackLevelsOverride, fxPhysicsOverride })) {
    if (val !== void 0 && val !== null) {
      if (typeof val !== "object" || Object.entries(val).some(([k, v]) => !TRACK_KEYS.includes(k) || typeof v !== "number" || !Number.isFinite(v))) {
        fail(`options.${key} must be an object of { melody?, chords?, bass?, rhythm?: number } or null`);
      }
    }
  }
  if (trackVolumes !== void 0) {
    if (!trackVolumes || typeof trackVolumes !== "object" || Object.entries(trackVolumes).some(([k, v]) => !TRACK_KEYS.includes(k) || typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 1.5)) {
      fail("options.trackVolumes must be an object of { melody?, chords?, bass?, rhythm?: number }, each finite in [0.0, 1.5] (SequencerViewModel.swift:3693-3699, setTrackVolume's clamp)");
    }
  }
  if (fxAmount !== void 0) {
    if (!fxAmount || typeof fxAmount !== "object" || Object.entries(fxAmount).some(([k, v]) => !TRACK_KEYS.includes(k) || typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 1)) {
      fail("options.fxAmount must be an object of { melody?, chords?, bass?, rhythm?: number }, each finite in [0.0, 1.0] (SequencerViewModel.swift:1446-1467, setFXSend/setFXDrive/setFXFilter's shared clamp)");
    }
  }
  if (fxMode !== void 0) {
    if (!fxMode || typeof fxMode !== "object" || Object.entries(fxMode).some(([k, v]) => !TRACK_KEYS.includes(k) || v !== void 0 && v !== "send" && v !== "drive")) {
      fail("options.fxMode must be an object of { melody?, chords?, bass?, rhythm?: 'send' | 'drive' } \u2014 'filter' is a real app mode (SequencerViewModel.swift:1352-1358) but its color formula (PixelGridUIView.swift:2667-2695, fxFilterColor) is not ported here, so it is rejected rather than silently rendered through the send/drive fill formula");
    }
  }
  if (noteIntervalMode !== void 0) {
    if (!noteIntervalMode || typeof noteIntervalMode !== "object" || Object.entries(noteIntervalMode).some(([k, v]) => !TRACK_KEYS.includes(k) || v !== void 0 && v !== "thirds" && v !== "musical" && v !== "seconds")) {
      fail("options.noteIntervalMode must be an object of { melody?, chords?, bass?, rhythm?: 'thirds' | 'musical' | 'seconds' } \u2014 'fourths'/'fifths'/'sevenths' are real app modes (IntervalMode.swift:14-35) but not ported here, so they are rejected rather than silently rendered through the wrong skip formula");
    }
  }
}
function deviationFor(constantPrefix, padSizePx) {
  const d = DEVIATIONS.find((x) => x.constant.startsWith(constantPrefix));
  if (!d || !isDeviationActive(d, padSizePx)) return null;
  return d.deviatingValueHex;
}
function renderPbGrid(ctx, options) {
  validate(ctx, options);
  const { layout, applyDeviations = true } = options;
  const scale = layout.scale ?? 1;
  const gapPtOrPx = COLORS.gapSize;
  let pixelSize, gapPx, offsetX, offsetY, canvasWidth, canvasHeight;
  if (layout.mode === "native") {
    gapPx = gapPtOrPx * scale;
    pixelSize = layout.pitch - gapPx;
    if (pixelSize <= 0) fail(`options.layout.pitch (${layout.pitch}) must be greater than the gap size at this scale (${gapPx})`);
    offsetX = layout.offsetX ?? 0;
    offsetY = layout.offsetY ?? 0;
    canvasWidth = GRID_LAYOUT.columns * layout.pitch;
    canvasHeight = GRID_LAYOUT.rows * layout.pitch;
  } else {
    const fit = calculatePixelSize(layout.boundsWidth, layout.boundsHeight);
    pixelSize = fit.pixelSize * scale;
    gapPx = gapPtOrPx * scale;
    offsetX = fit.gridOffsetX * scale;
    offsetY = fit.gridOffsetY * scale;
    canvasWidth = layout.boundsWidth * scale;
    canvasHeight = layout.boundsHeight * scale;
    if (pixelSize <= 0) fail(`options.layout bounds (${layout.boundsWidth}x${layout.boundsHeight}) are too small to fit a ${GRID_LAYOUT.columns}x${GRID_LAYOUT.rows} grid`);
  }
  const pitch = pixelSize + gapPx;
  const stateOpts = { ...DEFAULT_EMPTY_STATE_OPTIONS, ...options };
  const gutterHex = applyDeviations ? deviationFor("GUTTER", pixelSize) ?? COLORS.gridBackgroundColor.hex : COLORS.gridBackgroundColor.hex;
  const padHex = applyDeviations ? deviationFor("PAD", pixelSize) ?? COLORS.cellOffColor.hex : COLORS.cellOffColor.hex;
  ctx.fillStyle = gutterHex;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  const gapsSeen = /* @__PURE__ */ new Set();
  for (let col = 0; col < GRID_LAYOUT.columns; col++) {
    for (let row = 0; row < GRID_LAYOUT.rows; row++) {
      const zone = ZONES.find((z) => z.cells.some(([c, r]) => c === col && r === row));
      let hex = padHex;
      if (zone) {
        const resolved = zone.resolve(col, row, stateOpts);
        if (resolved) hex = resolved.hex;
        else gapsSeen.add(zone.describe(stateOpts));
      }
      const visualRow = visualRowForCell(col, row);
      const x = offsetX + col * pitch;
      const y = offsetY + visualRow * pitch;
      ctx.fillStyle = hex;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    }
  }
  const deviationsApplied = applyDeviations ? DEVIATIONS.filter((d) => isDeviationActive(d, pixelSize)).map((d) => `${d.constant}: ${d.deviatingValueHex} instead of ${d.appValueHex}`) : [];
  return { pixelSize, gapPx, offsetX, offsetY, canvasWidth, canvasHeight, gaps: [...gapsSeen], deviationsApplied };
}

// src/a11y.ts
var STYLE_ID = "pbgrid-a11y-style";
function ensureStyle(doc) {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
.pbgrid-list { list-style: none; margin: 0.5rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 4px; max-height: 320px; overflow-y: auto; }
.pbgrid-opt { display: flex; align-items: center; gap: 0.5rem; min-height: 48px; padding: 0.4rem 0.6rem; border-radius: 6px; background: rgba(127,127,127,0.12); cursor: pointer; }
.pbgrid-opt[aria-selected="true"] { background: rgba(127,127,127,0.22); }
.pbgrid-opt:focus-visible { outline: 2px solid #ffffff; outline-offset: 2px; box-shadow: 0 0 0 4px #000000; }
.pbgrid-sw { flex: 0 0 auto; width: 1.8em; height: 1.8em; border-radius: 3px; border: 1px solid rgba(127,127,127,0.6); display: inline-flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; }
.pbgrid-nm { font-weight: 700; }
.pbgrid-de { flex: 1 0 100%; font-size: 0.85rem; opacity: 0.85; }
@media screen and (max-width: 639px) {
  .pbgrid-opt { min-height: 48px; }
}`;
  doc.head.appendChild(style);
}
function coordinateString(cells) {
  const cols = [...new Set(cells.map(([c]) => c))].sort((a, b) => a - b);
  const rows = [...new Set(cells.map(([, r]) => r))].sort((a, b) => a - b);
  const span = (n) => n.length === 1 ? `${n[0]}` : `${n[0]}-${n[n.length - 1]}`;
  return `col ${span(cols)}, row ${span(rows)}`;
}
function mountA11y(canvas, container, partialOpts = {}, state = "empty") {
  if (!SUPPORTED_STATES.includes(state)) {
    throw new Error(`mountA11y: state ${JSON.stringify(state)} is not supported. Supported: ${SUPPORTED_STATES.join(", ")}`);
  }
  const opts = { ...DEFAULT_EMPTY_STATE_OPTIONS, ...partialOpts };
  const doc = container.ownerDocument;
  ensureStyle(doc);
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    `Pixelboop pattern grid, 44 by 24 pads, ${state} state. ${ZONES.length} named regions are listed below with their coordinates, color and function.`
  );
  const list = doc.createElement("ul");
  list.className = "pbgrid-list";
  list.setAttribute("role", "listbox");
  list.setAttribute("aria-label", "Pixelboop grid regions");
  const items = [];
  let selected = 0;
  const typed = { buf: "", at: 0 };
  const setSelected = (n, moveFocus) => {
    selected = (n % items.length + items.length) % items.length;
    items.forEach((el, i) => {
      el.setAttribute("aria-selected", String(i === selected));
      el.tabIndex = i === selected ? 0 : -1;
    });
    if (moveFocus) items[selected]?.focus();
  };
  ZONES.forEach((zone, i) => {
    const resolvedSample = zone.resolve(zone.cells[0][0], zone.cells[0][1], opts);
    const swatchHex = resolvedSample ? resolvedSample.hex : COLORS.cellOffColor.hex;
    const ink = labelInk({ r: parseInt(swatchHex.slice(1, 3), 16), g: parseInt(swatchHex.slice(3, 5), 16), b: parseInt(swatchHex.slice(5, 7), 16) });
    const li = doc.createElement("li");
    li.className = "pbgrid-opt";
    li.setAttribute("role", "option");
    li.id = `pbgrid-opt-${i}`;
    li.tabIndex = i === 0 ? 0 : -1;
    li.setAttribute("aria-selected", String(i === 0));
    const sw = doc.createElement("span");
    sw.className = "pbgrid-sw";
    sw.setAttribute("aria-hidden", "true");
    sw.style.backgroundColor = swatchHex;
    sw.style.color = ink;
    sw.textContent = String(i + 1);
    const nm = doc.createElement("span");
    nm.className = "pbgrid-nm";
    nm.textContent = zone.name;
    const de = doc.createElement("span");
    de.className = "pbgrid-de";
    de.textContent = zone.describe(opts);
    li.setAttribute(
      "aria-label",
      `${zone.name}. ${coordinateString(zone.cells)}. ${resolvedSample ? `Color ${swatchHex}.` : "Not yet available \u2014 shown unlit."} ${zone.describe(opts)}`
    );
    li.append(sw, nm, de);
    li.addEventListener("focus", () => setSelected(i, false));
    li.addEventListener("click", () => setSelected(i, true));
    items.push(li);
    list.appendChild(li);
  });
  const onListKeyDown = (e) => {
    const n = items.length;
    if (!n) return;
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (selected + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (selected + n - 1) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else if (e.key === "Escape") {
      items[selected]?.setAttribute("aria-selected", "false");
      e.preventDefault();
      return;
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const now = Date.now();
      typed.buf = (now - typed.at > 800 ? "" : typed.buf) + e.key.toLowerCase();
      typed.at = now;
      const from = typed.buf.length > 1 ? 0 : 1;
      for (let k = from; k < n + from; k++) {
        const j = (selected + k) % n;
        if (ZONES[j].name.toLowerCase().startsWith(typed.buf)) {
          next = j;
          break;
        }
      }
    } else return;
    if (next >= 0) {
      e.preventDefault();
      setSelected(next, true);
    }
  };
  list.addEventListener("keydown", onListKeyDown);
  container.appendChild(list);
  return {
    destroy() {
      list.removeEventListener("keydown", onListKeyDown);
      list.remove();
    }
  };
}

// src/pending-constants.ts
var PENDING_CONSTANTS = [
  {
    expectedName: "COLORS.controlColors.undoActive / not applicable \u2014 active/inactive ARE exported",
    swiftSource: "PixelGridUIView.swift:972-973 (COLORS.controlColors.active/inactive) \u2014 RESOLVED, in use",
    literalFound: 'Not a gap. Kept here only to record: the reference screenshot shows Undo as controlColors.active (#878787), implying that capture session had undo history despite an empty grid. This renderer defaults canUndo/canRedo to false (semantically "fresh") \u2014 see zones.ts EmptyStateOptions doc for that one known, deliberate divergence from the reference.',
    affects: "row 0, col 4 (Undo) only, and only when the caller does not override canUndo"
  }
];
function describePendingConstants() {
  return PENDING_CONSTANTS.map((p) => `${p.expectedName}: GAP, rendered unlit. ${p.affects}. Swift lead: ${p.swiftSource}. Value seen in reference: ${p.literalFound}`);
}
export {
  COLORS,
  DEFAULT_EMPTY_STATE_OPTIONS,
  DEVIATIONS,
  GRID_LAYOUT,
  PENDING_CONSTANTS,
  SUPPORTED_STATES,
  ZONES,
  describeDeviations,
  describePendingConstants,
  mountA11y,
  renderPbGrid
};
//# sourceMappingURL=pbgrid.js.map
