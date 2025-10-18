// upem-app/app/comptes-rendus/page.tsx
import { getCollection } from "@/lib/content";

export const dynamic = "force-static"; // page statique à la build

export default function Page() {
  const minutes = getCollection("minutes");

  if (minutes.length === 0) {
    return (
      <main className="container">
        <h1>Comptes rendus</h1>
        <p>Aucun compte rendu pour l’instant.</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Comptes rendus</h1>
      <ul className="list">
        {minutes.map((m) => (
          <li key={m.slug} className="card">
            <div className="meta">
              {m.date ? <time>{new Date(m.date).toLocaleDateString("fr-FR")}</time> : null}
            </div>
            <a href={`/article/${m.slug}`} className="title">
              {m.title}
            </a>
            {m.body ? (
              <p className="excerpt">
                {/* on montre juste le début du contenu si présent */}
                {m.body.slice(0, 140)}…
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
