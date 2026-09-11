from typing import Literal

from pydantic import BaseModel, ConfigDict


class HealthResponse(BaseModel):
    model_config = ConfigDict(extra='forbid')

    status: Literal['healthy']
    service: str
    version: str


class ReadinessResponse(BaseModel):
    model_config = ConfigDict(extra='forbid')

    status: Literal['ready']
    service: str
    version: str
