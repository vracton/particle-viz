For Day 2, I added Particle Viz's root **AGENTS.md**:

https://github.com/vracton/particle-viz/blob/main/AGENTS.md

It describes the project, repository layout, working conventions, setup/check commands, and five broad rules: host/module separation, explicit shared contracts, lifecycle ownership, local-first privacy, and focused changes backed by evidence.

My nominee is **“The visualizer gets an API, not the whole repository.”**

> A visualizer-building agent has a narrower role than a host/integration agent. Its task must name the visualizer files it is allowed to create or edit.

The rule allows that agent to read only AGENTS.md, the self-contained visualizer API reference, the relevant host entry point when necessary, and its assigned/new visualizer files. Other source files, existing visualizers, Git history, dependencies, and secrets are outside its scope. Host changes and repository-wide checks stay with the integration agent; extra access needs an explicit scope expansion.

The reason is the product itself: I want to prompt different agents to make graphics that slot into the same player. They should build against the API instead of rummaging through unrelated code, copying another visualizer, or rebuilding playback and controls. This keeps each agent's job understandable and its output easy to integrate. AGENTS.md states the boundary as policy; a future runner will need read/write allowlists for hard enforcement.

Day 1's Qodo review also showed why lifecycle ownership matters: queued audio events and restored GPU contexts need more than a working happy path. Those examples live in the delivery notes; the root instructions express the broader principles we can apply to future features.

Review Standards import/activation: pending verification.
