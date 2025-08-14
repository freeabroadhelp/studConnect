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
