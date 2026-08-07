"""
Sets up the SQLAlchemy engine and session that the rest of the app uses
to talk to Postgres. Everything reads its connection string from .env
so no secrets live in the code.
"""
import os
import socket
from urllib.parse import urlparse
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")
# Falls back to a local SQLite file if DATABASE_URL isn't set yet, so you
# can run the API immediately without waiting on a Postgres account.


def resolve_ipv4(hostname: str) -> str | None:
    """Looks up an IPv4 address for this hostname specifically. Some
    hosts (like Render) don't support outbound IPv6, but a Postgres
    provider's hostname (like Neon's) may resolve to an IPv6 address
    by default — this forces IPv4 so the connection actually works."""
    try:
        results = socket.getaddrinfo(hostname, None, socket.AF_INET)
        return results[0][4][0]
    except socket.gaierror:
        return None


connect_args: dict = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
elif DATABASE_URL.startswith("postgresql"):
    hostname = urlparse(DATABASE_URL.replace("postgresql+psycopg", "postgresql")).hostname
    ipv4 = resolve_ipv4(hostname) if hostname else None
    if ipv4:
        # hostaddr tells psycopg exactly which IP to connect to, while
        # `host` (still in DATABASE_URL) is kept for SSL hostname checks.
        connect_args = {"hostaddr": ipv4}

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