from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional
from sqlalchemy import JSON, Column, Integer, String
from sqlalchemy.orm import declarative_base
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.dialects.postgresql import JSONB

Base = declarative_base()


class AustraliaScholarship(Base):
    __tablename__ = "australia_scholarships"
    __table_args__ = {'extend_existing': True}  # Ensures CREATE TABLE IF NOT EXISTS behavior
    id = Column(Integer, primary_key=True, autoincrement=True)
    university = Column(String, nullable=False, unique=True)
    state = Column(String)
    type = Column(String)
    scholarships = Column(JSONB)
    common_programs = Column(JSONB)
    updated_at = Column(String)


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
