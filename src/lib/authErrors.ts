/**
 * Překlad surových chybových hlášek ze Supabase Auth do srozumitelné češtiny.
 * Supabase vrací anglické technické zprávy — tohle je mapuje na věty pro rodiče.
 */
export function mapAuthError(raw: string | null | undefined): string {
  const m = (raw ?? "").toLowerCase();

  if (m.includes("invalid login credentials")) return "Nesprávný e-mail nebo heslo.";
  if (m.includes("email not confirmed")) return "E-mail ještě není potvrzený. Zkontroluj schránku a klikni na odkaz v e-mailu.";
  if (m.includes("already registered") || m.includes("already been registered") || m.includes("user already exists"))
    return "Tento e-mail už je zaregistrovaný. Zkus se přihlásit.";
  if (m.includes("password should be at least") || m.includes("password is too short"))
    return "Heslo musí mít alespoň 6 znaků.";
  if (m.includes("unable to validate email") || m.includes("invalid email") || m.includes("invalid format"))
    return "Zadej platnou e-mailovou adresu.";
  if (m.includes("rate limit") || m.includes("too many") || m.includes("over_email_send_rate"))
    return "Příliš mnoho pokusů. Zkus to prosím za chvíli.";
  if (m.includes("network") || m.includes("failed to fetch"))
    return "Chyba sítě. Zkontroluj připojení a zkus to znovu.";

  return "Něco se nepovedlo. Zkus to prosím znovu.";
}
