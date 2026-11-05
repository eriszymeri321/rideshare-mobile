# RideShare · Java 8 · Vendtakimi dhe vendndodhja live

## Çfarë u ndërtua

- `aplikacioni/src/components/PikaNisjes.tsx` mbetet demonstrimi lokal i ushtrimit dhe përdoret te `/java-08-test`.
- `aplikacioni/src/components/NdjekjaVendndodhjes.tsx` është rrjedha e ndarjes reale: kërkesë udhëtari, pranim/refuzim nga shoferi, nisje/ndalim i ndarjes dhe hartë orientuese me pikat e fundit.
- `aplikacioni/src/app/udhetimi/[id]/page.tsx` shfaq ndjekjen live te detajet e udhëtimit.
- `aplikacioni/src/app/api/udhetimet/[id]/ndjekja/route.ts` kontrollon sesionin, pronësinë e udhëtimit dhe kërkesën e pranuar para se të ruajë ose kthejë koordinata.
- `aplikacioni/src/app/panel/page.tsx` dhe `actions.ts` lejojnë përdoruesin të caktojë rolin shofer/udhëtar. Shoferi lidh profilin me udhëtimin e lirë nga faqja e detajeve.
- `aplikacioni/schema-java08.sql` shton tabelat për kërkesat dhe vendndodhjet; u ekzekutua në databazën e konfiguruar. Për një databazë të re, ekzekuto fillimisht `schema-java05.sql` e pastaj `schema-java08.sql`.
- `mobile-week08.json` përshkruan testet e faqes demonstrative.

## Si përdoret

1. Hyr me GitHub te `/panel` dhe zgjidh rolin. Shoferi hap një udhëtim pa pronar dhe shtyp “Lidhe këtë udhëtim me profilin tim”.
2. Udhëtari hap të njëjtin udhëtim dhe kërkon vend. Shoferi pranon kërkesën te detajet.
3. Pas pranimit, secili person shtyp “Ndaj vendndodhjen time live” dhe jep leje. Harta orientuese dhe koordinatat përditësohen afërsisht çdo 8 sekonda.
4. Secili mund ta ndalë ndarjen. Pika hiqet menjëherë kur ndalet; nëse faqja mbyllet ose lidhja humbet, pika e fundit skadon pas dy minutash.

Vendndodhja lexohet vetëm pas klikimit. API-ja lejon leximin vetëm për shoferin e lidhur dhe udhëtarët që shoferi i ka pranuar. Pozicionet ruhen në Neon; kjo skemë nuk ka pastrim automatik të rreshtave të vjetër. Harta bazë e OpenStreetMap dhe pikat GPS ngarkohen në hartë vetëm pasi përdoruesi shtyp butonin përkatës; atëherë OpenStreetMap merr zonën e përafërt të këtyre pikave. Lidhja për secilën pikë hap koordinatat e saj në OpenStreetMap.

## Provat dhe kufizimet

`npm run lint`, `npm run build` dhe `git diff --check` kaluan. Migrimi i databazës u aplikua. Këto kontrolle nuk provojnë lejen reale të shfletuesit ose dy llogari në të njëjtin udhëtim.

Ende duhen kryer: ekzekutimi i migrimit në Neon; prova me dy llogari GitHub dhe dy pajisje/shfletues; pranimi/refuzimi i kërkesës; nisja/ndalja e ndarjes; prova e humbjes së rrjetit dhe skadimit. Mos i shëno si të kaluara pa i provuar. Prova me koleg dhe Issue-i/GitHub Actions nuk janë bërë.

AI ndihmoi në projektimin dhe shkrimin e rrjedhës së ndarjes, API-së dhe migrimit. Kërkohet kontroll manual i sigurisë së rrjedhës me llogaritë reale para përdorimit me vendndodhje personale.
