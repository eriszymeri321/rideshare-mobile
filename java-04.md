# RideShare — Java 4: Neon dhe PostgreSQL

## Qëllimi

Aplikacioni lexon udhëtimet në anën e serverit nga PostgreSQL përmes Neon. `DATABASE_URL` përdoret vetëm në server dhe nuk ekspozohet në shfletues.

## Çfarë u përgatit në repository

- U shtua `aplikacioni/schema.sql` me tabelën `udhetimet` dhe tri udhëtime fiktive.
- U shtua `aplikacioni/src/lib/db.ts` për lidhjen server-side me Neon.
- `aplikacioni/src/lib/udhetimet.ts` tani ka funksione asinkrone për listën dhe udhëtimin sipas ID-së.
- Faqja kryesore, detajet dhe kërkesa lexojnë nga databaza; faqet japin mesazh kur mungon lidhja.
- `aplikacioni/.gitignore` përjashton skedarët `.env*`.

## Konfigurimi që duhet plotësuar me llogarinë time

- Databaza Neon dhe tabela: **nuk u krijuan nga ky sesion**.
- `DATABASE_URL` në `.env.local` dhe Vercel: **nuk u vendos**; duhet kopjuar lokalisht nga Neon Console. Mos e vendos këtë sekret në repository.
- Vercel deployment dhe GitHub Push: **nuk u kryen**.

## Provat

`npm run lint` dhe `npm run build` përfunduan me sukses. U krijua databaza Neon në rajonin Frankfurt, u ekzekutua skema dhe u konfirmuan tri udhëtimet. Aplikacioni lokal u lidh me Neon. Ndryshimi i orës së udhëtimit 2 u pa pas rifreskimit dhe u kthye në `08:15`. Rruga `/udhetimi/99` shfaqi “Udhëtimi nuk u gjet”. Provat me tabelë bosh dhe me `DATABASE_URL` të hequr mbeten për t'u kryer.

1. Provo listën pa rreshta dhe lidhjen pa `DATABASE_URL`; rikthe konfigurimet pas secilës provë.
2. Provo në pamjen 375 px dhe plotëso më poshtë rezultatet e vëzhguara.

## Prova në çift dhe rezultatet

- Kolegu/rolet: **nuk u zhvillua në këtë sesion**.
- Rezultati në ekran 375 px: **për t'u plotësuar pas provës reale**.
- Vërejtjet dhe përmirësimet nga prova: **për t'u plotësuar pas provës reale**.

## Dorëzimi

Pas instalimit të paketave dhe provave: kontrollo ndryshimet në GitHub Desktop, bëj commit `Java 4 - RideShare me Neon`, pastaj Push origin. Dorëzo linkun kryesor të repository-t në formularin e kursit dhe lexo rezultatin e kontrollit automatik.
