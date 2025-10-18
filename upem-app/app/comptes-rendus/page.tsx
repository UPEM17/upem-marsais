import Link from "next/link";
import { getMinutes } from "../../lib/content";

export const metadata = { title: "Comptes rendus – UPEM" };

export default function Page() {
  const list = getMinutes();
  return (
    <main className="container">
      <h1>Comptes rendus</h1>
      <ul>
        {list.map((m) => (
          <li key={m.slug} style={{ marginBottom: 12 }}>
            <Link href={`/article/${m.slug}/`} className="title">{m.title}</Link>
            {m.date ? (
              <span className="meta" style={{ marginLeft: 8 }}>
                {new Date(m.date).toLocaleDateString("fr-FR")}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
