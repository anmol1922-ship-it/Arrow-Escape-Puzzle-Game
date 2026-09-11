from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from .puzzle import ActiveArrow


class AiGuidanceRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')

    puzzle_id: str = Field(min_length=1, max_length=64)
    board_size: int = Field(ge=4, le=7)
    moves: int = Field(ge=0)
    mistakes: int = Field(ge=0)
    arrows: list[ActiveArrow] = Field(min_length=1, max_length=49)
    mode: Literal['hint', 'explanation', 'coach']


class AiGuidanceResponse(BaseModel):
    model_config = ConfigDict(extra='forbid')

    arrow_id: str
    hint: str = Field(min_length=1, max_length=280)
    reason: str = Field(min_length=1, max_length=280)
    confidence: float = Field(ge=0, le=1)
    source: Literal['ai', 'local']
    request_id: str


class ErrorDetail(BaseModel):
    model_config = ConfigDict(extra='forbid')

    code: str
    message: str
    request_id: str


class ErrorEnvelope(BaseModel):
    model_config = ConfigDict(extra='forbid')

    error: ErrorDetail
