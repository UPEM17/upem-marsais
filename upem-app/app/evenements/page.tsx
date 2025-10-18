import Link from "next/link";
import Image from "next/image";
import { getEvents, getNextEvent } from "../../lib/content";

export const metadata = { title: "Événements – UPEM" };

export default function Page() {
  const list = getEvents();
  const next = getNextEvent();

  return (
    <main className="container">
      {next ? (
        <div className="notice" style={{marginBottom:16}}>
          <strong>Prochain évènement :</strong>{" "}
          <Link href={`/article/${next.slug}/`}>{next.title}</Link>
          {" · "}
          <span className="meta">{next.date ? new Date(next.date).toLocaleDateString("fr-FR") : ""}</span>
          {next.lieu ? <> {" · "} <span className="meta">Lieu : {next.lieu}</span></> : null}
        </div>
      ) : null}

      <h1>Événements</h1>
      <div className="grid">
        {list.map((p) => (
          <Link href={`/article/${p.slug}/`} key={p.slug} className="card">
            {p.cover ? (
              <Image className="thumb" src={p.cover} alt="miniature" width={120} height={90} />
            ) : <div className="thumb" />}
            <div>
              <div className="meta">{p.date ? new Date(p.date).toLocaleDateString("fr-FR") : ""}</div>
              <div className="title">{p.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
