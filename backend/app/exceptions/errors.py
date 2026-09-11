class ProviderUnavailableError(Exception):
    pass


class ProviderTimeoutError(Exception):
    pass


class ProviderResponseError(Exception):
    pass


class RateLimitExceededError(Exception):
    pass
