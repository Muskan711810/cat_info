import { Link } from "react-router-dom";
import { CatEntry } from "../api/client";

interface Props {
  cat: CatEntry;
}

export default function CatCard({ cat }: Props) {
  const catalogNo = String(cat.id).padStart(3, "0");

  return (
    <Link
      to={`/cats/${cat.id}`}
      className="group block border-2 border-ink/15 bg-parchment hover:border-pine hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
    >
      <div className="aspect-[4/3] bg-ink/5 overflow-hidden">
        {cat.image_url ? (
          <img
            src={cat.image_url}
            alt={cat.name}
            className="h-full w-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-ink/30 font-display text-4xl">
            ?
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-body text-xs tracking-widest text-marigold">
          No. {catalogNo}
        </p>
        <h3 className="font-display text-xl text-ink leading-snug">{cat.name}</h3>
        {cat.breed && <p className="font-body text-sm text-pine">{cat.breed}</p>}
        {cat.summary && (
          <p className="font-body text-sm text-ink/70 mt-2 line-clamp-2">
            {cat.summary}
          </p>
        )}
      </div>
    </Link>
  );
}
