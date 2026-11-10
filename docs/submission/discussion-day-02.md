For Day 2, I added Particle Viz's house rules in a root **AGENTS.md**:

https://github.com/vracton/particle-viz/blob/codex/day-02-project-rules/AGENTS.md

It includes the project scope, setup and verification commands, and five scoped rules covering local audio privacy, host/visualizer ownership, stale media events, WebGL recovery, and honest model attribution.

My nominee is **“Old tracks do not get a vote.”**

> Do not infer that a queued media event belongs to the current track merely because the audio element now has a src.

The story comes from Day 1: Qodo found that a pause event from the old track could run after a replacement file was selected and overwrite its loading status. We already had guards around asynchronous Play calls, but those guards didn't identify queued browser events. The fix moved pause-status changes to the user's explicit Pause action and synchronized transport immediately on file replacement. This rule makes that lesson part of the factory's instructions instead of leaving it in one PR's history.

Day 1 review: https://github.com/vracton/particle-viz/pull/1#issuecomment-6771503839

Review Standards import/activation: pending verification.
