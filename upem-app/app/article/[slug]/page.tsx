import Link from "next/link";
import { getAllSlugs, getArticleBySlug } from "../../../lib/content";

type Props = { params: { slug: string } };

export const metadata = {
  title: "Article – UPEM",
};

/** Next export exige generateStaticParams pour les routes dynamiques */
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: Props) {
  const doc = await getArticleBySlug(params.slug);
  if (!doc) {
    return (
      <main className="container">
        <h1>Article introuvable</h1>
        <p>
          <Link href="/">Retour à l’accueil</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="container">
      <p style={{ margin: "12px 0" }}>
        <Link href="/">← Retour à l’accueil</Link>
      </p>

      <h1 style={{ margin: "6px 0 0" }}>{doc.title}</h1>
      {doc.date && (
        <p style={{ color: "#6b7280", margin: 0 }}>
          {new Date(doc.date).toLocaleDateString("fr-FR")}
        </p>
      )}
      {doc.lieu && (
        <p style={{ color: "#6b7280", marginTop: 0 }}>Lieu : {doc.lieu}</p>
      )}

      <article
        style={{ marginTop: 16, lineHeight: 1.6 }}
        dangerouslySetInnerHTML={{ __html: doc.body.replace(/\n/g, "<br/>") }}
      />
    </main>
  );
}
