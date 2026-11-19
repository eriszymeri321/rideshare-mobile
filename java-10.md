# RideShare — Java 10: Dy ekrane, një gjendje

## Çfarë u plotësua

- `aplikacioni/src/app/api/udhetimet/[id]/ndjekja/route.ts` lexon nga Neon vendet e lira dhe statusin e kërkesës për sesionin aktual. Shoferi sheh kërkesat e udhëtimit të vet; udhëtari merr vetëm statusin e kërkesës së vet.
- E njëjta rrugë API ruan kërkesën. Pranimi bllokon rreshtin e udhëtimit dhe ndryshon statusin bashkë me numrin e vendeve në një transaksion. Kërkesa pranohet vetëm kur është në pritje dhe ka vend; prandaj pranimi i përsëritur nuk e ul numrin përsëri.
- `aplikacioni/src/components/NdjekjaVendndodhjes.tsx` rilexon gjendjen çdo 5 sekonda pa nisur lexime të njëjra njëkohësisht. Pas shkëputjes ruan pamjen e fundit, tregon “Po rilidhemi” dhe i bllokon veprimet që kërkojnë rrjet. Kur rrjeti rikthehet, nis një lexim të menjëhershëm.
- `aplikacioni/src/app/udhetimi/[id]/page.tsx` përdor komponentin e sinkronizuar për kërkesën dhe vendet, pa mbajtur një buton të veçantë që mund të mos përputhet me gjendjen e serverit.

Skema e kërkesave ekziston nga Java 8 te `aplikacioni/schema-java08.sql`. Shtova `aplikacioni/schema-java10.sql` vetëm për të krijuar dy udhëtime fiktive me nga dy vende: ID 10 për rastet 1–2 dhe ID 11 për rastin 3. Migrimi u aplikua në Neon-in e konfiguruar për këto prova; kodi i aplikacionit nuk krijon automatikisht të dhëna prove. Në një mjedis tjetër, ekzekuto skriptin në Neon SQL Editor pas migrimeve Java 8.

## Tri provat e kërkuara

Provat u kryen lokalisht më 18 nëntor 2026 me të dhëna fiktive në Neon. Në provat e para, dritarja normale përdori llogarinë GitHub `eriszymeri321` si udhëtare dhe dritarja private një sesion shoferi testues të nënshkruar lokalisht (`999900001`). Në përsëritjen offline, Safari përdori llogarinë reale si shofer dhe Chrome një sesion udhëtari testues (`999900002`) me DevTools. Nuk u përdor llogari e dytë reale GitHub. Udhëtimi 10 u përdor për pranimin dhe përsëritjen; udhëtimi 11 për zero vende dhe offline/rilidhjen.

### Prova 1 — Kërkesa mbërrin te shoferi

- **Pritshmëria:** Me dy vende, udhëtari dërgon kërkesë. Pas leximit periodik, shoferi sheh “Në pritje” dhe të dy ekranet tregojnë dy vende.
- **ID e udhëtimit:** 10; e njëjta rrjedhë u pa sërish në 11 para pranimit.
- **Rezultati real:** Në faqen e udhëtarit, klikimi kaloi në “Kërkesa jote është në pritje të shoferit.” Leximi i shoferit nga API ktheu statusin `ne_pritje` dhe dy vende. Në dritaren private të shoferit u shfaq emri i udhëtarit, “Në pritje” dhe butonat e pranimit/refuzimit. Kërkesa u gjet në Neon pas rifreskimit periodik. Kaloi.
- **Skedarët për t’u kontrolluar:** `aplikacioni/src/app/api/udhetimet/[id]/ndjekja/route.ts`; `aplikacioni/src/components/NdjekjaVendndodhjes.tsx`.

### Prova 2 — Pranimi sinkronizon ekranet dhe është vetëm një herë

