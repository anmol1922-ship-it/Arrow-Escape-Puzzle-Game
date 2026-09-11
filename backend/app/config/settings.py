from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    service_name: str = 'arrow-escape-api'
    service_version: str = '1.0.0'
    ai_provider: str = 'local'
    gemma_model: str = 'google/gemma-4-26B-A4B-it'
    gemma_base_url: str | None = None
    gemma_api_key: str | None = Field(default=None, repr=False)
    gemma_timeout_seconds: float = 5.0
    cors_origins: str = 'http://localhost:5173'
    max_request_bytes: int = 65536
    ai_rate_limit: str = '20/minute'

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(',') if origin.strip()]

    @property
    def ai_rate_limit_count(self) -> int:
        try:
            return int(self.ai_rate_limit.split('/', 1)[0])
        except (ValueError, IndexError):
            return 20


@lru_cache
def get_settings() -> Settings:
    return Settings()
