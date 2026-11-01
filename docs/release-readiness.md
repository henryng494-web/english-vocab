# Jungle Jokers — release readiness

Updated 2026-11-01. This change prepares iOS/Android build 18. The owner confirmed build 17 fixes login and purchase activation.

## Implemented

- Personal storage (learning, review schedules/sessions, placement, nickname, counters, streaks, bootstrap and Pro cache) is partitioned by user UUID, with a separate guest scope. Device language/interface preferences remain shared.
- Auth resolves the owner before mounting personal-data consumers. Account changes remount their React state without replaying the cold-start welcome. The signed-in login page completes navigation after remount.
- Bootstrap, summaries, async save rollback and entitlement checks discard stale work after account changes, including A → B → A. Personalized module caches are scoped too.
- RevenueCat configuration and identity transitions are serialized. Status, purchase and restore wait for the correct user. Cold-start guests clear a previously identified SDK user. Nickname hydration no longer writes another learner's name into a new account; explicit edits still sync.
- Password reset uses an isolated nonpersistent implicit client. The existing HTTPS `/auth/callback?next=/auth/reset-password` redirects to a public bilingual password page; HTTP navigation preserves its token fragment. No WebView PKCE verifier is needed in Safari. Credentials are removed from the address bar, validated, held in memory and kept away from ordinary auth/RevenueCat providers. Invalid/expired links and mismatched passwords are rejected. Success asks the user to reopen the app and sign in.
- Account deletion requires a session and server success, then clears the current learner's records rather than all accounts' progress.
- Feedback failures are surfaced. Without a webhook, the UI preserves the draft and offers `support@junglejokers.com`; it does not claim screenshot delivery. A durable in-app receiver is still optional configuration.
- Privacy/provider/deletion disclosures and subscription/restore/support information were expanded in Vietnamese and English. App Store privacy answers still require the owner's review.

## Migration

On first upgrade, legacy device-wide progress is copied once to the account whose initial auth session resolves. Originals remain as recovery backups. Legacy Pro is never trusted: RevenueCat rechecks it. Later accounts cannot read legacy keys.

Guest progress remains in the guest scope, available on sign-out, and is not automatically merged into an account. If an old signed-in flag exists but no user session resolves, ownership is unknown: legacy records remain backed up and are not assigned to the next person. Historically mixed records cannot be reliably separated automatically. Migration deletes no server learning records.

## Verification

- 26 automated regressions cover auth initialization, native navigation, Pro activation/stale checks, all personal keys across A/guest/B/A, migration/backup/deletion isolation, stale summaries, serialized SDK identity, recovery validation/callback routing, the actual Supabase SDK recovery request without a PKCE challenge, and feedback failures.
- TypeScript and ESLint on changed files; existing warnings in Discover/Review/review-schedule remain outside this change's scope.
- Mobile static export and bundle verification include Account, Login and Reset password HTML/RSC routes. Local exports use fixture public configuration and omit sparse-checkout media; they are not distributable IPAs. Capawesome must build main with the real existing environment.
- Read-only SQL reconfirmed RLS enabled on catalog and `user_learning`. No schema/auth settings changed; no real account deletion, purchase or recovery email was initiated.

## Still needs device/configuration verification

1. Upgrade from 17 while signed in; confirm current progress, then A → sign out → B → A and separate learning, names, streaks and Pro.
2. Request a reset from 18, open email in Safari, save a password and sign in on the app. Also test expiration. Actual SMTP delivery, templates and the production redirect allowlist cannot be inspected through the exposed connector; this change reuses the existing callback path.
3. Fresh install/signup/email confirmation, offline/background startup, restore after reinstall, cancellation and expiration. Sandbox success does not prove production approval.
4. For in-app screenshot delivery, configure `FEEDBACK_WEBHOOK_URL` with a receiver that retains attachments and verify receipt. The email fallback is available without it.
5. Complete App Store privacy answers, subscription metadata, reviewer access and screenshots. The earlier Supabase advisor warning about disabled leaked-password protection still requires project-setting review.

No Capawesome tool, Xcode or iOS device is exposed here. No native upload or App Store submission is implied.

References: [Supabase recovery](https://supabase.com/docs/guides/auth/passwords), [RevenueCat identity](https://www.revenuecat.com/docs/customers/identifying-customers), [Apple subscription management](https://support.apple.com/en-au/118428).
