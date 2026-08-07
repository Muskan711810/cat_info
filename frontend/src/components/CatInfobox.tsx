import { CatInfobox as CatInfoboxData } from "../utils/catInfo";

interface Props {
  info: CatInfoboxData;
  imageUrl?: string | null;
  name: string;
}

export default function CatInfobox({ info, imageUrl, name }: Props) {
  const hasAnyFacts = info.origin || info.lifespan || (info.temperament && info.temperament.length > 0);
  if (!hasAnyFacts && !imageUrl) return null;

  return (
    <aside className="border-2 border-ink/15 bg-white/40 w-full sm:w-72 sm:float-right sm:ml-6 mb-6">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          className="w-full aspect-square object-cover border-b-2 border-ink/15"
        />
      )}
      <div className="p-4 space-y-3">
        <h2 className="font-display text-lg text-ink text-center border-b border-ink/10 pb-2">
          {name}
        </h2>

        {info.origin && (
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-pine mb-0.5">
              Origin
            </p>
            <p className="font-body text-sm text-ink">{info.origin}</p>
          </div>
        )}

        {info.lifespan && (
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-pine mb-0.5">
              Lifespan
            </p>
            <p className="font-body text-sm text-ink">{info.lifespan}</p>
          </div>
        )}

        {info.temperament && info.temperament.length > 0 && (
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-pine mb-1">
              Temperament
            </p>
            <div className="flex flex-wrap gap-1.5">
              {info.temperament.map((trait) => (
                <span
                  key={trait}
                  className="font-body text-xs px-2 py-0.5 bg-marigold/15 text-rust border border-marigold/30"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
