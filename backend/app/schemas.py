"""
Pydantic models define the exact shape of data going in and out of the
API. This is the Python equivalent of a TypeScript interface, and
FastAPI uses these to auto-generate the /docs page and validate every
request before it ever reaches your route logic.
"""
from datetime import datetime
from pydantic import BaseModel


class CatEntryBase(BaseModel):
    name: str
    breed: str | None = None
    summary: str | None = ""
    body: str | None = ""
    image_url: str | None = ""


class CatEntryCreate(CatEntryBase):
    pass


class CatEntryUpdate(CatEntryBase):
    version: int  # client must send back the version it last saw


class CatEntryOut(CatEntryBase):
    id: int
    version: int
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True


"""
Pydantic models define the exact shape of data going in and out of the
API. This is the Python equivalent of a TypeScript interface, and
FastAPI uses these to auto-generate the /docs page and validate every
request before it ever reaches your route logic.
"""
from datetime import datetime
from pydantic import BaseModel, Field


class CatEntryBase(BaseModel):
    name: str
    breed: str | None = None
    summary: str | None = ""
    body: str | None = ""
    image_url: str | None = ""


class CatEntryCreate(CatEntryBase):
    breed: str = Field(..., min_length=1)
    summary: str = Field(..., min_length=1)


class CatEntryUpdate(CatEntryBase):
    version: int
    breed: str = Field(..., min_length=1)
    summary: str = Field(..., min_length=1)


class CatEntryOut(CatEntryBase):
    id: int
    version: int
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True