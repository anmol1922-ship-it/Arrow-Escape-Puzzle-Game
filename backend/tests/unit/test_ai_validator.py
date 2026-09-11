import pytest

from app.schemas.ai import AiGuidanceRequest, AiGuidanceResponse
from app.validators.ai_validator import legal_arrow_ids, validate_ai_response


def request():
    return AiGuidanceRequest.model_validate({
        'puzzle_id': 'level-001', 'board_size': 4, 'moves': 0, 'mistakes': 0, 'mode': 'hint',
        'arrows': [
            {'id': 'a1', 'row': 1, 'column': 0, 'direction': 'RIGHT'},
            {'id': 'a2', 'row': 1, 'column': 1, 'direction': 'RIGHT'},
        ],
    })


def test_validator_uses_the_clear_path_rule():
    assert legal_arrow_ids(request().arrows, 4) == ['a2']


def test_validator_rejects_illegal_ai_arrow():
    response = AiGuidanceResponse(arrow_id='a1', hint='x', reason='x', confidence=.9, source='ai', request_id='r')
    with pytest.raises(ValueError):
        validate_ai_response(request(), response)
