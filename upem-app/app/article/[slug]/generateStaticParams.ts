import { getAllSlugs } from "../../../lib/content";

// ⬅️ export NOMMÉ (pas default)
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// (optionnel, mais ok pour l’export statique)
export const dynamicParams = false;
