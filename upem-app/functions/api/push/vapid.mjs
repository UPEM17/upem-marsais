// Génération JWT VAPID côté Workers (ES256)
export function generateVapidHeaders(audience, publicKey, privateKey, subject) {
  const jwt = createVapidJWT(audience, publicKey, privateKey, subject);
  return {
    'Authorization': `WebPush ${jwt}`,
    'Crypto-Key': `p256ecdsa=${publicKey}`
  };
}

function createVapidJWT(aud, pub, priv, sub){
  const header = base64url(JSON.stringify({ alg: "ES256", typ: "JWT" }));
  const exp = Math.floor(Date.now()/1000) + 12*60*60; // 12h
  const payload = base64url(JSON.stringify({ aud, exp, sub }));
  const data = `${header}.${payload}`;
  return `${data}.${signES256(data, priv)}`;
}

// Workers: utilise SubtleCrypto pour ES256
function signES256(data, privKeyBase64){
  const raw = strToBuf(data);
  const key = base64ToBuf(privKeyBase64);
  return crypto.subtle.importKey('pkcs8', key, { name:'ECDSA', namedCurve:'P-256' }, false, ['sign'])
    .then(pk => crypto.subtle.sign({ name:'ECDSA', hash:'SHA-256' }, pk, raw))
    .then(sig => base64url(bufToStr(new Uint8Array(sig))));
}

function base64url(s){ return btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function strToBuf(s){ return new TextEncoder().encode(s); }
function bufToStr(buf){ let bin=''; for(const b of buf) bin+=String.fromCharCode(b); return bin; }
function base64ToBuf(b64){ const bin=atob(b64.replace(/-/g,'+').replace(/_/g,'/')); const arr=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i); return arr.buffer; }
