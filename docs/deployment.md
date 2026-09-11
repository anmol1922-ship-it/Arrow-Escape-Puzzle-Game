# Arrow Escape Build and Release

V1 is browser-first and has no production auto-deployment. Build the frontend
with `npm run build`; this validates all bundled levels, TypeScript, and the PWA
asset graph. Run backend tests from `backend/` and probe `/health` before release.

CI runs on pushes and pull requests. The release workflow runs only for `v*` tags
after repeating required checks. It packages:

- `frontend-dist.zip`
- `backend-package.zip`
- test results
- build logs

Artifacts include commit, ref, tag, and run metadata. A failed validation step
stops packaging. Credentials stay in the hosting environment and are never
committed. Capacitor packaging is intentionally deferred until browser acceptance
is complete.
