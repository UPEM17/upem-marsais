import Link from "next/link";
import Image from "next/image";
import { getPosts } from "../../lib/content";

export const metadata = { title: "Actualités – UPEM" };

export default function Page() {
  const posts = getPosts();
  return (
    <main className="container">
      {posts.map((p) => (
        <Link href={`/article/${p.slug}/`} key={p.slug} className="card">
          {p.cover ? (
            <Image className="thumb" src={p.cover} alt="miniature" width={120} height={90} />
          ) : (
            <div className="thumb" />
          )}
          <div>
            <h3>{p.title}</h3>
            {p.date && <p style={{ color: "#6b7280", marginTop: 0 }}>{p.date}</p>}
          </div>
        </Link>
      ))}
    </main>
  );
}
