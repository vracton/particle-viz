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

## Qodo Review Standards

Pending workspace sign-in and verification. After the branch is pushed, check Review Standards for this repository's rules. If missing, use Import rules and skills for `vracton/particle-viz`; check whether imported rules need activation. Do not describe the rules as imported or active until the workspace confirms it.

## Rule scope

The root instructions use principles that apply across the project, rather than prescribing individual Day 1 bug fixes. The host/visualizer rule includes an explicit least-access policy for visualizer-building agents, backed by a self-contained `docs/visualizer-api.md` reference. This is instruction-level scope, not a filesystem sandbox. The Day 1 review remains an example of why lifecycle ownership matters; the nominated rule explains the product-wide host/visualizer access boundary.

## Submission

Use `discussion-day-02.md` after the nominated rule and Review Standards status have been finalized. The Discussion is not posted on the user's behalf.

## Documentation review decisions

Qodo reviewed the initial draft in PR #2. Its two documentation findings were addressed: the root guide now explicitly states that generic visualizer discovery/selection/name binding is future work, and public submission links point to main so deleting the feature branch will not break them. No runtime feature was added to satisfy documentation wording.
