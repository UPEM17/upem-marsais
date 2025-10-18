import Link from "next/link";
import Image from "next/image";
import { getEvents } from "../lib/content";

export const metadata = { title: "UPEM" };

export default function Home() {
  const events = getEvents().slice(0, 1);

  return (
    <main className="container">
      {events.map((e) => (
        <Link href={`/article/${e.slug}/`} key={e.slug} className="card">
          {e.cover ? (
            <Image className="thumb" src={e.cover} alt="miniature" width={120} height={90} />
          ) : (
            <div className="thumb" />
          )}
          <div>
            <h3>{e.title}</h3>
            {e.date && <p style={{ color: "#6b7280", marginTop: 0 }}>{e.date}</p>}
          </div>
        </Link>
      ))}
    </main>
  );
}
