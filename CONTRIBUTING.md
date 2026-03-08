# Contributing

## Local setup

```bash
npm install
npm run dev
```

## Project principles

- keep the planner state normalized and shared across all modes
- prefer local assets and deterministic demo behavior
- preserve 1:1 meter semantics in planning interactions
- test visual changes with the Playwright workflow and fresh screenshots

## Pull request expectations

- explain the user-visible change
- note any affected planner commands or data structures
- include screenshots or short recordings for UI changes
- run `npm run build` before opening the PR

## Scope guidance

Good contributions:

- planner UX improvements
- catalog and inspector enhancements
- export quality improvements
- validation rule improvements
- accessibility and responsiveness fixes

Avoid in isolated PRs:

- large unrelated refactors
- asset dumps without registry wiring
- backend additions that bypass the local-first demo model
