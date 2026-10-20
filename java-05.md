# Java 5 · Hyrja dhe kontrolli i lejeve

Repository: https://github.com/eriszymeri321/rideshare-mobile

## Prova 1 · Sesioni

Hapat: Hapa aplikacionin lokal, shtypa hyrjen me GitHub dhe u ktheva te `/panel`, ku u shfaqën përdoruesi dhe roli. Shtypa **Dil**, hyra përsëri me GitHub dhe rifreskova faqen me `⌘R` dhe te dhenat mbeten prap tmiat edhe pas rifreskimit .

Rezultati: Pas hyrjes dhe përsëri pas rifreskimit, paneli shfaqi përdoruesin `eriszymeri321`, ID-në GitHub `246877188` dhe rolin `shofer`. Pas klikimit **Dil**, u ktheva te paneli dhe u shfaq butoni **Hyr me GitHub**, që tregon se sesioni u mbyll.

## Prova 2 · Ndryshimi i lejuar (ID 2)

Hapat: Si përdorues me rolin `shofer`, vendosa `08:25` në formularin e panelit dhe shtypa **Ruaj orën**. Kontrollova rreshtin me ID 2 në Neon, pastaj e ktheva orën e tij në `08:15` dhe kontrollova rreshtin përsëri.

Rezultati: Aplikacioni njoftoi suksesin; Neon tregoi ID 2 me orën `08:25` pas ruajtjes dhe `08:15` pas rikthimit. ID 1 mbeti në `08:00`.

## Prova 3 · Ndryshimi i refuzuar (ID 1)

Hapat: Hapa Web Inspector → Console dhe ekzekutova `document.querySelector('input[name="id"]').value = "1"`. Ndryshova orën në `08:25`, shtypa **Ruaj orën** dhe kontrollova vlerat e udhëtimeve në Neon.

Rezultati: Paneli shfaqi “Nuk ke leje për këtë udhëtim. Ora nuk ndryshoi.” ID 1 mbeti `08:00`, ndërsa udhëtimi im me ID 2 mbeti `08:15`.

## Çështje të hasura

U krijua fillimisht GitHub OAuth App, por hyrja përfundonte në GitHub 404. U konfigurua GitHub App me callback `http://localhost:3000/api/auth/callback/github`; hyrja pastaj funksionoi. Dalja/rihyrja si provë e veçantë nuk është dokumentuar.
