# RideShare — Java 4: Neon dhe PostgreSQL

## Qëllimi

Aplikacioni lexon udhëtimet në anën e serverit nga PostgreSQL përmes Neon. `DATABASE_URL` përdoret vetëm në server dhe nuk ekspozohet në shfletues.

## Çfarë u përgatit në repository

- U shtua `aplikacioni/schema.sql` me tabelën `udhetimet` dhe tri udhëtime fiktive.
- U shtua `aplikacioni/src/lib/db.ts` për lidhjen server-side me Neon.
- `aplikacioni/src/lib/udhetimet.ts` tani ka funksione asinkrone për listën dhe udhëtimin sipas ID-së.
- Faqja kryesore, detajet dhe kërkesa lexojnë nga databaza; faqet japin mesazh kur mungon lidhja.
- `aplikacioni/.gitignore` përjashton skedarët `.env*`.

## Konfigurimi

- U krijua projekti Neon `rideshare-java4` në Frankfurt dhe u ekzekutua `schema.sql` në degën `production`, databaza `neondb`.
- `DATABASE_URL` u vendos lokalisht në `aplikacioni/.env.local` (skedari përjashtohet nga Git) dhe si variabël e lidhur me projektin Vercel.
- Kodi u dërgua në GitHub me commit `63302fa`; deployment-i i Production u shfaq `Ready`.

## Provat

`npm run lint` dhe `npm run build` përfunduan me sukses.

### Prova 1 — Lista nga Neon dhe ndryshimi i të dhënave

Ekzekutova `schema.sql` në Neon dhe konfirmova tri rreshta. Nisa aplikacionin lokal me `npm run dev`; lista shfaqi tri udhëtimet. Ndryshova orën e udhëtimit 2 në `08:25` në SQL Editor, rifreskova faqen dhe pashë orën e re; pastaj e ktheva në `08:15`.

### Prova 2 — Udhëtim pa vende dhe ID që mungon

Në listë, udhëtimi 3 (Lipjan) shfaqi `0` vende dhe butoni për kërkesë ishte i çaktivizuar. Hapa `/udhetimi/99` dhe pashë mesazhin “Udhëtimi nuk u gjet”.

### Prova 3 — Gabimi kur mungon lidhja me databazën

Riemërtova përkohësisht `DATABASE_URL` në `.env.local`, ndalova dhe rinisa serverin lokal. Faqja shfaqi “Nuk u lidhëm me databazën. Provo përsëri.” Pastaj riktheva emrin `DATABASE_URL`, rinisa serverin dhe rifreskova faqen; tri udhëtimet u shfaqën përsëri. Skedari `.env.local` nuk u publikua.

## Prova në çift dhe rezultatet

- Kolegu/rolet: **nuk u zhvillua në këtë sesion**.
- Rezultati në ekran 375 px: **për t'u plotësuar pas provës reale**.
- Vërejtjet dhe përmirësimet nga prova: **për t'u plotësuar pas provës reale**.

## Dorëzimi

Pas instalimit të paketave dhe provave: kontrollo ndryshimet në GitHub Desktop, bëj commit `Java 4 - RideShare me Neon`, pastaj Push origin. Dorëzo linkun kryesor të repository-t në formularin e kursit dhe lexo rezultatin e kontrollit automatik.
