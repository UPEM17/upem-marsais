import Link from "next/link";
import { getEvents } from "../../lib/content";

export const metadata = { title: "Événements – UPEM" };

export default async function EvenementsPage() {
  const events = await getEvents();

  return (
    <main className="container">
      <h1>Événements</h1>
      {events.length === 0 ? (
        <p>Aucun événement pour le moment.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {events.map((e) => (
            <li key={e.slug} style={{ margin: "14px 0" }}>
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
    </main>
  );
}
