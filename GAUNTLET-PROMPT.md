# Gauntlet prompt — Pixelboop wiki grid

Paste into a fresh ultracode session at `~/Documents/GitHub/pixelboop-wiki`.

---

I want you to rebuild the interactive grid visualization in the Pixelboop wiki at the level of Ableton's Learning Music. It should be utterly perfect, visually beautiful, with every single thing done at reference quality—from pad legibility to labelling to touch behaviour to keyboard access to anything you could think of.

Fan out sub-agents and have sub-agents tackle each one individually so that the grid is utterly perfect. You should /loop on each item and have a separate sub-agent check it visually to ensure it teaches as well as Learning Music does. That separate sub-agent should be a really harsh critic, and if a reader could not learn the control from the figure alone, it should keep going.

Don't stop until each sub-agent is utterly wowed with the quality when compared with the actual Ableton Learning Music pages. It should literally compare them side by side blind and say which one teaches better. Reference stills are already on disk at `~/starseed/store/status/wiki-gauntlet/shots/bar/`; capture ours with `~/starseed/store/status/wiki-gauntlet/capture.mjs` against the dev server on port 3010. Do this in the existing React + Docusaurus component, `src/components/MystrixVisualizer/MystrixVisualizer.tsx`. /loop until it's utterly perfect. Fan out sub-agents and ultracode.

---

## The bar, concretely

| | |
|---|---|
| Named | Ableton Learning Music |
| Fetchable | 9 stills on disk under `shots/bar/`, desktop 1280x900 and phone 390x844 |
| Comparable | Same viewport, same capture tool, judged blind |

## Numbers that sit next to the taste

- A pad must be at least 24x24 CSS px at its touch target on a 390px-wide phone.
- Pad-on against pad-off must clear 3:1 contrast.
- Every control the figure names must be reachable by keyboard and announced.
- The page must not scroll sideways at 390px.
- No figure may depend on hover to convey meaning.

## What the critic is never given

The builder's history, the diff, or the reasoning. Only: the goal, the bar
stills, and the artifact. You do not want reasonable, you want independent.
