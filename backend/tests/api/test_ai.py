def payload():
    return {
        'puzzle_id': 'level-001',
        'board_size': 4,
        'moves': 0,
        'mistakes': 0,
        'mode': 'hint',
        'arrows': [
            {'id': 'a1', 'row': 1, 'column': 0, 'direction': 'RIGHT'},
            {'id': 'a2', 'row': 1, 'column': 1, 'direction': 'RIGHT'},
        ],
    }


def test_local_provider_returns_deterministic_guidance(client):
    response = client.post('/api/v1/ai/hint', json=payload())
    assert response.status_code == 200
    assert response.json()['source'] == 'local'
    assert response.json()['arrow_id'] == 'a2'


def test_oversized_request_is_rejected(client):
    response = client.post('/api/v1/ai/hint', data='x' * 70000, headers={'content-type': 'application/json'})
    assert response.status_code == 413
    assert response.json()['error']['code'] == 'REQUEST_TOO_LARGE'


def test_cors_is_explicit(client):
    response = client.options('/api/v1/ai/hint', headers={'Origin': 'https://not-arrow-escape.example', 'Access-Control-Request-Method': 'POST'})
    assert 'access-control-allow-origin' not in response.headers
