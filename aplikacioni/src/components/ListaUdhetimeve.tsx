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

  async function ruaj(id: string) {
    if (pendingRef.current.has(id) || idsRef.current.has(id)) return;
    pendingRef.current.add(id);
    const optimistic = new Set(idsRef.current).add(id);
    idsRef.current = optimistic;
    setIds(optimistic);
    setTotal((value) => value + 1);
    setPending((value) => new Set(value).add(id));
    setMesazhi("Po ruhet preferimi…");
    try {
      const response = await fetch(`/api/udhetimet/${encodeURIComponent(id)}/preferuar`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
      });
      if (!response.ok) throw new Error("Ruajtja dështoi");
      setMesazhi("U ruajt te të preferuarat.");
    } catch {
      const reverted = new Set(idsRef.current);
      reverted.delete(id);
      idsRef.current = reverted;
      setIds((current) => { const next = new Set(current); next.delete(id); return next; });
      setTotal((value) => Math.max(0, value - 1));
      setMesazhi("Nuk u ruajt. Provo përsëri.");
    } finally {
      pendingRef.current.delete(id);
      setPending((value) => { const next = new Set(value); next.delete(id); return next; });
    }
  }

  return <>
    <p aria-live="polite">Të preferuarat <strong>{total}</strong>{" "}
      {authenticated && <Link href="/preferuarat">Shiko udhëtimet favorite</Link>}
      {mesazhi && ` · ${mesazhi}`}</p>
    <div className="trip-list">
      {udhetimet.map((udhetim) => {
        const saved = ids.has(udhetim.id);
        const waiting = pending.has(udhetim.id);
        return <article className="trip-card" key={udhetim.id}>
          <h2>{udhetim.nisja} – {udhetim.destinacioni}</h2>
          <p>Ora: {udhetim.ora} · Vende të lira: {udhetim.vende}</p>
          <Link className="action" href={`/udhetimi/${udhetim.id}`}>Shiko detajet</Link>
          {authenticated ? <button className="favorite-button" type="button" disabled={saved || waiting}
            aria-pressed={saved} onClick={() => void ruaj(udhetim.id)}>
            <span aria-hidden="true">{saved ? "★" : "☆"}</span> {saved ? "I ruajtur" : waiting ? "Po ruhet…" : "Ruaj udhëtimin"}
          </button> : <Link className="favorite-button" href="/panel">☆ Hyr për ta ruajtur</Link>}
          <small className="favorite-note">Preferim personal · jo rezervim</small>
        </article>;
      })}
    </div>
  </>;
}
