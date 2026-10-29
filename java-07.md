# RideShare — Java 7: provo, korrigjo dhe shpjego

## Rasti im dhe parashikimi

- **Rasti:** Rasti 3 · Klikim apo rezervim.
- **Kodi personal P7:** Nuk ishte në materialin e dërguar; duhet marrë nga gjeneratori i ushtrimit.
- **Parashikimi:** Kur Arta hap një udhëtim me vende të lira dhe zgjedh “Kërko vend”, ekrani duhet ta bëjë të qartë nëse bëhet rezervim real. Për këtë projekt pres që kërkesa të jetë vetëm demonstrim dhe të mos pretendojë se i është dërguar shoferit. Në listë dhe te detajet pres të njëjtat të dhëna për të njëjtin ID.

## Dy probleme ose paqartësi të vërejtura

1. Te faqja e kërkesës, titulli “Simulim: Në pritje” mund të kuptohej si kërkesë e dërguar dhe në pritje të përgjigjes. Teksti poshtë tij thoshte se kërkesa nuk i dërgohet shoferit.
2. Te detajet, veprimi “Kërko vend” mund të tingëllojë si rezervim i vërtetë. Ai hap një faqe demonstrative dhe nuk dërgon kërkesë te shoferi.

## Korrigjimi

- **Skedari:** `aplikacioni/src/app/udhetimi/[id]/kerkesa/page.tsx`
- **Çfarë bën skedari:** Lexon udhëtimin sipas ID-së dhe shfaq faqen demonstrative të kërkesës. Kur nuk ka vende, shfaq “Nuk ka vende të lira.”
- **Ndryshimi:** Ndryshova titullin “Simulim: Në pritje” në “Kërkesë demonstrative”. Teksti tani nuk lë të kuptohet se kërkesa është dërguar ose pret konfirmim. Paqartësia te etiketa “Kërko vend” mbeti si problem i dytë i raportuar.

## Tri prova

### Prova 1 · Rrjedha e ID 2

- **Hapat:** Hapa listën `/`, ndoqa lidhjen për ID 2 te `/udhetimi/2` dhe pastaj hapa faqen `/udhetimi/2/kerkesa`.
- **Pritshmëria:** Lista dhe detajet tregojnë të njëjtin udhëtim. Faqja pas “Kërko vend” sqaron se veprimi është demonstrim dhe nuk dërgohet te shoferi.
- **Vëzhgimi:** Lista dhe detajet treguan Fushë Kosovë → AAB, ora 08:15 dhe 1 vend të lirë. Faqja e kërkesës shfaqi titullin “Kërkesë demonstrative”, tekstin se kërkesa nuk është dërguar te shoferi dhe se ruajtja/konfirmimi real shtohet më vonë. Prova kaloi.

### Prova 2 · Korrigjimi i tekstit

- **Hapat:** Hapa përsëri `/udhetimi/2/kerkesa` pas ndryshimit dhe kontrollova titullin bashkë me shpjegimin poshtë tij.
- **Pritshmëria:** Titulli nuk duhet të nënkuptojë një rezervim në pritje; shpjegimi duhet të thotë qartë se nuk ka dërgim real.
- **Vëzhgimi:** U shfaq “Kërkesë demonstrative”; faqja thotë se kërkesa nuk i është dërguar shoferit. Prova kaloi.

### Prova 3 · Hyrje tjetër, pa vende

- **Hapat:** Ndryshova ID-në nga 2 në 3 dhe hapa `/udhetimi/3/kerkesa`.
- **Pritshmëria:** Për një udhëtim me 0 vende, aplikacioni nuk duhet të premtojë rezervim dhe duhet të tregojë se nuk ka vende.
- **Vëzhgimi:** ID 3 ishte Lipjan → AAB me 0 vende; faqja shfaqi “Nuk ka vende të lira.” Prova kaloi.

## Ndihma nga AI dhe demonstrimi

AI ndihmoi në shqyrtimin e kodit, identifikimin e paqartësisë në titull dhe propozimin e formulimit të ri. Ndryshimin e bëra në projekt dhe i kontrollova faqet në serverin lokal. Nuk u bë demonstrim me koleg ose profesor gjatë këtij punimi.

## Commit-et

- **Para:** [5f1c46d](https://github.com/eriszymeri321/rideshare-mobile/commit/5f1c46d)
- **Pas:** [3879328](https://github.com/eriszymeri321/rideshare-mobile/commit/3879328)

## Dorëzimi në repository-n e lëndës

Issue për Javën 7 nuk u hap, sepse lidhja e formularit/repository-t të lëndës nuk ishte në materialin e dërguar. Kodi personal P7 gjithashtu duhet marrë nga gjeneratori me llogarinë e GitHub-it para dorëzimit.
