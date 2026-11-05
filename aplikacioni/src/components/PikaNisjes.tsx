"use client";

import { useState, type FormEvent } from "react";

type PikaNisjesProps = { demo?: boolean };
type GjendjaLokacionit = "idle" | "loading" | "success" | "denied" | "timeout" | "unavailable";

export function PikaNisjes({ demo = false }: PikaNisjesProps) {
  const [teksti, setTeksti] = useState("");
  const [vendtakimi, setVendtakimi] = useState("");
  const [gabimiTakimit, setGabimiTakimit] = useState("");
  const [gjendja, setGjendja] = useState<GjendjaLokacionit>("idle");
  const [mesazhiLokacionit, setMesazhiLokacionit] = useState("");
  const [saktesia, setSaktesia] = useState<number | null>(null);

  function konfirmo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const vendiPastruar = teksti.trim();
    if (!vendiPastruar) {
      setGabimiTakimit("Shkruaj vendtakimin para se ta konfirmosh.");
      return;
    }
    setVendtakimi(vendiPastruar);
    setGabimiTakimit("");
  }

  function perfundoLeximin(gjendjeERe: GjendjaLokacionit, mesazh: string, metra?: number) {
    setGjendja(gjendjeERe);
    setMesazhiLokacionit(mesazh);
    setSaktesia(gjendjeERe === "success" && metra !== undefined ? metra : null);
  }

  function deshtoiLeximi(error: Pick<GeolocationPositionError, "code">) {
    if (error.code === 1) {
      perfundoLeximin("denied", "Leja u refuzua. Shkruaj vendtakimin vetë.");
    } else if (error.code === 3) {
      perfundoLeximin("timeout", "Koha mbaroi. Provo sërish ose shkruaj vendtakimin vetë.");
    } else {
      perfundoLeximin("unavailable", "Pozicioni nuk është i disponueshëm. Shkruaj vendtakimin vetë.");
    }
  }

  function kerkoVendndodhjen() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      perfundoLeximin("unavailable", "Ky shfletues nuk e mbështet vendndodhjen. Shkruaj vendtakimin vetë.");
      return;
    }

    setGjendja("loading");
    setMesazhiLokacionit("Po kërkojmë vendndodhjen…");
    setSaktesia(null);
    navigator.geolocation.getCurrentPosition(
      (position) => perfundoLeximin("success", "Pozicioni u mor.", Math.round(position.coords.accuracy)),
      deshtoiLeximi,
      { timeout: 10000 },
    );
  }

  return (
    <section aria-labelledby="pika-nisjes-titull" data-testid="pickup-widget">
      <h2 id="pika-nisjes-titull">Vendtakimi</h2>
      <p>Vendtakimi i konfirmuar ruhet vetëm në këtë faqe; nuk dërgohet te shoferi.</p>
      <form onSubmit={konfirmo}>
        <label htmlFor="meeting-input">Shkruaj vendtakimin</label>
        <input
          id="meeting-input"
          data-testid="meeting-input"
          name="vendtakimi"
          value={teksti}
          onChange={(event) => setTeksti(event.target.value)}
          placeholder="p.sh. Biblioteka"
        />
        <button className="action" type="submit" data-testid="confirm-meeting">Konfirmo në telefon</button>
      </form>
      <p role="alert" data-testid="meeting-error">{gabimiTakimit}</p>
      <p data-testid="confirmed-meeting">
        {vendtakimi && <><strong>Vendtakimi i konfirmuar:</strong> {vendtakimi}</>}
      </p>
      <button
        className="action"
        type="button"
        onClick={kerkoVendndodhjen}
        disabled={gjendja === "loading"}
        data-testid="locate-me"
      >
        {gjendja === "loading" ? "Po kërkojmë vendndodhjen…" : "Përdor vendndodhjen time"}
      </button>
      <p role="status" data-testid="location-status" data-state={gjendja}>{mesazhiLokacionit}</p>
      <p data-testid="location-accuracy">
        {saktesia !== null ? <>Saktësia rreth {saktesia} m</> : ""}
      </p>
      {demo && <p>Prova lokale · vendtakimi dhe vendndodhja nuk dërgohen te serveri.</p>}
    </section>
  );
}
