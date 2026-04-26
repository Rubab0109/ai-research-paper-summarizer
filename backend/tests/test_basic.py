from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_reject_non_pdf_upload():
    response = client.post(
        "/api/analyze",
        files={"file": ("notes.txt", b"hello world", "text/plain")},
    )
    assert response.status_code == 400
    assert "PDF" in response.json()["detail"]
