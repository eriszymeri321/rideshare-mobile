"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PublikoUdhetim() {
  const router = useRouter();
  const [dukePublikuar, setDukePublikuar] = useState(false);
  const [mesazhi, setMesazhi] = useState("");

  async function publiko(formData: FormData) {
    if (dukePublikuar) return;
    setDukePublikuar(true);
    setMesazhi("Po publikohet udhëtimi…");
    try {
      const response = await fetch("/api/udhetimet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Udhëtimi nuk u publikua.");
      setMesazhi("Udhëtimi u publikua. Udhëtarët mund ta shohin dhe të kërkojnë vend.");
      router.push(`/udhetimi/${encodeURIComponent(data.id)}`);
      router.refresh();
    } catch (error) {
      setMesazhi(error instanceof Error ? error.message : "Udhëtimi nuk u publikua.");
    } finally {
      setDukePublikuar(false);
    }
  }

  return <form action={publiko} className="publish-trip-form">
    <h2>Publiko udhëtim</h2>
    <p>Udhëtimi lidhet automatikisht me profilin tënd dhe kërkesat e udhëtarëve shfaqen këtu.</p>
    <label htmlFor="trip-nisja">Nisja</label>
    <input id="trip-nisja" name="nisja" required maxLength={100} placeholder="p.sh. Ferizaj" />
    <label htmlFor="trip-destinacioni">Destinacioni</label>
    <input id="trip-destinacioni" name="destinacioni" required maxLength={100} placeholder="p.sh. AAB" />
    <label htmlFor="trip-vendtakimi">Vendtakimi</label>
    <input id="trip-vendtakimi" name="vendtakimi" required maxLength={160} placeholder="p.sh. Stacioni i autobusëve" />
    <label htmlFor="trip-ora">Ora e nisjes</label>
    <input id="trip-ora" name="ora" type="time" required defaultValue="08:15" />
    <label htmlFor="trip-vende">Vende të lira</label>
    <input id="trip-vende" name="vende" type="number" min={1} max={8} required defaultValue={2} />
    <button type="submit" disabled={dukePublikuar}>{dukePublikuar ? "Po publikohet…" : "Publiko udhëtimin"}</button>
    {mesazhi && <p role="status">{mesazhi}</p>}
  </form>;
}
