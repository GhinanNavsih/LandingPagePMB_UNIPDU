# PMB UNIPDU landing page

Next.js 15 landing page with a protected content editor at `/admin`. Admins sign in using Firebase Authentication; active access is granted by `LandingPageAdmins/{uid}`. The server verifies the session and the active admin record on every protected request. There is no public admin registration endpoint. Node.js 22 is configured for App Hosting.

## Run locally

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and configure the Firebase web API key and optional Gemini key. Never commit `.env.local`.
3. Authenticate with `gcloud auth application-default login`, or use `GOOGLE_APPLICATION_CREDENTIALS` pointing to a service account outside this repository.
4. Run `npm run dev`, then open `/admin`.

The current Firebase project is `pmbunipdu-d6a41`. Local development uses that project's Firestore database unless `FIRESTORE_EMULATOR_HOST` is set. The app fails explicitly on database errors instead of displaying old bundled content as though a save succeeded.

## Admin provisioning

Enable Email/Password in Firebase Authentication. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the shell (or a temporary, ignored environment file), then run `npm run admin:provision`. The command creates a Firebase Auth user and an active admin record, and seeds the existing landing page content only when no content exists. It never resets an existing user's password or overwrites existing content. Use Firebase Authentication's account recovery tools if an admin loses access.

In `/admin`, edit a section, then choose **Simpan & publikasikan**. The server validates all fields and atomically saves the content with an audit entry. Version checks reject overwrites from stale tabs. New page loads and chatbot requests read the saved content immediately. Already-open visitor pages receive changes when refreshed. Admins can change their own password under **Akun admin**; password changes and logout revoke existing sessions.

The landing-page registration buttons open `/pendaftaran`. The four-step form stores validated submissions through a server-only API and shows the applicant a reference number after a successful write. The protected admin area includes **Data pendaftar** for reviewing recent submissions. The versioned Firestore shape and lifecycle collections are documented in `docs/registration-data-model.md`.

The dormitory information is centrally managed. It is omitted from the admin response and editor, and the server restores the canonical section on every content read and write, so a direct request cannot replace it. To apply this policy to an existing database document, run `npm run admin:lock-dormitories` once with the same Firebase credentials used for provisioning.

## Firebase App Hosting

The App Hosting backend `pmb-landing` is associated with the existing web app `1:639852479553:web:cdee5d74ae41f951a032c0` in `pmbunipdu-d6a41`, with `us-central1` and Node.js 22. `apphosting.yaml` and `firebase.json` configure local source deployment. The project must be on the Blaze plan before App Hosting can create a rollout; after billing is enabled, run `firebase deploy --only apphosting:pmb-landing`. The Firebase Admin SDK uses the backend's Application Default Credentials; do not upload a private key. The runtime service account needs Firestore read/write and Firebase Authentication administration access (including session-cookie creation and revocation).

App Hosting supplies `FIREBASE_WEBAPP_CONFIG` for an associated Firebase web app. Alternatively, set `FIREBASE_WEB_API_KEY` in the backend's environment. Configure `GEMINI_API_KEY` as a secret for the chatbot and `GEMINI_MODEL` if needed. Set `APP_ORIGIN` only if the reverse proxy rewrites the original host; it must equal the public HTTPS origin with no trailing slash.

Collections are isolated from the existing PMB application:

- `LandingPageContent/main`: published content and version.
- `LandingPageAdmins/{uid}`: server-side admin allowlist.
- `LandingPageLoginAttempts/{hash}`: shared login throttling (8 attempts per 15-minute window).
- `LandingPageAudit/{id}`: publication metadata.
- `LandingPageSessions/{hash}`: session membership, expiration and revocation version (no raw session tokens).
- `PmbApplications/{id}`: versioned applicant, program choice, source, status and search data.
- `PmbApplicationEvents/{id}`: append-only registration workflow history.
- `PmbSubmissionKeys/{hash}`: retry-safe application idempotency records.
- `PmbSubmissionAttempts/{hash}`: public-form submission throttling without raw network identifiers.

All collections above must deny direct browser access in Firestore rules. Only the server Admin SDK accesses them. This repository intentionally does not replace the shared project's Firestore rules. Check the deployed rules before provisioning, especially any wildcard grants that might permit access to new collections. Session and submission-key records have an `expiresAt` timestamp suitable for a Firestore TTL policy; session access is rejected immediately on expiration even without TTL cleanup. Login and submission-attempt documents have a numeric `resetAt`; optionally schedule maintenance to remove old entries. Never delete records inside an active throttle window.

## Checks

`npm run typecheck`, `npm test`, and `npm run build` validate types, schema behavior, and production compilation. `npm run test:registration` uses an isolated Firestore emulator to verify registration validation, persistence, idempotency, cross-origin protection, and the honeypot without writing to production. `npm run test:integration` requires the Firebase CLI, Java 21+, and Chrome. It starts isolated Authentication and Firestore emulators for `demo-unipdu-landing` and checks browser login, responsive editing, database writes and public read-back, authorization, stale saves, password changes, logout, and login throttling. Both integration commands refuse to run against a live database.
