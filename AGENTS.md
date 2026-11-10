# Particle Viz agent instructions

## Project and scope

Particle Viz is a browser-only WebGL music visualizer host. The player provides local audio, transport, FFT analysis, and a shared accent color; small JavaScript modules provide visuals and metadata identifying their name and authoring model. The long-term goal is to let reviewed, agent-generated visualizers slot into that host.

The current app is a Vite/vanilla JavaScript prototype with one bundled visualizer. Keep increments focused on the requested challenge. Multiple visualizers, generation workflows, scrobbling services, and a redesign are future work unless explicitly requested. Bundled modules are trusted code, not a sandbox for arbitrary JavaScript.

## Setup and verification

Use Node.js 22.12+ (or 20.19+).

- `npm ci` — install the locked dependencies.
- `npm run dev` — start the local Vite app; open the printed URL.
- `npm test` — run the Node utility tests.
- `npm run build` — check the production build.
- `npm run preview` — serve the production build locally.

For runtime changes, run `npm test` and `npm run build`. For audio or graphics changes, also check the affected flow in a real WebGL/Web Audio browser with a local audio file. Relevant checks include play/pause/seek, replacing a playing track, invalid-file recovery, shared accent updates, and graphics loss/restoration. Run the checks relevant to the change, report what was actually verified, and state any verification limits. Documentation-only changes need a content/diff check, not a new browser test suite.

## Project rules

### 1. Local tracks stay local

**Applies to:** file input, audio loading, network calls, telemetry, and any visualizer receiving audio data.

**Rule:** Keep selected audio files, their filenames, embedded metadata, and derived audio data on the device. Use browser-local media/object URLs. Do not send them to a server, analytics service, or model as part of the local playback flow.

**Why:** A listener should be able to visualize personal music without disclosing it. Any future external integration needs an explicitly requested data boundary, rather than quietly changing local playback.

### 2. The host plays; the visualizer draws

**Applies to:** `src/main.js`, shared player utilities, and `src/visualizers/`.

**Rule:** The host owns the audio element, AudioContext, FFT analysis, playback/seek controls, animation scheduling, canvas size, and shared accent state. A visualizer consumes the host's render inputs and owns its rendering resources. Do not create another audio graph, playback UI, independent animation loop, or competing global color picker inside a visualizer. Use the host-provided accent for its configurable palette.

**Why:** A new visualizer should slot into the player without changing how the listener operates it or duplicating audio and scheduling work.

### 3. Old tracks do not get a vote

**Applies to:** asynchronous playback, file replacement, media events, and transport/status updates.

**Rule:** Tie asynchronous playback work to the current track generation and recheck ownership after awaits before updating state. Do not infer that a queued media event belongs to the current track merely because the audio element now has a src. File replacement must immediately synchronize the transport, and user-pause status must follow the current user's pause action rather than an old queued event.

**Why:** Day 1's Qodo review found that an old pause event could overwrite a replacement track's loading status. Await guards alone do not cover queued browser events; `audio.load()` can also cancel pending events.

### 4. A restored context needs a new renderer

**Applies to:** WebGL initialization, context loss/restoration, animation teardown, and renderer disposal.

**Rule:** Check shader compilation and program linking, clean up partially created resources on failure, and release GPU resources through `dispose()`. Stop rendering and show a readable state on context loss. On restoration, recreate the renderer's GPU resources before restarting the host's single animation loop; keep a readable fallback if recreation fails. Do not reuse GPU objects from the lost context.

**Why:** Day 1's Qodo review found that the original reload fallback left a recovered context blank. Browser recovery does not rebuild shader programs or buffers for us.

### 5. Credit the module honestly

**Applies to:** visualizer exports, registry entries, player metadata, and submission/demo descriptions.

**Rule:** Give every visualizer a stable id, a name, a description, and an accurate authoring-model credit, and keep the selected module's name and model visible in the player. Credit adaptations or source visualizers when relevant. Do not invent a model/version, label author-supplied metadata as verified provenance, or describe an unfinished capability as working.

**Why:** Comparing agent-made visualizers is part of the product. Useful attribution depends on distinguishing an author's claim from evidence, and challenge submissions should match what was built and checked.
