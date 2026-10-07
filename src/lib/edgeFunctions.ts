/**
 * Znamená tahle chyba, že edge funkce vůbec neběží?
 *
 * Rozdíl je zásadní, a proto to stojí zvlášť a je to otestované: při
 * nedostupné funkci víme jistě, že se NIC nesmazalo, a musíme to říct
 * naplno. U ostatních chyb (500 uprostřed mazání) jistotu nemáme, takže
 * nesmíme tvrdit ani „smazáno", ani „nic se nestalo".
 */
export function funkceNedostupna(error: unknown): boolean {
  if (!error) return false;
  const e = error as { message?: string; context?: { status?: number } };
  if (e.context?.status === 404) return true;
  return /Failed to (send a request|fetch)/i.test(e.message ?? "");
}
