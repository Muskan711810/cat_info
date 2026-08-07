"""
Populates (and backfills) the database with real cat breed entries
pulled from TheCatAPI (https://thecatapi.com) — a free, public API.

TheCatAPI's /breeds endpoint doesn't reliably include a photo per
breed for anonymous requests, so this script makes one extra call
per breed to /images/search?breed_ids=... to get a real photo URL.

Run it from the backend/ folder with the venv active:

    python -m app.seed

Safe to run more than once:
- Breeds not yet in the database get created.
- Breeds already in the database with a blank image_url get their
  image backfilled (this fixes entries seeded before this update).
- Breeds that already have both text and an image are left alone.
"""
import time
import requests
from .database import SessionLocal, engine, Base
from . import models

BREEDS_URL = "https://api.thecatapi.com/v1/breeds"
IMAGE_SEARCH_URL = "https://api.thecatapi.com/v1/images/search"


def build_body(breed: dict) -> str:
    parts = []
    if breed.get("description"):
        parts.append(breed["description"])
    if breed.get("temperament"):
        parts.append(f"Temperament: {breed['temperament']}.")
    if breed.get("origin"):
        parts.append(f"Origin: {breed['origin']}.")
    if breed.get("life_span"):
        parts.append(f"Typical lifespan: {breed['life_span']} years.")
    return "\n\n".join(parts)


def build_summary(description: str | None) -> str:
    if not description:
        return ""
    first_sentence = description.split(". ")[0].strip()
    return first_sentence if first_sentence.endswith(".") else first_sentence + "."


def fetch_image_url(breed_id: str) -> str:
    """Looks up one real photo for this breed. Returns "" if none found
    or the request fails, so a single bad lookup never crashes the seed."""
    try:
        resp = requests.get(
            IMAGE_SEARCH_URL, params={"breed_ids": breed_id, "limit": 1}, timeout=10
        )
        resp.raise_for_status()
        results = resp.json()
        if results and results[0].get("url"):
            return results[0]["url"]
    except requests.RequestException:
        pass
    return ""


def run():
    print("Fetching breed list from TheCatAPI...")
    response = requests.get(BREEDS_URL, timeout=15)
    response.raise_for_status()
    breeds = response.json()
    print(f"Got {len(breeds)} breeds. Looking up a photo for each (this takes a minute)...")

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    added = 0
    backfilled = 0
    skipped = 0
    try:
        for i, breed in enumerate(breeds, start=1):
            name = breed.get("name")
            if not name:
                continue

            image_url = fetch_image_url(breed.get("id", ""))
            time.sleep(0.1)  # be polite to the free anonymous rate limit

            existing = db.query(models.CatEntry).filter(models.CatEntry.name == name).first()

            if existing:
                if not existing.image_url and image_url:
                    existing.image_url = image_url
                    backfilled += 1
                else:
                    skipped += 1
                continue

            entry = models.CatEntry(
                name=name,
                breed=name,
                summary=build_summary(breed.get("description")),
                body=build_body(breed),
                image_url=image_url,
                version=1,
            )
            db.add(entry)
            added += 1

            if i % 10 == 0:
                print(f"  ...{i}/{len(breeds)} processed")

        db.commit()
    finally:
        db.close()

    print(
        f"Done — added {added} new entries, backfilled {backfilled} images "
        f"on existing entries, skipped {skipped} already complete."
    )


if __name__ == "__main__":
    run()