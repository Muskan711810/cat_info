# Cat Wipidia

A crowd-editable cat encyclopedia — a full rebuild of two old static
Bootstrap sites into a typed, full-stack app.

- **Frontend**: React + TypeScript + Tailwind + Axios (`/frontend`)
- **Backend**: Python + FastAPI + SQLAlchemy (`/backend`)
- **Database**: Postgres (free tier via Neon or Supabase); falls back to
  local SQLite for zero-setup development

See `backend/README.md` and `frontend/README.md` for setup steps for each
half. Quick start, two terminals:

```bash
# terminal 1
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt && cp .env.example .env
uvicorn app.main:app --reload

# terminal 2
cd frontend && npm install && cp .env.example .env
npm run dev
```

Then open http://localhost:5173.

## Current state (v0.1 — initial scaffold)

What exists right now:
- Backend: full CRUD for cat entries (`GET/POST/PUT/DELETE /api/cats`),
  with optimistic-concurrency version checks on edits and an edit log table
- Frontend: a catalog/home page that lists entries from the API, with
  client-side search

## Suggested next steps

1. **Seed some real data** — `POST /api/cats` a few entries via the
   `/docs` page so the homepage has something to show.
2. **Cat detail page** (`/cats/:id`) — read the full entry.
3. **Edit form** — this is where the version-conflict handling in
   `backend/app/routers/cats.py` actually gets exercised; the frontend
   needs to catch a `409` response and prompt the user to reload.
4. **Auth** — simple email/password with JWT, so edits are attributed to
   a real user instead of "anonymous."
5. **Deploy** — Vercel (frontend) + Render (backend) + Neon (database),
   all free tier; steps are in each half's README.
