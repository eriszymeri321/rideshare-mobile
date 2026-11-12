import Link from "next/link";
import { profiliIm } from "@/lib/lejet";
import { getSql } from "@/lib/db";
import type { Udhetim } from "@/lib/udhetimet";
import { ListaPreferuarave } from "@/components/ListaPreferuarave";

export const dynamic = "force-dynamic";

export default async function Preferuarat() {
  const profili = await profiliIm();

  if (!profili) {
    return <main>
      <h1>Udhëtimet e mia favorite</h1>
      <p>Hyr në llogarinë tënde për t’i parë udhëtimet e ruajtura.</p>
      <p><Link href="/panel">Hyr në llogari</Link></p>
      <p><Link href="/">Kthehu te udhëtimet</Link></p>
    </main>;
  }

  let udhetimet: Udhetim[];
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT u.id, u.nisja, u.destinacioni, u.ora, u.vendtakimi, u.vende
      FROM udhetimet_preferuara p
      JOIN udhetimet u ON u.id = p.udhetim_id
      WHERE p.github_id = ${profili.id}
      ORDER BY p.krijuar_me DESC, u.id
    `;
    udhetimet = rows as Udhetim[];
  } catch {
    return <main>
      <h1>Udhëtimet e mia favorite</h1>
      <p role="alert">Nuk mundëm t’i ngarkonim udhëtimet favorite. Provo përsëri më vonë.</p>
      <p><Link href="/">Kthehu te udhëtimet</Link></p>
    </main>;
  }

  return <main>
    <h1>Udhëtimet e mia favorite</h1>
    {udhetimet.length === 0 ? <p>Nuk ke ruajtur ende asnjë udhëtim si favorit.</p> :
      <ListaPreferuarave udhetimet={udhetimet} />}
    <p><Link href="/">Kthehu te udhëtimet</Link></p>
  </main>;
}
