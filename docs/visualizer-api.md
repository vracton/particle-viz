# Visualizer API

This file is the self-contained reference for an agent assigned to build a visualizer. Read the root `AGENTS.md` first and follow its visualizer-agent access boundary. Your task must explicitly name the visualizer files you may create/edit; it does not grant access to the rest of the repository.

## Module shape

Export one visualizer object from the JavaScript module assigned to your task:

```js
export const myVisualizer = {
  id: 'my-visualizer',
  name: 'My Visualizer',
  description: 'A short description of what it renders.',
  authorModel: 'Actual authoring model, or unknown when unavailable',
  create(canvas) {
    // Initialize this module's WebGL resources here.
    return {
      render({ time, spectrum, fftSize, sampleRate, accent, dpr }) {
        // Draw one frame. The host calls this method.
      },
      dispose() {
        // Release this module's resources.
      },
    };
  },
};
```

## Inputs and ownership

| Input | Meaning |
| --- | --- |
| `canvas` | The host-owned HTML canvas. The module may obtain its WebGL context. |
| `time` | Animation time in seconds; the host freezes it for reduced motion. |
| `spectrum` | Borrowed `Float32Array` containing every analyser bin in dB, ordered from low to high frequency. `null` before analysis is initialized. |
| `fftSize` | FFT window size in samples (currently 2048), or `null` before analysis is initialized. |
| `sampleRate` | Actual audio context sample rate in Hz, or `null` before analysis is initialized. |
| `accent` | Host-selected RGB array, three values in 0–1, for configurable palette colors. |
| `dpr` | Render pixel ratio used by the host, capped at 2 and reduced to keep the canvas near a 1.2-million-pixel budget. |

The host sizes the canvas backing buffer before each frame. Use `canvas.width` and `canvas.height` for the drawing viewport and aspect ratio. The host owns the audio element, audio graph, playback, FFT analysis, accent controls, and frame scheduling. Normal motion renders continuously. Reduced motion supplies fixed time and silent FFT bins, and renders only when needed, such as accent/size changes or graphics restoration. Do not assume render is called continuously. A visualizer receives no local file, filename, audio element, or raw audio samples through this API.

The module owns only its rendering resources. Check shader compilation/program linking, release partial allocations if initialization fails, and implement `dispose()` so the host can clean up. On context restoration the host creates a fresh renderer; do not reuse old GPU resources. Do not start an independent animation loop, create audio nodes, fetch remote resources, inspect the DOM beyond the provided canvas, or mutate the shared player UI.

## Reading the spectrum

There are `fftSize / 2` bins. Bin `i` corresponds to `i * sampleRate / fftSize` Hz, with DC at bin zero. The host uses Web Audio's `getFloatFrequencyData()` directly and sets analyser smoothing to zero. It does not aggregate bins, normalize dB values, or perform temporal averaging. Visualizers choose their own frequency bands, scaling, and smoothing.

Treat a null spectrum or non-finite magnitudes as silence. Once the analyser exists, the host fills all bins with `-Infinity` when playback is paused, ended, cleared, unavailable, or reduced motion is active. The same array is overwritten on subsequent render calls. Do not modify it or retain it after the call; copy it only if a visualizer needs its own history.

## Handoff to the host agent

Return the assigned files, their export name and metadata, any API limitation, and what you actually checked. Do not inspect another visualizer as a template. If additional files, dependencies, or API changes are needed, request an explicit scope expansion instead of exploring or changing them yourself.

The current player bundles one visualizer; its selector and visible credit are populated from module metadata. Adding a module to the registry, implementing multi-module switching, and running the full app's build/browser checks are host/integration work, not authorization for the visualizer agent to inspect or edit more files.
