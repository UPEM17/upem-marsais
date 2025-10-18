import { getAllSlugs } from "../../../lib/content";

export default function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}
