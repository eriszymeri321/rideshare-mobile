# Java 5 · Hyrja dhe kontrolli i lejeve

Repository: https://github.com/eriszymeri321/rideshare-mobile

## Prova 1 · Sesioni

Rezultati: Hyrja me GitHub funksionoi. Paneli shfaqi përdoruesin `eriszymeri321`, ID-në GitHub `246877188` dhe rolin `shofer`. Sesioni u ruajt gjatë përdorimit të panelit. Dalja dhe hyrja përsëri nuk u verifikuan veçmas.

## Prova 2 · Ndryshimi i lejuar (ID 2)

Rezultati: Me formularin e ID-së 2 u ruajt ora `08:25`; aplikacioni dha mesazhin e suksesit dhe Neon konfirmoi vlerën. Pastaj ora u rikthye në `08:15` dhe u verifikua përsëri në Neon.

## Prova 3 · Ndryshimi i refuzuar (ID 1)

Rezultati: Në DevTools ndryshova ID-në e fshehur të formularit nga 2 në 1 dhe provova të ruaj orën `08:25`. Aplikacioni shfaqi mesazhin “Nuk ke leje për këtë udhëtim. Ora nuk ndryshoi.” Ora e udhëtimit me ID 1 mbeti `08:00` në Neon; udhëtimi im me ID 2 mbeti `08:15`.

## Çështje të hasura

U krijua fillimisht GitHub OAuth App, por hyrja përfundonte në GitHub 404. U konfigurua GitHub App me callback `http://localhost:3000/api/auth/callback/github`; hyrja pastaj funksionoi. Dalja/rihyrja si provë e veçantë nuk është dokumentuar.
