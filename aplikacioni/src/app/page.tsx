import Link from "next/link";
import { lexoUdhetimet, type Udhetim } from "@/lib/udhetimet";
import { raportoGabiminNeon } from "@/lib/db";
import { profiliIm } from "@/lib/lejet";
import { getSql } from "@/lib/db";
import { ListaUdhetimeve } from "@/components/ListaUdhetimeve";

export const dynamic = "force-dynamic";

export default async function Home() {
  let udhetimet: Udhetim[];
  try {
    udhetimet = await lexoUdhetimet();
  } catch (error) {
    const gabimi = raportoGabiminNeon("lista e udhëtimeve", error);
    return (
      <main>
        <h1>RideShare</h1>
        <p><Link href="/panel">Hyr / Paneli im</Link></p>
        <p role="alert">{gabimi}</p>
        <Link className="action" href="/">Provo përsëri</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>RideShare · Udhëtimet për AAB</h1>
      <p><Link href="/panel">Hyr / Paneli im</Link></p>
      <p>Burimi: Neon · të dhëna fiktive për ushtrime</p>
      {udhetimet.length === 0 ? (
        <p>Nuk ka udhëtime për momentin.</p>
      ) : (
        <ListaMePreferime udhetimet={udhetimet} />
      )}
    </main>
  );
}

async function ListaMePreferime({ udhetimet }: { udhetimet: Udhetim[] }) {
  let ids: string[] = [];
  let count = 0;
  let authenticated = false;
  try {
    const profili = await profiliIm();
    if (profili) {
      authenticated = true;
      const sql = getSql();
      const rows = await sql`SELECT udhetim_id FROM udhetimet_preferuara WHERE github_id = ${profili.id}`;
      ids = rows.map((row) => String(row.udhetim_id));
      count = ids.length;
    }
  } catch {
    // Faqja e udhëtimeve mbetet e përdorshme edhe kur preferimet s'mund të lexohen.
  }
  return <ListaUdhetimeve udhetimet={udhetimet} preferuarat={ids} numri={count} authenticated={authenticated} />;
}
