from fastapi import APIRouter, Depends, HTTPException

from ..config.settings import Settings, get_settings
from ..schemas.health import HealthResponse, ReadinessResponse
from ..services.health_service import health, ready

router = APIRouter(tags=['health'])


@router.get('/health', response_model=HealthResponse)
def get_health(settings: Settings = Depends(get_settings)) -> HealthResponse:
    return HealthResponse(**health(settings))


@router.get('/health/ready', response_model=ReadinessResponse)
def get_readiness(settings: Settings = Depends(get_settings)) -> ReadinessResponse:
    if not ready(settings):
        raise HTTPException(status_code=503, detail='not ready')
    return ReadinessResponse(status='ready', service=settings.service_name, version=settings.service_version)
