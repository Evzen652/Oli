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
