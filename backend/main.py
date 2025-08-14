from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from models.models import (
    Service, University, Scholarship, ShortlistPreference, ShortlistItem, LeadIn, LeadOut, Booking, BookingCreate
)

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

UNIVERSITIES = [
    University(id=1, name="University of Toronto", country="Canada", tuition=32000, programs=["CS", "Business", "Biology"]),
    University(id=2, name="NUS", country="Singapore", tuition=28000, programs=["Engineering", "Data Science"]),
    University(id=3, name="TU Munich", country="Germany", tuition=1500, programs=["Robotics", "Mechanical"]),
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


@app.get("/health", tags=["meta"], summary="Health check")
def health():
    return {"status": "ok"}


@app.get("/services", response_model=list[Service], tags=["services"], summary="List services")
def list_services(category: str | None = None):
    if category:
        return [s for s in SERVICES if s.category == category]
    return SERVICES


@app.get("/universities", response_model=list[University], tags=["universities"], summary="List universities")
def list_universities(country: str | None = None, q: str | None = None):
    data = UNIVERSITIES
    if country:
        data = [u for u in data if u.country.lower() == country.lower()]
    if q:
        data = [u for u in data if q.lower() in u.name.lower()]
    return data


@app.get("/scholarships", response_model=list[Scholarship], tags=["scholarships"], summary="List scholarships")
def list_scholarships(country: str | None = None, level: str | None = None):
    data = SCHOLARSHIPS
    if country:
        data = [s for s in data if s.country.lower() == country.lower()]
    if level:
        data = [s for s in data if s.level.lower() == level.lower()]
    return data


@app.post("/shortlist", response_model=list[ShortlistItem], tags=["shortlist"], summary="Generate shortlist")
def generate_shortlist(prefs: ShortlistPreference):
    base = UNIVERSITIES
    items: list[ShortlistItem] = []
    for u in base:
        score = 0.5
        if prefs.country and prefs.country.lower() == u.country.lower():
            score += 0.2
        if prefs.program and prefs.program in u.programs:
            score += 0.2
        if prefs.budget and u.tuition <= prefs.budget:
            score += 0.1
        items.append(ShortlistItem(university=u.name, country=u.country, tuition=u.tuition, programs=u.programs, match_score=round(score,2)))
    return sorted(items, key=lambda x: x.match_score, reverse=True)


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
