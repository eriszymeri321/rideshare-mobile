"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Udhetim } from "@/lib/udhetimet";

export function ListaUdhetimeve({ udhetimet, preferuarat, numri, authenticated }: {
  udhetimet: Udhetim[]; preferuarat: string[]; numri: number; authenticated: boolean;
}) {
  const [ids, setIds] = useState(() => new Set(preferuarat));
  const idsRef = useRef(new Set(preferuarat));
  const [total, setTotal] = useState(numri);
  const [pending, setPending] = useState(() => new Set<string>());
  const [mesazhi, setMesazhi] = useState("");
  const pendingRef = useRef(new Set<string>());

  function caktoStatusin(id: string, saved: boolean) {
    const kishte = idsRef.current.has(id);
    if (kishte === saved) return;
    const next = new Set(idsRef.current);
    if (saved) next.add(id);
    else next.delete(id);
    idsRef.current = next;
    setIds(next);
    setTotal((value) => Math.max(0, value + (saved ? 1 : -1)));
  }

  async function ndryshoPreferimin(id: string) {
    if (pendingRef.current.has(id)) return;
    const wasSaved = idsRef.current.has(id);
    const saved = !wasSaved;
    pendingRef.current.add(id);
    caktoStatusin(id, saved);
    setPending((value) => new Set(value).add(id));
    setMesazhi(saved ? "Po ruhet preferimi…" : "Po hiqet nga të preferuarat…");
    try {
      const response = await fetch(`/api/udhetimet/${encodeURIComponent(id)}/preferuar`, {
        method: saved ? "POST" : "DELETE",
        ...(saved ? { headers: { "Content-Type": "application/json" }, body: "{}" } : {}),
      });
      if (!response.ok) throw new Error("Ndryshimi dështoi");
      setMesazhi(saved ? "U ruajt te të preferuarat." : "U hoq nga të preferuarat.");
    } catch {
      caktoStatusin(id, wasSaved);
      setMesazhi(saved ? "Nuk u ruajt. Provo përsëri." : "Nuk u hoq. Provo përsëri.");
    } finally {
      pendingRef.current.delete(id);
      setPending((value) => { const next = new Set(value); next.delete(id); return next; });
    }
  }

  return <>
    <div className="favorites-toolbar">
      <p>Të preferuarat: <strong>{total}</strong></p>
      {authenticated && <Link className="action" href="/preferuarat">Shiko udhëtimet e mia favorite</Link>}
    </div>
    <p className="favorite-status" aria-live="polite">{mesazhi}</p>
    <div className="trip-list">
      {udhetimet.map((udhetim) => {
        const saved = ids.has(udhetim.id);
        const waiting = pending.has(udhetim.id);
        return <article className="trip-card" key={udhetim.id}>
          <h2>{udhetim.nisja} – {udhetim.destinacioni}</h2>
          <p>Ora: {udhetim.ora} · Vende të lira: {udhetim.vende}</p>
          <Link className="action" href={`/udhetimi/${udhetim.id}`}>Shiko detajet</Link>
          {authenticated ? <button className="favorite-button" type="button" disabled={waiting}
            aria-pressed={saved} onClick={() => void ndryshoPreferimin(udhetim.id)}>
            <span aria-hidden="true">{saved ? "★" : "☆"}</span> {waiting ? (saved ? "Po ruhet…" : "Po hiqet…") : saved ? "Hiqe nga favoritët" : "Ruaj si favorit"}
          </button> : <Link className="favorite-button" href="/panel">☆ Hyr për ta ruajtur</Link>}
          <small className="favorite-note">Preferim personal · jo rezervim</small>
        </article>;
      })}
    </div>
  </>;
}
