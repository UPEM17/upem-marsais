import Link from "next/link";
import { getEvents } from "../lib/content";

export default function Home() {
  const evts = getEvents().slice(0, 1);
  return (
    <main className="container">
      <h1>UPEM</h1>
      {evts.length === 0 ? (
        <p>Bienvenue !</p>
      ) : (
        <>
          <h2>À la une</h2>
          <ul>
            {evts.map(e => (
              <li key={e.slug}>
                <Link href={`/article/${e.slug}`}>{e.title}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
