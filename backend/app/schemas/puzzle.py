from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

Direction = Literal['UP', 'DOWN', 'LEFT', 'RIGHT']


class ActiveArrow(BaseModel):
    model_config = ConfigDict(extra='forbid')

    id: str = Field(min_length=1, max_length=64)
    row: int = Field(ge=0, le=6)
    column: int = Field(ge=0, le=6)
    direction: Direction


class PuzzleSnapshot(BaseModel):
    model_config = ConfigDict(extra='forbid')

    puzzle_id: str = Field(min_length=1, max_length=64)
    board_size: int = Field(ge=4, le=7)
    moves: int = Field(ge=0)
    mistakes: int = Field(ge=0)
    arrows: list[ActiveArrow] = Field(min_length=1, max_length=49)

    @field_validator('arrows')
    @classmethod
    def unique_arrows(cls, arrows: list[ActiveArrow]) -> list[ActiveArrow]:
        ids = [arrow.id for arrow in arrows]
        positions = [(arrow.row, arrow.column) for arrow in arrows]
        if len(ids) != len(set(ids)):
            raise ValueError('arrow IDs must be unique')
        if len(positions) != len(set(positions)):
            raise ValueError('arrow positions must be unique')
        return arrows
