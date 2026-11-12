"use client";

import Link from "next/link";
import { useState } from "react";
import type { Udhetim } from "@/lib/udhetimet";

export function ListaPreferuarave({ udhetimet }: { udhetimet: Udhetim[] }) {
  const [lista, setLista] = useState(udhetimet);
  const [nePritje, setNePritje] = useState(() => new Set<string>());
  const [mesazhi, setMesazhi] = useState("");

  async function hiqe(id: string) {
    if (nePritje.has(id)) return;
    setNePritje((aktuale) => new Set(aktuale).add(id));
    setMesazhi("");
    try {
      const response = await fetch(`/api/udhetimet/${encodeURIComponent(id)}/preferuar`, { method: "DELETE" });
      if (!response.ok) throw new Error("Heqja dështoi");
      setLista((aktuale) => aktuale.filter((udhetim) => udhetim.id !== id));
      setMesazhi("U hoq nga të preferuarat.");
    } catch {
      setMesazhi("Nuk u hoq. Provo përsëri.");
    } finally {
      setNePritje((aktuale) => { const tjetra = new Set(aktuale); tjetra.delete(id); return tjetra; });
    }
  }

  return <>
    {mesazhi && <p role="status" aria-live="polite">{mesazhi}</p>}
    {lista.length === 0 ? <p>Nuk ke më udhëtime të ruajtura si favorite.</p> :
      <div className="trip-list">
        {lista.map((udhetim) => <article className="trip-card" key={udhetim.id}>
          <h2>{udhetim.nisja} – {udhetim.destinacioni}</h2>
          <p>Ora: {udhetim.ora} · Vende të lira: {udhetim.vende}</p>
          <Link className="action" href={`/udhetimi/${udhetim.id}`}>Shiko detajet</Link>
          <button className="favorite-button" type="button" disabled={nePritje.has(udhetim.id)}
            onClick={() => void hiqe(udhetim.id)}>
            {nePritje.has(udhetim.id) ? "Po hiqet…" : "Hiqe nga favoritët"}
          </button>
        </article>)}
      </div>}
  </>;
}
