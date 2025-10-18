import Link from "next/link";
import { getPosts } from "../../lib/content";

export const metadata = { title: "Actualités – UPEM" };

export default async function ActualitesPage() {
  const posts = await getPosts();

  return (
    <main className="container">
      <h1>Actualités</h1>
      {posts.length === 0 ? (
        <p>Aucune actualité pour le moment.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {posts.map((p) => (
            <li key={p.slug} style={{ margin: "14px 0" }}>
              <Link href={`/article/${p.slug}`} style={{ fontWeight: 700 }}>
                {p.title}
              </Link>
              {p.date && (
                <span style={{ color: "#6b7280", marginLeft: 8 }}>
                  {new Date(p.date).toLocaleDateString("fr-FR")}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
