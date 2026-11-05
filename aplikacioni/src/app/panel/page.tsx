import Link from "next/link";
import Hyrja from "@/components/Hyrja";
import { profiliIm } from "@/lib/lejet";
import { ruajOren, ruajRolin } from "./actions";

export const dynamic = "force-dynamic";

const mesazhet: Record<string, string> = {
  hyr: "Hyr në llogari para se të ndryshosh udhëtimin.",
  ndaluar: "Nuk ke leje për këtë udhëtim. Ora nuk ndryshoi.",
  fushe: "Kontrollo fushën: ora duhet të jetë e vlefshme ose zgjidh një rol të vlefshëm.",
  ruajtur: "Ora u ruajt me sukses. Kontrollo listën dhe detajet.",
  databaza: "Nuk u lidhëm me databazën. Kontrollo Neon dhe provo përsëri.",
};

export default async function Panel({ searchParams }: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  let p;
  try {
    p = await profiliIm();
  } catch {
    return <main><h1>Paneli im</h1><p role="alert">{mesazhet.databaza}</p><Link href="/panel">Provo përsëri</Link></main>;
  }
  return <main>
    <h1>Paneli im</h1>
    {m && mesazhet[m] && <p role="status">{mesazhet[m]}</p>}
    {!p ? <p>Lista është publike. Për panelin hyr me llogarinë tënde GitHub.</p> : <>
      <p>Përshëndetje, {p.emri}. Roli: <strong>{p.roli}</strong>.</p>
      <p>ID ime GitHub: <code>{p.id}</code></p>
      <form action={ruajRolin}>
        <label htmlFor="roli">Roli im në RideShare</label>{" "}
        <select id="roli" name="roli" defaultValue={p.roli}>
          <option value="udhetar">Udhëtar</option>
          <option value="shofer">Shofer</option>
        </select>{" "}
        <button type="submit">Ruaj rolin</button>
      </form>
    </>}
    <Hyrja brenda={Boolean(p)} />
    {p?.roli === "shofer" ? <form action={ruajOren}>
      <h2>Ndrysho orën e udhëtimit tim</h2>
      <input type="hidden" name="id" value="2" />
      <label htmlFor="ora">Ora e re</label>{" "}
      <input id="ora" name="ora" type="time" defaultValue="08:15" required />{" "}
      <button type="submit">Ruaj orën</button>
      <p>Formulari provon ID 2. Serveri verifikon pronarin edhe nëse ID ndryshohet.</p>
    </form> : p && <p>Si udhëtar mund të shohësh udhëtimet; nuk mund të ndryshosh orën e shoferit.</p>}
    <p><Link href="/">Kthehu te udhëtimet</Link></p>
    <p>Për ndarjen e vendndodhjes live, kërkesa e udhëtarit duhet pranuar nga shoferi. Secili person e nis dhe e ndal vetë ndarjen.</p>
  </main>;
}
