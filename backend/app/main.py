from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config.settings import get_settings
from .config.logging import configure_logging
from .exceptions.handlers import http_exception_handler, safe_error, unexpected_exception_handler, validation_exception_handler
from .routes.ai import router as ai_router
from .routes.health import router as health_router
from .routes.puzzle import router as puzzle_router
from fastapi import HTTPException

settings = get_settings()
configure_logging()
app = FastAPI(title='Arrow Escape API', version=settings.service_version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=['GET', 'POST', 'OPTIONS'],
    allow_headers=['Content-Type', 'X-Request-ID'],
)


@app.middleware('http')
async def request_controls(request: Request, call_next):
    correlation_id = request.headers.get('X-Request-ID') or str(uuid4())
    request.state.request_id = correlation_id
    content_length = request.headers.get('content-length')
    if content_length and int(content_length) > settings.max_request_bytes:
        response = safe_error(request, 413, 'REQUEST_TOO_LARGE', 'That request is too large.')
    else:
        response = await call_next(request)
    response.headers['X-Request-ID'] = correlation_id
    return response


@app.exception_handler(RequestValidationError)
async def handle_validation(request: Request, exc: RequestValidationError):
    return await validation_exception_handler(request, exc)


@app.exception_handler(HTTPException)
async def handle_http(request: Request, exc: HTTPException):
    return await http_exception_handler(request, exc)


@app.exception_handler(Exception)
async def handle_unexpected(request: Request, exc: Exception):
    return await unexpected_exception_handler(request, exc)


@app.get('/')
def root() -> dict[str, str]:
    return {'service': settings.service_name, 'status': 'healthy'}


app.include_router(health_router)
app.include_router(ai_router)
app.include_router(puzzle_router)
