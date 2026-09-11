#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [[ -f "$ROOT_DIR/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
fi

FRONTEND_PORT="${FRONTEND_PORT:-5173}"
BACKEND_PORT="${BACKEND_PORT:-8000}"
RUN_BACKEND="${RUN_BACKEND:-1}"
VITE_API_BASE_URL="${VITE_API_BASE_URL:-http://localhost:${BACKEND_PORT}}"
CORS_ORIGINS="${CORS_ORIGINS:-http://localhost:${FRONTEND_PORT},http://127.0.0.1:${FRONTEND_PORT}}"

export FRONTEND_PORT BACKEND_PORT RUN_BACKEND VITE_API_BASE_URL CORS_ORIGINS

if [[ ! -d "$ROOT_DIR/frontend/node_modules" ]]; then
  printf 'Frontend dependencies are missing. Run: (cd frontend && npm install)\n' >&2
  exit 1
fi

if [[ "$RUN_BACKEND" == "1" && ! -x "$ROOT_DIR/backend/.venv/bin/uvicorn" ]]; then
  printf 'Backend environment is missing. Run the setup commands in README.md or set RUN_BACKEND=0.\n' >&2
  exit 1
fi

frontend_pid=""
backend_pid=""

cleanup() {
  trap - EXIT INT TERM
  [[ -n "$frontend_pid" ]] && kill "$frontend_pid" 2>/dev/null || true
  [[ -n "$backend_pid" ]] && kill "$backend_pid" 2>/dev/null || true
  [[ -n "$frontend_pid" ]] && wait "$frontend_pid" 2>/dev/null || true
  [[ -n "$backend_pid" ]] && wait "$backend_pid" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

printf 'Frontend: http://localhost:%s\n' "$FRONTEND_PORT"

(cd "$ROOT_DIR/frontend" && npm run dev -- --host 127.0.0.1 --port "$FRONTEND_PORT") &
frontend_pid=$!

if [[ "$RUN_BACKEND" == "1" ]]; then
  printf 'Backend:  http://localhost:%s\n' "$BACKEND_PORT"
  (cd "$ROOT_DIR/backend" && .venv/bin/uvicorn app.main:app --host 127.0.0.1 --port "$BACKEND_PORT") &
  backend_pid=$!
else
  printf 'Backend:  disabled (RUN_BACKEND=0)\n'
fi

if [[ -n "$backend_pid" ]]; then
  wait -n "$frontend_pid" "$backend_pid"
else
  wait "$frontend_pid"
fi
