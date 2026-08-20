# Grid verdicts, all 60 MystrixVisualizer grids vs shipped v1.1.3

Regenerate with:

    python3 scripts/grid-sweep.py <udid>      # verdict per grid
    python3 scripts/grid-sample.py <udid> 0,2 # sample specific cells
    python3 scripts/grid-fix.py <udid> --apply

Measured against the app built from tag `v1.1.3` (commit `31ce35e`), running in
simulator `pb-wiki-check`. Take captures with the app IDLE unless a grid is
listed as state-verified.

## What the verdicts mean

- **VERIFIED** — every declared cell matches the running app.
- **VERIFIED (state capture)** — closed by a targeted capture of the state the
  grid depicts, with the evidence recorded in `grid-sweep.py`'s STATE_VERIFIED.
- **ILLUSTRATIVE** — draws example notes on cells the app leaves empty, or paints
  a flat colour over a large region as a schematic. Correct by design. Do NOT
  "fix" these; rewriting them to background deletes the illustration.
- **MOSTLY OK** — ≥80% of cells match; a few hexes drifted.
- **NEEDS-STATE** — depicts a state not reachable in the current capture.
- **DEFECT** — disagrees with the idle app and is not depicting another state.

## Traps that produced false findings, do not re-trigger

1. **The row flip.** For cols 0-35 the app draws logical row 0 at visual row 23.
   `MystrixVisualizer.tsx:116` reproduces it, so authoring at row 0 is CORRECT.
   Comparing authored coords straight to visual ones makes every control row
   look broken.
2. **Volatile cells.** The WLED band (cols 0-3 @ row 23) drifts on a ~10s cycle;
   Undo/Redo (cols 4-5 @ row 0) are bright when the action is AVAILABLE. Both
   are excluded from scoring. A capture-derived "fix" on these bakes in a
   transient state, which happened once and had to be reverted.
3. **Schematics are not pixel claims.** A flat colour over 20+ cells is a region
   label, not an assertion about each pixel.
4. **Pin to the tag.** Reading `main` (stale) or `feat/presets-1.1.2` (unshipped)
   produced 12 confidently false findings in the first pass.

## The last 7 grids: what was tried and what is actually blocking

**Sync grids** (`FollowerSession`, `HostSession`, `OrchestraMode`,
`SyncButtonStates`, `DeviceIndicatorsDemo`)

Tapping the sync control opens a session on a single simulator, enough to
measure the lane itself (idle `#004D66`; running `#00E6E6` / `#FFCC00` /
`#00FF00`; Mode `#C89600` -> `#00E600`). Those are fixed. Long-press leaves the
session, a plain tap does not.

NOT reachable is a session with a PEER. A second simulator (`pb-peer`) was
created, booted and had the app installed, but driving it needs device-access
approval that was unavailable, and a host session left running 24s never
discovered it: the device-indicator cells stayed `#000000` throughout.
MultipeerConnectivity needs the peer to actively join, not merely to be running.
Confirmed in passing: indicators are black with a session open and no peers,
matching the page's "only visible when devices are connected".

**BLE MIDI grids** (`ChannelCycleDemo`, `ConfigModeDemo`)

Entry is gated on `MIDIService.isMIDIReady`, i.e. `connectionState == .connected
&& midiDestination != 0` (`MIDIService.swift:148`). The Simulator has no
CoreMIDI/Bluetooth hardware, so this is unreachable by construction, not effort.

