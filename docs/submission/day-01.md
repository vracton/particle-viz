# Day 1 — first delivery

Challenge: https://hackathon.qodo.ai/challenges/?day=01
Discussion: https://github.com/orgs/qodo-hackathon/discussions/2
Repository: https://github.com/vracton/particle-viz

## Introduction (ready to post)

I'm building **Particle Viz**, a WebGL music visualizer host for listeners and people experimenting with agent-generated graphics. A shared player will manage local music, playback, accent colors, and eventually scrobbling, while small JavaScript visualizers carry their own name and model credit. My goal is to prompt an agent for a new visualizer and slot the reviewed module into the same player.

Today's small capability: open one local audio file and play it through one audio-reactive WebGL particle visualizer, with play/pause, seeking, a shared accent color, and visible model attribution.

## Delivery update (finish after Qodo review)

- PR: pending
- Screenshot: `day-01-desktop.jpg` (attach this image to the Discussion)
- Capability: local audio drives Orbit Field; shared playback, seek, and accent controls work.
- Qodo review: pending — do not claim this challenge complete until the actual review and reflection are recorded below.
- Review lesson: pending actual Qodo feedback.

## Checks performed

- `npm test`: 3 passing tests for missing/invalid duration, bounded seeking, time/color conversion.
- `npm run build`: production build passed.
- Browser: loaded a generated 12-second WAV; Play entered AUDIO REACTIVE; seek to 50% moved to 0:06; Pause preserved the position.
- Independent agent review identified an asynchronous Play/file-replacement race. Added a track generation guard so stale playback handlers cannot update a replacement track's UI.

## Scope

This delivery has one trusted bundled module, not arbitrary JavaScript execution or agent generation. Scrobbling services, multiple visualizers, persistent settings, richer module contracts, and generation workflows are future increments.

## Actual Qodo review and reflection

Pending. Record the review URL, actionable feedback (or explicitly no findings), what was checked against the code, and the decision to accept or question each material recommendation. A review is evidence, not a guarantee of correctness.
