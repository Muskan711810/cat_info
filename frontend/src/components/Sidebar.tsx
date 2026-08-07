import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchCats, CatEntry } from "../api/client";
import { parseInfobox } from "../utils/catInfo";

export default function Sidebar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeOrigin = searchParams.get("origin");

  const [cats, setCats] = useState<CatEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Loaded once, independent of whatever filter/search is active on
  // the Home page, so the origin list in the sidebar always reflects
  // the whole catalog rather than whatever's currently filtered.
  useEffect(() => {
    fetchCats()
      .then(setCats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const originCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const cat of cats) {
      const origin = parseInfobox(cat.body).origin;
      if (!origin) continue;
      counts.set(origin, (counts.get(origin) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [cats]);

  function goToRandomCat() {
    if (cats.length === 0) return;
    const pick = cats[Math.floor(Math.random() * cats.length)];
    navigate(`/cats/${pick.id}`);
  }

  return (
    <aside className="hidden md:flex md:flex-col w-56 flex-shrink-0 border-r-2 border-ink/10 bg-parchment/60 sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto">
      <nav className="p-4 space-y-1 border-b-2 border-ink/10">
        <Link
          to="/"
          className="flex items-center gap-2 font-body text-sm text-ink hover:text-pine px-2 py-1.5 rounded-sm hover:bg-pine/10 transition-colors"
        >
          <span aria-hidden>🏠</span> Home
        </Link>
        <button
          onClick={goToRandomCat}
          className="w-full flex items-center gap-2 font-body text-sm text-ink hover:text-pine px-2 py-1.5 rounded-sm hover:bg-pine/10 transition-colors text-left"
        >
          <span aria-hidden>🎲</span> Random cat
        </button>
        {/* <Link
          to="/cats/new"
          className="flex items-center gap-2 font-body text-sm text-ink hover:text-pine px-2 py-1.5 rounded-sm hover:bg-pine/10 transition-colors"
        >
          <span aria-hidden>➕</span> Add entry
        </Link> */}
      </nav>

      <div className="p-4">
        <p className="font-body text-xs uppercase tracking-widest text-pine mb-2">
          Browse by origin
        </p>

        {loading && (
          <p className="font-body text-xs text-ink/40">Loading…</p>
        )}

        {!loading && originCounts.length === 0 && (
          <p className="font-body text-xs text-ink/40">
            No origin data yet.
          </p>
        )}

        {!loading && originCounts.length > 0 && (
          <ul className="space-y-0.5">
            {activeOrigin && (
              <li>
                <Link
                  to="/"
                  className="font-body text-xs text-rust underline"
                >
                  &times; Clear filter
                </Link>
              </li>
            )}
            {originCounts.map(([origin, count]) => (
              <li key={origin}>
                <Link
                  to={`/?origin=${encodeURIComponent(origin)}`}
                  className={`flex items-center justify-between font-body text-sm px-2 py-1 rounded-sm transition-colors ${
                    activeOrigin === origin
                      ? "bg-pine text-parchment"
                      : "text-ink/80 hover:bg-pine/10 hover:text-pine"
                  }`}
                >
                  <span className="truncate">{origin}</span>
                  <span
                    className={`text-xs ml-2 ${
                      activeOrigin === origin ? "text-parchment/80" : "text-ink/40"
                    }`}
                  >
                    {count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}