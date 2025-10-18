import Link from "next/link";
import { getMinutes } from "../../lib/content";

export const metadata = { title: "Comptes rendus – UPEM" };

export default async function MinutesPage() {
  const minutes = await getMinutes();

  return (
    <main className="container">
      <h1>Comptes rendus</h1>
      {minutes.length === 0 ? (
        <p>Aucun compte rendu pour le moment.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {minutes.map((m) => (
            <li key={m.slug} style={{ margin: "14px 0" }}>
              <Link href={`/article/${m.slug}`} style={{ fontWeight: 700 }}>
                {m.title}
              </Link>
              {m.date && (
                <span style={{ color: "#6b7280", marginLeft: 8 }}>
                  {new Date(m.date).toLocaleDateString("fr-FR")}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
