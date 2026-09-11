from fastapi import APIRouter, Depends, HTTPException, Request

from ..config.settings import Settings, get_settings
from ..schemas.ai import AiGuidanceRequest, AiGuidanceResponse
from ..services.ai_service import get_guidance
from ..services.rate_limiter import InMemoryRateLimiter
from ..validators.puzzle_validator import validate_snapshot

router = APIRouter(prefix='/api/v1/ai', tags=['ai'])
_limiter = InMemoryRateLimiter()


@router.post('/hint', response_model=AiGuidanceResponse)
async def ai_hint(request: Request, payload: AiGuidanceRequest, settings: Settings = Depends(get_settings)) -> AiGuidanceResponse:
    client_key = request.client.host if request.client else 'unknown'
    _limiter.max_requests = settings.ai_rate_limit_count
    if not _limiter.allow(client_key):
        raise HTTPException(status_code=429, detail='rate limited')
    validate_snapshot(payload)
    request_id = getattr(request.state, 'request_id', 'unknown')
    return await get_guidance(payload, request_id, settings)
