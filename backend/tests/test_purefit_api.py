"""Backend API tests for PureFit Customs (quotes, contact)."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://events-reimagined.preview.emergentagent.com").rstrip("/")


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ===== Health =====
def test_root(api):
    r = api.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    data = r.json()
    assert "message" in data
    assert "PureFit" in data["message"]


# ===== Quotes =====
class TestQuotes:
    quote_id = None

    def test_create_quote_minimal(self, api):
        payload = {
            "name": "TEST_Customer_A",
            "phone": "+919999999999",
            "email": "test_a@example.com",
            "event_type": "Wedding",
            "bottle_size": "500ml",
            "quantity": "500",
        }
        r = api.post(f"{BASE_URL}/api/quotes", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert data["status"] == "new"
        TestQuotes.quote_id = data["id"]

    def test_create_quote_with_uploads(self, api):
        tiny_png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        payload = {
            "name": "TEST_Customer_B",
            "phone": "+919888888888",
            "email": "test_b@example.com",
            "event_type": "Corporate",
            "bottle_size": "750ml",
            "quantity": "1000",
            "event_date": "2026-05-01",
            "additional_requirements": "Gold foil",
            "logo_data": tiny_png,
            "logo_filename": "logo.png",
            "photo_data": tiny_png,
            "photo_filename": "photo.png",
        }
        r = api.post(f"{BASE_URL}/api/quotes", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["logo_data"] == tiny_png
        assert data["photo_filename"] == "photo.png"
        # Verify by GET single
        r2 = api.get(f"{BASE_URL}/api/quotes/{data['id']}")
        assert r2.status_code == 200
        full = r2.json()
        assert full["logo_data"] == tiny_png
        assert full["photo_data"] == tiny_png

    def test_list_quotes_excludes_base64(self, api):
        r = api.get(f"{BASE_URL}/api/quotes")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 1
        sample = items[0]
        # Ensure list shape does NOT include base64
        assert "logo_data" not in sample
        assert "photo_data" not in sample
        assert "has_logo" in sample
        assert "has_photo" in sample

    def test_get_quote_by_id(self, api):
        assert TestQuotes.quote_id, "Quote ID must be created first"
        r = api.get(f"{BASE_URL}/api/quotes/{TestQuotes.quote_id}")
        assert r.status_code == 200
        data = r.json()
        assert data["id"] == TestQuotes.quote_id
        assert data["name"] == "TEST_Customer_A"

    def test_get_quote_not_found(self, api):
        r = api.get(f"{BASE_URL}/api/quotes/nonexistent-id-xyz")
        assert r.status_code == 404

    def test_create_quote_missing_email(self, api):
        r = api.post(f"{BASE_URL}/api/quotes", json={
            "name": "TEST_NoEmail",
            "phone": "+91",
            "event_type": "Wedding",
            "bottle_size": "500ml",
            "quantity": "100",
        })
        assert r.status_code == 422

    def test_create_quote_missing_name(self, api):
        r = api.post(f"{BASE_URL}/api/quotes", json={
            "phone": "+91",
            "email": "noemail@example.com",
            "event_type": "Wedding",
            "bottle_size": "500ml",
            "quantity": "100",
        })
        assert r.status_code == 422

    def test_create_quote_invalid_email(self, api):
        r = api.post(f"{BASE_URL}/api/quotes", json={
            "name": "TEST_Bad",
            "phone": "+91",
            "email": "not-an-email",
            "event_type": "Wedding",
            "bottle_size": "500ml",
            "quantity": "100",
        })
        assert r.status_code == 422


# ===== Contact =====
class TestContact:
    msg_id = None

    def test_create_contact(self, api):
        payload = {
            "name": "TEST_Contact_A",
            "email": "contact_a@example.com",
            "phone": "+919777777777",
            "subject": "Test Subject",
            "message": "Hello from backend test",
        }
        r = api.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["message"] == payload["message"]
        assert "id" in data
        TestContact.msg_id = data["id"]

    def test_list_contact(self, api):
        r = api.get(f"{BASE_URL}/api/contact")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert any(m.get("id") == TestContact.msg_id for m in items)

    def test_contact_missing_email(self, api):
        r = api.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST",
            "message": "hi",
        })
        assert r.status_code == 422

    def test_contact_missing_message(self, api):
        r = api.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST",
            "email": "x@y.com",
        })
        assert r.status_code == 422

    def test_contact_missing_name(self, api):
        r = api.post(f"{BASE_URL}/api/contact", json={
            "email": "x@y.com",
            "message": "hi",
        })
        assert r.status_code == 422

    def test_contact_invalid_email(self, api):
        r = api.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST",
            "email": "bad",
            "message": "hi",
        })
        assert r.status_code == 422
