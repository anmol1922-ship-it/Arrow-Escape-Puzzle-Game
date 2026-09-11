from collections import defaultdict, deque
from time import monotonic


class InMemoryRateLimiter:
    def __init__(self, max_requests: int = 20, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: dict[str, deque[float]] = defaultdict(deque)

    def allow(self, key: str) -> bool:
        now = monotonic()
        timestamps = self._requests[key]
        while timestamps and now - timestamps[0] >= self.window_seconds:
            timestamps.popleft()
        if len(timestamps) >= self.max_requests:
            return False
        timestamps.append(now)
        return True
