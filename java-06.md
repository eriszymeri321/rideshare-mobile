# RideShare — Java 6: PWA dhe lexim offline

## Çfarë u shtua

- `aplikacioni/src/app/manifest.ts` krijon manifestin RideShare AAB.
- `aplikacioni/public/icons/icon-192.png` dhe `icon-512.png` janë ikonat e manifestit.
- `aplikacioni/src/app/api/udhetimet/route.ts` ekspozon vetëm fushat publike të udhëtimeve.
- `aplikacioni/public/sw.js` ruan faqen offline, ikonat dhe përgjigjen e listës publike.
- `aplikacioni/public/offline.html` shfaq listën e ruajtur, burimin/kohën dhe nuk lejon kërkesë rezervimi.
- `aplikacioni/src/components/Pwa.tsx` regjistron service worker-in dhe ngroh kopjen e API-së.
- `aplikacioni/src/app/layout.tsx` e përfshin komponentin PWA në layout.

Paneli, hyrja dhe veprimet POST nuk ruhen nga service worker-i.

## Kontrolli teknik i kryer

- `npm run lint` — përfundoi me sukses.
- `npm run build` — përfundoi me sukses; u krijuan `/manifest.webmanifest` dhe `/api/udhetimet`.
- Me serverin lokal të prodhimit, kërkesat për `/manifest.webmanifest`, `/icons/icon-192.png`, `/icons/icon-512.png`, `/offline.html`, `/sw.js` dhe `/api/udhetimet` kthyen HTTP 200.
- `/api/udhetimet` ktheu tri udhëtime me fushat publike. ID 2 u lexua me orën `08:15`.

## Tri provat e ushtrimit

### Prova 1 — Manifesti, ikonat dhe cache-i

- **Pritja:** manifesti ka emrin RideShare AAB; ikonat kanë madhësitë e duhura; worker-i është aktiv dhe cache përmban `/api/udhetimet`.
- **Hapat:** hapa aplikacionin lokal, kontrollova manifestin dhe ikonat; te Chrome → Application → Service Workers kontrollova `/sw.js`; te Cache Storage hapa `rideshare-public-v1`.
- **Rezultati real:** manifesti dhe ikonat u shërbyen me HTTP 200. Worker-i u shfaq `activated and is running`; cache përmbante `/api/udhetimet`, të dy ikonat dhe `/offline.html`. API-ja ktheu tri udhëtime.

### Prova 2 — Leximi pas ndërprerjes dhe rifreskimit

- **Pritja:** pasi lista të jetë ruajtur, fikja e rrjetit dhe rifreskimi i `/` shfaqin tri udhëtimet nga kopja offline; kërkesa për vend është e çaktivizuar.
- **Hapat:** në Chrome → Network zgjodha `Offline`, hapa `/` dhe rifreskova faqen.
- **Rezultati real:** u shfaqën të tri udhëtimet nga lista e fundit e ruajtur; mesazhi tregoi se serveri nuk u arrit dhe kopja mund të jetë e vjetruar. Butoni `Kërko vend` mbeti i çaktivizuar.

### Prova 3 — Përditësimi pas rikthimit të lidhjes

- **Pritja:** me RideShare offline, kopja tregon orën e vjetër; pasi Neon të ndryshohet përkohësisht në `08:25`, rikthehet rrjeti dhe shtypet “Rifresko listën”, karta tregon `08:25` nga serveri me kohën e re. Pastaj Neon rikthehet në `08:15`.
- **Hapat:** ndërsa RideShare ishte offline, ndryshova orën e ID 2 në Neon në `08:25`. E ktheva RideShare në `No throttling/Online` dhe shtypa `Rifresko listën`. Pastaj e riktheva orën në Neon në `08:15` dhe rifreskova përsëri.
- **Rezultati real:** pas rikthimit online, udhëtimi Fushë Kosovë → AAB u përditësua në `08:25`. Pas rikthimit në Neon dhe rifreskimit, ora u kthye në `08:15`.

## Dorëzimi

Provat u kryen; raporti tani përmban rezultatet e vëzhguara. Mbetet commit `Java 6: PWA dhe lexim offline`, Push origin dhe dorëzimi i URL-së së repository-t në formularin Java 6. Ruaje numrin e Issue-t; për korrigjime komento `rikontrollo` te i njëjti Issue.
