# Day 1 — first delivery

Challenge: https://hackathon.qodo.ai/challenges/?day=01
Discussion: https://github.com/orgs/qodo-hackathon/discussions/2
Repository: https://github.com/vracton/particle-viz
PR: https://github.com/vracton/particle-viz/pull/1
Qodo review: https://github.com/vracton/particle-viz/pull/1#issuecomment-6771503839

## Submission materials

Paste `discussion-post.md` into the Day 1 Discussion (or use its delivery section to update an existing introduction). Attach `day-01-desktop.jpg`; `day-01-mobile.jpg` is optional. The Discussion has not been posted on your behalf.

## Delivered capability

Open a local audio file and play it through Orbit Field, an audio-reactive WebGL particle visualizer. Play/pause, seek, shared accent color, and module/model metadata work. Audio stays on-device. One trusted bundled module keeps the first increment small.

## Verification

- `npm test`: 3 passing tests for missing/invalid duration, bounded seeking, time/color conversion.
- `npm run build`: production build passed after the fixes.
- `npm audit`: zero reported vulnerabilities at verification time.
- Browser: loaded a generated 12-second WAV; Play entered AUDIO REACTIVE; seek to 50% moved to 0:06; Pause preserved the position.
- Browser: invalid file produced a readable error; replacing it with a WAV restored playback.
- Browser: accent change worked and the layout was inspected at 390×844.
- Independent agent review identified an asynchronous Play/file-replacement race. Track generation guards prevent stale async handlers from updating replacement-track UI.
- Qodo fix regression: replaced a playing track and recorded status transitions: `Loading local audio…` → `Ready. Your audio stays on this device.` The new track was paused, Play was labeled correctly, and the mode was IDLE FIELD.
- Qodo fix regression: forced loss and restoration with `WEBGL_lose_context`; the unavailable message appeared, then the normal status and rendered particles returned without reload.

## Actual Qodo review and decisions

Qodo reviewed commit `90623f25c223338412a8565ada9079851cc5e74e` and reported two medium findings. Both were evaluated against the implementation and addressed in the follow-up commit on the same PR. These local verification results do not imply Qodo has re-reviewed that follow-up.

1. **Queued pause status on track replacement — accepted.** The old pause handler read the current src instead of identifying the event's original track. Pause status now follows the explicit user Pause action; replacing a track immediately synchronizes the transport. This avoids depending on queued media events, which can also be canceled by `audio.load()`.
2. **WebGL recovery required reload — accepted as a reliability improvement.** Day 1 originally offered a reload fallback. Since the handler requested restoration, rebuilding the renderer is the more consistent behavior. A restoration handler now recreates GPU resources, clears the failure state, resets frame timing, and restarts rendering; initialization failure keeps a readable fallback.

Lesson: guarding awaited Play operations is only one part of lifecycle correctness. Queued browser events can refer to earlier state, and a recovered WebGL context needs fresh GPU resources. The review improved two edge cases while preserving the small first delivery.

## Saved for future increments

Multiple visualizers, a richer/versioned module API, agent prompt-to-module generation and validation, persistence, playlists, scrobbling integrations, and browser-test automation. No general plugin framework or arbitrary JavaScript execution today.

## Short demo script

1. Run `npm ci` and `npm run dev`; open the printed local URL.
2. Open a local MP3/WAV supported by your browser.
3. Press Play and show particles responding to low-frequency energy.
4. Change ACCENT, seek to the middle, then pause.
5. Show Orbit Field's visible model credit and the Qodo review/fix reflection on the PR.
