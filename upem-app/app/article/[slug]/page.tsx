import Image from "next/image";
import { getBySlug, getAllSlugs } from "../../../lib/content";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}
export const dynamicParams = false;

type Props = { params: { slug: string } };

export default function Article({ params }: Props) {
  const doc = getBySlug(params.slug);
  if (!doc) {
    return (
      <main className="container">
        <p>Article introuvable.</p>
      </main>
    );
  }

  return (
    <main className="container">
      <article>
        <h1>{doc.title}</h1>

        {doc.date && (
          <p style={{ color: "#6b7280", marginTop: 0 }}>
            {new Date(doc.date).toLocaleString("fr-FR")}
          </p>
        )}

        {/* champ spécifique évent (optionnel) */}
        {"lieu" in doc && doc.lieu ? (
          <p style={{ color: "#6b7280", marginTop: 0 }}>Lieu : {doc.lieu}</p>
        ) : null}

        {doc.cover && (
          <div style={{ margin: "12px 0" }}>
            <Image
              src={doc.cover}
              alt=""
              width={1200}
              height={630}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}

        {doc.body && <div dangerouslySetInnerHTML={{ __html: doc.body }} />}

        {doc.images?.length ? (
          <div>
            <h3>Photos</h3>
            <div className="gallery">
              {doc.images.map((src: string, i: number) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="" />
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </main>
  );
}
