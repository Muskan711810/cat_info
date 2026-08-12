import { Link } from "react-router-dom";
import { CatEntry } from "../api/client";

interface Props {
  cat: CatEntry;
}

export default function CatCard({ cat }: Props) {
  return (
    <Link
      to={`/cats/${cat.id}`}
      className="flex gap-3 p-3 border border-ink/15 bg-parchment hover:bg-box transition-colors"
    >
      <div className="w-16 h-16 flex-shrink-0 bg-box border border-ink/15 overflow-hidden">
        {cat.image_url ? (
          <img
            src={cat.image_url}
            alt={cat.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-ink/20 font-display text-xl">
            ?
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-lg text-pine leading-snug truncate">
          {cat.name}
        </h3>
        {cat.breed && (
          <p className="font-body text-xs text-ink/50 mb-1">{cat.breed}</p>
        )}
        {cat.summary && (
          <p className="font-body text-sm text-ink/70 line-clamp-2">
            {cat.summary}
          </p>
        )}
      </div>
    </Link>
  );
}