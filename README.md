# RideShare

## Java 8 · ndarja e vendndodhjes live

1. Migrimi `aplikacioni/schema-java08.sql` është aplikuar në databazën e konfiguruar. Në një databazë të re ekzekuto `schema-java05.sql` dhe pastaj `schema-java08.sql` nga Neon SQL Editor.
2. Plotëso `aplikacioni/.env.local` me lidhjen e Neon dhe kredencialet OAuth të GitHub (`DATABASE_URL`, `GITHUB_ID`, `GITHUB_SECRET`, `NEXTAUTH_SECRET`). Mos publiko këtë skedar.
3. Nga `aplikacioni/` ekzekuto `npm install` dhe `npm run dev`.
4. Hyr me dy llogari GitHub: cakto njërën si shofer dhe lidhe me një udhëtim të lirë; tjetra caktohet udhëtare, kërkon vend dhe pret pranimin.
5. Pasi shoferi ta pranojë, të dy shtypin “Ndaj vendndodhjen time live”. Vendndodhja kërkon HTTPS ose `localhost` dhe leje nga shfletuesi.

Vendndodhja nuk merret pa veprim të qartë. Ajo ndahet vetëm mes shoferit të lidhur dhe udhëtarëve të pranuar. Secili mund ta ndalë nga faqja e udhëtimit.

## Konfigurimi për Vercel

Në Vercel → Project Settings → Environment Variables shto për **Production**:

- `DATABASE_URL` — connection string i Neon-it.
- `GITHUB_ID` dhe `GITHUB_SECRET` — kredencialet e GitHub App.
- `NEXTAUTH_SECRET` — sekret për sesionet e NextAuth.
- `NEXTAUTH_URL` — `https://rideshare-mobile-one.vercel.app`.

Mbaji vlerat sekrete si **Secret**. Pas ndryshimit bëj redeploy. Te GitHub → Settings → Developer settings → GitHub Apps → aplikacioni yt, shto callback URL `https://rideshare-mobile-one.vercel.app/api/auth/callback/github` dhe ruaje callback-un `http://localhost:3000/api/auth/callback/github` për zhvillimin lokal. GitHub App mund të ketë disa callback URL; NextAuth zgjedh atë që përputhet me `NEXTAUTH_URL`. Për t’u lejuar edhe përdoruesve të tjerë ta autorizojnë GitHub App, vendose app-in **Public / Any account**. Shih [GitHub callback URL](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/about-the-user-authorization-callback-url) dhe [ndryshimin e visibility](https://docs.github.com/en/apps/maintaining-github-apps/modifying-a-github-app-registration).
