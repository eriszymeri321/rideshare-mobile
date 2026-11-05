"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Pwa() {
  const pathname = usePathname();

  useEffect(() => {
    // The automated Week 8 route must stay independent from Neon and the service worker.
    if (pathname === "/java-08-test" || !("serviceWorker" in navigator)) return;
    let cancelled = false;
    async function warmSnapshot() {
      if (cancelled || !navigator.serviceWorker.controller) return;
      try { await fetch("/api/udhetimet", { cache: "no-store" }); } catch { /* offline */ }
    }
    navigator.serviceWorker.addEventListener("controllerchange", warmSnapshot);
    navigator.serviceWorker.register("/sw.js", { scope: "/" })
      .then(() => navigator.serviceWorker.ready).then(warmSnapshot).catch(() => {});
    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener("controllerchange", warmSnapshot);
    };
  }, [pathname]);

  if (pathname === "/java-08-test") return null;
  return <aside style={{ padding: "1rem" }}>
    <a href="/offline.html">Lista për lexim pa internet</a>
    <p>Kopja e ruajtur mund të jetë e vjetër. Këtu nuk konfirmohen rezervime.</p>
  </aside>;
}
