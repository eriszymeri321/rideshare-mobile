# RideShare — Java 2

## 1. Problemi
Studentët që nuk kanë makinë e kanë të vështirë të gjejnë transport të përbashkët për në AAB. RideShare i ndihmon të shohin udhëtimet e ofruara dhe të kërkojnë një vend.

## 2. Përdoruesit
- **Arta, pasagjere:** dëshiron të gjejë një udhëtim për në AAB, të shohë orarin, nisjen dhe vendet e lira, pastaj të kërkojë një vend.
- **Dreni, shofer:** publikon udhëtimin dhe numrin e vendeve. Ai e pranon ose e refuzon kërkesën; kërkesa nuk konfirmohet vetvetiu.

## 3. Veçoritë e para
1. Lista tregon pikën e nisjes, destinacionin, orën dhe vendet e lira.
2. Detajet tregojnë informacionin e udhëtimit dhe një buton për të kërkuar vend.
3. Pas kërkesës shfaqet statusi **“Në pritje”**; konfirmimi bëhet vetëm pasi shoferi ta pranojë.

## 4. Jashtë versionit të parë
Pagesat, harta live, bisedat, vlerësimet dhe gjurmimi GPS lihen për më vonë. Për ushtrimin përdorim të dhëna shembull, jo udhëtime reale.

## 5. Provat e planifikuara
- **Kërkesë normale:** Arta hap një udhëtim me vende të lira, sheh detajet dhe kërkon një vend. Rezultati i pritur: shfaqet “Në pritje”.
- **Pa vende të lira:** Arta hap një udhëtim me zero vende. Rezultati i pritur: nuk mund të kërkojë vend dhe sheh qartë “Nuk ka vende të lira”.

## 6. Skica dhe rrjedha
Skica shoqëruese paraqet tri ekranet: Lista → Detajet → Kërkesa në pritje. Në listë shihen nisja, koha dhe vendet; te detajet shihen informacionet para kërkesës.

## 7. Prova në çift dhe përmirësimi
**Plotësoje pas provës reale me kolegun:**
- Ku u ngatërrua kolegu: [shëno çfarë vëzhgove]
- Ndryshimi që bëra në skicë: [shëno ndryshimin real]

## 8. Ndihma nga AI
AI më ndihmoi të organizoj draftin e problemit, përdoruesve, veçorive dhe provave. E kontrollova tekstin dhe do ta përshtas me vëzhgimin tim nga prova në çift. Skicën dhe testimin duhet t’i kontrolloj vetë.
