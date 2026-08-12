import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchCats, CatEntry } from "../api/client";
import { parseInfobox } from "../utils/catInfo";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeOrigin = searchParams.get("origin");

  const [cats, setCats] = useState<CatEntry[]>([]);
  const [browseOpen, setBrowseOpen] = useState(false);
  const browseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCats()
      .then(setCats)
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (browseRef.current && !browseRef.current.contains(e.target as Node)) {
        setBrowseOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const originCounts = (() => {
    const counts = new Map<string, number>();
    for (const cat of cats) {
      const origin = parseInfobox(cat.body).origin;
      if (!origin) continue;
      counts.set(origin, (counts.get(origin) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  })();

  function goToRandomCat() {
    if (cats.length === 0) return;
    const pick = cats[Math.floor(Math.random() * cats.length)];
    navigate(`/cats/${pick.id}`);
  }

  return (
    <header className="border-b border-ink/30 bg-box">
      <div className="mx-auto max-w-5xl px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-5">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display italic text-xl text-ink">Cat Wipidia</span>
            <span className="font-body text-xs text-ink/60 hidden sm:inline">
              The free cat encyclopedia
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-3 font-body text-sm">
            <div className="relative" ref={browseRef}>
              <button
                onClick={() => setBrowseOpen((v) => !v)}
                className="text-pine hover:underline"
              >
                Browse by origin ▾
              </button>

              {browseOpen && (
                <div className="absolute left-0 top-full mt-1 w-64 max-h-96 overflow-y-auto border border-ink/30 bg-parchment shadow-md z-30">
                  {activeOrigin && (
                    <Link
                      to="/"
                      onClick={() => setBrowseOpen(false)}
                      className="block font-body text-xs text-rust px-3 py-2 border-b border-ink/15"
                    >
                      &times; Clear filter
                    </Link>
                  )}
                  {originCounts.length === 0 && (
                    <p className="font-body text-xs text-ink/40 px-3 py-2">
                      Loading…
                    </p>
                  )}
                  {originCounts.map(([origin, count]) => (
                    <Link
                      key={origin}
                      to={`/?origin=${encodeURIComponent(origin)}`}
                      onClick={() => setBrowseOpen(false)}
                      className={`flex items-center justify-between font-body text-sm px-3 py-1.5 ${
                        activeOrigin === origin
                          ? "bg-boxhead text-ink"
                          : "text-pine hover:bg-box"
                      }`}
                    >
                      <span className="truncate">{origin}</span>
                      <span className="text-xs ml-2 text-ink/40">{count}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button onClick={goToRandomCat} className="text-pine hover:underline">
              Random article
            </button>
          </nav>
        </div>

        <Link
          to="/cats/new"
          className="font-body text-sm px-3 py-1 border border-ink/30 bg-parchment text-ink hover:bg-box transition-colors whitespace-nowrap"
        >
          + Add entry
        </Link>
      </div>
    </header>
  );
}