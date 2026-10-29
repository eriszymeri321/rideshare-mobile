# RideShare · Java 7

## Rasti im
GitHub: eriszymeri321
Kodi: P7-637
Skenari i zgjedhur (numri dhe titulli, nga Rastet 1–5): Rasti 3 · Klikim apo rezervim
ID i udhëtimit në projektin tim: 2
Të dhënat fiktive të rastit: Fushë Kosovë → AAB, ora 08:15, 1 vend i lirë.

## Parashikimi
Para kodimit prisja që lista dhe detajet për ID 2 të tregonin të njëjtin udhëtim. Kur Arta zgjedh “Kërko vend”, ekrani duhet ta bëjë të qartë nëse bëhet rezervim real. Pres që kërkesa të jetë demonstrim dhe të mos pretendojë se i është dërguar shoferit.

## Dy probleme
1. Te faqja e kërkesës, titulli “Simulim: Në pritje” mund të kuptohej si kërkesë e dërguar dhe në pritje të përgjigjes, megjithëse teksti poshtë thoshte se kërkesa nuk i dërgohet shoferit.
2. Te detajet, veprimi “Kërko vend” mund të tingëllojë si rezervim i vërtetë. Ai hap një faqe demonstrative dhe nuk dërgon kërkesë te shoferi.

## Korrigjimi
Skedari: aplikacioni/src/app/udhetimi/[id]/kerkesa/page.tsx
Ky skedar lexon udhëtimin sipas ID-së dhe shfaq faqen demonstrative të kërkesës. Ndryshova titullin “Simulim: Në pritje” në “Kërkesë demonstrative”, sepse titulli i vjetër mund të nënkuptohej si kërkesë e dërguar që pret përgjigje. Formulimi i ri sqaron se nuk dërgohet dhe nuk konfirmohet rezervim real. Kur nuk ka vende, faqja tregon se nuk ka vende të lira.

## Versionet
Para: https://github.com/eriszymeri321/rideshare-mobile/commit/5f1c46d35b5d79265c1370c84742fdf12cafe3c8
Pas: https://github.com/eriszymeri321/rideshare-mobile/commit/3879328d0f440b9175f2e1cbb9ca85cdbb9bd178

## Provat që bëra
### Prova 1
Hapat: Hapa listën `/`, ndoqa lidhjen për ID 2 te `/udhetimi/2` dhe pastaj hapa `/udhetimi/2/kerkesa`.
Pritshmëria: Lista dhe detajet tregojnë të njëjtin udhëtim. Faqja pas “Kërko vend” sqaron se veprimi është demonstrim dhe nuk dërgohet te shoferi.
Vëzhgimi: Lista dhe detajet treguan Fushë Kosovë → AAB, ora 08:15 dhe 1 vend të lirë. Faqja shfaqi “Kërkesë demonstrative”, sqaroi se kërkesa nuk është dërguar te shoferi dhe se ruajtja/konfirmimi real shtohet më vonë. Prova kaloi.

### Prova 2
Hapat: Hapa përsëri `/udhetimi/2/kerkesa` pas ndryshimit dhe kontrollova titullin bashkë me shpjegimin.
Pritshmëria: Titulli nuk duhet të nënkuptojë një rezervim në pritje; shpjegimi duhet të thotë se nuk ka dërgim real.
Vëzhgimi: U shfaq “Kërkesë demonstrative”; faqja thotë se kërkesa nuk i është dërguar shoferit. Prova kaloi.

### Prova 3
Hapat: Ndryshova ID-në nga 2 në 3 dhe hapa `/udhetimi/3/kerkesa`.
Pritshmëria: Për një udhëtim me 0 vende, aplikacioni nuk duhet të premtojë rezervim dhe duhet të tregojë se nuk ka vende.
Vëzhgimi: ID 3 ishte Lipjan → AAB me 0 vende; faqja shfaqi “Nuk ka vende të lira.” Prova kaloi.

## Ndryshimi i ri
Nuk e kam demonstruar ende me koleg. Në provën time ndryshova hyrjen nga ID 2 (1 vend) në ID 3 (0 vende). Parashikova se kërkesa për ID 3 nuk do të premtonte rezervim; rezultati ishte mesazhi “Nuk ka vende të lira.”

## Ndihma nga AI
AI ndihmoi në shqyrtimin e kodit, identifikimin e paqartësisë në titull dhe propozimin e formulimit të ri. Unë e ndryshova skedarin dhe kontrollova listën, detajet dhe faqen e kërkesës në serverin lokal. Nuk u bë demonstrim me koleg ose profesor gjatë këtij punimi.
