For Day 2, I added Particle Viz's root **AGENTS.md**:

https://github.com/vracton/particle-viz/blob/main/AGENTS.md

It describes the project, repository layout, working conventions, setup/check commands, and five broad rules: host/module separation, explicit shared contracts, lifecycle ownership, local-first privacy, and focused changes backed by evidence.

My nominee is **“One host, many visualizers.”**

> Keep playback, audio analysis, transport controls, shared settings, and animation scheduling in the host. Visualizers consume host-provided inputs and own their rendering implementation; they must not duplicate the player or create independent audio graphs and animation loops.

The reason is the product itself: I want to prompt different agents to make visualizers that slot into the same player, with consistent playback, colors, and visible model credits. If every agent rebuilds the audio pipeline and controls, I get a collection of unrelated demos rather than an interchangeable visualizer library. This rule gives agents room to experiment with the graphics while keeping the listener's experience consistent.

Day 1's Qodo review also showed why lifecycle ownership matters: queued audio events and restored GPU contexts need more than a working happy path. Those examples live in the delivery notes; the root instructions express the broader principles we can apply to future features.

Review Standards import/activation: pending verification.
