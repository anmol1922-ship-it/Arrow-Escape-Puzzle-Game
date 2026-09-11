from ..config.settings import Settings


def health(settings: Settings) -> dict[str, str]:
    return {'status': 'healthy', 'service': settings.service_name, 'version': settings.service_version}


def ready(settings: Settings) -> bool:
    return settings.ai_provider.lower() != 'gemma' or bool(settings.gemma_base_url and settings.gemma_api_key)
