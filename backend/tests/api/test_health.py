def test_health_is_public_and_safe(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'healthy'
    assert 'secret' not in response.text.lower()
    assert response.headers['x-request-id']


def test_readiness_is_public(client):
    response = client.get('/health/ready')
    assert response.status_code == 200
    assert response.json()['status'] == 'ready'


def test_invalid_request_is_controlled(client):
    response = client.post('/api/v1/ai/hint', json={})
    assert response.status_code == 400
    assert response.json()['error']['code'] == 'INVALID_REQUEST'
    assert 'traceback' not in response.text.lower()
