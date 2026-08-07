"""
Database tables.

CatEntry.version is what makes edit-conflict handling possible later:
an update is only allowed to succeed if the version it was loaded at
still matches what's in the database (see routers/cats.py). This is
the "optimistic concurrency" approach from our design discussion.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base


class CatEntry(Base):
    __tablename__ = "cat_entries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False, index=True)
    breed = Column(String(120), index=True)
    summary = Column(Text, default="")
    body = Column(Text, default="")
    image_url = Column(String(500), default="")
    version = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class EditLog(Base):
    """One row per saved edit, so entries can show a history later."""
    __tablename__ = "edit_log"

    id = Column(Integer, primary_key=True, index=True)
    cat_entry_id = Column(Integer, ForeignKey("cat_entries.id"), nullable=False)
    editor_name = Column(String(120), default="anonymous")
    change_summary = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
