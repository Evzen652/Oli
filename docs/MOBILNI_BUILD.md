# Mobilní build (Google Play, App Store)

Webová aplikace se sestaví do `dist/` a Capacitor ji zabalí do nativního
projektu. **Žádný druhý kód** — to samé, co běží na webu, běží i v mobilu.

---

## ⚠️ Rozhodni teď, ne po vydání

`appId` v [`capacitor.config.ts`](../capacitor.config.ts) je **`com.oliedu.app`**.

Jakmile pod tímhle identifikátorem jednou vyjde aplikace v obchodě, **nedá se
změnit** — ani v Google Play, ani v App Store. Změna znamená novou aplikaci
s nulou stažení, bez recenzí a bez vazby na dosavadní uživatele. Odvozeno
z domény `oli-edu.com` (pomlčka v identifikátoru být nesmí).

Pokud chceš jiný, změň ho **před prvním odevzdáním**.

---

## Co potřebuješ nainstalovat

Na tomhle PC nic z toho není — proto jsem build nemohl spustit ani jednou.

| | Android | iOS |
|---|---|---|
| systém | Windows / macOS / Linux | **jen macOS** |
| nástroj | Android Studio | Xcode |
| jazyk | JDK 21 (přibalený v Android Studiu) | — |
| účet | Google Play Console (jednorázově 25 USD) | Apple Developer Program (99 USD/rok) |

---

## Běžný postup

```bash
npm run cap:android
```

Sestaví web, nasype ho do nativního projektu a otevře Android Studio. Tam
`Build → Generate Signed App Bundle` vyrobí `.aab` pro Play.

```bash
npm run cap:ios
```

Totéž pro Xcode. **Funguje jen na macOS.**

```bash
npm run cap:sync
```

Jen přesype web do obou projektů, nic neotevírá. Tohle spusť **po každé změně
webu**, jinak v mobilu poběží stará verze.

```bash
npm run cap:assets
```

Přegeneruje ikony a splash z `assets/icon.png` a `assets/splash.png`.
Zdrojová ikona je 1024×1024, splash 2732×2732.

---

## Co je hotové

- **Capacitor 8** + platformy `android/` a `ios/` (obě verzované v gitu, aby
  šly sestavit z obou PC).
- **Ikony a splash** — 87 souborů pro Android, 10 pro iOS, 8 pro web.
- **Bezpečné zóny** — `viewport-fit=cover` v `index.html` a odsazení `#root`
  v `index.css`. Bez toho by nadpis ležel pod čelistí a tlačítka pod
  indikátorem gest. Na webu je `env()` nula, takže se nic nemění.
- **Hardwarové tlačítko Zpět** ([`src/lib/native.ts`](../src/lib/native.ts)) —
  vrací se v historii místo okamžitého ukončení. Výchozí chování Capacitoru by
  dítě uprostřed cvičení vyhodilo ven i s rozdělanou prací; takhle platí táž
  ochrana odchodu jako u tlačítka Zpět v aplikaci.
- **Splash se schovává ručně**, až React běží — ne po fixním čase. Odpadá bílý
  záblesk mezi splashem a aplikací.
- **Webový manifest** — aplikace jde nainstalovat i z prohlížeče na počítači.
  Vygenerovaný manifest byl nepoužitelný (cesty `../icons/`, `image/png`
  u `.webp` souborů, chybějící `name` i `start_url`), takže je psaný ručně.

---

## Co zbývá

### 1. Podpisové klíče

Android `.aab` i iOS `.ipa` musí být podepsané. **Klíč k Androidu si zálohuj** —
při ztrátě nelze vydat aktualizaci existující aplikace.

### 2. Hluboké odkazy (jinak nefunguje obnova hesla)

Odkaz z e-mailu o obnově hesla dnes otevře **prohlížeč, ne aplikaci**. Uživatel
tím vypadne z aplikace a nemusí se dostat zpátky.

Aplikace už umí odkaz zpracovat (`appUrlOpen` v `src/lib/native.ts`), ale chybí
ověření domény:

- Android: `assetlinks.json` na `https://oli-edu.com/.well-known/`
- iOS: `apple-app-site-association` tamtéž

Obojí musí obsahovat otisk podpisového certifikátu, takže to jde udělat **až po
kroku 1**. Do té doby zůstane obnova hesla v prohlížeči — funguje, jen to není
hezké.

### 3. Písmo se stahuje z internetu

`index.html` načítá Nunito z `fonts.googleapis.com`. V mobilní aplikaci to
znamená, že při prvním spuštění bez signálu naskočí náhradní písmo. Stažení
písma k sobě navíc je jediný důvod, proč se aplikace hlásí Googlu — kvůli tomu
je Google Fonts uvedený v zásadách soukromí jako příjemce.

**Stažení písma do repozitáře obojí vyřeší.** Není to nutné ke spuštění, ale
u aplikace pro děti to je čistší.

### 4. Formuláře v obchodech

Data safety (Play) a Privacy Nutrition Labels (App Store) se vyplňují ručně
a musí sedět s [zásadami soukromí](../src/content/legal.ts). Seznam příjemců
tam je připravený a hlídá ho test `legal-recipients.test.ts`.

Souvisí s otevřeným rozhodnutím o **dětské kategorii** (blocker B4) — to určuje,
do které sekce se aplikace hlásí a jaká pravidla pro ni platí.

---

## Co jsem neověřil

Sestavení, spuštění na zařízení ani vzhled bezpečných zón. Na tomhle PC není
JDK, Android SDK ani Android Studio, iOS build vyžaduje macOS. Ověřené je jen
to, že `npx cap sync` proběhne pro obě platformy a že web zásahy nerozbily
(typecheck, 4710 testů, UI audit, build).

**První skutečný build tedy může narazit na věci, které odsud nevidím** —
typicky verze JDK, chybějící SDK komponenty nebo Gradle. To je normální
a nejde o chybu konfigurace.
