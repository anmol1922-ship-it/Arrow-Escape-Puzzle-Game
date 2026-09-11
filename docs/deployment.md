# Arrow Escape Build and Release

The frontend is deployed to GitHub Pages at:

https://anmol1922-ship-it.github.io/Arrow-Escape-Puzzle-Game/

The Pages workflow builds the Vite frontend with the project-site base path,
creates a single-page-app fallback, and deploys only from `main`. Pull requests
run the same frontend build without publishing a deployment.

V1 is browser-first. The optional backend is not deployed with the frontend;
AI guidance remains available through the configured API when that service is
running, and local deterministic play remains fully functional without it.

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
