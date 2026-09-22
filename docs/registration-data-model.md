# PMB registration data model

Registration data is written only by the server through `POST /api/applications`. Browser access to the collections remains denied by Firestore rules.

## Collections

### `PmbApplications/{applicationId}`

The authoritative application record. Every document includes:

- `schemaVersion`: document-shape version for future migrations.
- `revision`: optimistic workflow revision, starting at `1`.
- `applicationNumber`: public reference such as `PMB26-AB12CD34`.
- `cycleId` and `cycle`: stable admission-cycle ID plus its label snapshot.
- `status`: code, display-label snapshot, and change timestamp.
- `applicant`: identity, birth data, address, contact details, and school origin.
- `selection`: pathway and ordered program choices. Codes stay stable; labels and faculty names are stored as historical snapshots.
- `discovery`: normalized source codes and label snapshots.
- `search`: normalized values intended for future admin lookup.
- `submission`: channel and locale.
- `submittedAt` and `updatedAt`: Firestore timestamps.

Keep new fields additive where possible. When an incompatible shape is required, increment `schemaVersion` and migrate deliberately instead of changing the meaning of an existing field.

### `PmbApplicationEvents/{eventId}`

Append-only workflow history. The first event is `application.submitted`; later payment, verification, selection, and enrolment stages should add events rather than overwriting history.

### `PmbSubmissionKeys/{keyHash}`

Maps a one-time browser idempotency key to the created application. It prevents duplicate records when a request is retried. `expiresAt` is suitable for a Firestore TTL policy.

### `PmbSubmissionAttempts/{fingerprintHash}`

Shared server-side throttling state. Only a one-way request fingerprint is stored; raw IP addresses and user-agent strings are not persisted.

## Query strategy

The primary admin listing orders `PmbApplications` by `submittedAt`. Future filtered views should query stable fields such as `cycleId`, `status.code`, `selection.pathway.code`, or `selection.programChoices[].code`, adding only the Firestore composite indexes required by actual screens.

Do not use label text as a join key. Catalog labels can change, while the stable codes in `lib/admissions-catalog.ts` remain the integration contract.
