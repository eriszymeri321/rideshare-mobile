# Java 5 · Hyrja dhe kontrolli i lejeve

Repository: https://github.com/eriszymeri321/rideshare-mobile

## Prova 1

Hapat: Hapa aplikacionin lokal dhe hyra me GitHub. Më pas shtypa **Dil**, hyra përsëri me GitHub dhe rifreskova faqen me `⌘R`.

Rezultati real: Hyrja funksionoi. Pas rifreskimit paneli vazhdoi të shfaqte `eriszymeri321`, ID GitHub `246877188` dhe rolin `shofer`. Pas **Dil**, paneli shfaqi butonin **Hyr me GitHub**.

## Prova 2

Hapat: Si përdorues me rolin `shofer`, vendosa `08:25` në formularin e panelit dhe shtypa **Ruaj orën**. Kontrollova ID 2 në Neon, e ktheva orën në `08:15` dhe kontrollova përsëri.

Rezultati real: Aplikacioni njoftoi suksesin. Neon tregoi ID 2 me orën `08:25` pas ruajtjes dhe `08:15` pas rikthimit; ID 1 mbeti `08:00`.

## Prova 3

Hapat: Në Web Inspector → Console ekzekutova `document.querySelector('input[name="id"]').value = "1"`. Ndryshova orën në `08:25`, shtypa **Ruaj orën** dhe kontrollova Neon.

Rezultati real: Paneli shfaqi “Nuk ke leje për këtë udhëtim. Ora nuk ndryshoi.” ID 1 mbeti `08:00`; ID 2 mbeti `08:15`.

## Çështje të hasura

U krijua fillimisht GitHub OAuth App, por hyrja përfundonte në GitHub 404. U konfigurua GitHub App me callback `http://localhost:3000/api/auth/callback/github`; hyrja pastaj funksionoi. Dalja/rihyrja si provë e veçantë nuk është dokumentuar.
