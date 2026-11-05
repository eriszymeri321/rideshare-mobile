"use client";

import { useState, type FormEvent } from "react";

type PikaNisjesProps = { demo?: boolean };

export function PikaNisjes({ demo = false }: PikaNisjesProps) {
  const [teksti, setTeksti] = useState("");
  const [vendtakimi, setVendtakimi] = useState("");
  const [poKerkoj, setPoKerkoj] = useState(false);
  const [mesazhi, setMesazhi] = useState("");
  const [saktesia, setSaktesia] = useState<number | null>(null);

  function konfirmo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const vendiPastruar = teksti.trim();
    if (!vendiPastruar) {
      setMesazhi("Shkruaj vendtakimin para se ta konfirmosh.");
      return;
    }
    setVendtakimi(vendiPastruar);
    setSaktesia(null);
    setMesazhi("Vendtakimi u konfirmua vetëm në këtë pajisje.");
  }

  function kerkoVendndodhjen() {
    setSaktesia(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setPoKerkoj(false);
      setMesazhi("Ky shfletues nuk e mbështet vendndodhjen. Shkruaj vendtakimin vetë.");
      return;
    }

    setPoKerkoj(true);
    setMesazhi("Po kërkojmë vendndodhjen…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const metra = Math.round(position.coords.accuracy);
        perfundoLeximin(true, "Pozicioni u mor.", metra);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          perfundoLeximin(false, "Leja u refuzua. Shkruaj vendtakimin vetë.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          perfundoLeximin(false, "Pozicioni nuk është i disponueshëm. Shkruaj vendtakimin vetë.");
        } else {
          perfundoLeximin(false, "Koha mbaroi. Provo sërish ose shkruaj vendtakimin vetë.");
        }
      },
      { timeout: 10000 },
    );
  }

  function perfundoLeximin(meSukses: boolean, mesazh: string, metra?: number) {
    setPoKerkoj(false);
    setMesazhi(mesazh);
    if (meSukses && metra !== undefined) {
      setSaktesia(metra);
    }
  }

  function simuloTimeout() {
    setSaktesia(null);
    perfundoLeximin(false, "Koha mbaroi. Provo sërish ose shkruaj vendtakimin vetë.");
  }

  return (
    <section aria-labelledby="pika-nisjes-titull" data-testid="pickup-widget">
      <h2 id="pika-nisjes-titull">Vendtakimi</h2>
      <p>Konfirmimi ruhet vetëm në këtë faqe. Dritoni nuk e sheh dhe faqja nuk e dërgon te serveri.</p>
      <form onSubmit={konfirmo}>
        <label htmlFor={demo ? "vendtakimi-demo" : "vendtakimi"}>Shkruaj vendtakimin</label>
        <input
          id={demo ? "vendtakimi-demo" : "vendtakimi"}
          data-testid="pickup-input"
          name="vendtakimi"
          value={teksti}
          onChange={(event) => setTeksti(event.target.value)}
          placeholder="p.sh. Biblioteka (vend fiktiv)"
        />
        <button className="action" type="submit" data-testid="confirm-pickup">Konfirmo në telefon</button>
      </form>
      <button
        className="action"
        type="button"
        onClick={kerkoVendndodhjen}
        disabled={poKerkoj}
        data-testid="request-location"
      >
        Përdor vendndodhjen time
      </button>
      {demo && (
        <button className="action" type="button" onClick={simuloTimeout} data-testid="simulate-timeout">
          Simulo timeout-in
        </button>
      )}
      {poKerkoj && <p role="status" data-testid="pickup-loading">Po kërkojmë vendndodhjen…</p>}
      {mesazhi && <p role="status" data-testid="pickup-message">{mesazhi}</p>}
      {vendtakimi && (
        <p data-testid="confirmed-pickup"><strong>Vendtakimi i konfirmuar:</strong> {vendtakimi}</p>
      )}
      {saktesia !== null && <p data-testid="location-accuracy">Saktësia rreth {saktesia} m</p>}
      {demo && <p>Simulim për klasë · mos përdor vendndodhje të vërtetë në të dhënat e raportit.</p>}
    </section>
  );
}
