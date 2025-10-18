// upem-app/app/article/[slug]/generateStaticParams.ts
import { getAllSlugs } from "../../../lib/content";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}
