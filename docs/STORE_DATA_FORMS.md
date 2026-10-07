# Podklad pro formuláře o datech v obchodech

> **Google Play → App content → Data safety** a **App Store Connect → App
> Privacy**. Sepsáno 2026-10-07 z kódu, ne z představy. U každého řádku je
> soubor, odkud to plyne. Až se změní, co aplikace ukládá nebo kam co
> posílá, je potřeba změnit i tenhle dokument, `src/content/legal.ts`
> (`PRIJEMCI`) a `src/pages/Privacy.tsx`. Zásady i formuláře musí říkat totéž,
> protože obchody to porovnávají.
>
> **Není to právní posudek.** Řádky označené ⚖️ musí rozhodnout Evžen
> s právníkem. Ostatní jsou technický fakt.

---

## 1. Co aplikace NEsbírá (rychlá odpověď na většinu otázek)

Ověřeno v `package.json`, `index.html`, `src/**` a `android/` / `ios/`:

- **Žádná analytika, crash reporting ani reklamy.** Nejsou tam Sentry,
  PostHog, GA, Firebase, Plausible ani reklamní SDK. Písmo je hostované
  u nás (`src/assets/fonts/`, hlídá `self-hosted-fonts.test.ts`).
- **Žádná oprávnění zařízení kromě internetu.**
  `android/app/src/main/AndroidManifest.xml` má jen `INTERNET`.
  `ios/App/App/Info.plist` nemá žádný `*UsageDescription`, takže aplikace
  nepoužívá kameru, mikrofon, fotky, polohu ani kontakty. Web je navíc
  blokuje hlavičkou `Permissions-Policy` (`vercel.json`).
- **Žádné reklamní ani zařízení identifikátory** (AAID/IDFA, Android ID).
- **Žádné nákupy v aplikaci.** Sloupce `subscriptions.stripe_*` v databázi
  jsou, ale klient na ně nemá kód.
- **Žádné push notifikace** (chybí `google-services.json`, Capacitor nemá
  plugin pro push).
- **Telefonní číslo se nesbírá.** U pozvánky přes WhatsApp se číslo vloží
  do odkazu `wa.me` přímo v zařízení (`InviteParentDialog.tsx`) a k nám
  nedorazí.
- **Žádné sledování napříč aplikacemi** → Apple „Data Used to Track You“:
  **No**.

## 2. Co se sbírá — tabulka pro oba formuláře

„Sbírá se“ = odchází ze zařízení na náš server (Supabase). Google i Apple
to tak počítají, i když je to vlastní backend.

| Údaj | Čí | Kde v kódu | Google Play | Apple | Povinné? | Účel |
|---|---|---|---|---|---|---|
| E-mail rodiče | rodič | `Auth.tsx` (`signUp`) | Personal info → **Email address** | Contact Info → **Email Address** | ano (účet) | Account management, App functionality |
| E-mail rodiče zadaný dítětem v pozvánce | rodič | `send-parent-invite` → `parent_invitations.email` | Personal info → Email address | Contact Info → Email Address | ne (jen když dítě pozve rodiče) | App functionality (odeslání pozvánky) |
| Jméno dítěte | dítě | `useChildren.addChild` → `children.child_name`; také `user_metadata` účtu dítěte (`pair-child`) | Personal info → **Name** | Contact Info → **Name** | ano (rodič ho zadá při přidání dítěte; stačí přezdívka ⚖️) | App functionality |
| Zobrazované jméno rodiče | rodič | `useProfile` → `profiles.display_name` | Personal info → Name | Contact Info → Name | ne | App functionality |
| ID účtu (UUID ze Supabase Auth) | oba | `supabase.auth` | Personal info → **User IDs** | Identifiers → **User ID** | ano | App functionality, Account management |
| Anonymní token zkušebního režimu (náhodné UUID) | dítě bez účtu | `anonServerSync.ts` → `anon_trial`, `anon_progress` | Personal info → User IDs | Identifiers → User ID | ano v anonymním režimu | App functionality |
| Výsledky procvičování: téma, úroveň, správně/špatně, čas odpovědi, použitá nápověda, kód chyby | dítě | `performanceTracker.ts` → `session_logs`, `skill_profiles`; `skillLevel.ts` → `student_skill_level` | App activity → **App interactions** | Usage Data → **Product Interaction** | ano (bez toho aplikace nefunguje) | App functionality, Personalization (volba úrovně) |
| Text odpovědi dítěte a znění úlohy | dítě | `session_logs.student_answer`, `question_text` | App activity → **Other user-generated content** | User Content → **Other User Content** | ano | App functionality (rodič vidí, kde dítě chybovalo) |
| Poznámky rodiče o dítěti, poznámka k zadanému úkolu | rodič | `children.learning_notes`, `parent_assignments.note` | App activity → Other user-generated content | User Content → Other User Content | ne | App functionality |
| PIN dítěte | dítě | jen hash PBKDF2 (`set-child-pin`, `_shared/pin.ts`) | ⚖️ asi nedeklarovat: je to přihlašovací údaj, uložený jen jako hash | — | ne | Account management, Security |
| Hash IP adresy při párování | kdokoli | `pair-child` → `pairing_attempts` (solený SHA-256, ne IP) | ⚖️ viz §4 | ⚖️ viz §4 | ano | Fraud prevention, Security |

