import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejUdhetimin } from "@/lib/udhetimet";
import { PikaNisjes } from "@/components/PikaNisjes";
import { NdjekjaVendndodhjes } from "@/components/NdjekjaVendndodhjes";
import { raportoGabiminNeon } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Detajet({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let udhetim;
  try {
    udhetim = await gjejUdhetimin(id);
  } catch (error) {
    const gabimi = raportoGabiminNeon("detajet e udhëtimit", error);
    return (
      <main>
        <h1>RideShare</h1>
        <p role="alert">{gabimi}</p>
        <Link href="/">← Kthehu te lista</Link>
      </main>
    );
  }
  if (!udhetim) notFound();

  return (
    <main>
      <Link href="/">← Kthehu te lista</Link>
      <h1>{udhetim.nisja} – {udhetim.destinacioni}</h1>
      <p>Ora: {udhetim.ora}</p>
      <p>Vendtakimi: {udhetim.vendtakimi}</p>
      <PikaNisjes />
      <NdjekjaVendndodhjes udhetimId={id} />
    </main>
  );
}
