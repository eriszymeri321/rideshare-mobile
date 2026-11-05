# RideShare

## Java 8 · ndarja e vendndodhjes live

1. Migrimi `aplikacioni/schema-java08.sql` është aplikuar në databazën e konfiguruar. Në një databazë të re ekzekuto `schema-java05.sql` dhe pastaj `schema-java08.sql` nga Neon SQL Editor.
2. Plotëso `aplikacioni/.env.local` me lidhjen e Neon dhe kredencialet OAuth të GitHub (`DATABASE_URL`, `GITHUB_ID`, `GITHUB_SECRET`, `NEXTAUTH_SECRET`). Mos publiko këtë skedar.
3. Nga `aplikacioni/` ekzekuto `npm install` dhe `npm run dev`.
4. Hyr me dy llogari GitHub: cakto njërën si shofer dhe lidhe me një udhëtim të lirë; tjetra caktohet udhëtare, kërkon vend dhe pret pranimin.
5. Pasi shoferi ta pranojë, të dy shtypin “Ndaj vendndodhjen time live”. Vendndodhja kërkon HTTPS ose `localhost` dhe leje nga shfletuesi.

Vendndodhja nuk merret pa veprim të qartë. Ajo ndahet vetëm mes shoferit të lidhur dhe udhëtarëve të pranuar. Secili mund ta ndalë nga faqja e udhëtimit.