**Propojení s uživatelem (Apple „Linked to You“): ano** u všech řádků. Data
visí na účtu rodiče nebo dítěte. U anonymního režimu visí na tokenu
z prohlížeče, ne na osobě, ale i tak to radši deklarovat jako propojené.

**Ephemeral (Google „processed ephemerally“): ne.** Všechno se ukládá.

## 3. Komu data odcházejí (Google „Data sharing“)

Google za „sdílení“ **nepovažuje** předání zpracovateli, který data
zpracovává naším jménem. Podle toho jsou všechny příjemci níž zpracovatelé
a sekce „Data shared“ může zůstat **prázdná** ⚖️. Musí k tomu ale existovat
zpracovatelské smlouvy (to tvrdí i zásady, viz `SESSION_HANDOFF.md` §2 bod 5).

| Příjemce | Co dostane | Kde v kódu |
|---|---|---|
| Supabase (EU) | všechno z tabulky výš | celý backend |
| Vercel | IP adresa a údaje prohlížeče při načtení webu | hosting |
| Groq nebo Google (jazykový model) | ID tématu, počet pokusů a chyb, kódy chyb (`wrong_string`, `numeric_off`…). **Ne jméno, ne text odpovědí.** | `analyze-misconceptions/index.ts` |
| Resend | e-mail rodiče, jméno a ročník dítěte (text pozvánky) | `send-parent-invite/index.ts` |

WhatsApp mezi příjemci **není**. Zprávu odesílá uživatel sám ze své
aplikace, naše aplikace WhatsAppu nic nepředává.

## 4. Otevřené otázky ⚖️

1. **Hash IP při párování.** Ukládá se jen solený hash kvůli omezení
   pokusů, ne IP samotná. Google bere IP jako údaj hlavně tehdy, když se
   z ní odvozuje poloha, což se tu neděje. Rozhodnout, jestli deklarovat
   „Device or other IDs“ s účelem Fraud prevention. Opatrnější volba je
   deklarovat.
2. **Logy hostingu (Vercel, Supabase)** obsahují IP a user-agent. Obchody to
   většinou za sběr aplikace nepovažují, ale zásady to zmiňují (Vercel).
   Formulář s tím má souhlasit.
3. **Jméno dítěte je povinné.** Formulář nabízí „required / optional“.
   Technicky je povinné (`children.child_name NOT NULL`), ale může to být
   přezdívka. Jestli to v aplikaci rodiči říct, je produktové rozhodnutí.
4. **Kategorie pro děti.** Google Play: cílová skupina zahrnuje děti →
   platí Families Policy. Ta je splněná tím, že aplikace nemá reklamní ani
   analytické SDK. Apple: Kids Category vs. smíšené publikum je pořád
   otevřené (`SESSION_HANDOFF.md` §2 bod 8).

## 5. Bezpečnost a mazání (obě formuláře se ptají)

- **Šifrování při přenosu: ano.** Všechny hosty jsou `https://`, Android
  servíruje aplikaci jako `https://localhost` (`capacitor.config.ts`), web
  má HSTS (`vercel.json`).
- **Smazání účtu přímo v aplikaci: ano.** Rodič → Smazat účet
  (`DeleteAccountDialog.tsx` → edge funkce `delete-account`). Smaže účet
  rodiče, účty dětí i všechna jejich data.
- **Webový odkaz na mazání (Google ho vyžaduje):** `https://<doména>/smazani-uctu`
  (`DeleteAccountInfo`). Doménu doplnit po přechodu na `.cz`.
- **Smazání jednoho dítěte:** od 7. 10. přes edge funkci `delete-child`.
  **Funguje až po jejím nasazení** (`supabase functions deploy delete-child`).
  Do té doby se smaže jen řádek dítěte a jeho přihlašovací účet zůstává,
  viz `PENDING_CHANGES.md`.
- **Anonymní data** se mažou sama po 44 dnech (cron `anon-cleanup-44d`).
- **Export dat** (právo na přenositelnost) v aplikaci **není**. Vyřizuje
  se e-mailem podle zásad.

## 6. Technické drobnosti, které s formuláři souvisí

- **`android:allowBackup="true"`** (`AndroidManifest.xml`). Automatická
  záloha Androidu může do Google Drive uložit i data WebView, tedy
  `localStorage` s přihlašovacím tokenem a zapamatovaným dítětem
  (`oli_remembered_child`). U dětské aplikace stojí za zvážení `false`, nebo
  pravidla zálohy, která WebView vynechají. Je to rozhodnutí, ne oprava:
  vypnutí znamená, že se po obnově telefonu dítě musí znovu spárovat.
- **iOS privacy manifest** (`PrivacyInfo.xcprivacy`) v aplikaci chybí.
  Capacitor 8 nese vlastní manifest pro svůj kód. Jestli aplikace sama
  nepoužívá „required reason API“, ověří až první build v Xcode a kontrola
  při nahrání.
