import { CatInfobox as CatInfoboxData } from "../utils/catInfo";

interface Props {
  info: CatInfoboxData;
  imageUrl?: string | null;
  name: string;
}

export default function CatInfobox({ info, imageUrl, name }: Props) {
  const hasAnyFacts =
    info.origin || info.lifespan || (info.temperament && info.temperament.length > 0);
  if (!hasAnyFacts && !imageUrl) return null;

  const rows: { label: string; value: string }[] = [];
  if (info.origin) rows.push({ label: "Origin", value: info.origin });
  if (info.lifespan) rows.push({ label: "Lifespan", value: info.lifespan });
  if (info.temperament && info.temperament.length > 0) {
    rows.push({ label: "Temperament", value: info.temperament.join(", ") });
  }

  return (
    <aside className="w-full sm:w-72 sm:float-right sm:ml-6 mb-6 border border-ink/30 bg-box text-sm">
      <div className="bg-boxhead px-2 py-1.5 text-center">
        <h2 className="font-display font-bold text-base text-ink leading-tight">
          {name}
        </h2>
      </div>

      {imageUrl && (
        <div className="p-2 text-center border-t border-ink/15">
          <img
            src={imageUrl}
            alt={name}
            className="w-full object-cover border border-ink/15"
          />
        </div>
      )}

      {rows.length > 0 && (
        <table className="w-full border-t border-ink/15">
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.label}
                className={i > 0 ? "border-t border-ink/10" : undefined}
              >
                <th className="align-top text-left font-body font-bold text-ink/80 bg-box/50 px-2 py-1.5 w-24 whitespace-nowrap">
                  {row.label}
                </th>
                <td className="font-body text-ink px-2 py-1.5">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </aside>
  );
}