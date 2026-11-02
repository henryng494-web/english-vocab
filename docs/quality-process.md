# Automated quality checks

App quality runs on main pushes, pull requests, daily at 18:00 UTC (05:00 Sydney during daylight saving), and manual dispatch. It executes 49 deterministic regressions for auth/account isolation, restored learning, Family gestures, Review loading and purchase/trial logic, plus TypeScript. It does not require production credentials and never purchases, deletes accounts, or changes production data.

Every run retains diagnostic text artifacts for 14 days. A failing main run creates or updates one open `[Quality] Automated regression failure` issue with the commit and Actions link. Pull requests from forks have read-only permissions and cannot create these issues. Reporting failures remain visible in the Actions report job. Successful reruns do not automatically close an issue: verify the repair and close it with evidence.

A separate ChatGPT daily task inspects the repository reports, reproduces confirmed bugs, prepares focused fixes and regression tests, and reports changes. Its access and execution availability must be verified on each run; a schedule alone does not guarantee unattended native builds.

## Remaining coverage

These Node harnesses mock external services. They do not exercise the live iOS WebView, actual StoreKit, account data on a user's phone, or validate live RLS/API availability. Native crash collection, authenticated device UI tests and a device farm are not installed by this workflow. Never call these checks an end-to-end iPhone test.

Outstanding device regression: Rank bands above 3000 are visible but selecting does not switch bands. PR300 only changed scrolling and is not a verified fix. Reproduce the selection/data loading transition before making another change.

For each confirmed failure: reproduce, preserve the failing test, fix narrowly, run targeted checks and TypeScript, review the diff, merge the PR after required checks pass, then prepare a TestFlight build when required. App Review submission and public release remain separate actions.
