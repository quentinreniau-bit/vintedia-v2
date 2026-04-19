import { useState, useRef } from "react";

const TEAL = "#00C9B1";
const DARK = "#0D1117";
const CARD = "#161B22";
const BORDER = "#21262D";
const MUTED = "#8B949E";
const WHITE = "#F0F6FC";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${DARK}; color: ${WHITE}; font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  .app { min-height: 100vh; background: ${DARK}; position: relative; overflow: hidden; }
  .bg-glow { position: fixed; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(0,201,177,0.08) 0%, transparent 70%); pointer-events: none; z-index: 0; top: -200px; right: -200px; }
  .bg-glow2 { position: fixed; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(0,201,177,0.05) 0%, transparent 70%); pointer-events: none; z-index: 0; bottom: -100px; left: -100px; }
  .header { position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 20px 40px; border-bottom: 1px solid ${BORDER}; backdrop-filter: blur(10px); background: rgba(13,17,23,0.8); }
  .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; letter-spacing: -0.5px; display: flex; align-items: center; gap: 10px; }
  .logo-dot { width: 8px; height: 8px; background: ${TEAL}; border-radius: 50%; box-shadow: 0 0 10px ${TEAL}; animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.8); } }
  .badge { background: rgba(0,201,177,0.12); border: 1px solid rgba(0,201,177,0.3); color: ${TEAL}; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px; text-transform: uppercase; }
  .main { position: relative; z-index: 10; max-width: 1000px; margin: 0 auto; padding: 60px 20px 40px; }
  .hero { text-align: center; margin-bottom: 60px; }
  .hero h1 { font-family: 'Syne', sans-serif; font-size: clamp(32px, 5vw, 56px); font-weight: 800; line-height: 1.1; margin-bottom: 16px; letter-spacing: -1.5px; }
  .hero h1 span { color: ${TEAL}; }
  .hero p { font-size: 16px; color: ${MUTED}; max-width: 480px; margin: 0 auto; line-height: 1.7; font-weight: 300; }
  .upload-zone { border: 2px dashed ${BORDER}; border-radius: 20px; padding: 60px 40px; text-align: center; cursor: pointer; transition: all 0.3s ease; background: rgba(22,27,34,0.5); margin-bottom: 32px; position: relative; overflow: hidden; }
  .upload-zone::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(0,201,177,0.04) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s; }
  .upload-zone:hover::before, .upload-zone.drag-over::before { opacity: 1; }
  .upload-zone:hover, .upload-zone.drag-over { border-color: ${TEAL}; transform: translateY(-2px); box-shadow: 0 20px 60px rgba(0,201,177,0.1); }
  .upload-icon { width: 64px; height: 64px; margin: 0 auto 20px; background: rgba(0,201,177,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
  .upload-zone h3 { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 8px; }
  .upload-zone p { color: ${MUTED}; font-size: 13px; }
  .preview-img { max-height: 260px; border-radius: 12px; object-fit: contain; max-width: 100%; }
  .btn-primary { background: ${TEAL}; color: #000; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; padding: 16px 36px; border: none; border-radius: 12px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 8px; letter-spacing: 0.3px; }
  .btn-primary:hover:not(:disabled) { background: #00dfc5; transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,201,177,0.35); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-secondary { background: transparent; color: ${MUTED}; font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 12px 24px; border: 1px solid ${BORDER}; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
  .btn-secondary:hover { border-color: ${MUTED}; color: ${WHITE}; }
  .actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .loading { text-align: center; padding: 60px; }
  .spinner { width: 48px; height: 48px; border: 3px solid ${BORDER}; border-top-color: ${TEAL}; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 24px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading p { color: ${MUTED}; font-size: 14px; }
  .loading strong { display: block; font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: ${WHITE}; margin-bottom: 8px; }
  .results { display: grid; gap: 20px; animation: fadeUp 0.5s ease forwards; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .result-card { background: ${CARD}; border: 1px solid ${BORDER}; border-radius: 16px; padding: 28px; transition: border-color 0.2s; }
  .result-card:hover { border-color: rgba(0,201,177,0.3); }
  .card-label { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .card-label .icon { width: 36px; height: 36px; background: rgba(0,201,177,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 17px; }
  .card-label h3 { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${TEAL}; }
  .card-content { font-size: 15px; line-height: 1.7; color: ${WHITE}; }
  .price-range { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .price-badge { background: rgba(0,201,177,0.12); border: 1px solid rgba(0,201,177,0.3); color: ${TEAL}; font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; padding: 10px 24px; border-radius: 12px; letter-spacing: -0.5px; }
  .price-note { color: ${MUTED}; font-size: 13px; line-height: 1.5; }
  .tags-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag { background: rgba(255,255,255,0.05); border: 1px solid ${BORDER}; color: ${WHITE}; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; }
  .tag.cat { background: rgba(0,201,177,0.08); border-color: rgba(0,201,177,0.25); color: ${TEAL}; }
  .copy-btn { display: inline-flex; align-items: center; gap: 6px; background: transparent; border: 1px solid ${BORDER}; color: ${MUTED}; font-size: 12px; padding: 6px 14px; border-radius: 8px; cursor: pointer; transition: all 0.2s; margin-top: 12px; }
  .copy-btn:hover { border-color: ${TEAL}; color: ${TEAL}; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media (max-width: 600px) { .two-col { grid-template-columns: 1fr; } .header { padding: 16px 20px; } .main { padding: 40px 16px; } }
  .reset-bar { display: flex; justify-content: center; padding-top: 8px; }
`;

function ResultCard({ icon, label, children, copyText }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="result-card">
      <div className="card-label">
        <div className="icon">{icon}</div>
        <h3>{label}</h3>
      </div>
      <div className="card-content">{children}</div>
      {copyText && (
        <button className="copy-btn" onClick={() => {
          navigator.clipboard.writeText(copyText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
        }}>
          {copied ? "✓ Copié !" : "⎘ Copier"}
        </button>
      )}
    </div>
  );
}

export default function VintedSaaS() {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImageBase64(e.target.result.split(",")[1]);
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  async function analyze() {
    if (!imageBase64) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const prompt = `Tu es un expert en revente d'articles de mode et lifestyle sur Vinted. 
Analyse cette photo d'article et génère une fiche de vente complète en JSON UNIQUEMENT (aucun texte autour, aucun backtick markdown).

Format JSON attendu :
{
  "titre": "Titre accrocheur de max 60 caractères, optimisé pour la recherche Vinted",
  "description": "Description vendeuse de 3-4 phrases, ton chaleureux et naturel, donne envie d'acheter",
  "categorie_principale": "Catégorie Vinted principale",
  "sous_categorie": "Sous-catégorie précise",
  "etat": "État estimé (Neuf avec étiquette / Très bon état / Bon état)",
  "marque": "Marque détectée ou Non identifiée",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"],
  "prix_min": 15,
  "prix_max": 25,
  "conseil_prix": "Courte explication sur le prix conseillé"
}`;

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
              { type: "text", text: prompt }
            ]
          }]
        })
      });

      const data = await response.json();
      const text = data.content?.map(i => i.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch (err) {
      setError("Une erreur est survenue. Vérifiez votre connexion et réessayez.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setImage(null);
    setImageBase64(null);
    setResult(null);
    setError(null);
  }

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <div className="bg-glow" />
        <div className="bg-glow2" />
        <header className="header">
          <div className="logo"><div className="logo-dot" />VintedAI</div>
          <div className="badge">Beta</div>
        </header>
        <main className="main">
          {!result && !loading && (
            <>
              <div className="hero">
                <h1>Vendez plus vite<br />grâce à l'<span>IA</span></h1>
                <p>Prenez une photo de votre article. L'IA génère le titre parfait, la description qui vend, les hashtags et le prix idéal.</p>
              </div>
              <div
                className={`upload-zone${dragOver ? " drag-over" : ""}`}
                onClick={() => !image && fileRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {image ? (
                  <img src={image} alt="Aperçu" className="preview-img" />
                ) : (
                  <>
                    <div className="upload-icon">📷</div>
                    <h3>Déposez votre photo ici</h3>
                    <p>ou cliquez pour choisir un fichier · JPG, PNG, WEBP</p>
                  </>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
              </div>
              {error && <p style={{ color: "#FF7B7B", textAlign: "center", fontSize: 14, marginBottom: 16 }}>⚠ {error}</p>}
              <div className="actions">
                <button className="btn-primary" onClick={analyze} disabled={!image}>✦ Analyser avec l'IA</button>
                {image && <button className="btn-secondary" onClick={() => { setImage(null); setImageBase64(null); setError(null); fileRef.current.value = ""; }}>Changer la photo</button>}
              </div>
            </>
          )}
          {loading && (
            <div className="loading">
              <div className="spinner" />
              <strong>Analyse en cours…</strong>
              <p>L'IA examine votre article et prépare<br />votre fiche de vente optimisée.</p>
            </div>
          )}
          {result && (
            <>
              <div className="results">
                <ResultCard icon="✦" label="Titre optimisé" copyText={result.titre}>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18 }}>{result.titre}</p>
                </ResultCard>
                <ResultCard icon="📝" label="Description" copyText={result.description}>
                  <p>{result.description}</p>
                </ResultCard>
                <ResultCard icon="💰" label="Prix conseillé">
                  <div className="price-range">
                    <div className="price-badge">{result.prix_min}€ – {result.prix_max}€</div>
                    <p className="price-note">{result.conseil_prix}</p>
                  </div>
                </ResultCard>
                <div className="two-col">
                  <ResultCard icon="🗂" label="Catégorie">
                    <div className="tags-grid">
                      <span className="tag cat">{result.categorie_principale}</span>
                      {result.sous_categorie && <span className="tag">{result.sous_categorie}</span>}
                      {result.etat && <span className="tag">{result.etat}</span>}
                      {result.marque && result.marque !== "Non identifiée" && <span className="tag cat">🏷 {result.marque}</span>}
                    </div>
                  </ResultCard>
                  <ResultCard icon="#" label="Hashtags" copyText={result.hashtags?.join(" ")}>
                    <div className="tags-grid">
                      {result.hashtags?.map((t, i) => <span key={i} className="tag">{t}</span>)}
                    </div>
                  </ResultCard>
                </div>
              </div>
              <div className="reset-bar" style={{ marginTop: 32 }}>
                <button className="btn-primary" onClick={reset}>↺ Analyser un autre article</button>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
