# Arrow Escape API

Core gameplay is local. The API provides health/readiness and optional guidance.

## Endpoints

- `GET /health` returns `{status, service, version}` without secrets.
- `GET /health/ready` returns `200` when configured and `503` with a safe envelope
  when optional provider configuration is unavailable.
- `POST /api/v1/ai/hint` accepts a bounded current puzzle snapshot and mode
  `hint`, `explanation`, or `coach`.

The canonical request/response schemas are in
[contracts/openapi.yaml](../specs/001-arrow-escape-v1/contracts/openapi.yaml).

## Safety

- CORS allows only configured frontend origins.
- Bodies larger than 64 KiB are rejected before parsing.
- AI requests are limited to 20 per minute per client IP in V1.
- Every response carries `X-Request-ID`.
- Errors use `{error: {code, message, requestId}}` and never expose tracebacks,
  provider payloads, internal hosts, credentials, or raw upstream messages.
- AI responses pass schema, current-state, legal-path, and solver validation.
- Any client network failure, timeout, invalid response, or non-success status
  uses the deterministic local hint instead.

## Configuration

The model defaults to `google/gemma-4-26B-A4B-it` through backend settings. The
name and credential are not hardcoded in frontend code or committed environment
files.