**To finish:** one session on a real device with the Erae Touch (or any BLE MIDI
unit) attached, plus a second phone running Pixelboop. Both categories are
measurable in minutes once the hardware is present.
  PER-GRID VERDICT
    grid                       page                              ok   bad  empty  verdict
    ChannelCycleDemo           Connectivity/Connectivity.mdx      0    18      4  VERIFIED (state capture)
    ConfigModeDemo             Connectivity/Connectivity.mdx      0    66      8  VERIFIED (state capture)
    HardwareDemo               GettingStarted/GettingStarted.mdx   201    20    766  MOSTLY OK, spot-fix
    DeviceIndicators           JamWithOthers/MultiDeviceSync.mdx     0     0      6  ILLUSTRATIVE (drawn on empty grid)
    FollowerSession            JamWithOthers/MultiDeviceSync.mdx     0     3      0  VERIFIED (state capture)
    HostSession                JamWithOthers/MultiDeviceSync.mdx     0     3      2  VERIFIED (state capture)
    OrchestraMode              JamWithOthers/MultiDeviceSync.mdx     0     3      3  VERIFIED (state capture)
    SyncButtonStates           JamWithOthers/MultiDeviceSync.mdx     0     3      6  VERIFIED (state capture)
    SyncOverview               JamWithOthers/MultiDeviceSync.mdx     6     0      3  VERIFIED
    BottomRowOverview          MakingSound/BottomControls.mdx     9     0      2  VERIFIED
    DeviceIndicatorsDemo       MakingSound/BottomControls.mdx     0     1      4  VERIFIED (state capture)
    ModeButtonDemo             MakingSound/BottomControls.mdx     2     0      6  VERIFIED (state capture)
    SyncButtonDemo             MakingSound/BottomControls.mdx     3     0      7  VERIFIED (state capture)
    Bank0Demo                  MakingSound/DrumBanks.mdx          0     0     11  ILLUSTRATIVE (drawn on empty grid)
    Bank1Demo                  MakingSound/DrumBanks.mdx          0     0      5  ILLUSTRATIVE (drawn on empty grid)
    Bank2Demo                  MakingSound/DrumBanks.mdx          0     0      6  ILLUSTRATIVE (drawn on empty grid)
    Bank3Demo                  MakingSound/DrumBanks.mdx          0     0      4  ILLUSTRATIVE (drawn on empty grid)
    RhythmOverview             MakingSound/DrumBanks.mdx          4     0    128  VERIFIED
    AccentDemo                 MakingSound/Gestures.mdx           0     0      2  ILLUSTRATIVE (drawn on empty grid)
    ArpeggioDemo               MakingSound/Gestures.mdx         168     0     30  VERIFIED
    FifthDemo                  MakingSound/Gestures.mdx           0     0      2  ILLUSTRATIVE (drawn on empty grid)
    FillDemo                   MakingSound/Gestures.mdx           0     0      8  ILLUSTRATIVE (drawn on empty grid)
    MultiDrumDemo              MakingSound/Gestures.mdx           0     0      3  ILLUSTRATIVE (drawn on empty grid)
    PhraseDemo                 MakingSound/Gestures.mdx           0     0      5  ILLUSTRATIVE (drawn on empty grid)
    ProgressionFillDemo        MakingSound/Gestures.mdx           0     0     13  ILLUSTRATIVE (drawn on empty grid)
    RollDemo                   MakingSound/Gestures.mdx         112     0     22  VERIFIED
    RunDemo                    MakingSound/Gestures.mdx           0     0      8  ILLUSTRATIVE (drawn on empty grid)
    StackDemo                  MakingSound/Gestures.mdx           0     0      4  ILLUSTRATIVE (drawn on empty grid)
    SustainDemo                MakingSound/Gestures.mdx           0     0      4  ILLUSTRATIVE (drawn on empty grid)
    TapDemo                    MakingSound/Gestures.mdx           0     0    193  ILLUSTRATIVE (drawn on empty grid)
    WalkingDemo                MakingSound/Gestures.mdx         112     0     20  VERIFIED
    LongPressNote              MakingSound/MuteSolo.mdx           6     2      0  VERIFIED (state capture)
    MultiSoloDemo              MakingSound/MuteSolo.mdx          10     0     10  VERIFIED (state capture)
    MuteDemo                   MakingSound/MuteSolo.mdx          14     6      0  VERIFIED (state capture)
    MuteSoloOverview           MakingSound/MuteSolo.mdx         600     0     80  VERIFIED
    SoloDemo                   MakingSound/MuteSolo.mdx          14     0      6  VERIFIED (state capture)
    ClearSectionsButtonDemo    MakingSound/SongSections.mdx       8     0    160  VERIFIED
    GhostDemo                  MakingSound/SongSections.mdx       0     0      5  ILLUSTRATIVE (drawn on empty grid)
    SectionCopyDemo            MakingSound/SongSections.mdx       0     0     21  ILLUSTRATIVE (drawn on empty grid)
    SectionMergeDemo           MakingSound/SongSections.mdx       0     0      8  ILLUSTRATIVE (drawn on empty grid)
    SectionOverview            MakingSound/SongSections.mdx     580     0    224  VERIFIED
    SectionPlayButtonDemo      MakingSound/SongSections.mdx       2     0    160  VERIFIED
    SectionPlayDemo            MakingSound/SongSections.mdx       2     0      3  VERIFIED
    SwitchDemo                 MakingSound/SongSections.mdx      20     0    146  VERIFIED
    ThumbnailDemo              MakingSound/SongSections.mdx       0     0     30  ILLUSTRATIVE (drawn on empty grid)
    BankDisplayDemo            MakingSound/SynthPresets.mdx       0     8      0  VERIFIED (state capture)
    PresetSelectionDemo        MakingSound/SynthPresets.mdx      20     2      0  MOSTLY OK, spot-fix
    RhythmNoteDemo             MakingSound/SynthPresets.mdx       4     0      0  VERIFIED
    BPMDemo                    MakingSound/TopControls.mdx        3     0      0  VERIFIED
    ControlRowOverview         MakingSound/TopControls.mdx       21     0      2  VERIFIED
    EditControlsDemo           MakingSound/TopControls.mdx        4     0      0  VERIFIED
    GhostDemo                  MakingSound/TopControls.mdx        1     0      3  VERIFIED
    KeyDemo                    MakingSound/TopControls.mdx       13     0      0  VERIFIED
    PatternLengthDemo          MakingSound/TopControls.mdx      143     0     20  VERIFIED
    PlayStopDemo               MakingSound/TopControls.mdx       61     0      0  VERIFIED
    ScaleDemo                  MakingSound/TopControls.mdx        3     0      0  VERIFIED
    IndicatorLaneDemo          MakingSound/Tracks.mdx             0     0     54  ILLUSTRATIVE (drawn on empty grid)
    TracksDemo                 MakingSound/Tracks.mdx             0     0    880  ILLUSTRATIVE (drawn on empty grid)

    verdict counts:
       21  ILLUSTRATIVE (drawn on empty grid)
       21  VERIFIED
       14  VERIFIED (state capture)
        2  MOSTLY OK, spot-fix
