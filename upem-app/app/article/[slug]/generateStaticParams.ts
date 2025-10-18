// upem-app/app/article/[slug]/generateStaticParams.ts
import { getAllSlugs } from "@/lib/content";

export default function generateStaticParams() {
  // retourne [{ slug: "xxx" }, ...] pour l'export statique
  return getAllSlugs().map((slug) => ({ slug }));
}
