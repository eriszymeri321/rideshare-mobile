# RideShare — Java 9

## Çfarë ndërtova

Shtova ruajtjen e udhëtimeve të preferuara për përdoruesin e kyçur. Ylli dhe numri përditësohen menjëherë në pritje, ndërsa suksesi shfaqet vetëm pas përgjigjes së serverit. Në gabim pamja rikthehet. Preferimet lexohen nga Neon pas rifreskimit. Preferimi është personal dhe nuk krijon rezervim. API merr identitetin nga sesioni i NextAuth; kufizimi unik në databazë garanton një preferim për çiftin përdorues–udhëtim.

## Provat që bëra

### Prova 1: Ruajtja e suksesshme mbetet pas rifreskimit.

**Hapat:** migrimi u aplikua në Neon. Në Chromium headless hapa aplikacionin me profil prove të përkohshëm, klikova ruajtjen dhe rifreskova faqen. **Vëzhgimi:** u shfaq pritja dhe suksesi; pas rifreskimit udhëtimi mbeti “I ruajtur” dhe numri `1`. Rreshti dhe profili provues u fshinë pas testimit. Prova përdori sesion prove lokal, jo hyrjen personale të GitHub-it.

### Prova 2: Gabimi i serverit nuk lë një sukses të rremë në ekran.

**Hapat:** në Chromium nisa ruajtjen e një udhëtimi të dytë dhe simulova përgjigje `503` nga API. **Vëzhgimi:** ylli dhe numri ndryshuan gjatë pritjes; pas gabimit numri u rikthye nga `2` në `1`, butoni u kthye te “Ruaj udhëtimin” dhe mund të provohej përsëri. Udhëtimi i dytë nuk u ruajt në databazë. API gjithashtu refuzoi kërkesën pa sesion (`401`) dhe udhëtimin që mungon (`404`).

### Prova 3: Klikimet e përsëritura nuk krijojnë kopje.

**Hapat:** në shfletues klikova sërish gjatë pritjes; butoni u çaktivizua. Pastaj dërgova kërkesa të përsëritura në API dhe kontrollova databazën. **Vëzhgimi:** klikimet e shpejta nisën vetëm një kërkesë; kërkesa e përsëritur në API ishte idempotente dhe databaza mbajti një rresht. Profili provues u fshi pas testit. Kufizimi unik është çelësi primar i tabelës.

## Ku gjendet puna

- `aplikacioni/src/components/ListaUdhetimeve.tsx` — pamja optimiste, pritja, gabimi dhe rikthimi.
- `aplikacioni/src/app/api/udhetimet/[id]/preferuar/route.ts` — ruajtja e autentikuar dhe idempotente.
- `aplikacioni/src/app/page.tsx` — leximi fillestar i preferimeve nga serveri.
- `aplikacioni/schema-java09.sql` — migrimi SQL.
- `java-09.md` — ky raport pranë README-së.

`aplikacioni/schema-java09.sql` u aplikua në Neon pasi tabela ekzistuese `profilet` dhe `udhetimet` u verifikuan. Aplikacioni nuk është publikuar, prandaj nuk ka link demonstrimi.

## Çfarë mbetet për përmirësim

Provat u kryen lokalisht me profil dhe të dhëna prove. Hyrja me llogarinë personale të GitHub-it dhe demonstrimi në pajisjen tënde mbeten verifikime shtesë para dorëzimit. Heqja e preferimit është zgjerim opsional dhe nuk është zbatuar.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)

AI ndihmoi në implementimin, shqyrtimin e kërkesave dhe plotësimin e këtij raporti. Verifikimet e kryera: `npm run build`, `npm run lint`, testet API/Neon, prova në Chromium e ruajtjes dhe rifreskimit, klikimeve të përsëritura dhe rikthimit pas `503`. Hyrja me llogarinë personale të GitHub-it dhe demonstrimi në pajisjen e studentit nuk u kryen.
