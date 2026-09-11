"""V1 keeps puzzle authority in the browser; this service exposes no remote move authority."""


def puzzle_service_status() -> dict[str, str]:
    return {"authority": "frontend-deterministic-engine", "status": "local-only"}
