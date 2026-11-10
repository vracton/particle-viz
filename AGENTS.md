# Particle Viz

## What we are building

Particle Viz is a browser-based home for music visualizers. A shared player handles local music, playback, seeking, and accent colors. Small JavaScript visualizer modules provide graphics and metadata such as their name and authoring model. The longer-term goal is to prompt an agent for a new visualizer and slot the reviewed result into the same host.

Today this is a Vite/vanilla JavaScript app with one bundled WebGL visualizer. There is no backend or arbitrary-script sandbox. Multiple visualizers, generation workflows, scrobbling integrations, and design changes should be introduced as focused increments when requested, rather than built speculatively.

## Repository map

- `index.html` — player markup and accessible controls.
- `src/main.js` — host, audio lifecycle, shared state, and animation scheduling.
- `src/visualizers/` — trusted visualizer modules and their rendering resources.
- `src/audio-utils.js` and `src/audio-utils.test.js` — pure transport/color helpers and tests.
- `src/style.css` — shared interface styling.
- `docs/submission/` — challenge evidence, decisions, and submission drafts.

## Working in this repository

Read the relevant code before changing it. Keep the existing vanilla JavaScript/Vite setup unless a requested capability justifies a change. Prefer small, readable modules and explicit interfaces; avoid new dependencies or abstractions that only serve a hypothetical future feature. Preserve keyboard access, meaningful control labels, responsive layout, and reduced-motion support when changing the interface.

Use Node.js 22.12+ (or 20.19+):

- `npm ci` — install locked dependencies.
- `npm run dev` — start development; open the printed local URL.
- `npm test` — run the Node utility tests.
- `npm run build` — create the production build.
- `npm run preview` — serve that production build locally.

For runtime changes, run the tests and build. Also verify changed audio/graphics interactions in a real WebGL/Web Audio browser with a local audio file. Choose checks based on the change; documentation-only work needs a content/diff check, not an application test suite. Report what was checked and any limits. Keep setup instructions and submission evidence consistent with actual behavior.

## Project rules

### 1. One host, many visualizers

**Applies to:** player architecture, shared utilities, and every visualizer module.

**Rule:** Keep playback, audio analysis, transport controls, shared settings, and animation scheduling in the host. Visualizers consume host-provided inputs and own their rendering implementation; they must not duplicate the player or create independent audio graphs and animation loops.

**Why:** Listeners should be able to change the visuals without changing how they play their music. Agents should be able to add a visualizer without rebuilding the surrounding application.

### 2. Shared behavior belongs in the contract

**Applies to:** visualizer interfaces, metadata, configurable colors, and shared player UI.

**Rule:** Express reusable behavior through an explicit host/module contract instead of module-specific global state or host special cases. Use shared accent settings for configurable palettes. Supply stable visualizer identifiers and accurate names/model credits, and show the selected module's name and credit in the player. Document intentional contract changes and update affected callers together.

**Why:** Independently authored visualizers need predictable inputs and attribution to remain interchangeable. Author-supplied model metadata is a credit, not verified provenance.

### 3. Own the whole lifecycle

**Applies to:** asynchronous work, event handlers, browser resources, and rendering modules.

**Rule:** Make resource and state ownership explicit from creation through replacement, recovery, and cleanup. Stale asynchronous work must not update a newer operation's state. Release resources when their owner is replaced or disposed, handle initialization failures visibly, and recreate resources that become invalid after browser recovery.

**Why:** Audio, object URLs, event queues, animation frames, and GPU resources have different lifetimes. Ownership rules prevent a successful happy path from hiding leaks, races, or broken recovery.

### 4. Local by default, external by intent

**Applies to:** audio/file handling, network requests, telemetry, and future service integrations.

**Rule:** Keep selected music, filenames, embedded metadata, and derived audio data on-device in the local playback flow. Any requested external integration must make its destination, purpose, and data boundary explicit; do not silently add uploads, analytics, or model calls to local playback.

**Why:** Playing personal music should not require disclosing it. A future scrobbling or generation feature should have a deliberate boundary rather than changing the privacy of the whole app.

### 5. Deliver the requested increment with evidence

**Applies to:** implementation, dependencies, tests, documentation, and PR/submission descriptions.

**Rule:** Keep changes focused on the current task. Reuse existing patterns before adding frameworks or abstractions, verify the behavior being changed, and report results accurately. Do not claim unbuilt features, unrun checks, or an AI review as proof of correctness. Preserve unrelated work and record material decisions where the next contributor can find them.

**Why:** This project grows across multiple hackathon challenges. Small, reviewable increments and honest evidence let each challenge improve the factory without consuming the whole roadmap at once.
