# Particle Viz

A WebGL music visualizer host where the player owns audio and shared controls, while small JavaScript modules supply the visuals and identify the model that made them.

## Day 1: one working capability

Open a local audio file and play it through **Orbit Field**, an audio-reactive WebGL particle study. Pause, seek, and change the shared accent color. The module's name and model credit are visible in the player. Files stay in the browser; there is no upload endpoint, account, or backend.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Requires Node.js 22.12+ (or 20.19+) and a modern WebGL/Web Audio browser. Browser codec support determines which audio formats work.

```sh
npm test
npm run build
npm run preview
```

## Tiny visualizer contract

`src/visualizers/orbit-field.js` exports a trusted, bundled module:

```js
{
  id, name, description, authorModel,
  create(canvas) {
    return {
      render({ time, energy, accent, dpr }) {},
      dispose() {}
    };
  }
}
```

`time` is seconds, `energy` is a normalized low-frequency average, `accent` is an RGB array in 0–1, and `dpr` is capped at 2. The host sets the canvas backing size before rendering. Modules own and release their GPU resources; the host owns audio, FFT, and the animation loop. Model metadata is an author-supplied credit, not verified provenance.

Day 1 has a single registered visualizer. Adding more modules and switching between them is future work. Only reviewed repository code runs: this is not a sandbox for arbitrary generated JavaScript.

## Deliberately saved for later

- Multiple visualizers and a real selection/cleanup lifecycle
- Agent prompt → module generation and validation
- Richer frequency/time-domain data and versioned plugin API
- Volume, playlists, persistence, and scrobbling service integration
- Automated browser regression tests and CI

## Verification

`npm test` checks unknown duration handling, seek boundaries, and shared conversions. Browser checks and challenge evidence are recorded in [Day 1 delivery](docs/submission/day-01.md).
