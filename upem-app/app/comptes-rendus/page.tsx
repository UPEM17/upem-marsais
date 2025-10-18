import Link from "next/link";
import { getMinutes } from "../../lib/content";

export const metadata = { title: "Comptes rendus – UPEM" };

export default function Page() {
  const items = getMinutes();
  return (
    <main className="container">
      <h1>Comptes rendus</h1>
      {items.length === 0 ? (
        <p>Aucun compte rendu pour l’instant.</p>
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
