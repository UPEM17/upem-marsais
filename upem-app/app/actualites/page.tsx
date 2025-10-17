import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from '@/lib/content';

export const metadata = { title: 'Actualités – UPEM' };

export default function Page(){
  const posts = getPosts();
  return (
    <div className="grid">
      {posts.map(p=> (
        <Link href={`/article/${p.slug}/`} key={p.slug} className="card">
          {p.cover ? (
            <Image className="thumb" src={p.cover} alt="miniature" width={120} height={90} />
          ) : <div className="thumb" />}
          <div>
            <div className="meta">{new Date(p.date).toLocaleDateString('fr-FR')}</div>
            <h3>{p.title}</h3>
            {p.tags?.map(t=> <span className="tag" key={t}>{t}</span>)}
            <p className="summary">{p.summary}</p>
          </div>
        </Link>
      ))}
      {!posts.length && <div className="notice">Aucune actualité pour le moment.</div>}
    </div>
  );
}
