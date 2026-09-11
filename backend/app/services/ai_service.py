from ..config.settings import Settings
from ..exceptions.errors import ProviderResponseError, ProviderTimeoutError, ProviderUnavailableError
from ..providers.gemma_provider import GemmaProvider
from ..schemas.ai import AiGuidanceRequest, AiGuidanceResponse
from ..validators.ai_validator import local_guidance, validate_ai_response


async def get_guidance(request: AiGuidanceRequest, request_id: str, settings: Settings) -> AiGuidanceResponse:
    if settings.ai_provider.lower() != 'gemma':
        return local_guidance(request, request_id)
    provider = GemmaProvider(settings)
    try:
        response = await provider.get_guidance(request, request_id)
        return validate_ai_response(request, response)
    except (ProviderUnavailableError, ProviderTimeoutError, ProviderResponseError, ValueError):
        return local_guidance(request, request_id)
