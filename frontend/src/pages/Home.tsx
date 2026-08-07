import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchCats, CatEntry } from "../api/client";
import { parseInfobox } from "../utils/catInfo";
import CatCard from "../components/CatCard";
import CatCardSkeleton from "../components/CatCardSkeleton";

type SortOrder = "az" | "za";

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const originFilter = searchParams.get("origin");

  const [cats, setCats] = useState<CatEntry[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("az");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  // When an origin filter is active (from the sidebar), we need the
  // full catalog client-side to filter by origin, since the backend
  // search only matches name/breed. Otherwise, let the backend do the
  // name/breed search as usual.
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchCats(originFilter ? undefined : search || undefined)
      .then(setCats)
      .catch(() =>
        setError(
          "Couldn't reach the catalog. Is the backend running at the URL in your .env?"
        )
      )
      .finally(() => setLoading(false));
  }, [search, originFilter]);

  const filteredCats = useMemo(() => {
    let result = cats;

    if (originFilter) {
      result = result.filter(
        (cat) => parseInfobox(cat.body).origin === originFilter
      );
    }

    if (originFilter && search) {
      const q = search.toLowerCase();
      result = result.filter(
        (cat) =>
          cat.name.toLowerCase().includes(q) ||
          (cat.breed ?? "").toLowerCase().includes(q)
      );
    }

    const sorted = [...result];
    sorted.sort((a, b) =>
      sortOrder === "az" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    return sorted;
  }, [cats, originFilter, search, sortOrder]);

  const spotlight = useMemo(() => {
    if (search || originFilter) return null;
    const withPhotos = cats.filter((c) => c.image_url);
    if (withPhotos.length === 0) return null;
    return withPhotos[Math.floor(Math.random() * withPhotos.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cats.length, search, originFilter]);

  function goToRandomCat() {
    if (cats.length === 0) return;
    const pick = cats[Math.floor(Math.random() * cats.length)];
    navigate(`/cats/${pick.id}`);
  }

  return (
    <>
      <section className="border-b-2 border-ink/10 bg-gradient-to-b from-pine/10 to-transparent">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <p className="font-body text-xs uppercase tracking-[0.25em] text-marigold mb-3">
            Est. today &middot; crowd-written
          </p>
          <h1 className="font-display text-5xl text-ink mb-4 leading-tight">
            The Catalog
          </h1>
          <p className="font-body text-lg text-ink/70 max-w-xl mb-6">
            A living field guide to the cats of the world. Every entry is
            editable — help expand the record.
          </p>
          <button
            onClick={goToRandomCat}
            disabled={cats.length === 0}
            className="font-body text-sm px-4 py-2 border-2 border-pine text-pine hover:bg-pine hover:text-parchment transition-colors disabled:opacity-40"
          >
            🎲 Take me to a random cat
          </button>
        </div>
      </section>

      {spotlight && (
        <section className="border-b-2 border-ink/10 bg-white/30">
          <div className="mx-auto max-w-5xl px-6 py-8">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-marigold mb-3">
              Spotlight entry
            </p>
            <Link
              to={`/cats/${spotlight.id}`}
              className="flex flex-col sm:flex-row gap-6 group"
            >
              <img
                src={spotlight.image_url ?? undefined}
                alt={spotlight.name}
                className="w-full sm:w-48 h-48 object-cover border-2 border-ink/15 flex-shrink-0"
              />
              <div>
                <h2 className="font-display text-2xl text-ink group-hover:text-pine transition-colors">
                  {spotlight.name}
                </h2>
                {spotlight.breed && (
                  <p className="font-body text-sm text-pine mb-2">{spotlight.breed}</p>
                )}
                {spotlight.summary && (
                  <p className="font-body text-ink/70 line-clamp-3">
                    {spotlight.summary}
                  </p>
                )}
                <span className="font-body text-sm text-pine underline mt-2 inline-block">
                  Read the full entry &rarr;
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <main className="mx-auto max-w-5xl px-6 py-10">
        {originFilter && (
          <div className="flex items-center gap-3 mb-6 font-body text-sm">
            <span className="text-ink/60">Filtering by origin:</span>
            <span className="px-2 py-0.5 bg-pine text-parchment">{originFilter}</span>
            <Link to="/" className="text-rust underline">
              Clear
            </Link>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or breed…"
            className="w-full max-w-sm border-2 border-ink/15 bg-white/40 px-4 py-2 font-body text-ink placeholder:text-ink/40 focus:outline-none focus:border-pine"
          />
          <div className="flex items-center gap-4">
            {!loading && !error && (
              <p className="font-body text-sm text-ink/50">
                {filteredCats.length} {filteredCats.length === 1 ? "entry" : "entries"}
              </p>
            )}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="font-body text-sm border-2 border-ink/15 bg-white/40 px-3 py-2 focus:outline-none focus:border-pine"
            >
              <option value="az">Name A &rarr; Z</option>
              <option value="za">Name Z &rarr; A</option>
            </select>
          </div>
        </div>

        {error && <p className="font-body text-rust">{error}</p>}

        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CatCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !error && filteredCats.length === 0 && (
          <p className="font-body text-ink/50">
            No entries match yet. Try a different search, or{" "}
            <Link to="/cats/new" className="text-pine underline">
              add one
            </Link>
            .
          </p>
        )}

        {!loading && !error && filteredCats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCats.map((cat) => (
              <CatCard key={cat.id} cat={cat} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}