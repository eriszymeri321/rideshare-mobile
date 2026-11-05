# RideShare · Java 8 · Vendtakimi dhe vendndodhja live

## Çfarë u ndërtua

- `aplikacioni/src/components/PikaNisjes.tsx` zbaton zgjedhjen manuale dhe demonstrimin lokal të lejes së vendndodhjes.
- `aplikacioni/src/components/NdjekjaVendndodhjes.tsx` zbaton kërkesën e udhëtarit, pranimin/refuzimin nga shoferi, ndarjen live dhe hartën.
- `aplikacioni/src/app/udhetimi/[id]/page.tsx` shfaq ndjekjen live te detajet e udhëtimit.
- `aplikacioni/src/app/api/udhetimet/[id]/ndjekja/route.ts` kontrollon sesionin, pronësinë dhe pranimin para ruajtjes/leximit të koordinatave.
- `aplikacioni/src/app/panel/page.tsx` lejon zgjedhjen e rolit; shoferi mund ta lidhë profilin e vet me një udhëtim të lirë.
- `aplikacioni/src/app/java-08-test/page.tsx` është faqe prove lokale që nuk kërkon Neon ose hyrje.
- `aplikacioni/schema-java08.sql` shton tabelat e kërkesave dhe vendndodhjeve. Migrimi u ekzekutua në databazën e konfiguruar lokalisht.

## Provat

Provat e ndërveprimit u kryen në `/java-08-test` në Chrome 116 headless me leje dhe koordinata të simuluara në DevTools. Nuk u përdor vendndodhje reale.

### Prova 1

**Hapat:** Hapa `http://127.0.0.1:3000/java-08-test` në Chrome. Para klikimit lexova gjendjen e lejes me Permissions API. Pastaj lejova geolocation në DevTools, vendosa koordinata fiktive dhe shtypa “Përdor vendndodhjen time”.

**Pritshmëria:** Faqja të mos kërkojë leje gjatë hapjes; gjendja të jetë `prompt` derisa të shtypet butoni. Pas klikimit, suksesi të përfundojë pritjen dhe të tregojë saktësinë.

**Vëzhgimi real:** Para klikimit gjendja ishte `prompt`. Pas klikimit u shfaq “Pozicioni u mor.” dhe “Saktësia rreth 25 m”. Komponenti i vendtakimit nuk dërgoi koordinata; layout-i i aplikacionit bëri veçmas kërkesën publike `/api/udhetimet` për cache-in offline. Prova kaloi me vendndodhje të simuluar, jo me GPS real.

### Prova 2

**Hapat:** Në Chrome vendosa lejen e geolocation në `denied` për faqen, e hapa dhe shtypa butonin e vendndodhjes. Në një provë tjetër të së njëjtës faqe demonstrative shkrova “Parkingu” dhe e konfirmova. Pastaj shtypa “Simulo timeout-in”.

**Pritshmëria:** Refuzimi të mos bllokojë formularin manual; vendtakimi i shkruar të konfirmohet. Simulimi i timeout-it të mbyllë pritjen dhe të lejojë vazhdimin manual.

**Vëzhgimi real:** Pas refuzimit u shfaq “Leja u refuzua. Shkruaj vendtakimin vetë.” Në provën manuale u shfaq “Vendtakimi i konfirmuar: Parkingu”. Simulimi shfaqi “Koha mbaroi. Provo sërish ose shkruaj vendtakimin vetë.” Nuk provova timeout të vërtetë në pajisje.

### Prova 3

**Hapat:** Kontrollova skedarët që hyjnë në dorëzim me `git ls-files` për skedarë `.env`; skanova `java-08.md` dhe `mobile-week08.json` për URL databaze dhe koordinata me saktësi të lartë. Koordinatat e përdorura në Chrome ishin fiktive dhe nuk u shkruan në raport.

**Pritshmëria:** Asnjë skedar `.env`, URL/sekret databaze ose koordinatë reale të mos përfshihet në dokumentet e dorëzimit.

**Vëzhgimi real:** Kontrolli gjeti 0 skedarë `.env` të gjurmuar, 0 koordinata të sakta dhe 0 URL databaze në dy dokumentet e skanuara. Kjo është kontroll i këtyre skedarëve dhe modeleve, jo audit i përgjithshëm i çdo sekreti të mundshëm.

### Prova me një hyrje të re

**Hyrja që provova:** Konfirmova “Biblioteka”, pastaj shkrova vetëm hapësira dhe shtypa “Konfirmo në telefon”. Më pas shkrova “Parkingu” pa e konfirmuar.

**Parashikimi im para klikimit:** Teksti bosh pas `trim()` nuk do të pranohet; “Biblioteka” do të mbetet vendtakimi i konfirmuar si kur fusha përmban hapësira, ashtu edhe kur ndryshohet pa konfirmim.

**Çfarë pashë realisht:** Pas hyrjes me hapësira u shfaq “Shkruaj vendtakimin para se ta konfirmosh.” dhe vendtakimi mbeti “Biblioteka”. Pas ndryshimit në “Parkingu” pa klikim, vendtakimi i konfirmuar vazhdoi të ishte “Biblioteka”.

**Skedari dhe funksioni që e shpjegojnë:** `aplikacioni/src/components/PikaNisjes.tsx`, funksioni `konfirmo`; `teksti` dhe `vendtakimi` mbahen në state të veçanta, ndërsa `trim()` kontrollon tekstin bosh.

**Çfarë kuptova ose korrigjova:** Teksti në fushë është draft; vetëm klikimi e ndryshon vendtakimin e konfirmuar. Hyrja me hapësira nuk duhet të fshijë zgjedhjen e mëparshme.

## Kontrolle teknike dhe kufizime

`npm run lint`, `npm run build` dhe `git diff --check` kaluan. Provat e Chrome përdorën lokacion të simuluar. Nuk u provuan dy llogari GitHub, dy telefona, ndarja live mes shoferit/udhëtarit apo testi me koleg.

Më 2026-11-05 u kontrollua domeni publik `https://rideshare-mobile-one.vercel.app`: faqja kryesore, `/panel` dhe `/udhetimi/2` kthyen HTTP 200; `/api/udhetimet` ktheu HTTP 200 me listën e udhëtimeve; `/api/auth/providers` raportoi GitHub dhe callback-un `https://rideshare-mobile-one.vercel.app/api/auth/callback/github`. Endpoint-i privat i ndjekjes ktheu HTTP 401 pa sesion, siç pritet. Këto kontrolle vërtetojnë që deploy-i publik lidhet me databazën dhe njofton callback-un e prodhimit, por nuk provojnë hyrjen përfundimtare me GitHub, konfigurimin e dukshmërisë së GitHub App ose ndarjen live mes dy llogarive.

Vendndodhja lexohet vetëm pas klikimit dhe shfaqet vetëm mes shoferit të lidhur dhe udhëtarëve të pranuar. Pozicionet ruhen në Neon. Harta OpenStreetMap ngarkohet vetëm pasi përdoruesi zgjedh ta hapë; atëherë OpenStreetMap merr zonën e përafërt të pikave. Secili mund ta ndalë ndarjen.

AI ndihmoi në implementim dhe shqyrtim. Prova me koleg nuk u realizua; nuk pretendohet si e kryer.
