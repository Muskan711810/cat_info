# Cat Wipidia — Backend (FastAPI)

## Run it locally

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # leave DATABASE_URL as-is to use local SQLite for now
uvicorn app.main:app --reload
```

Open **http://localhost:8000/docs** — FastAPI auto-generates an interactive
API tester there. Try `GET /api/cats`, then `POST /api/cats` to add an entry.

## What's here

- `app/main.py` — app setup, CORS, mounts routes
- `app/models.py` — the two database tables (`CatEntry`, `EditLog`)
- `app/schemas.py` — request/response shapes (like TS interfaces)
- `app/routers/cats.py` — the actual CRUD endpoints
- `app/database.py` — DB connection (defaults to a local SQLite file so you
  can run this before setting up Postgres)

## Deploying free

1. Create a free Postgres database at **neon.tech** or **supabase.com** —
   copy its connection string into `DATABASE_URL` on your host (not in git).
2. Push this `backend/` folder to its own GitHub repo (or a subfolder — see
   root README).
3. Create a free **Web Service** on **render.com**, point it at the repo,
   set build command `pip install -r requirements.txt`, start command
   `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
4. Add `DATABASE_URL`, `JWT_SECRET`, and `CORS_ORIGINS` (your deployed
   frontend URL) as environment variables in Render's dashboard.

Note: Render's free tier sleeps after ~15 minutes idle — the first request
after that takes 30-50s to wake back up. Fine for a portfolio project; worth
mentioning if you demo it live.
