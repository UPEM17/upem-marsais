import Link from "next/link";
import Image from "next/image";
import { getPosts } from "../../lib/content";

export const metadata = { title: "Actualités – UPEM" };

export default function Page() {
  const list = getPosts();
  return (
    <main className="container">
      <h1>Actualités</h1>
      <div className="grid">
        {list.map((p) => (
          <Link href={`/article/${p.slug}/`} key={p.slug} className="card">
            {p.cover ? (
              <Image className="thumb" src={p.cover} alt="miniature" width={120} height={90} />
            ) : (
              <div className="thumb" />
            )}
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
