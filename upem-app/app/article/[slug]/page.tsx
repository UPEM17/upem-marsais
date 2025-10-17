import { getPosts, getEvents, getMinutes } from '../../../lib/content';
import { mdToHtml } from '../../../lib/markdown';
import Image from 'next/image';

export function generateStaticParams(){
  return [...getPosts(), ...getEvents(), ...getMinutes()].map(p=>({ slug: p.slug }));
}

export default function Page({ params }:{ params:{ slug:string } }){
  const all = [...getPosts(), ...getEvents(), ...getMinutes()];
  const p = all.find(x => x.slug === params.slug);
  if(!p) return <div className="notice">Introuvable</div>;
  return (
    <article className="article">
      <div className="meta">{new Date(p.date).toLocaleString('fr-FR')}</div>
      <h1>{p.title}</h1>
      {p.cover && <Image src={p.cover} alt="" width={1200} height={600} />}
      <div dangerouslySetInnerHTML={{ __html: mdToHtml(p.content) }} />
      {p.images?.length ? (
        <div>
          <h3>Photos</h3>
          <div className="gallery">
            {p.images.map((src,i)=> <img key={i} src={src} alt="" />)}
          </div>
        </div>
      ) : null}
    </article>
  );
}
