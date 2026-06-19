"""PureFit Customs Backend.

Provides:
- Public lead capture (quotes, contact)
- Emergent Google OAuth (allowlisted to ADMIN_EMAIL)
- Admin endpoints (quotes, messages, file upload, site content CRUD)
- Object storage proxy for public media access
- Resend email notification on quote submission
"""
import os
import uuid
import asyncio
import logging
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import requests
import resend
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, Request, Response, Cookie, Header
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("purefit")

# ---------- DB ----------
mongo_url = os.environ["MONGO_URL"]
db_client = AsyncIOMotorClient(mongo_url)
db = db_client[os.environ["DB_NAME"]]

# ---------- Config ----------
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "purefit2026@gmail.com").lower().strip()
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY", "")
APP_NAME = os.environ.get("APP_NAME", "purefit-customs")
resend.api_key = RESEND_API_KEY

STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
EMERGENT_AUTH_SESSION_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"

# Module-level storage key
_storage_key: Optional[str] = None


def init_storage() -> Optional[str]:
    global _storage_key
    if _storage_key:
        return _storage_key
    if not EMERGENT_KEY:
        logger.warning("EMERGENT_LLM_KEY missing — object storage disabled")
        return None
    try:
        r = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
        r.raise_for_status()
        _storage_key = r.json()["storage_key"]
        logger.info("Object storage initialised")
        return _storage_key
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
        return None


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    if not key:
        raise HTTPException(status_code=500, detail="Object storage not configured")
    r = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    if r.status_code == 403:
        # refresh key once
        global _storage_key
        _storage_key = None
        key = init_storage()
        if key:
            r = requests.put(
                f"{STORAGE_URL}/objects/{path}",
                headers={"X-Storage-Key": key, "Content-Type": content_type},
                data=data,
                timeout=120,
            )
    r.raise_for_status()
    return r.json()


def get_object(path: str) -> tuple[bytes, str]:
    key = init_storage()
    if not key:
        raise HTTPException(status_code=500, detail="Object storage not configured")
    r = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    if r.status_code == 403:
        global _storage_key
        _storage_key = None
        key = init_storage()
        if key:
            r = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    r.raise_for_status()
    return r.content, r.headers.get("Content-Type", "application/octet-stream")


# ---------- Models ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class QuoteRequestCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    event_type: str
    bottle_size: str
    quantity: str
    event_date: Optional[str] = None
    additional_requirements: Optional[str] = ""
    logo_data: Optional[str] = None
    logo_filename: Optional[str] = None
    photo_data: Optional[str] = None
    photo_filename: Optional[str] = None


class QuoteRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str
    event_type: str
    bottle_size: str
    quantity: str
    event_date: Optional[str] = None
    additional_requirements: Optional[str] = ""
    logo_data: Optional[str] = None
    logo_filename: Optional[str] = None
    photo_data: Optional[str] = None
    photo_filename: Optional[str] = None
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class QuoteRequestList(BaseModel):
    id: str
    name: str
    phone: str
    email: str
    event_type: str
    bottle_size: str
    quantity: str
    event_date: Optional[str] = None
    additional_requirements: Optional[str] = ""
    has_logo: bool = False
    has_photo: bool = False
    status: str = "new"
    created_at: str


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: Optional[str] = "General Inquiry"
    message: str


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = ""
    subject: Optional[str] = "General Inquiry"
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = ""
    is_admin: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SiteContentItem(BaseModel):
    """Single dynamic content item — gallery image, hero feature, testimonial, etc."""
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    kind: str  # "gallery" | "hero" | "testimonial"
    category: Optional[str] = ""
    title: Optional[str] = ""
    subtitle: Optional[str] = ""
    image_id: Optional[str] = None  # links to media collection
    client_name: Optional[str] = ""
    quantity: Optional[str] = ""
    quote: Optional[str] = ""
    author_name: Optional[str] = ""
    author_role: Optional[str] = ""
    is_featured: bool = False
    is_active: bool = True
    sort_order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SiteContentCreate(BaseModel):
    kind: str
    category: Optional[str] = ""
    title: Optional[str] = ""
    subtitle: Optional[str] = ""
    image_id: Optional[str] = None
    client_name: Optional[str] = ""
    quantity: Optional[str] = ""
    quote: Optional[str] = ""
    author_name: Optional[str] = ""
    author_role: Optional[str] = ""
    is_featured: bool = False
    is_active: bool = True
    sort_order: int = 0


