import Image from "next/image";
import { getBySlug, getAllSlugs } from "../../../lib/content";

export default function Article({ params }: { params: { slug: string } }) {
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
        {doc.date && <p style={{ color: "#6b7280" }}>{doc.date}</p>}
        {doc.lieu && <p style={{ color: "#6b7280" }}>Lieu : {doc.lieu}</p>}

        {doc.cover && (
          <div style={{ margin: "12px 0" }}>
            <Image
              src={doc.cover}
              alt=""
              width={720}
              height={405}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}

        <div dangerouslySetInnerHTML={{ __html: doc.body }} />
      </article>
    </main>
  );
}

export async function generateStaticParams() {
  return getAllSlugs();
}
