from fastapi import APIRouter

router = APIRouter(prefix='/api/v1/puzzles', tags=['puzzles'])

# V1 gameplay remains local; this router is reserved for non-authoritative metadata.
