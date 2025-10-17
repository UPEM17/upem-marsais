import '../styles/globals.css';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: "UPEM – Association de Parents d'élèves",
  description: 'Actualités, événements, commandes, comptes rendus et galerie UPEM.'
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0c0f14" />
      </head>
      <body>
        <header className="header container">
          <Image src="/logo.png" alt="UPEM" width={48} height={48} />
          <strong>UPEM</strong>
          <nav className="nav">
            <Link href="/actualites/">Actualités</Link>
            <Link href="/evenements/">Événements</Link>
            <Link href="/commandes/">Commandes</Link>
            <Link href="/comptes-rendus/">Compte rendu</Link>
            <Link href="/galerie/">Galerie</Link>
            <a href="/admin/">Admin</a>
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="container footer">© {new Date().getFullYear()} UPEM – Association de parents d'élèves</footer>
        <script dangerouslySetInnerHTML={{__html:`if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js');}`}} />
      </body>
    </html>
  );
}
