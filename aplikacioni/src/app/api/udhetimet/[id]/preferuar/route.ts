import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSql } from "@/lib/db";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId || !/^\d+$/.test(userId)) {
    return Response.json({ error: "Hyr para se të ruash udhëtimin." }, { status: 401 });
  }
  const { id } = await params;
  const sql = getSql();
  try {
    const rows = await sql`
      INSERT INTO udhetimet_preferuara (github_id, udhetim_id)
      SELECT ${userId}, u.id FROM udhetimet u
      WHERE u.id = ${id}
      ON CONFLICT (github_id, udhetim_id) DO NOTHING
      RETURNING udhetim_id
    `;
    if (rows.length) return Response.json({ saved: true }, { status: 201 });
    const existing = await sql`SELECT 1 FROM udhetimet_preferuara WHERE github_id = ${userId} AND udhetim_id = ${id}`;
    if (existing.length) return Response.json({ saved: true, alreadySaved: true });
    return Response.json({ error: "Udhëtimi nuk u gjet." }, { status: 404 });
  } catch {
    return Response.json({ error: "Preferimi nuk mund të ruhet tani." }, { status: 503 });
  }
}
