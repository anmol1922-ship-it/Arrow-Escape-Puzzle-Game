from collections.abc import Iterable

from ..schemas.ai import AiGuidanceRequest, AiGuidanceResponse
from ..schemas.puzzle import ActiveArrow


def legal_arrow_ids(arrows: Iterable[ActiveArrow], board_size: int) -> list[str]:
    arrow_list = list(arrows)
    occupied = {(arrow.row, arrow.column): arrow for arrow in arrow_list}
    ordered = sorted(arrow_list, key=lambda arrow: (arrow.row, arrow.column, arrow.id))
    vectors = {'UP': (-1, 0), 'DOWN': (1, 0), 'LEFT': (0, -1), 'RIGHT': (0, 1)}
    legal: list[str] = []
    for arrow in ordered:
        row_delta, column_delta = vectors[arrow.direction]
        row, column = arrow.row + row_delta, arrow.column + column_delta
        clear = True
        while 0 <= row < board_size and 0 <= column < board_size:
            if (row, column) in occupied:
                clear = False
                break
            row += row_delta
            column += column_delta
        if clear:
            legal.append(arrow.id)
    return legal


def validate_ai_response(request: AiGuidanceRequest, response: AiGuidanceResponse) -> AiGuidanceResponse:
    if request.board_size < 4 or request.board_size > 7:
        raise ValueError('invalid board size')
    if response.arrow_id not in legal_arrow_ids(request.arrows, request.board_size):
        raise ValueError('AI selected an illegal arrow')
    return response


def local_guidance(request: AiGuidanceRequest, request_id: str) -> AiGuidanceResponse:
    legal = legal_arrow_ids(request.arrows, request.board_size)
    if not legal:
        raise ValueError('no legal move available')
    arrow_id = legal[0]
    return AiGuidanceResponse(
        arrow_id=arrow_id,
        hint='Try the highlighted arrow first.',
        reason='Its complete path is currently clear.',
        confidence=1.0,
        source='local',
        request_id=request_id,
    )
