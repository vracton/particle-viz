# Day 2 — your factory, your rules

Challenge: https://hackathon.qodo.ai/challenges/?day=02
Discussion entry point: https://qodo.ai/hackathon-day-2
Repository instructions: https://github.com/vracton/particle-viz/blob/main/AGENTS.md

## Deliverable

A root `AGENTS.md` describing Particle Viz, its current scope, repository map, working conventions, setup/verification commands, and five broad project rules. Each rule includes its scope and reason:

1. One host, many visualizers.
2. Shared behavior belongs in the contract.
3. Own the whole lifecycle.
4. Local by default, external by intent.
5. Deliver the requested increment with evidence.

No application feature or design changes. The profile-frame bonus is excluded.

## Qodo Review Standards — verified November 10, 2026

PR #2 was merged: https://github.com/vracton/particle-viz/pull/2

Imported rules using Qodo's **Import rules and skills** for `vracton/particle-viz`. Review Standards shows **11 active rules**, all from **AGENTS.md**, with repository-specific scope. The Pending rules tab is empty. Manual import activated these rules; the workspace's auto-approval settings were not changed. The existing rule-violation review check is enabled, and AGENTS.md is already in the rule-source filename list.

The imported code-review standards are:

1. Use shared accent settings for configurable visualizer palettes.
2. Update affected callers when the host/module contract changes.
3. Show initialization failures to the user.
4. Schedule visualizer animation only in the host.
5. Release owned resources on replacement or disposal.
6. Recreate resources invalidated by browser recovery.
7. Prevent stale asynchronous work from updating newer operation state.
8. Preserve reduced-motion support in interface changes.
9. Keep local playback music and derived data on-device.
10. Keep audio playback and analysis in the host.
11. Expose reusable visualizer behavior through an explicit module contract.

Qodo extracts reviewable code standards rather than copying every instruction verbatim. The visualizer-agent read/write allowlist remains an instruction policy in AGENTS.md; it was not extracted as a code-review rule and is not filesystem enforcement. A future runner must enforce equivalent file access limits.

Evidence: `day-02-qodo-standards.jpg` (cropped to the Review Standards workspace to exclude account details).

## Rule scope

The root instructions use principles that apply across the project, rather than prescribing individual Day 1 bug fixes. The host/visualizer rule includes an explicit least-access policy for visualizer-building agents, backed by a self-contained `docs/visualizer-api.md` reference. This is instruction-level scope, not a filesystem sandbox. The Day 1 review remains an example of why lifecycle ownership matters; the nominated rule explains the product-wide host/visualizer access boundary.

## Submission

Use the ready-to-paste `discussion-day-02.md`, which includes the nominated rule, its story, and the verified Review Standards result. The Discussion is not posted on the user's behalf.

## Documentation review decisions

Qodo reviewed the initial draft in PR #2. Its two documentation findings were addressed: the root guide now explicitly states that generic visualizer discovery/selection/name binding is future work, and public submission links point to main so deleting the feature branch will not break them. No runtime feature was added to satisfy documentation wording.

## Verification

Content/diff checks passed. Confirmed five root rules, setup/check commands, the API reference, and an exact match between the submission quote and AGENTS.md. Independent agent review checked the broad guidance and the least-access policy. Runtime tests were not repeated because the changes are documentation-only. Qodo import was verified in the live workspace, including the Active state and repository-specific scope.
