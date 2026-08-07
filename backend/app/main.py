import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from . import models
from .database import engine
from .routers import cats

load_dotenv()

# Creates tables on startup if they don't exist yet. Fine for a small
# project; a real production app would use Alembic migrations instead.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cat Wipidia API", version="0.1.0")

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cats.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
