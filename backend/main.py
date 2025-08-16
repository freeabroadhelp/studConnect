from fastapi import FastAPI, Depends, HTTPException, status, Header, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import random, string
from typing import Optional
import os
import csv
import psycopg2
import requests
import ast
import urllib.parse
import json
import boto3
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from models.models import (
    Service, University, Scholarship, ShortlistPreference, ShortlistItem, LeadIn, LeadOut, Booking, BookingCreate
)
from db import Base, engine, get_db
from models.models_user import User
from models.schemas_user import UserRegister, UserLogin, UserVerify, UserOut, TokenResponse
from utils.crud_user import get_user_by_email, create_user
from utils.auth_utils import hash_password, verify_password, create_token, decode_token
from utils.email_service import send_otp, smtp_diagnostics
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVICES = [
    Service(code="peer", name="Peer Counselling", category="counselling", description="Connect with current international students."),
    Service(code="rep", name="University Representative", category="counselling", description="Official sessions with university reps."),
    Service(code="shortlist", name="University Shortlisting", category="planning", description="Data-guided personalized shortlist."),
    Service(code="application", name="Application Assistance", category="application", description="Documents, SOP, tracking."),
    Service(code="visa", name="Visa Guidance", category="compliance", description="Checklist & mock interviews."),
    Service(code="scholarship", name="Scholarship Assistance", category="funding", description="Identify & apply for scholarships."),
]

SCHOLARSHIPS = [
    Scholarship(id=1, name="Global Excellence Scholarship", country="Canada", amount="$10,000", level="Masters", deadline="2025-11-01"),
    Scholarship(id=2, name="STEM Innovators Grant", country="USA", amount="$8,000", level="Bachelors", deadline="2025-12-15"),
    Scholarship(id=3, name="EU Research Fellowship", country="Germany", amount="€12,000", level="PhD", deadline="2026-01-20"),
]

LEADS: list[LeadOut] = []
BOOKINGS: list[Booking] = [
    Booking(id=1, topic="Peer Counselling", scheduled_for=datetime.utcnow()+timedelta(days=3), status="upcoming"),
]

Base.metadata.create_all(bind=engine)

DB_URL = os.environ.get("DATABASE_URL")
session = boto3.session.Session()

def generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))

@app.post("/auth/register", response_model=dict, tags=["auth"], summary="Register & send OTP")
def register(payload: UserRegister, db_session=Depends(get_db)):
    db: Session
    with db_session as db:
        existing = get_user_by_email(db, payload.email.lower())
        if existing:
            if existing.is_verified:
                raise HTTPException(status_code=400, detail="Email already registered")
            user = existing
            user.full_name = payload.full_name
            user.role = payload.role
            user.password_hash = hash_password(payload.password)
        else:
            user = create_user(
                db,
                email=payload.email,
                full_name=payload.full_name,
                role=payload.role,
                password_hash=hash_password(payload.password),
            )
        code = generate_otp()
        user.set_otp(code)
        if not send_otp(user.email, code):
            raise HTTPException(status_code=500, detail="Could not send verification email (check SMTP settings)")
        return {"message": "OTP sent to email for verification"}

@app.post("/auth/verify", response_model=TokenResponse, tags=["auth"], summary="Verify OTP & get token")
def verify_otp(payload: UserVerify, db_session=Depends(get_db)):
    db: Session
    with db_session as db:
        user = get_user_by_email(db, payload.email.lower())
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.is_verified:
            return TokenResponse(access_token=create_token(str(user.id)))
        if not user.otp_code or not user.otp_expires:
            raise HTTPException(status_code=400, detail="No OTP pending")
        if datetime.utcnow() > user.otp_expires:
            raise HTTPException(status_code=400, detail="OTP expired")
        if payload.code != user.otp_code:
            raise HTTPException(status_code=400, detail="Invalid OTP")
        user.is_verified = True
        user.otp_code = None
        user.otp_expires = None
        return TokenResponse(access_token=create_token(str(user.id)))

@app.post("/auth/login", response_model=TokenResponse, tags=["auth"], summary="Login (requires verified)")
def login(payload: UserLogin, db_session=Depends(get_db)):
    db: Session
    with db_session as db:
        user = get_user_by_email(db, payload.email.lower())
        if not user or not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if not user.is_verified:
            raise HTTPException(status_code=403, detail="Email not verified")
        return TokenResponse(access_token=create_token(str(user.id)))

