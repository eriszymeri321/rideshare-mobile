# RideShare — Java 7: provo, korrigjo dhe shpjego

## Rasti im

Rasti im (P7-637, GitHub: eriszymeri321)

- Kodi personal: P7-637
- GitHub: eriszymeri321
- Rasti i zgjedhur: Rasti 3 · Klikim apo rezervim

## Parashikimi

Kur Arta hap një udhëtim me vende të lira dhe zgjedh “Kërko vend”, ekrani duhet ta bëjë të qartë nëse bëhet rezervim real. Pres që kërkesa të jetë vetëm demonstrim dhe të mos pretendojë se i është dërguar shoferit. Në listë dhe te detajet pres të njëjtat të dhëna për të njëjtin ID.

## Dy probleme

1. Te faqja e kërkesës, titulli “Simulim: Në pritje” mund të kuptohej si kërkesë e dërguar dhe në pritje të përgjigjes. Teksti poshtë tij thoshte se kërkesa nuk i dërgohet shoferit.
2. Te detajet, veprimi “Kërko vend” mund të tingëllojë si rezervim i vërtetë. Ai hap një faqe demonstrative dhe nuk dërgon kërkesë te shoferi.

## Ndryshimi i ri

Ndryshova titullin e faqes së kërkesës nga “Simulim: Në pritje” në “Kërkesë demonstrative”. Kjo e bën të qartë se faqja paraqet vetëm demonstrim. Paqartësia te etiketa “Kërko vend” mbeti si problemi i dytë i raportuar.

## Korrigjimi

- Skedari: aplikacioni/src/app/udhetimi/[id]/kerkesa/page.tsx

- Arsyeja: titulli “Simulim: Në pritje” mund të nënkuptohej si kërkesë e dërguar që pret përgjigje, ndërsa projekti nuk dërgon rezervim real. E ndryshova në “Kërkesë demonstrative” që të mos premtohet dërgim ose konfirmim.

Korrigjimi (arsyeja): titullin e ndryshova që përdoruesi ta kuptojë se bëhet fjalë për demonstrim, jo për rezervim në pritje.

Skedari lexon udhëtimin sipas ID-së dhe shfaq faqen demonstrative të kërkesës. Kur nuk ka vende, faqja tregon se nuk ka vende të lira.

## Ndihma nga AI

AI ndihmoi në shqyrtimin e kodit, identifikimin e paqartësisë në titull dhe propozimin e formulimit të ri. Ndryshimin e bëra në projekt dhe i kontrollova faqet në serverin lokal. Nuk u bë demonstrim me koleg ose profesor gjatë këtij punimi.

## Prova 1 (Hapat, Pritshmëria, Vëzhgimi)

- **Hapat:** Hapa listën `/`, ndoqa lidhjen për ID 2 te `/udhetimi/2` dhe pastaj hapa `/udhetimi/2/kerkesa`.
- **Pritshmëria:** Lista dhe detajet tregojnë të njëjtin udhëtim. Faqja pas “Kërko vend” sqaron se veprimi është demonstrim dhe nuk dërgohet te shoferi.
- **Vëzhgimi:** Lista dhe detajet treguan Fushë Kosovë → AAB, ora 08:15 dhe 1 vend të lirë. Faqja shfaqi titullin “Kërkesë demonstrative”, sqaroi se kërkesa nuk është dërguar te shoferi dhe se ruajtja/konfirmimi real shtohet më vonë. Prova kaloi.

## Prova 2 (Hapat, Pritshmëria, Vëzhgimi)

- **Hapat:** Hapa përsëri `/udhetimi/2/kerkesa` pas ndryshimit dhe kontrollova titullin bashkë me shpjegimin poshtë tij.
- **Pritshmëria:** Titulli nuk duhet të nënkuptojë një rezervim në pritje; shpjegimi duhet të thotë qartë se nuk ka dërgim real.
- **Vëzhgimi:** U shfaq “Kërkesë demonstrative”; faqja thotë se kërkesa nuk i është dërguar shoferit. Prova kaloi.

## Prova 3 (Hapat, Pritshmëria, Vëzhgimi)

- **Hapat:** Ndryshova ID-në nga 2 në 3 dhe hapa `/udhetimi/3/kerkesa`.
- **Pritshmëria:** Për një udhëtim me 0 vende, aplikacioni nuk duhet të premtojë rezervim dhe duhet të tregojë se nuk ka vende.
- **Vëzhgimi:** ID 3 ishte Lipjan → AAB me 0 vende; faqja shfaqi “Nuk ka vende të lira.” Prova kaloi.

## Commit-et

- Para: https://github.com/eriszymeri321/rideshare-mobile/commit/5f1c46d
- Pas: https://github.com/eriszymeri321/rideshare-mobile/commit/3879328
