"""
Sets up the SQLAlchemy engine and session that the rest of the app uses
to talk to Postgres. Everything reads its connection string from .env
so no secrets live in the code.
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")
# Falls back to a local SQLite file if DATABASE_URL isn't set yet, so you
# can run the API immediately without waiting on a Postgres account.

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency: gives each request its own DB session, then closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
