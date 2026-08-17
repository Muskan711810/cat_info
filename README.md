# Cat Wipidia

**🔗 Live site:** https://cat-info-bice.vercel.app
**🔗 API docs:** https://cat-wipidia-backend.onrender.com/docs

A crowd-editable cat encyclopedia — a full rebuild of two old static
Bootstrap sites into a typed, full-stack app, styled after Wikipedia.
Seeded with 67 real cat breeds (photos, temperament, origin, lifespan)
pulled from a public cat API.

- **Frontend**: React + TypeScript + Tailwind + Axios (`/frontend`), deployed on Vercel
- **Backend**: Python + FastAPI + SQLAlchemy (`/backend`), deployed on Render
- **Database**: Postgres (free tier via Neon); falls back to local SQLite
  for zero-setup development

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

## Current state

- **Full CRUD** for cat entries (`GET/POST/PUT/DELETE /api/cats`), with
  required-field validation (name, breed, summary)
- **Optimistic-concurrency edit conflicts** — editing an entry someone
  else just changed returns a 409 instead of silently overwriting it,
  with an edit log table tracking history
- **Catalog browsing** — search, sort, a "spotlight" featured entry, and
  filtering by country of origin (via a live sidebar/dropdown)
- **Wikipedia-style UI** — infobox panel, serif headings, classic blue
  links, boxed layout
- **Seed script** (`backend/app/seed.py`) that pulls real breed data and
  photos from a public cat API
- **Deployed live** — Vercel (frontend) + Render (backend) + Neon
  (Postgres), all free tier

## Suggested next steps

1. **Auth** — simple email/password with JWT, so edits are attributed to
   a real user instead of anonymous.
2. **Edit history view** — a page showing an entry's past versions,
   using the `edit_log` table that's already being written to.
3. **Pagination** — once the catalog grows past ~100 entries.
4. **Real image upload** — currently entries store an image *URL* rather
   than an uploaded file; a real upload would need object storage
   (e.g. Cloudinary, Supabase Storage).

## Known limitations

- Render's free tier sleeps after ~15 min idle — first request after
  that takes 30-50s to wake up.
- No authentication yet — any visitor can edit or delete any entry.