class SiteContentUpdate(BaseModel):
    category: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image_id: Optional[str] = None
    client_name: Optional[str] = None
    quantity: Optional[str] = None
    quote: Optional[str] = None
    author_name: Optional[str] = None
    author_role: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class MediaItem(BaseModel):
    id: str
    storage_path: str
    original_filename: str
    content_type: str
    size: int
    url: str
    created_at: str


# ---------- Auth ----------
async def _user_from_session_token(token: str) -> Optional[dict]:
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        return None
    exp = session.get("expires_at")
    if isinstance(exp, str):
        exp = datetime.fromisoformat(exp)
    if exp and exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)
    if exp and exp < datetime.now(timezone.utc):
        return None
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    return user


async def get_current_user(
    session_token: Optional[str] = Cookie(default=None),
    authorization: Optional[str] = Header(default=None),
) -> dict:
    token = session_token
    if not token and authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = await _user_from_session_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    return user


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if not user.get("is_admin") or user.get("email", "").lower() != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ---------- App ----------
app = FastAPI(title="PureFit Customs API")
api_router = APIRouter(prefix="/api")


@app.on_event("startup")
async def on_startup():
    init_storage()


# ---------- Existing status check ----------
@api_router.get("/")
async def root():
    return {"message": "PureFit Customs API", "version": "2.0"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    obj = StatusCheck(**input.model_dump())
    doc = obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()
    await db.status_checks.insert_one(doc)
    return obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    items = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for c in items:
        if isinstance(c.get("timestamp"), str):
            c["timestamp"] = datetime.fromisoformat(c["timestamp"])
    return items


# ---------- Email helper ----------
def _build_quote_email_html(q: QuoteRequest) -> str:
    return f"""
    <table style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;border-collapse:collapse;border:1px solid #0B3D2E">
      <tr><td style="background:#0B3D2E;color:#D4AF37;padding:24px 28px;font-size:22px;letter-spacing:3px;text-transform:uppercase">PureFit Customs · New Quote Request</td></tr>
      <tr><td style="background:#F8F5EE;padding:28px;color:#111111">
        <p style="font-size:16px;margin:0 0 16px 0">A new quote request has been submitted on your website.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#0B3D2E;font-weight:bold;width:180px">Name</td><td>{q.name}</td></tr>
          <tr><td style="padding:8px 0;color:#0B3D2E;font-weight:bold">Phone</td><td>{q.phone}</td></tr>
          <tr><td style="padding:8px 0;color:#0B3D2E;font-weight:bold">Email</td><td>{q.email}</td></tr>
          <tr><td style="padding:8px 0;color:#0B3D2E;font-weight:bold">Event Type</td><td>{q.event_type}</td></tr>
          <tr><td style="padding:8px 0;color:#0B3D2E;font-weight:bold">Bottle Size</td><td>{q.bottle_size}</td></tr>
          <tr><td style="padding:8px 0;color:#0B3D2E;font-weight:bold">Quantity</td><td>{q.quantity}</td></tr>
          <tr><td style="padding:8px 0;color:#0B3D2E;font-weight:bold">Event Date</td><td>{q.event_date or '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#0B3D2E;font-weight:bold;vertical-align:top">Requirements</td><td>{(q.additional_requirements or '—').replace(chr(10), '<br>')}</td></tr>
          <tr><td style="padding:8px 0;color:#0B3D2E;font-weight:bold">Attachments</td><td>{'Logo · ' if q.logo_data else ''}{'Photo · ' if q.photo_data else ''}{'None' if not q.logo_data and not q.photo_data else ''}</td></tr>
        </table>
        <p style="margin-top:20px;color:#555;font-size:12px">View full details (including uploads) inside the PureFit admin dashboard.</p>
      </td></tr>
      <tr><td style="background:#111111;color:#D4AF37;padding:16px 28px;font-size:11px;letter-spacing:3px;text-transform:uppercase">PureFit Customs · Every Bottle Tells A Story</td></tr>
    </table>
    """


async def _send_quote_email(q: QuoteRequest) -> None:
    if not RESEND_API_KEY:
        logger.warning("Resend API key missing — skipping notification email")
        return
    params = {
        "from": SENDER_EMAIL,
        "to": [ADMIN_EMAIL],
        "subject": f"New Quote · {q.name} · {q.event_type}",
        "html": _build_quote_email_html(q),
        "reply_to": q.email,
    }
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Quote notification email sent to {ADMIN_EMAIL}")
    except Exception as e:
        logger.error(f"Failed to send quote email: {e}")


# ---------- Public lead endpoints ----------
@api_router.post("/quotes", response_model=QuoteRequest)
async def create_quote_request(payload: QuoteRequestCreate):
    quote = QuoteRequest(**payload.model_dump())
    doc = quote.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.quote_requests.insert_one(doc)
    logger.info(f"New quote request from {quote.name} ({quote.email})")
    # Fire and forget email
    asyncio.create_task(_send_quote_email(quote))
    return quote


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(payload: ContactMessageCreate):
    msg = ContactMessage(**payload.model_dump())
    doc = msg.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.contact_messages.insert_one(doc)
    logger.info(f"New contact message from {msg.name} ({msg.email})")
    return msg


# Backwards compat — keep the previous list endpoints accessible (but admins use /api/admin/* in the UI now)
@api_router.get("/quotes", response_model=List[QuoteRequestList])
async def list_quote_requests_legacy(_: dict = Depends(require_admin)):
    return await _list_quotes()


@api_router.get("/quotes/{quote_id}", response_model=QuoteRequest)
async def get_quote_legacy(quote_id: str, _: dict = Depends(require_admin)):
    return await _get_quote(quote_id)


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contact_messages_legacy(_: dict = Depends(require_admin)):
    return await _list_messages()


# ---------- Auth endpoints ----------
@api_router.post("/auth/session")
async def auth_session(request: Request, response: Response):
    body = await request.json()
    session_id = body.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    logger.info(f"Auth session exchange: id_prefix={session_id[:8]}… len={len(session_id)}")

    # Exchange with Emergent Auth
    try:
        r = await asyncio.to_thread(
            requests.get,
            EMERGENT_AUTH_SESSION_URL,
            headers={"X-Session-ID": session_id},
            timeout=15,
        )
        if r.status_code != 200:
            logger.error(f"Emergent /session-data returned {r.status_code}: {r.text[:200]}")
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        logger.error(f"Emergent auth exchange failed: {e}")
        raise HTTPException(status_code=401, detail="Auth exchange failed")

    email = (data.get("email") or "").lower().strip()
    if email != ADMIN_EMAIL:
        logger.warning(f"Non-allowlisted login attempt: {email}")
        raise HTTPException(status_code=403, detail="This account is not authorised to access PureFit Customs admin.")

    name = data.get("name", "")
    picture = data.get("picture", "")
    session_token = data.get("session_token")
    if not session_token:
        raise HTTPException(status_code=502, detail="No session token returned")

    # Upsert user
    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": name, "picture": picture, "is_admin": True}},
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "is_admin": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    # Store session
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.insert_one({
        "session_token": session_token,
        "user_id": user_id,
        "email": email,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    response.set_cookie(
        key="session_token",
        value=session_token,
        max_age=7 * 24 * 60 * 60,
        path="/",
        httponly=True,
        secure=True,
        samesite="none",
    )

    return {
        "user_id": user_id,
        "email": email,
        "name": name,
        "picture": picture,
        "is_admin": True,
        "session_token": session_token,  # also returned so frontend can store it in localStorage (cookies blocked by ingress CORS)
    }


@api_router.get("/auth/me")
async def auth_me(user: dict = Depends(get_current_user)):
    return {
        "user_id": user["user_id"],
        "email": user["email"],
        "name": user.get("name", ""),
        "picture": user.get("picture", ""),
        "is_admin": bool(user.get("is_admin")),
    }


@api_router.post("/auth/logout")
async def auth_logout(response: Response, session_token: Optional[str] = Cookie(default=None)):
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie("session_token", path="/")
    return {"ok": True}


# ---------- Admin helpers (also used by legacy public) ----------
async def _list_quotes() -> List[QuoteRequestList]:
    quotes = await db.quote_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    out = []
    for q in quotes:
        out.append(QuoteRequestList(
            id=q.get("id"),
            name=q.get("name", ""),
            phone=q.get("phone", ""),
            email=q.get("email", ""),
            event_type=q.get("event_type", ""),
            bottle_size=q.get("bottle_size", ""),
            quantity=q.get("quantity", ""),
            event_date=q.get("event_date"),
            additional_requirements=q.get("additional_requirements", ""),
            has_logo=bool(q.get("logo_data")),
            has_photo=bool(q.get("photo_data")),
            status=q.get("status", "new"),
            created_at=q.get("created_at", ""),
        ))
    return out


async def _get_quote(quote_id: str) -> QuoteRequest:
    q = await db.quote_requests.find_one({"id": quote_id}, {"_id": 0})
    if not q:
        raise HTTPException(status_code=404, detail="Quote not found")
    if isinstance(q.get("created_at"), str):
        q["created_at"] = datetime.fromisoformat(q["created_at"])
    return QuoteRequest(**q)


async def _list_messages() -> List[ContactMessage]:
    items = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for m in items:
        if isinstance(m.get("created_at"), str):
            m["created_at"] = datetime.fromisoformat(m["created_at"])
    return [ContactMessage(**m) for m in items]


# ---------- Admin endpoints ----------
@api_router.get("/admin/quotes", response_model=List[QuoteRequestList])
async def admin_list_quotes(_: dict = Depends(require_admin)):
    return await _list_quotes()


@api_router.get("/admin/quotes/{quote_id}", response_model=QuoteRequest)
async def admin_get_quote(quote_id: str, _: dict = Depends(require_admin)):
    return await _get_quote(quote_id)


@api_router.patch("/admin/quotes/{quote_id}")
async def admin_update_quote_status(quote_id: str, payload: dict, _: dict = Depends(require_admin)):
    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="status required")
    res = await db.quote_requests.update_one({"id": quote_id}, {"$set": {"status": new_status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Quote not found")
    return {"ok": True}


@api_router.get("/admin/messages", response_model=List[ContactMessage])
async def admin_list_messages(_: dict = Depends(require_admin)):
    return await _list_messages()


# ---------- Media upload / serve ----------
MIME_TYPES = {
    "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
    "gif": "image/gif", "webp": "image/webp", "svg": "image/svg+xml",
}


@api_router.post("/admin/media", response_model=MediaItem)
async def upload_media(file: UploadFile = File(...), _: dict = Depends(require_admin)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename")
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in {"jpg", "jpeg", "png", "webp", "gif", "svg"}:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use JPG, PNG, WEBP, GIF or SVG.")

    content_type = MIME_TYPES.get(ext, file.content_type or "application/octet-stream")
    file_id = uuid.uuid4().hex
    path = f"{APP_NAME}/images/{file_id}.{ext}"
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    result = await asyncio.to_thread(put_object, path, data, content_type)

    record = {
        "id": file_id,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.media.insert_one(record)
    return MediaItem(
        id=file_id,
        storage_path=result["path"],
        original_filename=file.filename,
        content_type=content_type,
        size=record["size"],
        url=f"/api/media/{file_id}",
        created_at=record["created_at"],
    )


@api_router.get("/admin/media", response_model=List[MediaItem])
async def list_media(_: dict = Depends(require_admin)):
    items = await db.media.find({"is_deleted": False}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [
        MediaItem(
            id=m["id"],
            storage_path=m["storage_path"],
            original_filename=m["original_filename"],
            content_type=m["content_type"],
            size=m.get("size", 0),
            url=f"/api/media/{m['id']}",
            created_at=m["created_at"],
        )
        for m in items
    ]


@api_router.delete("/admin/media/{media_id}")
async def delete_media(media_id: str, _: dict = Depends(require_admin)):
    res = await db.media.update_one({"id": media_id}, {"$set": {"is_deleted": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Media not found")
    return {"ok": True}


@api_router.get("/media/{media_id}")
async def serve_media(media_id: str):
    """Public — serves uploaded site assets so <img src='/api/media/...'> works."""
    record = await db.media.find_one({"id": media_id, "is_deleted": False}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="Not found")
    try:
        data, ct = await asyncio.to_thread(get_object, record["storage_path"])
    except Exception as e:
        logger.error(f"Storage fetch failed for {media_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch media")
    return Response(
        content=data,
        media_type=record.get("content_type") or ct,
        headers={"Cache-Control": "public, max-age=86400"},
    )


# ---------- Site Content ----------
@api_router.get("/site-content")
async def public_site_content():
    """Returns active content grouped by kind for the public website."""
    items = await db.site_content.find({"is_active": True}, {"_id": 0}).sort("sort_order", 1).to_list(500)
    grouped = {"gallery": [], "hero": [], "testimonial": []}
    for it in items:
        kind = it.get("kind")
        if kind in grouped:
            if it.get("image_id"):
                it["image_url"] = f"/api/media/{it['image_id']}"
            grouped[kind].append(it)
    return grouped


@api_router.get("/admin/site-content", response_model=List[SiteContentItem])
async def admin_list_site_content(_: dict = Depends(require_admin)):
    items = await db.site_content.find({}, {"_id": 0}).sort("sort_order", 1).to_list(500)
    out = []
    for it in items:
        if isinstance(it.get("created_at"), str):
            it["created_at"] = datetime.fromisoformat(it["created_at"])
        out.append(SiteContentItem(**it))
    return out


@api_router.post("/admin/site-content", response_model=SiteContentItem)
async def admin_create_site_content(payload: SiteContentCreate, _: dict = Depends(require_admin)):
    item = SiteContentItem(**payload.model_dump())
    doc = item.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.site_content.insert_one(doc)
    return item


@api_router.patch("/admin/site-content/{item_id}", response_model=SiteContentItem)
async def admin_update_site_content(item_id: str, payload: SiteContentUpdate, _: dict = Depends(require_admin)):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail="Nothing to update")
    res = await db.site_content.update_one({"id": item_id}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    doc = await db.site_content.find_one({"id": item_id}, {"_id": 0})
    if isinstance(doc.get("created_at"), str):
        doc["created_at"] = datetime.fromisoformat(doc["created_at"])
    return SiteContentItem(**doc)


@api_router.delete("/admin/site-content/{item_id}")
async def admin_delete_site_content(item_id: str, _: dict = Depends(require_admin)):
    res = await db.site_content.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"ok": True}


# ---------- Site Settings (logo, favicon, brand colors, hero image) ----------
@api_router.get("/site-settings")
async def public_site_settings():
    doc = await db.site_settings.find_one({"id": "default"}, {"_id": 0}) or {}
    # Map image_ids to URLs for convenience
    out = dict(doc)
    for k in ("logo_image_id", "favicon_image_id", "hero_background_image_id", "hero_featured_image_id"):
        v = doc.get(k)
        if v:
            out[k.replace("_image_id", "_url")] = f"/api/media/{v}"
    return out


@api_router.put("/admin/site-settings")
async def admin_update_settings(payload: dict, _: dict = Depends(require_admin)):
    payload = {k: v for k, v in payload.items() if k in {
        "logo_image_id", "favicon_image_id", "hero_background_image_id", "hero_featured_image_id",
        "primary_color", "secondary_color", "accent_color", "background_color",
        "hero_headline", "hero_subheading", "hero_overline",
    }}
    await db.site_settings.update_one({"id": "default"}, {"$set": payload}, upsert=True)
    doc = await db.site_settings.find_one({"id": "default"}, {"_id": 0}) or {}
    return doc


# ---------- Final wiring ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "").split(",") if os.environ.get("CORS_ORIGINS") and os.environ.get("CORS_ORIGINS") != "*" else [],
    allow_origin_regex=r"https?://([a-zA-Z0-9-]+\.)*(preview\.emergentagent\.com|localhost(:\d+)?)$",
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown():
    db_client.close()
