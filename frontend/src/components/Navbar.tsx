import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b-2 border-ink/10 bg-parchment/95 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="font-display text-2xl tracking-tight text-ink">
          Cat Wipidia
        </Link>
        <div className="flex items-center gap-4">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-pine hidden md:inline">
            A field guide, crowd-written
          </span>
          <Link
            to="/cats/new"
            className="font-body text-sm font-medium px-4 py-2 rounded-sm bg-pine text-parchment hover:bg-ink transition-colors whitespace-nowrap"
          >
            + Add entry
          </Link>
        </div>
      </div>
    </header>
  );
}