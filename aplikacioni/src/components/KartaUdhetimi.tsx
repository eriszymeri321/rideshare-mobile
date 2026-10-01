import Link from "next/link";
import type { Udhetim } from "@/lib/udhetimet";

export function KartaUdhetimi({ udhetim }: { udhetim: Udhetim }) {
  return (
    <article className="trip-card">
      <h2>{udhetim.nisja} – {udhetim.destinacioni}</h2>
      <p>Ora: {udhetim.ora} · Vende të lira: {udhetim.vende}</p>
      {udhetim.vende > 0 ? (
        <Link className="action" href={`/udhetimi/${udhetim.id}`}>
          Shiko detajet
        </Link>
      ) : (
        <button className="action" disabled>Nuk ka vende të lira</button>
      )}
    </article>
  );
}