def auth_user(authorization: str | None = Header(default=None), db_session=Depends(get_db)) -> UserOut:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ",1)[1]
    try:
        data = decode_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = data.get("sub")
    db: Session
    with db_session as db:
        user = db.get(User, user_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        payload = {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_verified": user.is_verified,
            "created_at": user.created_at
        }
        return UserOut.model_validate(payload)

@app.get("/users/me", response_model=UserOut, tags=["users"], summary="Current user")
def me(current: UserOut = Depends(auth_user)):
    return current


@app.get("/health", tags=["meta"], summary="Health check")
def health():
    return {"status": "ok"}


@app.get("/services", response_model=list[Service], tags=["services"], summary="List services")
def list_services(category: str | None = None):
    if category:
        return [s for s in SERVICES if s.category == category]
    return SERVICES

    

@app.get("/scholarships", response_model=list[Scholarship], tags=["scholarships"], summary="List scholarships")
def list_scholarships(country: Optional[str] = None, level: Optional[str] = None):
    data = SCHOLARSHIPS
    if country:
        data = [s for s in data if s.country.lower() == country.lower()]
    if level:
        data = [s for s in data if s.level.lower() == level.lower()]
    return data



@app.post("/leads", response_model=LeadOut, status_code=201, tags=["leads"], summary="Create lead")
def create_lead(payload: LeadIn):
    lead = LeadOut(id=len(LEADS)+1, created_at=datetime.utcnow(), **payload.dict())
    LEADS.append(lead)
    return lead


@app.get("/bookings", response_model=list[Booking], tags=["bookings"], summary="List bookings (static demo)")
def list_bookings():
    return BOOKINGS


@app.post("/bookings", response_model=Booking, status_code=201, tags=["bookings"], summary="Create booking (static in-memory)")
def create_booking(payload: BookingCreate):
    b = Booking(id=len(BOOKINGS)+1, topic=payload.topic, scheduled_for=payload.scheduled_for, status="upcoming")
    BOOKINGS.append(b)
    return b


@app.get("/debug/smtp", tags=["meta"], summary="SMTP diagnostics (protected)")
def smtp_debug(current: UserOut = Depends(auth_user)):
    if current.role != "counsellor":
        raise HTTPException(status_code=403, detail="Not authorized")
    return smtp_diagnostics()


@app.get("/api/universities/all")
def get_all_universities(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    country: str | None = Query(None),
    q: str | None = Query(None),
    sort: str = Query("rank")
):
    offset = (page - 1) * page_size

    conn = None
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()

        where_clauses = []
        params: list = []

        if country:
            where_clauses.append("country = %s")
            params.append(country.strip())

        if q:
            where_clauses.append("name ILIKE %s")
            params.append(f"%{q.strip()}%")

        sql = "SELECT * FROM universities"
        if where_clauses:
            sql += " WHERE " + " AND ".join(where_clauses)

        # sorting
        if sort == "rank":
            order_by = "CASE WHEN urap_standings ~ '^[0-9]+$' THEN urap_standings::int END ASC NULLS LAST, name ASC"
        else:
            order_by = "name ASC"

        sql += f" ORDER BY {order_by} LIMIT %s OFFSET %s"
        params.extend([page_size, offset])

        cur.execute(sql, params)
        rows = cur.fetchall()
        colnames = [desc[0] for desc in cur.description]

        formatted = []
        for row in rows:
            d = dict(zip(colnames, row))
            d["thumbnail_url"] = d.get("thumbnail_r2") or d.get("thumbnail")
            d["logo_url"] = d.get("logo_r2") or d.get("logo")

            formatted.append(d)

        total = len(formatted)
        return {
            "items": formatted,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        if conn:
            conn.close()

@app.get("/api/universities/{uni_id}")
def get_university(
    uni_id: int = Path(..., description="University ID")
):
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        cur.execute("SELECT * FROM universities WHERE id = %s", (uni_id,))
        row = cur.fetchone()
        if not row:
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail="University not found")
        colnames = [desc[0] for desc in cur.description]
        d = dict(zip(colnames, row))
        d["thumbnail_url"] = d.get("thumbnail_r2") or None
        d["logo_url"] = d.get("logo_r2") or None
        cur.close()
        conn.close()
        return d
    except Exception as e:
        # Return a JSON error with CORS headers
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=500, content={"error": str(e)})
