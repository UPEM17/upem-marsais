import Link from 'next/link';
import Image from 'next/image';
import { getEvents } from '@/lib/content';

export const metadata = { title: 'Événements – UPEM' };

export default function Page(){
  const list = getEvents();
  return (
    <div className="grid">
      {list.map(p=> (
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
      {!list.length && <div className="notice">Aucun événement pour le moment.</div>}
    </div>
  );
}
