from uuid import uuid4

from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


def request_id(request: Request) -> str:
    return getattr(request.state, 'request_id', request.headers.get('X-Request-ID', str(uuid4())))


def safe_error(request: Request, status_code: int, code: str, message: str) -> JSONResponse:
    correlation_id = request_id(request)
    response = JSONResponse(
        status_code=status_code,
        content={'error': {'code': code, 'message': message, 'requestId': correlation_id}},
    )
    response.headers['X-Request-ID'] = correlation_id
    return response


async def validation_exception_handler(request: Request, _exc: RequestValidationError) -> JSONResponse:
    return safe_error(request, 400, 'INVALID_REQUEST', 'Invalid puzzle state.')


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    messages = {404: 'That resource is unavailable.', 413: 'That request is too large.', 429: 'Too many requests. Please try again shortly.', 503: 'Guidance is unavailable right now. Your game is still playable.'}
    code = {404: 'NOT_FOUND', 413: 'REQUEST_TOO_LARGE', 429: 'RATE_LIMITED', 503: 'SERVICE_UNAVAILABLE'}.get(exc.status_code, 'INVALID_REQUEST')
    message = messages.get(exc.status_code, 'We could not complete that request.')
    return safe_error(request, exc.status_code, code, message)


async def unexpected_exception_handler(request: Request, _exc: Exception) -> JSONResponse:
    return safe_error(request, 500, 'INTERNAL_ERROR', 'Something went wrong. Please try again.')
