# StudConnect Backend (FastAPI)

## Quick Start

Create & activate a virtual environment, install dependencies, and run the server:

```bash
python -m venv venv
source venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -e .
uvicorn app.main:app --reload
```

Visit http://127.0.0.1:8000/docs for interactive API docs.

## Current Endpoints (v0.2 scaffold)
- `GET /health` health check
- Auth: `POST /auth/register`, `POST /auth/login`
- Users: `GET /users/me`
- Universities: `GET /universities` (filters: `country`, `q`)
- Services: `GET /services` (filter: `category`)
- Bookings: `POST /bookings` (student only), `GET /bookings`
- Scholarships: `GET /scholarships` (filters: `country`, `level`)
- Shortlist: `POST /shortlist` (generate ranked list from preferences)
- Leads: `POST /leads` (in‑memory capture)

## Roadmap (Phase 1 Extended)
- Availability management for counsellors (time slots)
- University/program data ingestion pipeline
- Application tracking entities (applications, documents)
- Email notifications & rate limiting
- Replace in-memory leads & scholarships with DB models
- Role-based admin endpoints

## Phase 2 Ideas
- AI shortlisting recommendations (model integration)
- Admin moderation workflows
- Payment integration
- Content/blog management
- Messaging / chat & real-time presence
- Analytics dashboard

## User Auth / Verification (New)
1. Set env vars (example):
   ```
   DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST/dbname?sslmode=require
   JWT_SECRET=change_me_long_random
   OTP_SENDER=debug
   ```
2. Endpoints:
   - POST /auth/register  -> sends OTP
   - POST /auth/verify    -> verify code, returns JWT
   - POST /auth/login     -> login (after verification)
   - GET  /users/me       -> requires Bearer token
3. OTP is 6 digits, expires in 5 minutes.

## Install extra deps
