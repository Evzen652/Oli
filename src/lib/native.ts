import { Capacitor } from "@capacitor/core";

/**
 * Chování, které dává smysl jen v obalu pro Google Play a App Store.
 *
 * Na webu se celá funkce po první podmínce vrátí a nic nenačte — pluginy se
 * importují dynamicky, takže webový balík o ně nenaroste.
 */
export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Produkční web. Odsud vedou odkazy, které uživatel otevře MIMO aplikaci —
 * dnes jen ty z e-mailu. Táž hodnota je v `supabase/functions/send-parent-invite`
 * (`APP_URL`); při změně domény se musí přepsat obě.
 */
const PRODUKCNI_WEB = "https://oli-edu.com";

/**
 * Kam má vést odkaz, který uživateli přijde e-mailem (obnova hesla, potvrzení
 * registrace).
 *
 * Na webu je to původ aktuální stránky — na produkci `https://oli-edu.com`,
 * při vývoji `http://localhost:8080`. Obnova hesla tak jde vyzkoušet lokálně.
 *
 * Uvnitř obalu pro Play a App Store je `window.location.origin` ale
 * `https://localhost` (kvůli `androidScheme: "https"`, viz `capacitor.config.ts`)
 * — to je původ WebView, žádná adresa na internetu. Odkaz postavený na něm vede
 * do prázdna: e-mail odejde, uživatel v něm klikne a neotevře se nic. Proto se
 * v obalu bere produkční doména natvrdo. Natvrdo pro všechny prostředí ji dát
 * nejde, to by rozbilo vývoj na localhostu.
 *
 * ⚠️ Každá adresa odsud musí být v Supabase v **Authentication → URL
 * Configuration → Redirect URLs**. Co tam není, to Supabase zahodí a přesměruje
 * na Site URL — a neohlásí to; projeví se to až tím, že odkaz vede jinam.
 *
 * ⚠️ Na mobilu se odkaz zatím otevře v prohlížeči, ne v aplikaci — hluboké
 * odkazy čekají na podpisový klíč (viz `nastavHlubokeOdkazy` níž). Heslo si
 * tedy uživatel změní v prohlížeči a do aplikace se pak přihlásí novým. To je
 * funkční cesta; před touhle opravou nefungovala žádná.
 */
export function adresaProOdkazZEmailu(cesta = ""): string {
  return (isNative() ? PRODUKCNI_WEB : window.location.origin) + cesta;
}

/** Ať se listener nezaregistruje dvakrát (StrictMode montuje efekty 2×). */
let nastaveno = false;

export async function initNative(): Promise<void> {
  if (!isNative() || nastaveno) return;
  nastaveno = true;

  await Promise.all([nastavStavovyRadek(), nastavTlacitkoZpet(), nastavHlubokeOdkazy()]);

  // Splash schováváme AŽ TEĎ, ne po fixním čase (`launchAutoHide: false`
  // v capacitor.config.ts). React už běží, takže mezi splashem a aplikací
  // není bílý záblesk.
  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide();
  } catch {
    // Splash je kosmetika — když plugin selže, aplikace musí běžet dál.
  }
}

async function nastavStavovyRadek(): Promise<void> {
  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    // Krémový podklad → tmavé ikony. `Style.Light` znamená „světlé pozadí",
    // ne světlé ikony; pojmenování je matoucí a plete se pravidelně.
    await StatusBar.setStyle({ style: Style.Light });
    if (Capacitor.getPlatform() === "android") {
      await StatusBar.setBackgroundColor({ color: "#FAF9F6" });
    }
  } catch {
    // Na některých zařízeních plugin selže; vzhled stavového řádku
    // aplikaci nerozbije.
  }
}

/**
 * Hardwarové tlačítko Zpět na Androidu.
 *
 * Výchozí chování Capacitoru je aplikaci rovnou ukončit — to by dítě uprostřed
 * cvičení vyhodilo ven i s rozdělanou prací. Proto se místo toho vracíme
 * v historii, takže platí táž ochrana odchodu ze cvičení jako u tlačítka Zpět
 * v aplikaci. Ukončujeme jen tehdy, když už není kam couvnout.
 */
async function nastavTlacitkoZpet(): Promise<void> {
  if (Capacitor.getPlatform() !== "android") return;
  try {
    const { App } = await import("@capacitor/app");
    await App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });
  } catch {
    // Bez listeneru zůstane výchozí chování — nepříjemné, ne fatální.
  }
}

/**
 * Odkazy z e-mailů (obnova hesla, pozvánka rodiče).
 *
 * Když je pro doménu nastavený App Link / Universal Link, systém otevře
 * aplikaci a předá jí celou URL. Bez tohohle listeneru by se aplikace jen
 * spustila na úvodní obrazovce a token z odkazu by se zahodil.
 *
 * ⚠️ Samotné ověření domény tady nezařídím: vyžaduje soubory na serveru
 * (`assetlinks.json` pro Android, `apple-app-site-association` pro iOS)
 * a shodu s podpisovým certifikátem. Do té doby se odkaz otevře v prohlížeči
 * a tenhle listener se nespustí — aplikace tím ale nic neztratí.
 */
async function nastavHlubokeOdkazy(): Promise<void> {
  try {
    const { App } = await import("@capacitor/app");
    await App.addListener("appUrlOpen", ({ url }) => {
      try {
        const cil = new URL(url);
        // Uvnitř obalu běží aplikace na vlastním původu, takže se přenáší
        // jen cesta — doménu z odkazu zahazujeme schválně.
        window.location.href = cil.pathname + cil.search + cil.hash;
      } catch {
        // Nevalidní URL ignorujeme; horší než nic nedělat by bylo spadnout.
      }
    });
  } catch {
    // Plugin nedostupný — hluboké odkazy prostě nefungují.
  }
}
