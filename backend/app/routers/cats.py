from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/cats", tags=["cats"])


@router.get("", response_model=list[schemas.CatEntryOut])
def list_cats(search: str | None = None, db: Session = Depends(get_db)):
    query = db.query(models.CatEntry)
    if search:
        like = f"%{search}%"
        query = query.filter(
            (models.CatEntry.name.ilike(like)) | (models.CatEntry.breed.ilike(like))
        )
    return query.order_by(models.CatEntry.name).all()


@router.get("/{cat_id}", response_model=schemas.CatEntryOut)
def get_cat(cat_id: int, db: Session = Depends(get_db)):
    cat = db.query(models.CatEntry).filter(models.CatEntry.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Cat entry not found")
    return cat


@router.post("", response_model=schemas.CatEntryOut, status_code=201)
def create_cat(payload: schemas.CatEntryCreate, db: Session = Depends(get_db)):
    cat = models.CatEntry(**payload.model_dump(), version=1)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.put("/{cat_id}", response_model=schemas.CatEntryOut)
def update_cat(cat_id: int, payload: schemas.CatEntryUpdate, db: Session = Depends(get_db)):
    cat = db.query(models.CatEntry).filter(models.CatEntry.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Cat entry not found")

    # Optimistic concurrency check: reject the edit if someone else's
    # change already moved the version forward since this client loaded it.
    if cat.version != payload.version:
        raise HTTPException(
            status_code=409,
            detail="This entry was edited by someone else. Reload and try again.",
        )

    for field in ("name", "breed", "summary", "body", "image_url"):
        setattr(cat, field, getattr(payload, field))
    cat.version += 1

    db.add(models.EditLog(cat_entry_id=cat.id, change_summary="Updated entry"))
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/{cat_id}", status_code=204)
def delete_cat(cat_id: int, db: Session = Depends(get_db)):
    cat = db.query(models.CatEntry).filter(models.CatEntry.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Cat entry not found")
    db.delete(cat)
    db.commit()
