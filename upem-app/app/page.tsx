import Link from "next/link";
import { getEvents } from "../../lib/content";

export const metadata = { title: "Événements – UPEM" };

export default function Page() {
  const items = getEvents();
  return (
    <main className="container">
      <h1>Événements</h1>
      {items.length === 0 ? (
        <p>Aucun événement pour l’instant.</p>
      ) : (
        <ul>
          {items.map(p => (
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
