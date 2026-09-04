/**
 * Ochrana proti useknutému sezení na hraně stránkovaného dotazu.
 *
 * PROBLÉM
 * -------
 * Obrazovky, které z `session_logs` skládají SEZENÍ, čtou pevný počet řádků
 * (`.order("created_at", desc).limit(N)`). Jenže limit se počítá v řádcích, ne
 * v sezeních — u aktivního dítěte proto poslední, nejstarší sezení v dávce
 * skoro jistě přijde useknuté vejpůl.
 *
 * Nezobrazí se prázdné místo, ale **nesprávné číslo**: sezení o šesti úlohách
 * se ukáže jako „✓2 správně" ze dvou úloh, protože zbylé čtyři řádky se do
 * limitu nevešly. Rodič to nemá jak poznat — vypadá to jako sezení, které dítě
 * nedodělalo, a promítne se to i do známky u toho řádku.
 *
 * ŘEŠENÍ
 * ------
 * Když dotaz limit vyčerpal, zahoď celé nejstarší sezení v dávce. Radši o jedno
 * sezení míň než jedno sezení se špatnými čísly. Zvýšení limitu problém neřeší,
 * jen ho posouvá k aktivnějším dětem.
 */

/**
 * Odstraní nejstarší sezení z dávky, pokud dotaz narazil na limit.
 *
 * Očekává řádky **seřazené sestupně podle času** (nejstarší poslední) — tedy
 * přesně to, co vrací `.order("created_at", { ascending: false })`.
 *
 * Když dávka limitu nedosáhla, vrací ji beze změny: nic useknuté být nemohlo.
 * Když celá dávka patří jedinému sezení, vrátí prázdno — takové sezení je
 * delší než limit a jeho čísla by byla nutně špatná.
 */
export function dropTruncatedTailSession<T extends { session_id: string }>(
  rows: T[],
  limit: number,
): T[] {
  if (rows.length < limit) return rows;
  const oldest = rows[rows.length - 1]?.session_id;
  if (!oldest) return rows;
  return rows.filter((r) => r.session_id !== oldest);
}
