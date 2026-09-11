import pytest

from app.config.settings import Settings
from app.exceptions.errors import ProviderUnavailableError
from app.providers.gemma_provider import GemmaProvider
from app.schemas.ai import AiGuidanceRequest


@pytest.mark.asyncio
async def test_unconfigured_provider_fails_without_exposing_credentials():
    provider = GemmaProvider(Settings(ai_provider='gemma'))
    request = AiGuidanceRequest.model_validate({
        'puzzle_id': 'level-001', 'board_size': 4, 'moves': 0, 'mistakes': 0, 'mode': 'hint',
        'arrows': [{'id': 'a1', 'row': 0, 'column': 0, 'direction': 'RIGHT'}],
    })
    with pytest.raises(ProviderUnavailableError):
        await provider.get_guidance(request, 'request-id')
