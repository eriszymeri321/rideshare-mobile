# RideShare — Java 8

## Çfarë ndërtova

Te detajet e udhëtimit vendosa të njëjtin komponent `PikaNisjes` që përdoret edhe në faqen `/java-08-test`. Arta mund të shkruajë dhe të konfirmojë një vendtakim ose, vetëm pas klikimit, t’i kërkojë shfletuesit vendndodhjen. Kjo zgjedhje lokale nuk dërgohet te shoferi dhe humbet pas rifreskimit. Ndarja live me shoferin është veçori shtesë e projektit, jashtë hapit të sotëm.

## Provat që bëra

Provat u kryen lokalisht në Chrome me vendndodhje të simuluar. Nuk u përdor GPS ose adresë reale.

### Prova 1: Leja nuk kërkohet sapo hapet faqja.

**Hapat:** Hapa `http://127.0.0.1:3000/java-08-test` dhe kontrollova gjendjen fillestare. Në mjedisin lokal të provës vendosa zëvendësuesin e geolocation-it pa e thirrur në render; pastaj klikova “Përdor vendndodhjen time” dhe i dhashë komponentit pozicion prove.

**Pritshmëria:** Faqja të hapet pa kërkuar leje; klikimi ta nisë kërkesën dhe suksesi të tregojë saktësinë.

**Vëzhgimi:** Para klikimit gjendja e komponentit ishte `idle`; leximi i geolocation-it nuk niset në render. Pas klikimit, me saktësi prove 37 m, u shfaq “Pozicioni u mor.”, “Saktësia rreth 37 m” dhe gjendja `success`. Me zëvendësuesin lokal nuk u shfaq dialog i sistemit për leje, prandaj kjo provë nuk pretendon se klikimi real i GPS-it u lejua në pajisje.

### Prova 2: Refuzimi i lejes nuk e bllokon përdoruesin.

**Hapat:** Vendosa lejen e vendndodhjes në `denied`, rifreskova faqen dhe klikova butonin. Pastaj shkrova “Parkingu” dhe e konfirmova. Në provë tjetër simulova gabimin e skadimit me kodin 3.

**Pritshmëria:** Refuzimi dhe skadimi ta përfundojnë pritjen; fusha manuale të mbetet e përdorshme.

**Vëzhgimi:** Simulimi i kodit 1 shfaqi “Leja u refuzua. Shkruaj vendtakimin vetë.” me gjendjen `denied`; “Parkingu” u konfirmua manualisht. Kodi 3 shfaqi mesazhin e skadimit me gjendjen `timeout`; kodi 2 kaloi në `unavailable`. Në të tri rastet pritja mbaroi dhe butoni u bë përsëri i përdorshëm. Nuk provova refuzim ose timeout real të pajisjes.

### Prova 3: Dëshmitë në GitHub nuk tregojnë adresën time reale.

**Hapat:** Kontrollova skedarët e dorëzimit për skedarë `.env`, URL të databazës dhe koordinata të sakta; përdora vetëm koordinata prove në shfletues.

**Pritshmëria:** Skedarët e publikuar të mos përmbajnë sekrete, adresë ose koordinata personale.

**Vëzhgimi:** Kontrolli gjeti 0 skedarë `.env` të gjurmuar, 0 URL databaze në raport/konfigurimin e testit dhe asnjë koordinatë reale të shkruar në to. Ky kontroll vlen vetëm për skedarët dhe modelet e skanuara, jo si audit i përgjithshëm i çdo sekreti.

## Ku gjendet puna

- Komponenti: `aplikacioni/src/components/PikaNisjes.tsx`.
- Detajet e udhëtimit: `aplikacioni/src/app/udhetimi/[id]/page.tsx`.
- Faqja automatike lokale: `aplikacioni/src/app/java-08-test/page.tsx`.
- Konfigurimi i testit: `mobile-week08.json`, me `version: 1` dhe `path: /java-08-test`.
- Varësitë dhe lockfile: `aplikacioni/package.json` dhe `aplikacioni/package-lock.json`.
- Repository: https://github.com/eriszymeri321/rideshare-mobile

## Çfarë mbetet për përmirësim

Vendtakimi manual dhe rezultati i geolocation-it ruhen vetëm në gjendjen lokale të faqes; rifreskimi i humb dhe shoferi nuk i merr. Kjo është jashtë qëllimit të ushtrimit të sotëm. Ndarja live është funksion shtesë; lidhja e një udhëtimi në Production duhet të përdoret vetëm kur ai udhëtim është i lirë ose i lidhur me shoferin e kyçur.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)

AI ndihmoi në rishikimin e kërkesave, gjetjen e mospërputhjes së etiketave të testit dhe përditësimin e komponentit. E verifikova vetë duke hapur faqen lokale, duke provuar konfirmimin manual dhe duke simuluar suksesin, refuzimin, skadimin dhe mungesën e mbështetjes. Nuk përdora koordinata reale.

## Prova me një hyrje të re

- Hyrja që provova: Shkrova “Biblioteka” dhe konfirmova. Ndryshova draftin në “Parkingu” pa e konfirmuar, provova tekst vetëm me hapësira dhe në fund konfirmova “Kafe Teatri”.
- Parashikimi im para klikimit: “Biblioteka” do të mbetet e konfirmuar kur shkruaj “Parkingu” pa e konfirmuar; hapësirat do të refuzohen; konfirmimi i “Kafe Teatri” do ta zëvendësojë vendtakimin.
- Çfarë pashë realisht: “Biblioteka” u shfaq si vendtakim i konfirmuar. Drafti “Parkingu” pa konfirmim nuk e ndryshoi. Hapësirat shfaqën “Shkruaj vendtakimin para se ta konfirmosh.” dhe vendtakimi mbeti “Biblioteka”. Pas konfirmimit të ri u shfaq “Vendtakimi i konfirmuar: Kafe Teatri”.
- Skedari dhe funksioni që e shpjegojnë: `aplikacioni/src/components/PikaNisjes.tsx`, funksioni `konfirmo`; `teksti` është draft, `vendtakimi` është zgjedhja e konfirmuar dhe `trim()` refuzon tekstin bosh.
- Çfarë kuptova ose korrigjova: Shkrimi nuk e ndryshon zgjedhjen; vetëm konfirmimi i një teksti jo bosh e ndryshon. Prova automatike nuk vërteton provë me koleg.

## Kufizimet e verifikimit

Provat automatike kontrollojnë sjelljet e faqes së provës; ato nuk vërtetojnë GPS real, lidhjen me Neon, sigurinë e gjithë aplikacionit, ndarjen live mes dy personave apo autorësinë. Testi zyrtar i javës 8 duhet të ekzekutohet përsëri mbi këtë commit në Issue-in ekzistues.
