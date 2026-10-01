# RideShare — Java 3

## Çfarë ndërtova
Ndërtova listën me tri udhëtime fiktive, kartën e ripërdorshme, faqen e detajeve, kërkesën demonstrative, mesazhin për udhëtimin që nuk u gjet dhe stilet bazë për telefon.

## Provat që bëra
### Prova 1: Lista në telefon
Kontrollova faqen kryesore lokale: u përgjigj me kodin 200 dhe përmbante saktësisht tri karta; CSS e shfaq listën në një kolonë si parazgjedhje. Nuk e provova pamjen në Chrome/Edge ose në telefon fizik.

### Prova 2: Detajet e udhëtimit të dytë
Hapa `/udhetimi/2`; faqja u përgjigj me kodin 200 dhe shfaqi vendtakimin “Te stacioni kryesor”. Te `/udhetimi/3` u shfaq “Nuk ka vende të lira”, ndërsa `/udhetimi/99` u përgjigj me kodin 404 dhe mesazhin “Udhëtimi nuk u gjet”.

### Prova 3: Kërkesa në pritje
Hapa `/udhetimi/2/kerkesa`; faqja u përgjigj me kodin 200 dhe shfaqi “Simulim: Në pritje”. Lidhja e kthimit te detajet është në faqe; nga detajet ka lidhje për t’u kthyer te lista. Nuk dërgohet rezervim real.

## Çfarë do të përmirësoj
Do ta provoj pamjen dhe prekjen e lidhjeve në emulimin e telefonit me një koleg, sepse këtu verifikova përgjigjet lokale të faqeve, jo ndërveprimin në pajisje.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)
AI më ndihmoi t’i vendos skedarët sipas shembullit të ushtrimit; kontrollova vetë ndërtimin dhe përgjigjet e faqeve lokale me ESLint, Next.js build dhe kërkesa HTTP.
