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
      result = result.filter((cat) => parseInfobox(cat.body).origin === originFilter);
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
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="border border-ink/30 bg-box px-5 py-4 mb-6">
        <h1 className="font-display text-3xl text-ink mb-1">
          Welcome to Cat Wipidia
        </h1>
        <p className="font-body text-sm text-ink/70">
          The free cat encyclopedia that anyone can edit —{" "}
          <span className="font-semibold">{cats.length}</span>{" "}
          {cats.length === 1 ? "entry" : "entries"} and counting.{" "}
          <button onClick={goToRandomCat} className="text-pine hover:underline">
            Random entry
          </button>
          {" · "}
          <Link to="/cats/new" className="text-pine hover:underline">
            Add an entry
          </Link>
        </p>
      </div>

      {spotlight && (
        <div className="border border-ink/30 mb-6">
          <div className="bg-boxhead px-3 py-1.5 font-display font-bold text-sm text-ink">
            From today's featured entry
          </div>
          <Link
            to={`/cats/${spotlight.id}`}
            className="flex flex-col sm:flex-row gap-4 p-4 hover:bg-box transition-colors"
          >
            <img
              src={spotlight.image_url ?? undefined}
              alt={spotlight.name}
              className="w-full sm:w-40 h-40 object-cover border border-ink/15 flex-shrink-0"
            />
            <div>
              <h2 className="font-display text-xl text-pine mb-1">
                {spotlight.name}
              </h2>
              {spotlight.summary && (
                <p className="font-body text-sm text-ink/80 line-clamp-4">
                  {spotlight.summary}
                </p>
              )}
              <span className="font-body text-sm text-pine hover:underline mt-2 inline-block">
                Read the full entry &rarr;
              </span>
            </div>
          </Link>
        </div>
      )}

      {originFilter && (
        <div className="flex items-center gap-3 mb-4 font-body text-sm border border-ink/20 bg-box px-3 py-2">
          <span className="text-ink/60">Category: origin =</span>
          <span className="font-semibold text-ink">{originFilter}</span>
          <Link to="/" className="text-rust hover:underline ml-auto">
            Clear
          </Link>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-ink/15 pb-3">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or breed…"
          className="w-full max-w-sm border border-ink/30 bg-parchment px-3 py-1.5 font-body text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-pine"
        />
        <div className="flex items-center gap-3 font-body text-sm">
          {!loading && !error && (
            <span className="text-ink/50">
              {filteredCats.length} {filteredCats.length === 1 ? "entry" : "entries"}
            </span>
          )}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="border border-ink/30 bg-parchment px-2 py-1.5 focus:outline-none focus:border-pine"
          >
            <option value="az">Name A &rarr; Z</option>
            <option value="za">Name Z &rarr; A</option>
          </select>
        </div>
      </div>

      {error && <p className="font-body text-rust">{error}</p>}

      {loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CatCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && !error && filteredCats.length === 0 && (
        <p className="font-body text-ink/50">
          No entries match yet. Try a different search, or{" "}
          <Link to="/cats/new" className="text-pine hover:underline">
            add one
          </Link>
          .
        </p>
      )}

      {!loading && !error && filteredCats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCats.map((cat) => (
            <CatCard key={cat.id} cat={cat} />
          ))}
        </div>
      )}
    </main>
  );
}