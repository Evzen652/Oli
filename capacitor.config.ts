import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Obal aplikace pro Google Play a App Store.
 *
 * Webová aplikace se sestaví do `dist/` a Capacitor ji zabalí do nativního
 * projektu. Žádný druhý kód: to samé, co běží na webu, běží i v mobilu.
 *
 * ⚠️ `appId` JE NEVRATNÝ. Jakmile pod ním jednou vyjde aplikace v obchodě,
 * nedá se změnit — je to trvalý identifikátor v Google Play i App Store.
 * Změna znamená novou aplikaci s nulou stažení a bez recenzí. Odvozeno
 * z domény oli-edu.com (pomlčka v identifikátoru být nesmí). Pokud se ti
 * nelíbí, změň ho TEĎ, ne po prvním vydání.
 */
const config: CapacitorConfig = {
  appId: "com.oliedu.app",
  appName: "Oli",
  webDir: "dist",

  // Android servíruje obsah přes https://localhost místo http://.
  // Bez toho není stránka „secure context" a rozbije se všechno, co ho
  // vyžaduje — u nás hlavně ukládání přihlášení Supabase.
  server: {
    androidScheme: "https",
  },

  plugins: {
    SplashScreen: {
      // Splash schováváme ručně, až je React opravdu připravený (viz
      // `src/lib/native.ts`). Automatické skrytí po fixním čase buď bliká
      // bílým mezistavem, nebo drží splash zbytečně dlouho.
      launchAutoHide: false,
      backgroundColor: "#FAF9F6", // --background, ať na splash nenavazuje skok
      androidSpinnerStyle: "small",
      spinnerColor: "#F97316", // --primary
    },
    StatusBar: {
      // Krémový podklad aplikace → tmavý text ve stavovém řádku.
      style: "LIGHT",
      backgroundColor: "#FAF9F6",
    },
  },
};

export default config;
