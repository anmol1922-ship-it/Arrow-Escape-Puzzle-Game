from typing import Protocol

from ..schemas.ai import AiGuidanceRequest, AiGuidanceResponse


class AIProvider(Protocol):
    async def get_guidance(self, request: AiGuidanceRequest, request_id: str) -> AiGuidanceResponse:
        ...
