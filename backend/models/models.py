from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional


class Service(BaseModel):
    code: str
    name: str
    category: str
    description: str


class University(BaseModel):
    id: int
    name: str
    country: str
    tuition: int
    programs: List[str]


class Scholarship(BaseModel):
    id: int
    name: str
    country: str
    amount: str
    level: str
    deadline: str


class ShortlistPreference(BaseModel):
    country: Optional[str] = None
    budget: Optional[int] = None
    program: Optional[str] = None


class ShortlistItem(BaseModel):
    university: str
    country: str
    match_score: float
    tuition: int
    programs: List[str]


class LeadIn(BaseModel):
    name: str
    email: EmailStr
    message: str


class LeadOut(LeadIn):
    id: int
    created_at: datetime


class Booking(BaseModel):
    id: int
    topic: str
    scheduled_for: datetime
    status: str


class BookingCreate(BaseModel):
    topic: str
    scheduled_for: datetime
