// Our seeded entries write facts as plain sentences inside `body`, e.g.
// "Temperament: Active, Curious.\n\nOrigin: Egypt.\n\nTypical lifespan: 14 - 15 years."
// This pulls those back out so we can show them as a tidy infobox,
// the way a Wikipedia-style page would. If an entry doesn't follow
// this pattern (e.g. a custom entry someone typed by hand), the
// matching fields are simply omitted — nothing breaks.

export interface CatInfobox {
  origin?: string;
  lifespan?: string;
  temperament?: string[];
}

export function parseInfobox(body: string | null | undefined): CatInfobox {
  if (!body) return {};

  const origin = body.match(/Origin:\s*([^.\n]+)/i)?.[1]?.trim();
  const lifespan = body.match(/(?:Typical )?[Ll]ifespan:\s*([^.\n]+)/i)?.[1]?.trim();
  const temperamentRaw = body.match(/Temperament:\s*([^.\n]+)/i)?.[1]?.trim();

  const temperament = temperamentRaw
    ? temperamentRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : undefined;

  return { origin, lifespan, temperament };
}
