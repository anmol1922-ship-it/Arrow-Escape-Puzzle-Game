import httpx

from ..config.settings import Settings
from ..exceptions.errors import ProviderResponseError, ProviderTimeoutError, ProviderUnavailableError
from ..schemas.ai import AiGuidanceRequest, AiGuidanceResponse


class GemmaProvider:
    def __init__(self, settings: Settings):
        self.settings = settings

    async def get_guidance(self, request: AiGuidanceRequest, request_id: str) -> AiGuidanceResponse:
        if not self.settings.gemma_base_url or not self.settings.gemma_api_key:
            raise ProviderUnavailableError('provider is not configured')
        payload = {
            'model': self.settings.gemma_model,
            'input': request.model_dump(mode='json'),
            'mode': request.mode,
        }
        try:
            async with httpx.AsyncClient(timeout=self.settings.gemma_timeout_seconds) as client:
                response = await client.post(
                    self.settings.gemma_base_url,
                    json=payload,
                    headers={'Authorization': f'Bearer {self.settings.gemma_api_key}'},
                )
                response.raise_for_status()
                data = response.json()
        except httpx.TimeoutException as error:
            raise ProviderTimeoutError from error
        except (httpx.HTTPError, ValueError) as error:
            raise ProviderResponseError from error
        try:
            return AiGuidanceResponse.model_validate({**data, 'source': 'ai', 'request_id': request_id})
        except Exception as error:
            raise ProviderResponseError from error
