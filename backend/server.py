from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="PureFit Customs API")
api_router = APIRouter(prefix="/api")


# ====== Models ======
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
    logo_data: Optional[str] = None  # base64 data URL
    logo_filename: Optional[str] = None
    photo_data: Optional[str] = None  # base64 data URL
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


# ====== Routes ======
@api_router.get("/")
async def root():
    return {"message": "PureFit Customs API", "version": "1.0"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


@api_router.post("/quotes", response_model=QuoteRequest)
async def create_quote_request(payload: QuoteRequestCreate):
    quote = QuoteRequest(**payload.model_dump())
    doc = quote.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.quote_requests.insert_one(doc)
    logger.info(f"New quote request from {quote.name} ({quote.email})")
    return quote


@api_router.get("/quotes", response_model=List[QuoteRequestList])
async def list_quote_requests():
    quotes = await db.quote_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    result = []
    for q in quotes:
        result.append(QuoteRequestList(
            id=q.get('id'),
            name=q.get('name', ''),
            phone=q.get('phone', ''),
            email=q.get('email', ''),
            event_type=q.get('event_type', ''),
            bottle_size=q.get('bottle_size', ''),
            quantity=q.get('quantity', ''),
            event_date=q.get('event_date'),
            additional_requirements=q.get('additional_requirements', ''),
            has_logo=bool(q.get('logo_data')),
            has_photo=bool(q.get('photo_data')),
            status=q.get('status', 'new'),
            created_at=q.get('created_at', ''),
        ))
    return result


@api_router.get("/quotes/{quote_id}", response_model=QuoteRequest)
async def get_quote_request(quote_id: str):
    quote = await db.quote_requests.find_one({"id": quote_id}, {"_id": 0})
    if not quote:
        raise HTTPException(status_code=404, detail="Quote request not found")
    if isinstance(quote.get('created_at'), str):
        quote['created_at'] = datetime.fromisoformat(quote['created_at'])
    return QuoteRequest(**quote)


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(payload: ContactMessageCreate):
    msg = ContactMessage(**payload.model_dump())
    doc = msg.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    logger.info(f"New contact message from {msg.name} ({msg.email})")
    return msg


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contact_messages():
    msgs = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for m in msgs:
        if isinstance(m.get('created_at'), str):
            m['created_at'] = datetime.fromisoformat(m['created_at'])
    return [ContactMessage(**m) for m in msgs]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
