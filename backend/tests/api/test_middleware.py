def test_request_id_is_preserved(client):
    response = client.get('/health', headers={'X-Request-ID': 'test-request'})
    assert response.headers['x-request-id'] == 'test-request'


def test_cors_allows_configured_origin(client):
    response = client.options('/api/v1/ai/hint', headers={'Origin': 'http://localhost:5173', 'Access-Control-Request-Method': 'POST'})
    assert response.headers.get('access-control-allow-origin') == 'http://localhost:5173'
