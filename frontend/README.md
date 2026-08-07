# Cat Wipidia — Frontend (React + TypeScript + Tailwind)

## Run it locally

```bash
cd frontend
npm install
cp .env.example .env      # points at http://localhost:8000 by default
npm run dev
```

Open **http://localhost:5173**. Make sure the backend (`../backend`) is
running first, or you'll see the "Couldn't reach the catalog" message.

## What's here

- `src/api/client.ts` — the Axios instance + typed functions that call the
  FastAPI backend
- `src/components/` — reusable pieces (`Navbar`, `CatCard`)
- `src/pages/Home.tsx` — the catalog listing with search
- `tailwind.config.js` — the color/font tokens for the "field guide"
  design direction (parchment background, forest green + marigold accents,
  Fraunces/Karla type pairing)

## Deploying free

1. Push this `frontend/` folder to GitHub (see root README for repo layout).
2. Import the repo on **vercel.com** (free tier). Set the root directory to
   `frontend` if it's in a monorepo.
3. Add an environment variable `VITE_API_URL` pointing at your deployed
   backend's URL.
