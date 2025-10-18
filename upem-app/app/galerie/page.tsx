import { getGalleryImages } from "../../lib/content";

export const metadata = { title: "Galerie – UPEM" };

export default function Page(){
  const images = getGalleryImages();
  return (
    <main className="container">
      <h1>Galerie</h1>
      {images.length ? (
        <div className="gallery">
          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" />
          ))}
        </div>
      ) : <p>Aucune image pour le moment.</p>}
    </main>
  );
}
