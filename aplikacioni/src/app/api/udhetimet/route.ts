import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { profiliIm } from "@/lib/lejet";
import { getSql, raportoGabiminNeon } from "@/lib/db";
import { lexoUdhetimet } from "@/lib/udhetimet";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await lexoUdhetimet();
    const trips = rows.map(({ id, nisja, destinacioni, ora, vendtakimi, vende }) =>
      ({ id, nisja, destinacioni, ora, vendtakimi, vende }));
    return Response.json({ trips }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Lista nuk mund të lexohet tani." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const profili = await profiliIm();
    if (!session?.user?.id || !profili) return Response.json({ error: "Hyr me GitHub për të publikuar udhëtim." }, { status: 401 });
    if (profili.roli !== "shofer") return Response.json({ error: "Ndrysho rolin në shofer para publikimit." }, { status: 403 });

    const body = await request.json() as Record<string, unknown>;
    const nisja = typeof body.nisja === "string" ? body.nisja.trim() : "";
    const destinacioni = typeof body.destinacioni === "string" ? body.destinacioni.trim() : "";
    const vendtakimi = typeof body.vendtakimi === "string" ? body.vendtakimi.trim() : "";
    const ora = typeof body.ora === "string" ? body.ora : "";
    const vende = Number(body.vende);
    if (!nisja || !destinacioni || !vendtakimi || nisja.length > 100 || destinacioni.length > 100
      || vendtakimi.length > 160 || !/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(ora)
      || !Number.isInteger(vende) || vende < 1 || vende > 8) {
      return Response.json({ error: "Plotëso nisjen, destinacionin, vendtakimin, orën dhe 1–8 vende." }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const sql = getSql();
    const rows = await sql`INSERT INTO udhetimet (id, nisja, destinacioni, ora, vendtakimi, vende, shofer_id)
      VALUES (${id}, ${nisja}, ${destinacioni}, ${ora}, ${vendtakimi}, ${vende}, ${profili.id})
      RETURNING id`;
    return Response.json({ id: String(rows[0].id) }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = raportoGabiminNeon("publikimi i udhëtimit", error);
    return Response.json({ error: message }, { status: 503 });
  }
}
