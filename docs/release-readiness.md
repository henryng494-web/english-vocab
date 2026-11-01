# Jungle Jokers — release readiness audit

Audit baseline: main `d4ecc8eac90304430c364971bebff4e0ba88d771` (iOS build 17), 2026-11-01.

## Verified evidence

- Owner reports build 17 fixes the initial-login/Account loop and purchase-to-Pro activation on TestFlight. This is device evidence from the owner, not an independent device test by this agent.
- Auth/Pro regression suite covers persisted session initialization, nickname event loops, native entitlement lookup, navigation and stale entitlement responses.
- Production database inspection found RLS enabled on `word_bank`, `word_details` and `user_learning`. Catalog SELECT is public; learning rows are constrained by `auth.uid() = user_id`.
- No real account was deleted and no purchase was initiated during this audit.

## Fixes in this change

- Account deletion now requires an access token before deleting local data. Previously a missing session skipped server deletion and still erased local storage, making deletion appear successful. Server refusal continues to preserve local data for retry.
- Feedback now returns failure when the configured delivery webhook rejects the request, instead of reporting success.
- Regression tests cover both deletion refusal paths and both webhook delivery outcomes.

## Remaining release blockers

| Priority | Finding and evidence | Required completion |
| --- | --- | --- |
| P0 | Personal learning/review data uses device-wide localStorage keys (`learning-storage.ts`, `review-schedule.ts`, `review-session-storage.ts`). Sign-out does not isolate those stores. `AuthSessionContext.tsx` can reuse a local nickname for the next user. Database RLS does not isolate local data. | Partition personal storage and in-memory bootstrap state by authenticated user; define guest-data migration; test A → sign out → B → A without data/name/Pro leakage or loss. Preserve existing users' progress during migration. |
| P0 | Forgot-password sends a link to `/auth/callback?next=/account`; no new-password page exists. Mobile uses PKCE, while email may open a browser outside the WebView that holds its verifier. | Implement and test the complete recovery flow, including opening the email on the same device in an external browser, setting a new password, and signing into the app again. Verify allowed redirect URLs and actual email delivery. |
| P1 | Without `FEEDBACK_WEBHOOK_URL`, feedback only logs payload/image metadata; attachment bytes are not retained. | Configure and verify a durable support delivery channel, or clearly communicate the fallback. Test a screenshot reaches the support destination. |
| P1 | Privacy/terms pages are generic and need reconciliation with actual auth, purchase and data processing behavior. | Review factual provider disclosures, contact/deletion instructions and subscription information before store submission. Confirm App Store privacy answers match implementation. |

## Further verification before submission

- Test fresh install and upgrade from 17, signup/email confirmation, expired sessions, background/foreground, offline startup and sign-out/account switching.
- Verify restore purchases after reinstall, cancellation, expiration and interrupted purchases. Confirm sandbox behavior separately from production approval status.
- Supabase security advisor flags leaked-password protection as disabled; evaluate enabling it for the production auth configuration.
- Confirm build commit SHA and iOS CFBundleVersion from the actual uploaded artifact; Capawesome job number is distinct from CFBundleVersion.
- Prepare reviewer access, screenshots, support/privacy URLs and subscription metadata. This audit does not certify App Store approval readiness.

## Execution limits

This environment has no iOS device/Xcode and exposes no Capawesome Cloud tool. Local checks cannot replace TestFlight verification. No native build/upload or App Store submission was performed. These small fixes do not resolve the remaining P0 items above.
