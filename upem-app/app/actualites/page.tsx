import Link from "next/link";
import { getPosts } from "../../lib/content";

export const metadata = { title: "Actualités – UPEM" };

export default function Page() {
  const posts = getPosts();
  return (
    <main className="container">
      <h1>Actualités</h1>
      {posts.length === 0 ? (
        <p>Aucune actualité pour l’instant.</p>
      ) : (
        <ul>
          {posts.map(p => (
            <li key={p.slug}>
              <Link href={`/article/${p.slug}`}>{p.title}</Link>{" "}
              <small>({new Date(p.date).toLocaleDateString("fr-FR")})</small>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
