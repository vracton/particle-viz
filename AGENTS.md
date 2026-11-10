# Particle Viz

## What we are building

Particle Viz is a browser-based home for music visualizers. A shared player handles local music, playback, seeking, and accent colors. Small JavaScript visualizer modules provide graphics and metadata such as their name and authoring model. The longer-term goal is to prompt an agent for a new visualizer and slot the reviewed result into the same host.

Today this is a Vite/vanilla JavaScript app with one bundled WebGL visualizer. There is no backend or arbitrary-script sandbox. Multiple visualizers, generation workflows, scrobbling integrations, and design changes should be introduced as focused increments when requested, rather than built speculatively.

The current registry contains one bundled visualizer, and the host binds its name and model credit from metadata. Multi-visualizer switching and automatic discovery are not implemented yet. The rules below guide future changes as well as the existing prototype.

## Repository map

- `index.html` — player markup and accessible controls.
- `src/main.js` — host, audio lifecycle, shared state, and animation scheduling.
- `src/visualizers/` — trusted visualizer modules and their rendering resources.
- `docs/visualizer-api.md` — self-contained API reference for visualizer-building agents.
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

For runtime changes, run the tests and build. Also verify changed audio/graphics interactions in a real WebGL/Web Audio browser with a local audio file. For overlaid controls, check both narrow widths and short viewport heights, including a high-zoom equivalent, so controls remain reachable or the page can scroll. Choose checks based on the change; documentation-only work needs a content/diff check, not an application test suite. Report what was checked and any limits. Keep setup instructions and submission evidence consistent with actual behavior.

## Project rules

### 1. One host, many visualizers

**Applies to:** player architecture, shared utilities, and every visualizer module.

**Rule:** Keep playback, audio analysis, transport controls, shared settings, and animation scheduling in the host. Visualizers consume host-provided inputs and own their rendering implementation; they must not duplicate the player or create independent audio graphs and animation loops.

**Visualizer-agent access boundary:** A visualizer-building agent has a narrower role than a host/integration agent. Its task must name the visualizer files it is allowed to create or edit. It may read only this `AGENTS.md`, `docs/visualizer-api.md`, the relevant host entry point `src/main.js` when needed to understand the API, and the visualizer files assigned to that task or created by that agent within the assigned scope. Treat the contract and host entry point as read-only. Do not browse, search, or read other repository files, existing visualizers, Git history, dependencies, or secrets; do not modify host code, styling, configuration, or another visualizer. Do not use imports, shell commands, or tools to bypass that boundary. If the task needs more context or an API change, report the need to the host/integration agent or user and wait for an explicit scope expansion. Host integration, dependency installation, and repository-wide validation belong to the host/integration role.

This is an agent instruction policy, not an enforced filesystem sandbox. When a runner is added, enforce equivalent read/write allowlists there rather than treating these instructions as a security guarantee.

**Why:** Listeners should be able to change the visuals without changing how they play their music. Agents should be able to add a visualizer through a small API without copying other visualizers, exploring unrelated code, or rebuilding the surrounding application.

### 2. Shared behavior belongs in the contract

**Applies to:** visualizer interfaces, metadata, configurable colors, and shared player UI.

**Rule:** Express reusable behavior through an explicit host/module contract instead of module-specific global state or host special cases. Use shared accent settings for configurable palettes. Supply stable visualizer identifiers and accurate names/model credits, and show the selected module's name and credit in the player. Document intentional contract changes and update affected callers together.

**Why:** Independently authored visualizers need predictable inputs and attribution to remain interchangeable. Author-supplied model metadata is a credit, not verified provenance.

### 3. Own the whole lifecycle

**Applies to:** asynchronous work, event handlers, browser resources, and rendering modules.

**Rule:** Make resource and state ownership explicit from creation through replacement, recovery, and cleanup. Stale asynchronous work must not update a newer operation's state. Release resources when their owner is replaced or disposed, handle initialization failures visibly, and recreate resources that become invalid after browser recovery. Avoid repeatedly rendering unchanged static output; redraw when a visible input changes and resume continuous work only when needed.

**Why:** Audio, object URLs, event queues, animation frames, and GPU resources have different lifetimes. Ownership rules prevent a successful happy path from hiding leaks, races, or broken recovery.

### 4. Local by default, external by intent

**Applies to:** audio/file handling, network requests, telemetry, and future service integrations.

**Rule:** Keep selected music, filenames, embedded metadata, and derived audio data on-device in the local playback flow. Any requested external integration must make its destination, purpose, and data boundary explicit; do not silently add uploads, analytics, or model calls to local playback.

**Why:** Playing personal music should not require disclosing it. A future scrobbling or generation feature should have a deliberate boundary rather than changing the privacy of the whole app.

### 5. Deliver the requested increment with evidence

**Applies to:** implementation, dependencies, tests, documentation, and PR/submission descriptions.

**Rule:** Keep changes focused on the current task. Reuse existing patterns before adding frameworks or abstractions, verify the behavior being changed, and report results accurately. Do not claim unbuilt features, unrun checks, or an AI review as proof of correctness. Preserve unrelated work and record material decisions where the next contributor can find them.

**Why:** This project grows across multiple hackathon challenges. Small, reviewable increments and honest evidence let each challenge improve the factory without consuming the whole roadmap at once.

### 6. Keep interface text concise

**Applies to:** visible interface copy, labels, badges, empty/loading/error states, and user-facing or submission prose.

**Rule:** Show text when it helps the listener operate the app or make a meaningful choice. Omit unsolicited headlines, slogans, technical explanations, decorative tags, and descriptions that repeat a label or an obvious control. Keep necessary control labels, accessible names, short operational feedback, visible errors, and the selected visualizer's name/model credit. Put implementation explanations in developer documentation. Do not use em dashes or stock closing statements in newly authored user-facing and submission prose.

**Why:** The music and graphics are the main experience. Extra text crowds the controls and distracts from the visualizer; removing it must not make the player harder to use or hide a failure.
