---
sidebar_position: 4
---

# Common Q&A

## Company & Product

### Q: Who makes Pixelboop?

Pixelboop is an **Audiolux** product. Audiolux creates innovative music creation tools and is owned and operated by **de Bastion, Inc**.

- **Audiolux**: [www.audiolux.app](https://www.audiolux.app)
- **de Bastion, Inc**: [inc.debastion.com](https://inc.debastion.com)

### Q: Is Pixelboop available for Android?

**Coming soon!** Pixelboop is currently available on iOS (iPhone and iPad), with Android support in active development. Follow [@audioluxapp](https://twitter.com/audioluxapp) for updates.

### Q: Is there a desktop version?

Not currently. Pixelboop is designed as a mobile-first experience, optimized for multitouch gestures on iOS and Android devices. A desktop companion app may be considered in the future.

## Playing with Others

### Q: Can people jam together with Pixelboop?

**Yes!** Multiple Pixelboop devices can sync together for collaborative jamming. See our [Multi-Device Sync](../JamWithOthers/MultiDeviceSync) guide to learn how to connect devices and jam in real-time.

### Q: How many devices can sync together?

Currently, Pixelboop supports **up to 8 devices** syncing together simultaneously. One device acts as the host and shares playback state, BPM, and timing with all connected peers.

### Q: Do we need to be on the same WiFi network?

Yes. All devices need to be on the same WiFi network. Pixelboop finds the other devices on that network by itself and keeps them in time, with no internet connection involved. This is Pixelboop's own sync, not Ableton Link (see the DAW question below).

## MIDI & External Gear

### Q: Can I use Pixelboop with my MIDI gear?

**Yes!** Pixelboop supports both:
- **USB MIDI** via Lightning/USB-C adapter (iOS)
- **Bluetooth MIDI** for wireless connections

Each track can send MIDI to different channels, making it easy to control multiple synths, drum machines, or DAWs. See [Connectivity](/Connectivity) for setup.

### Q: Can I sync Pixelboop with my DAW?

Not on its own clock yet. Ableton Link is built into the app, but it is switched off in every shipping build and there is no announced date for turning it on. The pixels reserved for its button on the bottom row stay black, so there is no Link control to hunt for.

<!-- FIGURE: a MystrixVisualizer of the bottom control row (Link pixels black) belongs here. This page is .md, so it cannot host the component as written; convert to .mdx first or link out to the figure already on Multi-Device Sync. -->

What does work today:

- **Pixelboop's own multi-device sync** over WiFi, for playing in time with other Pixelboop devices. See [Multi-Device Sync](../JamWithOthers/MultiDeviceSync).
- **MIDI over Bluetooth LE or USB**, for playing your DAW's instruments or your hardware from the Pixelboop grid.

Pixelboop sends MIDI notes, not MIDI clock, so a DAW receiving from Pixelboop plays the notes but will not follow Pixelboop's tempo. Set the tempo on both sides by hand and start them together.

## LED Integration

### Q: Can I connect external LED strips?

**Yes!** Pixelboop can control [WLED](https://kno.wled.ge/)-compatible LED strips over WiFi. The bottom-left corner shows a rainbow gradient when WLED is enabled, and your LEDs will mirror the grid patterns in real-time. Perfect for live performances!

**See our [WLED Setup Guide](../Connectivity/WLED) for complete instructions.**

### Q: What LEDs are compatible?

Any **WLED-compatible** LED strip or controller. WLED is an open-source project that runs on ESP8266/ESP32 chips and supports addressable LEDs (WS2812B, SK6812, etc.). Search "WLED controller" online for ready-made options, or follow our [WLED guide](../Connectivity/WLED) to build your own.

## Getting Help

### Q: I found a bug. How do I report it?

Start at the [PixelBoop community forum](https://www.pixelboop.com/forum). It is open to guests, so you can post a bug report, a feature request, or a question without making an account or handing over an email address.

Other ways to reach us:

- Email: [support@audiolux.app](mailto:support@audiolux.app)
- Discord: [discord.gg/ZsXcujcnFe](https://discord.gg/ZsXcujcnFe)

The forum is not linked from inside the app yet, so reach it from [pixelboop.com](https://www.pixelboop.com) or bookmark the address above.

### Q: Do I need an account to use Pixelboop?

**No account required!** Pixelboop works completely offline. All your patterns and settings are stored locally on your device.

### Q: Can I export my patterns?

Pattern export/import is on the roadmap. For now, patterns are saved locally. Multi-device sync lets you share and copy patterns between devices during a session.

### Q: Does Pixelboop cost money?

Pixelboop is available on the **App Store**, and everything in the current version is included free: all 48 sounds across Melody, Chords, and Bass, right out of the box.

**[Pixelboop Pro](../GettingStarted/PixelboopPro)**, an optional one-time purchase (not a subscription), arrives in a future update. It will add extra drum kits, LiteJam Guitar support, and per-instrument hardware visualizations.
