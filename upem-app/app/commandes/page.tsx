export const metadata = { title: 'Commandes – UPEM' };

export default function Page(){
  return (
    <section className="grid">
      <div className="notice">
        <h3>Commandes</h3>
        <p>Ici s’intégrera votre formulaire <strong>Google Apps Script</strong> (ou Google Form) pour remplir votre Google Sheet.</p>
        <p>Placez simplement l’URL de l’application web Apps Script dans un <code>&lt;iframe&gt;</code> :</p>
        <pre>{`<iframe src=\"https://script.google.com/macros/s/XXX/exec\" style=\"width:100%;height:1200px;border:0\"></iframe>`}</pre>
      </div>
    </section>
  );
}
