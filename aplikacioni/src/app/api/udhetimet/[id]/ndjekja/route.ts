import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { profiliIm } from "@/lib/lejet";
import { getSql, raportoGabiminNeon } from "@/lib/db";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

async function konteksti(id: string) {
  const session = await getServerSession(authOptions);
  const profili = await profiliIm();
  if (!session?.user?.id || !profili) return { error: "hyr" as const };
  const sql = getSql();
  const udhetimet = await sql`SELECT id, shofer_id, vende FROM udhetimet WHERE id = ${id}`;
  if (!udhetimet[0]) return { error: "mungon" as const };
  const kerkesat = await sql`SELECT id, status FROM kerkesat_udhetimit
    WHERE udhetim_id = ${id} AND udhetar_id = ${profili.id}`;
  return {
    sql,
    profili,
    udhetimi: udhetimet[0] as { id: string; shofer_id: string | null; vende: number },
    kerkesa: kerkesat[0] as { id: number; status: string } | undefined,
  };
}

export async function GET(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const ctx = await konteksti(id);
    if ("error" in ctx) return Response.json({ error: ctx.error }, { status: ctx.error === "hyr" ? 401 : 404 });
    const eshteShofer = ctx.udhetimi.shofer_id === ctx.profili.id;
    const mundTaShohe = eshteShofer || ctx.kerkesa?.status === "pranuar";
    const kerkesatNePritje = eshteShofer
      ? await ctx.sql`SELECT k.id, p.emri FROM kerkesat_udhetimit k
        JOIN profilet p ON p.github_id = k.udhetar_id
        WHERE k.udhetim_id = ${id} AND k.status = 'ne_pritje' ORDER BY k.krijuar_me`
      : [];
    const pozicionet = mundTaShohe
      ? await ctx.sql`SELECT v.profile_id AS id, p.emri, p.roli, v.latitude, v.longitude,
          v.saktesia, v.perditesuar_me
        FROM vendndodhjet_live v JOIN profilet p ON p.github_id = v.profile_id
        WHERE v.udhetim_id = ${id} AND v.aktive = true
          AND v.perditesuar_me > now() - interval '2 minutes'
          AND (v.profile_id = ${ctx.profili.id} OR v.profile_id = ${ctx.udhetimi.shofer_id}
            OR EXISTS (SELECT 1 FROM kerkesat_udhetimit k
              WHERE k.udhetim_id = ${id} AND k.udhetar_id = v.profile_id AND k.status = 'pranuar'))`
      : [];
    const eNdaj = pozicionet.some((p) => p.id === ctx.profili.id);
    return Response.json({
      viewer: { emri: ctx.profili.emri, roli: ctx.profili.roli, eshteShofer },
      kaShoferTjeter: Boolean(ctx.udhetimi.shofer_id && !eshteShofer),
      statusKerkese: ctx.kerkesa?.status ?? null,
      kerkesatNePritje,
      pozicionet,
      eNdaj,
      mundTaNdaje: eshteShofer || ctx.kerkesa?.status === "pranuar",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = raportoGabiminNeon("ndjekja live", error);
    return Response.json({ error: message }, { status: 503 });
  }
}

export async function POST(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const ctx = await konteksti(id);
    if ("error" in ctx) return Response.json({ error: ctx.error }, { status: ctx.error === "hyr" ? 401 : 404 });
    const body = await request.json() as Record<string, unknown>;

    if (body.veprim === "merr") {
      if (ctx.profili.roli !== "shofer") {
        return Response.json({ error: "Ndrysho rolin në shofer nga paneli para se të lidhësh udhëtimin." }, { status: 403 });
      }
      const rows = await ctx.sql`UPDATE udhetimet SET shofer_id = ${ctx.profili.id}
        WHERE id = ${id} AND (shofer_id IS NULL OR shofer_id = ${ctx.profili.id}) RETURNING id`;
      if (!rows.length) return Response.json({ error: "Ky udhëtim është lidhur me një shofer tjetër." }, { status: 409 });
      return Response.json({ ok: true });
    }

    if (body.veprim === "kerko") {
      if (ctx.profili.roli !== "udhetar" || ctx.udhetimi.shofer_id === ctx.profili.id || Number(ctx.udhetimi.vende) < 1) {
        return Response.json({ error: "Ky udhëtim nuk mund të kërkohet nga ky profil." }, { status: 403 });
      }
      await ctx.sql`INSERT INTO kerkesat_udhetimit (udhetim_id, udhetar_id)
        VALUES (${id}, ${ctx.profili.id}) ON CONFLICT (udhetim_id, udhetar_id)
        DO UPDATE SET status = 'ne_pritje', ndryshuar_me = now()
        WHERE kerkesat_udhetimit.status = 'refuzuar'`;
      return Response.json({ ok: true });
    }

    if (body.veprim === "pergjigju") {
      if (ctx.udhetimi.shofer_id !== ctx.profili.id || !["prano", "refuzo"].includes(String(body.vendimi))) {
        return Response.json({ error: "Vetëm shoferi i udhëtimit mund t’i përgjigjet kërkesës." }, { status: 403 });
      }
      const rows = await ctx.sql`UPDATE kerkesat_udhetimit SET
          status = ${body.vendimi === "prano" ? "pranuar" : "refuzuar"}, ndryshuar_me = now()
        WHERE id = ${Number(body.kerkesaId)} AND udhetim_id = ${id} AND status = 'ne_pritje'
        RETURNING id`;
      if (!rows.length) return Response.json({ error: "Kërkesa nuk u gjet ose është trajtuar." }, { status: 409 });
      return Response.json({ ok: true });
    }

    if (body.veprim === "pozicion") {
      const eLejuar = ctx.udhetimi.shofer_id === ctx.profili.id || ctx.kerkesa?.status === "pranuar";
      if (!eLejuar) return Response.json({ error: "Kërkesa duhet pranuar para ndarjes së vendndodhjes." }, { status: 403 });
      if (body.ndaj === false) {
        await ctx.sql`UPDATE vendndodhjet_live SET aktive = false, perditesuar_me = now()
          WHERE udhetim_id = ${id} AND profile_id = ${ctx.profili.id}`;
        return Response.json({ ok: true });
      }
      const latitude = Number(body.latitude);
      const longitude = Number(body.longitude);
      const saktesia = Number(body.saktesia);
      if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 || !Number.isFinite(longitude)
        || Math.abs(longitude) > 180 || !Number.isFinite(saktesia) || saktesia < 0) {
        return Response.json({ error: "Koordinatat nuk janë të vlefshme." }, { status: 400 });
      }
      await ctx.sql`INSERT INTO vendndodhjet_live
          (udhetim_id, profile_id, latitude, longitude, saktesia, aktive, perditesuar_me)
        VALUES (${id}, ${ctx.profili.id}, ${latitude}, ${longitude}, ${saktesia}, true, now())
        ON CONFLICT (udhetim_id, profile_id) DO UPDATE SET latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude, saktesia = EXCLUDED.saktesia,
          aktive = true, perditesuar_me = now()`;
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Veprim i panjohur." }, { status: 400 });
  } catch (error) {
    const message = raportoGabiminNeon("veprimi i ndjekjes live", error);
    return Response.json({ error: message }, { status: 503 });
  }
}
