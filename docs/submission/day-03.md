# Day 3: GitHub Issues run

Challenge: https://hackathon.qodo.ai/challenges/?day=03
Discussion: https://github.com/orgs/qodo-hackathon/discussions/5

## Ticket connection

Used the connected GitHub MCP tools to create issues #3, #4, and #5, list the open backlog, and fetch #3 with its description and acceptance criteria. Tickets run in order: glass player, concise-copy instructions, then the GPT-6.1 Sol shader. Each gets a separate branch and PR. Review feedback is evaluated before starting the next ticket.

## Issue #3: glass player

Ticket: https://github.com/vracton/particle-viz/issues/3
Branch: `codex/issue-3-glass-player`
PR: https://github.com/vracton/particle-viz/pull/6

Delivered a full-viewport canvas, two small metadata controls, and a translucent playback dock. Removed headline, slogans, badges, renderer tags, duplicate labels, and routine visible status prose. File errors and graphics failures remain visible; ordinary transport state is announced through a live region.

Acceptance checks:

- Desktop and 390px mobile screenshots: `day-03-glass-desktop.jpg`, `day-03-glass-mobile.jpg`.
- Long filename truncates; at 390px the page width is 390px, the dock stays inside the viewport, and its controls remain reachable.
- Invalid WAV shows an error; a valid 60-second generated WAV recovers, plays, seeks to 50% (0:30), and pauses. Accent changes work.
- Enter starts playback and Space pauses through the focused button.
- Forced WebGL context loss shows a readable message; restoration clears it and rendering resumes.
- `npm test`: 3 passing. `npm run build`: passed.
- Qodo review: https://github.com/vracton/particle-viz/pull/6#issuecomment-6777546859. One confirmed medium issue: at 320×180 CSS pixels the fixed dock covered the selector. Reproduced the overlap, then added a short-height flow/scroll layout and rechecked selector and playback access. The original 390px portrait check did not cover this case. Qodo also read linked GitHub issue #3 and the 11 active standards as review context.
- Feedback carried forward: check both narrow width and short height for overlaid controls; preserve concise visible errors when simplifying text. This is a check in the UI acceptance workflow, not a new framework or skill.

The current dots are intentionally unchanged in this ticket. The shader replacement belongs to issue #5.

## Issue #4: concise interface instructions

Ticket: https://github.com/vracton/particle-viz/issues/4
Status: not started; awaiting issue #3 review.

## Issue #5: GPT-6.1 Sol shader

Ticket: https://github.com/vracton/particle-viz/issues/5
Status: not started; awaiting issue #4 review.