- **Pritshmëria:** Shoferi pranon kërkesën. Pas leximit pasues, shoferi dhe udhëtari shohin kërkesën e pranuar dhe një vend. Dërgimi i të njëjtit pranim prapë nuk e ndryshon numrin. Me një kërkesë tjetër në pritje, provo edhe 0 vende: pranimi duhet të refuzohet dhe numri të mbetet 0.
- **ID e udhëtimit:** 10 për pranimin/përsëritjen; 11 për provën me zero vende.
- **Rezultati real:** Për ID 10, API-ja e shoferit ktheu HTTP 200; Neon kaloi nga `2/ne_pritje` në `1/pranuar`. E njëjta përgjigje u dërgua përsëri: API ktheu HTTP 409 dhe vendet mbetën 1. Ndërfaqja e udhëtarit pas poll-it shfaqi “Kërkesa u pranua” dhe një vend. Për ID 11, me kërkesë në pritje dhe vende të vendosura përkohësisht në 0, pranimi u refuzua me HTTP 409, kërkesa mbeti `ne_pritje` dhe numri mbeti 0. Vendet u kthyen në 2 për provën e tretë. Kaloi.
- **Skedarët për t’u kontrolluar:** `aplikacioni/src/app/api/udhetimet/[id]/ndjekja/route.ts`; `aplikacioni/src/components/NdjekjaVendndodhjes.tsx`.

### Prova 3 — Offline dhe rilidhja

- **Pritshmëria:** Me udhëtarin offline vetëm, pamja e fundit mbetet dhe shfaqet “Po rilidhemi”; shoferi online pranon kërkesën. Pas rikthimit të lidhjes, udhëtari merr statusin e ri dhe vendin e mbetur pa Refresh manual.
- **ID e udhëtimit fiktiv të dytë:** 11.
- **Rezultati real:** Në Chrome DevTools → Network conditions vendosa `Offline`. Network tregoi dështimin e `GET /api/udhetimet/11/ndjekja` me `net::ERR_INTERNET_DISCONNECTED`. Udhëtari mbajti pamjen e fundit: “Në pritje”, 2 vende dhe paralajmërimin “Po rilidhemi”. Në dritaren Safari online, shoferi e pranoi kërkesën; ekrani i tij tregoi “U pranua” dhe 1 vend. E ktheva Chrome DevTools në `No throttling`; pa Refresh, kërkesa e leximit u kthye HTTP 200, udhëtari tregoi “U pranua” dhe 1 vend, dhe paralajmërimi u hoq. Kaloi.
- **Skedarët për t’u kontrolluar:** `aplikacioni/src/components/NdjekjaVendndodhjes.tsx`; `aplikacioni/src/app/api/udhetimet/[id]/ndjekja/route.ts`.

## Kontrollet teknike

- `npm run lint` — kaloi.
- `npm run build` — kaloi; TypeScript dhe build-i i Next.js përfunduan.
- `git diff --check` — kaloi.

Këto kontrolle nuk zëvendësojnë tri provat në shfletues.

## Kufizimet

Provat përdorën dy sesione RideShare në shfletues të ndryshëm, por vetëm një llogari reale GitHub (`eriszymeri321`); sesioni tjetër ishte NextAuth testues i nënshkruar lokalisht, jo llogari OAuth e dytë. Prova offline përdori Chrome DevTools `Offline` dhe `No throttling`. Prandaj rrjedha e aplikacionit dhe sjellja e rrjetit u provuan lokalisht, por hyrja OAuth e një llogarie të dytë reale nuk u verifikua. Pas provës, kërkesat dhe profilet sintetike u fshinë, roli i llogarisë reale u kthye në `udhetar` dhe pronësia u hoq. Udhëtimet fiktive 10/11 mbeten në Neon me nga 2 vende, gati për përdorim të mëvonshëm. `.env.local` nuk përfshihet në raport ose në Git.

## Ndihma nga AI

AI ndihmoi në analizimin e ushtrimeve, implementimin e sinkronizimit dhe përgatitjen e këtij raporti. Provat janë kryer në mjedisin lokal siç përshkruhet më sipër; kufizimet e sesionit testues dhe simulimit të offline janë shënuar shprehimisht.
