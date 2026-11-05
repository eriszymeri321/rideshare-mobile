"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Pozicioni = {
  id: string;
  emri: string;
  roli: "shofer" | "udhetar";
  latitude: number;
  longitude: number;
  saktesia: number;
  perditesuar_me: string;
};
type TeDhena = {
  viewer: { emri: string; roli: "shofer" | "udhetar"; eshteShofer: boolean };
  statusKerkese: string | null;
  kerkesatNePritje: { id: number; emri: string }[];
  pozicionet: Pozicioni[];
  eNdaj: boolean;
  mundTaNdaje: boolean;
};

export function NdjekjaVendndodhjes({ udhetimId, vende }: { udhetimId: string; vende: number }) {
  const [teDhena, setTeDhena] = useState<TeDhena | null>(null);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const [poNdaj, setPoNdaj] = useState(false);
  const [mesazhi, setMesazhi] = useState("");
  const [eNdaj, setENdaj] = useState(false);
  const pollId = useRef<number | null>(null);
  const api = `/api/udhetimet/${encodeURIComponent(udhetimId)}/ndjekja`;

  const lexo = useCallback(async () => {
    try {
      const response = await fetch(api, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(response.status === 401 ? "Hyr me GitHub për këtë funksion." : data.error);
      setTeDhena(data as TeDhena);
      setENdaj((v) => v || Boolean((data as TeDhena).eNdaj));
    } catch (error) {
      setMesazhi(error instanceof Error ? error.message : "Nuk u lexua gjendja e udhëtimit.");
    } finally {
      setDukeNgarkuar(false);
    }
  }, [api]);

  useEffect(() => {
    const initial = window.setTimeout(() => void lexo(), 0);
    const timer = window.setInterval(() => void lexo(), 7000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [lexo]);

  useEffect(() => () => {
    if (pollId.current !== null) window.clearInterval(pollId.current);
  }, []);

  async function dergo(body: Record<string, unknown>) {
    const response = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Veprimi nuk u krye.");
    return result;
  }

  async function nisNdarjenMe(position: GeolocationPosition) {
    await dergo({
      veprim: "pozicion",
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      saktesia: position.coords.accuracy,
    });
    setENdaj(true);
    setMesazhi("Vendndodhja jote po ndahet me personat e pranuar të këtij udhëtimi.");
    void lexo();
    pollId.current = window.setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (p) => {
        void dergo({
          veprim: "pozicion",
          latitude: p.coords.latitude,
          longitude: p.coords.longitude,
          saktesia: p.coords.accuracy,
        }).then(() => void lexo()).catch((error) => setMesazhi(error.message));
      },
        (error) => setMesazhi(error.code === error.PERMISSION_DENIED
          ? "Leja u hoq. Ndal ndarjen ose lejo vendndodhjen në cilësimet e shfletuesit."
          : "Përditësimi i vendndodhjes dështoi; pozicioni i fundit skadon pas dy minutash."),
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 },
      );
    }, 8000);
  }

  function nisNdarjen() {
    if (!navigator.geolocation) {
      setMesazhi("Ky shfletues nuk e mbështet vendndodhjen.");
      return;
    }
    setPoNdaj(true);
    setMesazhi("Po kërkohet leja dhe pozicioni…");
    navigator.geolocation.getCurrentPosition(
      (position) => { void nisNdarjenMe(position).catch((error) => setMesazhi(error.message)).finally(() => setPoNdaj(false)); },
      (error) => {
        setPoNdaj(false);
        setMesazhi(error.code === error.PERMISSION_DENIED
          ? "Leja u refuzua. Ndryshoje te cilësimet e shfletuesit për të ndarë vendndodhjen."
          : "Nuk u mor vendndodhja. Provo sërish.");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
  }

  async function ndaloNdarjen() {
    if (pollId.current !== null) window.clearInterval(pollId.current);
    pollId.current = null;
    setENdaj(false);
    try {
      await dergo({ veprim: "pozicion", ndaj: false });
      setMesazhi("Ndarja u ndal dhe pozicioni yt u hoq nga harta.");
      await lexo();
    } catch (error) {
      setMesazhi(error instanceof Error ? error.message : "Nuk u ndal ndarja në server.");
    }
  }

  async function kerkoVend() {
    try {
      await dergo({ veprim: "kerko" });
      setMesazhi("Kërkesa iu dërgua shoferit. Vendndodhja ndahet vetëm nëse ai e pranon.");
      await lexo();
    } catch (error) { setMesazhi(error instanceof Error ? error.message : "Kërkesa dështoi."); }
  }

  async function pergjigju(kerkesaId: number, vendimi: "prano" | "refuzo") {
    try {
      await dergo({ veprim: "pergjigju", kerkesaId, vendimi });
      setMesazhi(vendimi === "prano" ? "Kërkesa u pranua; tani mund të ndani vendndodhjen." : "Kërkesa u refuzua.");
      await lexo();
    } catch (error) { setMesazhi(error instanceof Error ? error.message : "Përgjigjja dështoi."); }
  }

  async function merrUdhetimin() {
    try {
      await dergo({ veprim: "merr" });
      setMesazhi("Udhëtimi u lidh me profilin tënd të shoferit.");
      await lexo();
    } catch (error) { setMesazhi(error instanceof Error ? error.message : "Nuk u lidh udhëtimi."); }
  }

  if (dukeNgarkuar) return <section><h2>Vendndodhja live</h2><p>Po ngarkohet…</p></section>;
  if (!teDhena) return <section><h2>Vendndodhja live</h2><p role="alert">{mesazhi || "Hyr me GitHub për të kërkuar ose ndarë vendndodhjen."}</p><Link className="action" href="/panel">Hyr / Paneli im</Link></section>;

  const shoferi = teDhena.pozicionet.find((p) => p.roli === "shofer");
  const udhetaret = teDhena.pozicionet.filter((p) => p.roli === "udhetar");

  return (
    <section aria-labelledby="ndjekja-titull" data-testid="live-location">
      <h2 id="ndjekja-titull">Vendndodhja live e udhëtimit</h2>
      <p>Kërkesa dhe koordinatat janë private për shoferin dhe udhëtarët e pranuar. Ndarja fiket nga secili person kur të dojë.</p>
      {teDhena.viewer.roli === "shofer" && !teDhena.viewer.eshteShofer && (
        <><p>Ky udhëtim nuk ka ende shofer të lidhur.</p><button className="action" onClick={merrUdhetimin}>Lidhe këtë udhëtim me profilin tim</button></>
      )}
      {teDhena.viewer.roli === "udhetar" && teDhena.viewer.eshteShofer && <p>Ky udhëtim është i lidhur me profilin tënd si shofer.</p>}
      {!teDhena.viewer.eshteShofer && teDhena.viewer.roli === "udhetar" && !teDhena.statusKerkese && (
        <button className="action" onClick={kerkoVend} disabled={vende < 1}>Kërko vend dhe qasje te vendndodhja</button>
      )}
      {teDhena.statusKerkese === "ne_pritje" && <p role="status">Kërkesa jote është në pritje të shoferit.</p>}
      {teDhena.statusKerkese === "refuzuar" && <p role="status">Shoferi nuk e pranoi kërkesën.</p>}
      {teDhena.viewer.eshteShofer && teDhena.kerkesatNePritje.length > 0 && <div>
        <h3>Kërkesat për udhëtim</h3>
        {teDhena.kerkesatNePritje.map((k) => <p key={k.id}>
          {k.emri}{" "}
          <button type="button" onClick={() => void pergjigju(k.id, "prano")}>Prano</button>{" "}
          <button type="button" onClick={() => void pergjigju(k.id, "refuzo")}>Refuzo</button>
        </p>)}
      </div>}
      {teDhena.mundTaNdaje && <div>
        <p>Vendndodhja rifreskohet çdo 8 sekonda kur faqja është aktive; pika e fundit hiqet pas 2 minutash pa përditësim.</p>
        {eNdaj
          ? <button className="action" type="button" onClick={() => void ndaloNdarjen()}>Ndalo ndarjen e vendndodhjes</button>
          : <button className="action" type="button" disabled={poNdaj} onClick={nisNdarjen}>
            {poNdaj ? "Po kërkojmë vendndodhjen…" : "Ndaj vendndodhjen time live"}
          </button>}
      </div>}
      {mesazhi && <p role="status">{mesazhi}</p>}
      {teDhena.mundTaNdaje && <HartaUdhetimit shoferi={shoferi} udhetaret={udhetaret} />}
    </section>
  );
}

function HartaUdhetimit({ shoferi, udhetaret }: { shoferi?: Pozicioni; udhetaret: Pozicioni[] }) {
  const [ngarkoHarten, setNgarkoHarten] = useState(false);
  const pikat = [shoferi, ...udhetaret].filter((p): p is Pozicioni => Boolean(p));
  if (!pikat.length) return <p>Harta shfaqet kur shoferi ose një udhëtar i pranuar nis ndarjen e vendndodhjes.</p>;
  const latMin = Math.min(...pikat.map((p) => p.latitude));
  const latMax = Math.max(...pikat.map((p) => p.latitude));
  const lngMin = Math.min(...pikat.map((p) => p.longitude));
  const lngMax = Math.max(...pikat.map((p) => p.longitude));
  const mercatorY = (latitude: number) => Math.log(Math.tan(Math.PI / 4 + (Math.max(-85, Math.min(85, latitude)) * Math.PI / 180) / 2));
  const latitudeFromMercator = (y: number) => (2 * Math.atan(Math.exp(y)) - Math.PI / 2) * 180 / Math.PI;
  const projectedYs = [mercatorY(latMin), mercatorY(latMax)];
  const centerX = (lngMin + lngMax) / 2;
  const centerY = (projectedYs[0] + projectedYs[1]) / 2;
  let width = Math.max(lngMax - lngMin, 0.002) * 1.5;
  let height = Math.max(projectedYs[1] - projectedYs[0], 0.002) * 1.5;
  const aspect = 600 / 340;
  if (width / height > aspect) height = width / aspect;
  else width = height * aspect;
  const left = centerX - width / 2;
  const right = centerX + width / 2;
  const bottom = latitudeFromMercator(centerY - height / 2);
  const top = latitudeFromMercator(centerY + height / 2);
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${left},${bottom},${right},${top}&layer=mapnik`;
  const x = (p: Pozicioni) => ((p.longitude - left) / width) * 600;
  const y = (p: Pozicioni) => ((centerY + height / 2 - mercatorY(p.latitude)) / height) * 340;
  return <div>
    <h3>Harta live · vendndodhjet e fundit</h3>
    <p>Për të mbrojtur vendndodhjen, harta e jashtme ngarkohet vetëm me klikim. OpenStreetMap merr zonën e përafërt të pikave për të shfaqur hartën.</p>
    {!ngarkoHarten && <button className="action" type="button" onClick={() => setNgarkoHarten(true)}>Ngarko hartën OpenStreetMap</button>}
    <div className="location-map">
      {ngarkoHarten && <iframe src={mapUrl} title="Hartë OpenStreetMap e udhëtimit" loading="lazy" />}
      <svg viewBox="0 0 600 340" preserveAspectRatio="none" role="img" aria-label="Pikat e shoferit dhe udhëtarëve në hartë">
      {shoferi && udhetaret[0] && <path d={`M ${x(shoferi)} ${y(shoferi)} L ${x(udhetaret[0])} ${y(udhetaret[0])}`} stroke="#334155" strokeWidth="3" strokeDasharray="8 7" />}
      {pikat.map((p) => <g key={p.id}>
        <circle cx={x(p)} cy={y(p)} r="17" fill={p.roli === "shofer" ? "#2257d6" : "#d13c57"} stroke="white" strokeWidth="5" />
        <text x={x(p)} y={y(p) - 22} textAnchor="middle" fontSize="14" fontWeight="700" fill="#172033" stroke="white" strokeWidth="4" paintOrder="stroke">{p.roli === "shofer" ? "Shoferi" : p.emri}</text>
      </g>)}
      </svg>
    </div>
    <p>Koordinatat mbeten në listën private të këtij udhëtimi; kur hap lidhjen e jashtme, koordinatat i dërgohen OpenStreetMap.</p>
    <ul>
      {pikat.map((p) => <li key={p.id}>
        <strong>{p.roli === "shofer" ? "Shoferi" : p.emri}</strong>: {p.latitude.toFixed(5)}, {p.longitude.toFixed(5)} · ±{Math.round(p.saktesia)} m · përditësuar {new Date(p.perditesuar_me).toLocaleTimeString("sq-AL")}.
        {" "}<a href={`https://www.openstreetmap.org/?mlat=${p.latitude}&mlon=${p.longitude}#map=17/${p.latitude}/${p.longitude}`} target="_blank" rel="noreferrer">Hape në OpenStreetMap</a>
      </li>)}
    </ul>
  </div>;
}
