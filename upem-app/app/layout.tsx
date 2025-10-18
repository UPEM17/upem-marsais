import '../styles/globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { getLastUpdated } from '../lib/content';

export const metadata = {
  title: "UPEM — Union des Parents d'Élèves de Marsais",
  description: "Actualités, événements, commandes, comptes rendus et galerie UPEM."
};

export default function RootLayout({children}:{children:React.ReactNode}){
  const lastUpdated = getLastUpdated(); // valeur figée au build/export

  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0c0f14" />
        <meta name="last-updated" content={lastUpdated} />
      </head>
      <body>
        <header className="header container">
          <Image src="/logo.png" alt="UPEM" width={48} height={48} />
          <strong>UPEM</strong>
          <nav className="nav">
            <Link href="/actualites/">Actualités <span id="nav-badge" className="dot" hidden /></Link>
            <Link href="/evenements/">Événements</Link>
            <Link href="/commandes/">Commandes</Link>
            <Link href="/comptes-rendus/">Comptes rendus</Link>
            <Link href="/galerie/">Galerie</Link>
          </nav>
        </header>

        <main className="container">{children}</main>

        <footer className="container footer">
          © {new Date().getFullYear()} UPEM – Association de parents d'élèves
          {" · "}
          <a href="/admin/">Admin</a>
        </footer>

        {/* SW + badge non lu + (option) push */}
        <script dangerouslySetInnerHTML={{__html:`
(function(){
  // Service worker
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('/sw.js'); }

  // Badge "non lu" (et Badging API pour PWA)
  var lastUpdated = (document.querySelector('meta[name="last-updated"]')||{}).content || '';
  try{
    var lastSeen = localStorage.getItem('upem.lastSeen') || '';
    if(!lastSeen || (lastUpdated && lastUpdated > lastSeen)){
      var el = document.getElementById('nav-badge'); if(el) el.hidden=false;
      if('setAppBadge' in navigator) navigator.setAppBadge(1).catch(()=>{});
    }
    document.addEventListener('visibilitychange', function(){
      if(document.visibilityState==='hidden'){
        localStorage.setItem('upem.lastSeen', lastUpdated || new Date().toISOString());
        var el = document.getElementById('nav-badge'); if(el) el.hidden=true;
        if('clearAppBadge' in navigator) navigator.clearAppBadge().catch(()=>{});
      }
    });
  }catch(e){}

  // Bouton d’activation push : expose une fonction globale (tu pourras l’appeler depuis Commandes ou Accueil)
  window.enableUpemPush = async function(){
    if(!('Notification' in window)) return alert('Notifications non supportées');
    const perm = await Notification.requestPermission();
    if(perm!=='granted') return alert('Autorisation refusée');
    if(!('serviceWorker' in navigator)) return alert('SW absent');

    const reg = await navigator.serviceWorker.ready;
    // clé publique VAPID exposée par secret Cloudflare (voir /api/push/vapidPublic)
    const vapidRes = await fetch('/api/push/vapidPublic');
    if(!vapidRes.ok){ alert('Push: clé publique manquante'); return; }
    const { key } = await vapidRes.json();

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key)
    });

    await fetch('/api/push/subscribe', {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(sub)
    });

    alert('Notifications activées');
  };

  function urlBase64ToUint8Array(base64String){
    const padding='='.repeat((4-base64String.length%4)%4);
    const base64=(base64String+padding).replace(/-/g,'+').replace(/_/g,'/');
    const raw=atob(base64); const output=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++) output[i]=raw.charCodeAt(i);
    return output;
  }
})();`}} />
      </body>
    </html>
  );
}
