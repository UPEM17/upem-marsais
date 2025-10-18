import Link from "next/link";
import { getEvents } from "../lib/content";

export const metadata = { title: "UPEM – Accueil" };

export default async function HomePage() {
  const events = (await getEvents()).slice(0, 5);

  return (
    <main className="container">
      <h1>UPEM</h1>
      <p>Association de parents d’élèves</p>

      <h2>À venir</h2>
      {events.length === 0 ? (
        <p>Aucun événement planifié.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {events.map((e) => (
            <li key={e.slug} style={{ margin: "12px 0" }}>
              <Link href={`/article/${e.slug}`} style={{ fontWeight: 700 }}>
                {e.title}
              </Link>
              {e.date && (
                <span style={{ color: "#6b7280", marginLeft: 8 }}>
                  {new Date(e.date).toLocaleDateString("fr-FR")}
                </span>
              )}
              {e.lieu && <span style={{ marginLeft: 8 }}>• {e.lieu}</span>}
            </li>
          ))}
        </ul>
      )}

      <p style={{ marginTop: 24 }}>
        <Link href="/evenements">Tous les événements →</Link>
      </p>
    </main>
  );
}
