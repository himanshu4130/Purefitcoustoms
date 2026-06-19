"""Phase 2 backend tests: auth, admin routes, media, site-content, site-settings."""
import os
import io
import uuid
import time
import pytest
import requests
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://events-reimagined.preview.emergentagent.com").rstrip("/")
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "purefit2026@gmail.com")


@pytest.fixture(scope="module")
def mongo():
    c = MongoClient(MONGO_URL)
    yield c[DB_NAME]
    c.close()


@pytest.fixture(scope="module")
def admin_token(mongo):
    """Seed an admin user + session and return Bearer token."""
    token = f"test_admin_token_{uuid.uuid4().hex}"
    user_id = f"admin_test_{uuid.uuid4().hex[:10]}"
    mongo.users.insert_one({
        "user_id": user_id,
        "email": ADMIN_EMAIL,
        "name": "PureFit Admin (Test)",
        "picture": "",
        "is_admin": True,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    mongo.user_sessions.insert_one({
        "session_token": token,
        "user_id": user_id,
        "email": ADMIN_EMAIL,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    yield token
    mongo.user_sessions.delete_one({"session_token": token})
    mongo.users.delete_one({"user_id": user_id})


@pytest.fixture(scope="module")
def nonadmin_token(mongo):
    """Seed a non-allowlisted user + session token."""
    token = f"test_other_token_{uuid.uuid4().hex}"
    user_id = f"other_test_{uuid.uuid4().hex[:10]}"
    mongo.users.insert_one({
        "user_id": user_id,
        "email": "someoneelse@example.com",
        "name": "Other",
        "picture": "",
        "is_admin": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    mongo.user_sessions.insert_one({
        "session_token": token,
        "user_id": user_id,
        "email": "someoneelse@example.com",
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    yield token
    mongo.user_sessions.delete_one({"session_token": token})
    mongo.users.delete_one({"user_id": user_id})


def admin_headers(t): return {"Authorization": f"Bearer {t}"}


# ============ PUBLIC ENDPOINTS ============

class TestPublic:
    def test_site_content_public(self):
        r = requests.get(f"{BASE_URL}/api/site-content")
        assert r.status_code == 200
        data = r.json()
        assert "gallery" in data and isinstance(data["gallery"], list)
        assert "hero" in data and isinstance(data["hero"], list)
        assert "testimonial" in data and isinstance(data["testimonial"], list)

    def test_site_settings_public(self):
        r = requests.get(f"{BASE_URL}/api/site-settings")
        assert r.status_code == 200
        assert isinstance(r.json(), dict)

    def test_create_quote_public_still_works(self):
        payload = {
            "name": "TEST_Phase2_Quote",
            "phone": "+919999999999",
            "email": "test@example.com",
            "event_type": "Wedding",
            "bottle_size": "500ml",
            "quantity": "100",
        }
        r = requests.post(f"{BASE_URL}/api/quotes", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert "id" in data

    def test_create_contact_public_still_works(self):
        payload = {
            "name": "TEST_Phase2_Contact",
            "email": "contact@example.com",
            "message": "Test message phase 2",
        }
        r = requests.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        assert "id" in r.json()


# ============ AUTH GUARDS (no auth -> 401) ============

class TestAuthGuards:
    def test_legacy_quotes_requires_auth(self):
        r = requests.get(f"{BASE_URL}/api/quotes")
        assert r.status_code in (401, 403), r.text

    def test_legacy_contact_requires_auth(self):
        r = requests.get(f"{BASE_URL}/api/contact")
        assert r.status_code in (401, 403), r.text

    def test_admin_quotes_no_auth(self):
        r = requests.get(f"{BASE_URL}/api/admin/quotes")
        assert r.status_code in (401, 403)

    def test_admin_messages_no_auth(self):
        r = requests.get(f"{BASE_URL}/api/admin/messages")
        assert r.status_code in (401, 403)

    def test_admin_media_list_no_auth(self):
        r = requests.get(f"{BASE_URL}/api/admin/media")
        assert r.status_code in (401, 403)

    def test_admin_media_post_no_auth(self):
        r = requests.post(f"{BASE_URL}/api/admin/media", files={"file": ("a.png", b"x", "image/png")})
        assert r.status_code in (401, 403)

    def test_admin_site_content_no_auth(self):
        r = requests.get(f"{BASE_URL}/api/admin/site-content")
        assert r.status_code in (401, 403)

    def test_auth_session_invalid(self):
        r = requests.post(f"{BASE_URL}/api/auth/session", json={"session_id": "invalid_session_xyz"})
        assert r.status_code in (400, 401)

    def test_auth_session_no_body(self):
        r = requests.post(f"{BASE_URL}/api/auth/session", json={})
        assert r.status_code in (400, 401, 422)


# ============ NON-ADMIN AUTHENTICATED (403) ============

class TestNonAdminAccess:
    def test_me_works_for_nonadmin(self, nonadmin_token):
        r = requests.get(f"{BASE_URL}/api/auth/me", headers=admin_headers(nonadmin_token))
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == "someoneelse@example.com"
        assert data["is_admin"] is False

    def test_admin_quotes_forbidden_for_nonadmin(self, nonadmin_token):
        r = requests.get(f"{BASE_URL}/api/admin/quotes", headers=admin_headers(nonadmin_token))
        assert r.status_code == 403


# ============ ADMIN ACCESS ============

class TestAdminAccess:
    def test_me_returns_admin(self, admin_token):
        r = requests.get(f"{BASE_URL}/api/auth/me", headers=admin_headers(admin_token))
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["is_admin"] is True

    def test_admin_quotes_ok(self, admin_token):
        r = requests.get(f"{BASE_URL}/api/admin/quotes", headers=admin_headers(admin_token))
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_messages_ok(self, admin_token):
        r = requests.get(f"{BASE_URL}/api/admin/messages", headers=admin_headers(admin_token))
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ============ MEDIA UPLOAD + SERVE ============

# 1x1 transparent PNG bytes
PNG_BYTES = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4"
    "890000000d49444154789c63000100000005000100"
    "5d0a2db40000000049454e44ae426082"
)


class TestMediaFlow:
    media_id = None

    def test_upload_media(self, admin_token):
        files = {"file": ("test.png", PNG_BYTES, "image/png")}
        r = requests.post(f"{BASE_URL}/api/admin/media", files=files, headers=admin_headers(admin_token), timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and data["url"].startswith("/api/media/")
        assert data["content_type"] == "image/png"
        TestMediaFlow.media_id = data["id"]

    def test_serve_media_public(self):
        assert TestMediaFlow.media_id, "upload must succeed first"
        r = requests.get(f"{BASE_URL}/api/media/{TestMediaFlow.media_id}", timeout=30)
        assert r.status_code == 200
        assert "image" in r.headers.get("Content-Type", "")
        assert len(r.content) > 0

    def test_list_admin_media(self, admin_token):
        r = requests.get(f"{BASE_URL}/api/admin/media", headers=admin_headers(admin_token))
        assert r.status_code == 200
        items = r.json()
        assert any(m["id"] == TestMediaFlow.media_id for m in items)

    def test_delete_media(self, admin_token):
        r = requests.delete(f"{BASE_URL}/api/admin/media/{TestMediaFlow.media_id}", headers=admin_headers(admin_token))
        assert r.status_code == 200

    def test_serve_media_404_after_delete(self):
        r = requests.get(f"{BASE_URL}/api/media/{TestMediaFlow.media_id}", timeout=15)
        assert r.status_code == 404


# ============ SITE CONTENT CRUD + PUBLIC REFLECTION ============

class TestSiteContent:
    item_id = None

    def test_create(self, admin_token):
        r = requests.post(
            f"{BASE_URL}/api/admin/site-content",
            json={"kind": "gallery", "category": "Weddings", "title": "TEST_Phase2_Item", "is_active": True},
            headers=admin_headers(admin_token),
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["title"] == "TEST_Phase2_Item"
        assert data["kind"] == "gallery"
        TestSiteContent.item_id = data["id"]

    def test_list_admin(self, admin_token):
        r = requests.get(f"{BASE_URL}/api/admin/site-content", headers=admin_headers(admin_token))
        assert r.status_code == 200
        assert any(it["id"] == TestSiteContent.item_id for it in r.json())

    def test_public_reflects(self):
        r = requests.get(f"{BASE_URL}/api/site-content")
        assert r.status_code == 200
        gallery = r.json()["gallery"]
        assert any(it["id"] == TestSiteContent.item_id for it in gallery)

    def test_patch(self, admin_token):
        r = requests.patch(
            f"{BASE_URL}/api/admin/site-content/{TestSiteContent.item_id}",
            json={"is_featured": True},
            headers=admin_headers(admin_token),
        )
        assert r.status_code == 200
        assert r.json()["is_featured"] is True

    def test_delete(self, admin_token):
        r = requests.delete(
            f"{BASE_URL}/api/admin/site-content/{TestSiteContent.item_id}",
            headers=admin_headers(admin_token),
        )
        assert r.status_code == 200
        # Verify gone
        r2 = requests.get(f"{BASE_URL}/api/site-content")
        assert not any(it["id"] == TestSiteContent.item_id for it in r2.json()["gallery"])


# ============ SITE SETTINGS ============

class TestSiteSettings:
    def test_put_hero_headline_and_public_reflects(self, admin_token, mongo):
        original = mongo.site_settings.find_one({"id": "default"}, {"_id": 0}) or {}
        original_headline = original.get("hero_headline")
        new_headline = f"TEST Phase2 Headline {uuid.uuid4().hex[:6]}"
        r = requests.put(
            f"{BASE_URL}/api/admin/site-settings",
            json={"hero_headline": new_headline},
            headers=admin_headers(admin_token),
        )
        assert r.status_code == 200
        r2 = requests.get(f"{BASE_URL}/api/site-settings")
        assert r2.status_code == 200
        assert r2.json().get("hero_headline") == new_headline
        # Restore
        if original_headline is not None:
            requests.put(
                f"{BASE_URL}/api/admin/site-settings",
                json={"hero_headline": original_headline},
                headers=admin_headers(admin_token),
            )
