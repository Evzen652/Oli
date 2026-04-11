/**
 * DOPLŇOVACÍ DIKTÁT — Zásobník vět
 * 
 * Věty pokrývající 4 pravopisné jevy:
 * - vyjmenovaná slova (y/ý vs i/í po B, L, M, P, S, V, Z)
 * - párové souhlásky (b/p, d/t, ž/š, z/s, v/f, ď/ť)
 * - tvrdé a měkké souhlásky (y/ý vs i/í)
 * - velká písmena (vlastní vs obecná jména)
 * 
 * Pravidla pro obsah:
 * - Věty nesmí prozrazovat odpověď.
 * - Slovní zásoba odpovídá 3.–5. ročníku ZŠ.
 * - Žádná cizí slova ani odborné termíny.
 * - Každé slovo po doplnění musí být skutečné české slovo.
 */

export interface DiktatItem {
  sentence: string;
  answer: string;
  options: string[];
  rule: string;
  type: "vyjmenovana" | "parove" | "tvrde_mekke" | "velka_pismena";
}

export const DIKTAT_POOL: DiktatItem[] = [
  // ═══════════════════════════════════════════════════════════════
  // VYJMENOVANÁ SLOVA — po B (→ y/ý)
  // ═══════════════════════════════════════════════════════════════
  { sentence: "V domě nikdo neb_dlí.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Bydlí — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "Na louce stála kob_la.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Kobyla — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "Honza dostal nový b_t.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Byt — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "B_k utíkal přes pole.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Býk — vyjmenované slovo po B → ý.", type: "vyjmenovana" },
  { sentence: "Ob_čej tu platí odjakživa.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Obyčej — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "B_lina roste u potoka.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Bylina — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "Dob_tek se pásl na stráni.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Dobytek — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "Nab_l jsem do pistole.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Nabýt — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "Ob_vatel domu otevřel dveře.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Obyvatel — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "B_strý chlapec odpověděl rychle.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Bystrý — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "Příb_tek stál na kraji lesa.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Příbytek — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "B_val tu starý mlýn.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Býval — vyjmenované slovo po B → ý.", type: "vyjmenovana" },
  { sentence: "Zb_tek chleba jsme dali ptákům.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Zbytek — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "Ob_čejný den začal ráno.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Obyčejný — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "Nab_dka v obchodě byla dobrá.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Nabídka — není vyjmenované slovo po B → í.", type: "vyjmenovana" },
  { sentence: "Sb_rali jsme houby v lese.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Sbírat — není vyjmenované slovo po B → í.", type: "vyjmenovana" },
  { sentence: "B_valy tu velké zahrady.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Bývaly — vyjmenované slovo po B → ý.", type: "vyjmenovana" },
  { sentence: "Potřebuji nový náb_tek.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Nábytek — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "Ob_lí dozrává na poli.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Obilí — není vyjmenované slovo po B → i.", type: "vyjmenovana" },
  { sentence: "B_lý králík seděl v kleci.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Bílý — není vyjmenované slovo po B → í.", type: "vyjmenovana" },
  { sentence: "Na b_tvě bojovali vojáci.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Bitva — není vyjmenované slovo po B → i.", type: "vyjmenovana" },
  { sentence: "Ab_ to šlo rychleji.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Aby — vyjmenované slovo po B → y.", type: "vyjmenovana" },

  // ═══════════════════════════════════════════════════════════════
  // VYJMENOVANÁ SLOVA — po L (→ y/ý)
  // ═══════════════════════════════════════════════════════════════
  { sentence: "V noci se bl_skalo.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Blýskat — vyjmenované slovo po L → ý.", type: "vyjmenovana" },
  { sentence: "Sedlák jel na ml_n.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Mlýn — vyjmenované slovo po L → ý.", type: "vyjmenovana" },
  { sentence: "Sl_šel jsem zvláštní zvuk.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Slyšet — vyjmenované slovo po L → y.", type: "vyjmenovana" },
  { sentence: "Pl_nový plyn hoří modře.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Plyn — vyjmenované slovo po L → y.", type: "vyjmenovana" },
  { sentence: "Pl_tvat vodou se nemá.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Plýtvat — vyjmenované slovo po L → ý.", type: "vyjmenovana" },
  { sentence: "Sl_chali jsme pohádku.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Slýchat — vyjmenované slovo po L → ý.", type: "vyjmenovana" },
  { sentence: "L_ko v pokoji je pohodlné.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Lyko — vyjmenované slovo po L → y.", type: "vyjmenovana" },
  { sentence: "L_že v zimě potřebuješ.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Lyže — vyjmenované slovo po L → y.", type: "vyjmenovana" },
  { sentence: "Pl_nulí jsme po vodě.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Plynout — vyjmenované slovo po L → y.", type: "vyjmenovana" },
  { sentence: "L_ška utíkala do lesa.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Liška — není vyjmenované slovo po L → i.", type: "vyjmenovana" },
  { sentence: "L_pa kvete v létě.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Lípa — není vyjmenované slovo po L → í.", type: "vyjmenovana" },
  { sentence: "Pol_cista stál na křižovatce.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Policista — není vyjmenované slovo po L → i.", type: "vyjmenovana" },
  { sentence: "Mal_ny rostou na keři.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Maliny — není vyjmenované slovo po L → i.", type: "vyjmenovana" },
  { sentence: "L_monáda je sladká.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Limonáda — není vyjmenované slovo po L → i.", type: "vyjmenovana" },
  { sentence: "Sl_mák leze pomalu.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Slimák — není vyjmenované slovo po L → i.", type: "vyjmenovana" },
  { sentence: "L_stek spadl ze stromu.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Lístek — není vyjmenované slovo po L → í.", type: "vyjmenovana" },
  { sentence: "Pol_vka voněla po celém domě.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Polívka — není vyjmenované slovo po L → í.", type: "vyjmenovana" },
  { sentence: "Kl_katá cesta vedla do kopce.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Klikatá — není vyjmenované slovo po L → i.", type: "vyjmenovana" },
  { sentence: "Sl_boval jsem, že přijdu.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Slibovat — není vyjmenované slovo po L → i.", type: "vyjmenovana" },
  { sentence: "Pl_š je hebká látka.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Plyš — vyjmenované slovo po L → y.", type: "vyjmenovana" },

  // ═══════════════════════════════════════════════════════════════
  // VYJMENOVANÁ SLOVA — po M (→ y/ý)
  // ═══════════════════════════════════════════════════════════════
  { sentence: "M_š se schovala do díry.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Myš — vyjmenované slovo po M → y.", type: "vyjmenovana" },
  { sentence: "Děti se um_valy v koupelně.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Umývat — vyjmenované slovo po M → ý.", type: "vyjmenovana" },
  { sentence: "Sm_čec hraje na housle.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Smyčec — vyjmenované slovo po M → y.", type: "vyjmenovana" },
  { sentence: "M_dlo leží u umyvadla.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Mýdlo — vyjmenované slovo po M → ý.", type: "vyjmenovana" },
  { sentence: "Přem_šlel jsem celý den.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Přemýšlet — vyjmenované slovo po M → ý.", type: "vyjmenovana" },
  { sentence: "Zm_ja ležela na kameni.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Zmije — není vyjmenované slovo po M → i.", type: "vyjmenovana" },
  { sentence: "M_nce ležela na chodníku.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Mince — není vyjmenované slovo po M → i.", type: "vyjmenovana" },
  { sentence: "M_ska na jídlo stojí v kuchyni.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Miska — není vyjmenované slovo po M → i.", type: "vyjmenovana" },
  { sentence: "M_šlenka mu přišla ráno.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Myšlenka — vyjmenované slovo po M → y.", type: "vyjmenovana" },
  { sentence: "M_t nádobí není zábava.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Mýt — vyjmenované slovo po M → ý.", type: "vyjmenovana" },
  { sentence: "M_val se koupá v potoce.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Myval — vyjmenované slovo po M → y.", type: "vyjmenovana" },
  { sentence: "Pom_slel jsem na prázdniny.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Pomyslel — vyjmenované slovo po M → y.", type: "vyjmenovana" },
  { sentence: "Sm_sl toho příběhu je jasný.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Smysl — vyjmenované slovo po M → y.", type: "vyjmenovana" },
  { sentence: "Zam_kat dveře na klíč.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Zamykat — vyjmenované slovo po M → y.", type: "vyjmenovana" },
  { sentence: "M_lý chlapec se usmíval.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Milý — není vyjmenované slovo po M → i.", type: "vyjmenovana" },
  { sentence: "M_nuta utekla rychle.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Minuta — není vyjmenované slovo po M → i.", type: "vyjmenovana" },
  { sentence: "Hm_z bzučel nad loukou.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Hmyz — vyjmenované slovo po M → y.", type: "vyjmenovana" },
  { sentence: "Kám_nek ležel u cesty.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Kamínek — není vyjmenované slovo po M → í.", type: "vyjmenovana" },
  { sentence: "Zam_slel se nad úlohou.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Zamyslel — vyjmenované slovo po M → y.", type: "vyjmenovana" },
  { sentence: "Dom_šlivý člověk přehání.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Domýšlivý — vyjmenované slovo po M → ý.", type: "vyjmenovana" },
  { sentence: "Pom_jivé květy rychle zvadly.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Pomíjivé — není vyjmenované slovo po M → í.", type: "vyjmenovana" },
  { sentence: "M_lostivý král odpustil.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Milostivý — není vyjmenované slovo po M → i.", type: "vyjmenovana" },

  // ═══════════════════════════════════════════════════════════════
  // VYJMENOVANÁ SLOVA — po P (→ y/ý)
  // ═══════════════════════════════════════════════════════════════
  { sentence: "Na zemi ležel starý p_tel.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Pytel — vyjmenované slovo po P → y.", type: "vyjmenovana" },
  { sentence: "P_sk je jemný na dotyk.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Pysk — vyjmenované slovo po P → y.", type: "vyjmenovana" },
  { sentence: "P_šný pán kráčel po ulici.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Pyšný — vyjmenované slovo po P → y.", type: "vyjmenovana" },
  { sentence: "P_tlák vaří jídlo.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Pytlák — vyjmenované slovo po P → y.", type: "vyjmenovana" },
  { sentence: "P_kat se tu nesmí.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Pykat — vyjmenované slovo po P → y.", type: "vyjmenovana" },
  { sentence: "Kop_to u ševce slouží k práci.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Kopyto — vyjmenované slovo po P → y.", type: "vyjmenovana" },
  { sentence: "Zp_tavý chlapec se ptal na vše.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Zpytavý — vyjmenované slovo po P → y.", type: "vyjmenovana" },
  { sentence: "Sp_žírna voněla jídlem.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Spížírna — není vyjmenované slovo po P → í.", type: "vyjmenovana" },
  { sentence: "P_smo je latinkou.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Písmo — není vyjmenované slovo po P → í.", type: "vyjmenovana" },
  { sentence: "P_lka je ostré nářadí.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Pilka — není vyjmenované slovo po P → i.", type: "vyjmenovana" },
  { sentence: "Op_ce skáče po stromech.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Opice — není vyjmenované slovo po P → i.", type: "vyjmenovana" },
  { sentence: "P_voňka voní krásně.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Pivoňka — není vyjmenované slovo po P → i.", type: "vyjmenovana" },

  // ═══════════════════════════════════════════════════════════════
  // VYJMENOVANÁ SLOVA — po S (→ y/ý)
  // ═══════════════════════════════════════════════════════════════
  { sentence: "S_kora zpívá na větvi.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Sýkora — vyjmenované slovo po S → ý.", type: "vyjmenovana" },
  { sentence: "S_r je dobrý na svačinu.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Sýr — vyjmenované slovo po S → ý.", type: "vyjmenovana" },
  { sentence: "S_n dostal nové kolo.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Syn — vyjmenované slovo po S → y.", type: "vyjmenovana" },
  { sentence: "S_pali jsme písek do kbelíku.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Sypat — vyjmenované slovo po S → y.", type: "vyjmenovana" },
  { sentence: "S_rový koláč je oblíbený.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Sýrový — vyjmenované slovo po S → ý.", type: "vyjmenovana" },
  { sentence: "S_pal jsem celou noc.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Sýpal — vyjmenované slovo po S → ý.", type: "vyjmenovana" },
  { sentence: "S_ček je malá sova.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Sýček — vyjmenované slovo po S → ý.", type: "vyjmenovana" },
  { sentence: "Nas_tit se je důležité.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Nasytit — vyjmenované slovo po S → y.", type: "vyjmenovana" },
  { sentence: "S_rečky k obědu voněly.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Sýrečky — vyjmenované slovo po S → ý.", type: "vyjmenovana" },
  { sentence: "S_lnice vedla do města.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Silnice — není vyjmenované slovo po S → i.", type: "vyjmenovana" },
  { sentence: "S_la mu chyběla na konci.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Síla — není vyjmenované slovo po S → í.", type: "vyjmenovana" },
  { sentence: "Pros_m tě o pomoc.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Prosím — není vyjmenované slovo po S → í.", type: "vyjmenovana" },
  { sentence: "S_to na mouku stálo v komoře.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Síto — píšeme s í.", type: "vyjmenovana" },

  // ═══════════════════════════════════════════════════════════════
  // VYJMENOVANÁ SLOVA — po V (→ y/ý)
  // ═══════════════════════════════════════════════════════════════
  { sentence: "V_dra plave v řece.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Vydra — vyjmenované slovo po V → y.", type: "vyjmenovana" },
  { sentence: "V_soký strom stál u cesty.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Vysoký — vyjmenované slovo po V → y.", type: "vyjmenovana" },
  { sentence: "Zv_k je důležitý při jídle.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Zvyk — vyjmenované slovo po V → y.", type: "vyjmenovana" },
  { sentence: "V_r velký je krásný pták.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Výr — vyjmenované slovo po V → ý.", type: "vyjmenovana" },
  { sentence: "V_ška na to téma je zajímavá.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Výška — vyjmenované slovo po V → ý.", type: "vyjmenovana" },
  { sentence: "Ob_klý tvar je hladký.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Obvyklý — vyjmenované slovo po V → y.", type: "vyjmenovana" },
  { sentence: "V_chřice lámala stromy.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Vichřice — není vyjmenované slovo po V → i.", type: "vyjmenovana" },
  { sentence: "V_dlička leží na stole.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Vidlička — není vyjmenované slovo po V → i.", type: "vyjmenovana" },
  { sentence: "Na stole stojí v_no.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Víno — není vyjmenované slovo po V → í.", type: "vyjmenovana" },
  { sentence: "V_tr foukal od severu.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Vítr — není vyjmenované slovo po V → í.", type: "vyjmenovana" },
  { sentence: "V_počet byl složitý.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Výpočet — vyjmenované slovo po V → ý.", type: "vyjmenovana" },
  { sentence: "V_let do hor byl krásný.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Výlet — vyjmenované slovo po V → ý.", type: "vyjmenovana" },
  { sentence: "Pov_k se ozval z dálky.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Povyk — vyjmenované slovo po V → y.", type: "vyjmenovana" },
  { sentence: "V_tah jel nahoru.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Výtah — vyjmenované slovo po V → ý.", type: "vyjmenovana" },
  { sentence: "V_ce jich tam nebylo.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Více — není vyjmenované slovo po V → í.", type: "vyjmenovana" },
  { sentence: "Zv_řata žijí v lese.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Zvířata — není vyjmenované slovo po V → í.", type: "vyjmenovana" },
  { sentence: "V_raz v obličeji byl veselý.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Výraz — vyjmenované slovo po V → ý.", type: "vyjmenovana" },
  { sentence: "Sv_čka hořela na stole.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Svíčka — není vyjmenované slovo po V → í.", type: "vyjmenovana" },
  { sentence: "V_bor rozhodl o výletu.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Výbor — vyjmenované slovo po V → ý.", type: "vyjmenovana" },
  { sentence: "V_kend strávíme na chatě.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Víkend — není vyjmenované slovo po V → í.", type: "vyjmenovana" },

  // ═══════════════════════════════════════════════════════════════
  // VYJMENOVANÁ SLOVA — po Z (→ y/ý)
  // ═══════════════════════════════════════════════════════════════
  { sentence: "Na zdi visí jaz_ček.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Jazýček — vyjmenované slovo po Z → ý.", type: "vyjmenovana" },
  { sentence: "Jaz_k je důležitý sval.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Jazyk — vyjmenované slovo po Z → y.", type: "vyjmenovana" },
  { sentence: "Brz_čko přijdeme domů.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Brzyčko — vyjmenované slovo po Z → y.", type: "vyjmenovana" },
  { sentence: "Naz_vat věci pravým jménem.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Nazývat — vyjmenované slovo po Z → ý.", type: "vyjmenovana" },
  { sentence: "Ciz_nec přijel z daleka.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Cizinec — není vyjmenované slovo po Z → i.", type: "vyjmenovana" },
  { sentence: "Z_ma letos přišla brzy.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Zima — není vyjmenované slovo po Z → i.", type: "vyjmenovana" },
  { sentence: "Z_sk je důležitý v obchodě.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Zisk — není vyjmenované slovo po Z → i.", type: "vyjmenovana" },
  { sentence: "Koz_čka měla bílou srst.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Kozička — není vyjmenované slovo po Z → i.", type: "vyjmenovana" },
  { sentence: "Z_tra bude hezky.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Zítra — není vyjmenované slovo po Z → í.", type: "vyjmenovana" },
  { sentence: "Z_vat nesmíš ve škole.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Zívat — není vyjmenované slovo po Z → í.", type: "vyjmenovana" },
  { sentence: "Voz_k jel po silnici.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Vozík — není vyjmenované slovo po Z → í.", type: "vyjmenovana" },
  { sentence: "Kaz_t věci se nemá.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Kazit — není vyjmenované slovo po Z → i.", type: "vyjmenovana" },

  // ═══════════════════════════════════════════════════════════════
  // VYJMENOVANÁ SLOVA — DALŠÍ SMĚS
  // ═══════════════════════════════════════════════════════════════
  { sentence: "Sl_šíme hudbu z rádia.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Slyšíme — vyjmenované slovo po L → y.", type: "vyjmenovana" },
  { sentence: "V_koupali jsme se v rybníce.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Vykoupali — vyjmenované slovo po V → y.", type: "vyjmenovana" },
  { sentence: "M_dlinka voněla levandulí.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Mýdlinka — vyjmenované slovo po M → ý.", type: "vyjmenovana" },
  { sentence: "P_skat umí každý.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Pískat — není vyjmenované slovo po P → í.", type: "vyjmenovana" },
  { sentence: "S_lný vítr ohýbal stromy.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Silný — není vyjmenované slovo po S → i.", type: "vyjmenovana" },
  { sentence: "Zb_tečně se strachoval.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Zbytečně — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "L_žařský vlek jel nahoru.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Lyžařský — vyjmenované slovo po L → y.", type: "vyjmenovana" },
  { sentence: "V_stava začala v devět.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Výstava — vyjmenované slovo po V → ý.", type: "vyjmenovana" },
  { sentence: "Um_vadlo je v koupelně.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Umyvadlo — vyjmenované slovo po M → y.", type: "vyjmenovana" },
  { sentence: "Ob_čejné dny plynou rychle.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Obyčejné — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "L_ják bubnoval na okna.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Liják — není vyjmenované slovo po L → i.", type: "vyjmenovana" },
  { sentence: "M_šáci běhají po půdě.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Myšáci — vyjmenované slovo po M → y.", type: "vyjmenovana" },
  { sentence: "V_plata přišla včas.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Výplata — vyjmenované slovo po V → ý.", type: "vyjmenovana" },
  { sentence: "M_šák utekl do díry.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Myšák — vyjmenované slovo po M → y.", type: "vyjmenovana" },
  { sentence: "Rozb_tý hrneček ležel na zemi.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Rozbitý — není vyjmenované slovo po B → i.", type: "vyjmenovana" },
  { sentence: "V_bral jsem si knihu.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Vybral — vyjmenované slovo po V → y.", type: "vyjmenovana" },
  { sentence: "L_stí šustilo pod nohama.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Listí — není vyjmenované slovo po L → i.", type: "vyjmenovana" },
  { sentence: "S_paný čaj je dobrý.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Sypaný — vyjmenované slovo po S → y.", type: "vyjmenovana" },
  { sentence: "M_ška utíkala po poli.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Myška — vyjmenované slovo po M → y.", type: "vyjmenovana" },
  { sentence: "V_kládání trvalo dlouho.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Vykládání — vyjmenované slovo po V → y.", type: "vyjmenovana" },
  { sentence: "P_lně to sledoval.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Pilně — není vyjmenované slovo po P → i.", type: "vyjmenovana" },
  { sentence: "P_cha předchází pád.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Pýcha — vyjmenované slovo po P → ý.", type: "vyjmenovana" },
  { sentence: "Op_loval nový plot.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Opiloval — není vyjmenované slovo po P → i.", type: "vyjmenovana" },

  // ═══════════════════════════════════════════════════════════════
  // PÁROVÉ SOUHLÁSKY — b/p, d/t, ž/š, z/s, v/f
  // ═══════════════════════════════════════════════════════════════
  { sentence: "Na rybníce je silný le_.", answer: "d", options: ["d", "t"], rule: "Led — pomocné slovo: ledy → d.", type: "parove" },
  { sentence: "Maminka krájí chlé_.", answer: "b", options: ["b", "p"], rule: "Chléb — pomocné slovo: chleby → b.", type: "parove" },
  { sentence: "V trávě leze ha_.", answer: "d", options: ["d", "t"], rule: "Had — pomocné slovo: hadi → d.", type: "parove" },
  { sentence: "Na střeše sedí holu_.", answer: "b", options: ["b", "p"], rule: "Holub — pomocné slovo: holubi → b.", type: "parove" },
  { sentence: "Ve sklepě stojí su_.", answer: "d", options: ["d", "t"], rule: "Sud — pomocné slovo: sudy → d.", type: "parove" },
  { sentence: "Potřebuji nů_ na krájení.", answer: "ž", options: ["ž", "š"], rule: "Nůž — pomocné slovo: nože → ž.", type: "parove" },
  { sentence: "Na stěně visí krásný obra_.", answer: "z", options: ["z", "s"], rule: "Obraz — pomocné slovo: obrazy → z.", type: "parove" },
  { sentence: "Pod dubem ležel žalu_.", answer: "d", options: ["d", "t"], rule: "Žalud — pomocné slovo: žaludy → d.", type: "parove" },
  { sentence: "Před domem roste velký du_.", answer: "b", options: ["b", "p"], rule: "Dub — pomocné slovo: duby → b.", type: "parove" },
  { sentence: "Klu_ běží po hřišti.", answer: "k", options: ["k", "g"], rule: "Kluk — pomocné slovo: kluci → k.", type: "parove" },
  { sentence: "Na okně sedí vrabčá_.", answer: "k", options: ["k", "g"], rule: "Vrabčák — pomocné slovo: vrabčáci → k.", type: "parove" },
  { sentence: "Chlape_ jde do školy.", answer: "c", options: ["c", "k"], rule: "Chlapec — pomocné slovo: chlapci → c.", type: "parove" },
  { sentence: "Hrne_ stojí na sporáku.", answer: "c", options: ["c", "k"], rule: "Hrnec — pomocné slovo: hrnce → c.", type: "parove" },
  { sentence: "Měl na hlavě klobou_.", answer: "k", options: ["k", "g"], rule: "Klobouk — pomocné slovo: klobouky → k.", type: "parove" },
  { sentence: "Sedl si na paře_ v lese.", answer: "z", options: ["z", "s"], rule: "Pařez — pomocné slovo: pařezy → z.", type: "parove" },
  { sentence: "Snědl jsem celý ro_lík.", answer: "h", options: ["h", "ch"], rule: "Rohlík — pomocné slovo: rohlíky → h.", type: "parove" },
  { sentence: "Hrá_ dostal gól.", answer: "č", options: ["č", "š"], rule: "Hráč — pomocné slovo: hráči → č.", type: "parove" },
  { sentence: "Kuchař nalil polé_ku.", answer: "v", options: ["v", "f"], rule: "Polévka — pomocné slovo: polévky → v.", type: "parove" },
  { sentence: "Mra_ padal celou noc.", answer: "z", options: ["z", "s"], rule: "Mráz — pomocné slovo: mrazy → z.", type: "parove" },
  { sentence: "Kra_ je plný lesů.", answer: "j", options: ["j", "k"], rule: "Kraj — pomocné slovo: kraje → j.", type: "parove" },
  { sentence: "Kupoval jsem dáre_ k narozeninám.", answer: "k", options: ["k", "g"], rule: "Dárek — pomocné slovo: dárky → k.", type: "parove" },
  { sentence: "Sní_ pokryl celou zahradu.", answer: "h", options: ["h", "ch"], rule: "Sníh — pomocné slovo: sněhy → h.", type: "parove" },
  { sentence: "Na stromě seděl stehli_.", answer: "k", options: ["k", "g"], rule: "Stehlík — pomocné slovo: stehlíci → k.", type: "parove" },
  { sentence: "Brouče_ lezl po listu.", answer: "k", options: ["k", "g"], rule: "Brouček — pomocné slovo: broučci → k.", type: "parove" },
  { sentence: "Hle_ na tu krásu!", answer: "ď", options: ["ď", "ť"], rule: "Hleď — pomocné slovo: hledět → d.", type: "parove" },
  { sentence: "Táta opravil rá_ u okna.", answer: "m", options: ["m", "n"], rule: "Rám — pomocné slovo: rámy → m.", type: "parove" },
  { sentence: "Hla_ trápil celou rodinu.", answer: "d", options: ["d", "t"], rule: "Hlad — pomocné slovo: hladový → d.", type: "parove" },
  { sentence: "Šáte_ visel na věšáku.", answer: "k", options: ["k", "g"], rule: "Šátek — pomocné slovo: šátky → k.", type: "parove" },
  { sentence: "Kope_ sena stál na poli.", answer: "c", options: ["c", "k"], rule: "Kopec — pomocné slovo: kopce → c.", type: "parove" },
  { sentence: "Dra_ měl ostré zuby.", answer: "k", options: ["k", "g"], rule: "Drak — pomocné slovo: draci → k.", type: "parove" },
  { sentence: "Stru_a na kytaře praskla.", answer: "n", options: ["n", "m"], rule: "Struna — pomocné slovo: struny → n.", type: "parove" },
  { sentence: "Žá_ měl dobré hodnocení.", answer: "k", options: ["k", "g"], rule: "Žák — pomocné slovo: žáci → k.", type: "parove" },
  { sentence: "Hlemý_ď leze pomalu.", answer: "ž", options: ["ž", "š"], rule: "Hlemýžď — pomocné slovo: hlemýždě → ž.", type: "parove" },
  { sentence: "Tatínek opravil vů_.", answer: "z", options: ["z", "s"], rule: "Vůz — pomocné slovo: vozy → z.", type: "parove" },
  { sentence: "Stro_ stojí u cesty.", answer: "m", options: ["m", "n"], rule: "Strom — pomocné slovo: stromy → m.", type: "parove" },
  { sentence: "Rybá_ sedí u rybníka.", answer: "ř", options: ["ř", "š"], rule: "Rybář — pomocné slovo: rybáři → ř.", type: "parove" },
  { sentence: "Na poště dostal balíče_.", answer: "k", options: ["k", "g"], rule: "Balíček — pomocné slovo: balíčky → k.", type: "parove" },
  { sentence: "Kone_ filmu byl veselý.", answer: "c", options: ["c", "k"], rule: "Konec — pomocné slovo: konce → c.", type: "parove" },
  { sentence: "Lé_ pomohl nemocnému.", answer: "k", options: ["k", "g"], rule: "Lék — pomocné slovo: léky → k.", type: "parove" },

  // ═══════════════════════════════════════════════════════════════
  // PÁROVÉ SOUHLÁSKY — další
  // ═══════════════════════════════════════════════════════════════
  { sentence: "Odpoledne šel ven na procházku po sa_.", answer: "d", options: ["d", "t"], rule: "Sad — pomocné slovo: sady → d.", type: "parove" },
  { sentence: "Souse_ přišel na návštěvu.", answer: "d", options: ["d", "t"], rule: "Soused — pomocné slovo: sousedé → d.", type: "parove" },
  { sentence: "Zahradní hno_ použili na záhon.", answer: "j", options: ["j", "k"], rule: "Hnoj — pomocné slovo: hnoje → j.", type: "parove" },
  { sentence: "Na stěně visí plakát s medvě_em.", answer: "d", options: ["d", "t"], rule: "Medvěd — pomocné slovo: medvědi → d.", type: "parove" },
  { sentence: "Zámě_ se podařil.", answer: "r", options: ["r", "ř"], rule: "Záměr — pomocné slovo: záměry → r.", type: "parove" },
  { sentence: "Prame_ vody teče z kopce.", answer: "n", options: ["n", "m"], rule: "Pramen — pomocné slovo: prameny → n.", type: "parove" },
  { sentence: "Správný odha_ pomůže.", answer: "d", options: ["d", "t"], rule: "Odhad — pomocné slovo: odhady → d.", type: "parove" },
  { sentence: "Kně_ stál u oltáře.", answer: "z", options: ["z", "s"], rule: "Kněz — pomocné slovo: kněží → z.", type: "parove" },
  { sentence: "Ko_ běhal po louce.", answer: "ň", options: ["ň", "n"], rule: "Koň — pomocné slovo: koně → ň.", type: "parove" },
  { sentence: "V lese žije li_ka.", answer: "š", options: ["ž", "š"], rule: "Liška — pomocné slovo: lišky → š.", type: "parove" },
  { sentence: "Zmrzlinu jsem dal na talí_.", answer: "ř", options: ["ř", "š"], rule: "Talíř — pomocné slovo: talíře → ř.", type: "parove" },
  { sentence: "Klou_ u ruky bolí.", answer: "b", options: ["b", "p"], rule: "Kloub — pomocné slovo: klouby → b.", type: "parove" },
  { sentence: "Pod stolem leží ko_.", answer: "š", options: ["ž", "š"], rule: "Koš — pomocné slovo: koše → š.", type: "parove" },
  { sentence: "Bolel ho bo_ u těla.", answer: "k", options: ["k", "g"], rule: "Bok — pomocné slovo: boky → k.", type: "parove" },
  { sentence: "Kapesní_ leží v kapse.", answer: "k", options: ["k", "g"], rule: "Kapesník — pomocné slovo: kapesníky → k.", type: "parove" },
  { sentence: "Pohle_ z okna je krásný.", answer: "d", options: ["d", "t"], rule: "Pohled — pomocné slovo: pohledy → d.", type: "parove" },
  { sentence: "Korá_ plul po moři.", answer: "b", options: ["b", "p"], rule: "Koráb — pomocné slovo: koráby → b.", type: "parove" },
  { sentence: "Hra_ stojí na kopci.", answer: "d", options: ["d", "t"], rule: "Hrad — pomocné slovo: hrady → d.", type: "parove" },

  // ═══════════════════════════════════════════════════════════════
  // PÁROVÉ SOUHLÁSKY — rozšíření
  // ═══════════════════════════════════════════════════════════════
  { sentence: "Na střeše sedí kou_.", answer: "ř", options: ["ř", "š"], rule: "Kouř — pomocné slovo: kouře → ř.", type: "parove" },
  { sentence: "Poklá_ leží v truhle.", answer: "d", options: ["d", "t"], rule: "Poklad — pomocné slovo: poklady → d.", type: "parove" },
  { sentence: "Zví_e spalo v pelechu.", answer: "ř", options: ["ř", "š"], rule: "Zvíře — pomocné slovo: zvířata → ř.", type: "parove" },
  { sentence: "Pra_ letí vzduchem.", answer: "ch", options: ["ch", "h"], rule: "Prach — pomocné slovo: prachy → ch.", type: "parove" },
  { sentence: "Stře_a chrání před deštěm.", answer: "ch", options: ["ch", "h"], rule: "Střecha — pomocné slovo: střechy → ch.", type: "parove" },
  { sentence: "Šplha_ je dobrý v lezení.", answer: "č", options: ["č", "š"], rule: "Šplhač — pomocné slovo: šplhači → č.", type: "parove" },
  { sentence: "Gará_ stojí vedle domu.", answer: "ž", options: ["ž", "š"], rule: "Garáž — pomocné slovo: garáže → ž.", type: "parove" },
  { sentence: "V krabici byl poklá_.", answer: "d", options: ["d", "t"], rule: "Poklad — pomocné slovo: poklady → d.", type: "parove" },
  { sentence: "Venku padal dé_ť celý den.", answer: "š", options: ["ž", "š"], rule: "Déšť — pomocné slovo: deště → š.", type: "parove" },
  { sentence: "Oře_ padl ze stromu.", answer: "ch", options: ["ch", "h"], rule: "Ořech — pomocné slovo: ořechy → ch.", type: "parove" },

  // ═══════════════════════════════════════════════════════════════
  // TVRDÉ SOUHLÁSKY — po h, ch, k, r, d, t, n → y/ý
  // ═══════════════════════════════════════════════════════════════
  { sentence: "V rybníce plavou r_by.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce r píšeme vždy y.", type: "tvrde_mekke" },
  { sentence: "Maminka ch_stá svačinu.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce ch píšeme vždy y.", type: "tvrde_mekke" },
  { sentence: "Koupili jsme k_tku.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce k píšeme vždy y.", type: "tvrde_mekke" },
  { sentence: "Duch_ se bojíme.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce ch píšeme vždy y.", type: "tvrde_mekke" },
  { sentence: "H_baj se rychle!", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce h píšeme vždy y.", type: "tvrde_mekke" },
  { sentence: "Komár_ bzučeli u okna.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce r píšeme vždy y.", type: "tvrde_mekke" },
  { sentence: "T_gři žijí v Asii.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce t píšeme vždy y.", type: "tvrde_mekke" },
  { sentence: "D_m stál na kopci.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce d píšeme vždy ý — dým.", type: "tvrde_mekke" },
  { sentence: "H_nout se musíš rychle.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce h píšeme vždy ý.", type: "tvrde_mekke" },
  { sentence: "Kuř_ce běhaly po dvoře.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Ř je měkká souhláska → i.", type: "tvrde_mekke" },
  { sentence: "K_slo bylo na talíři.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce k píšeme vždy y.", type: "tvrde_mekke" },
  { sentence: "K_tara hraje krásně.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce k píšeme vždy y.", type: "tvrde_mekke" },
  { sentence: "Ch_ba v úloze se dá opravit.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce ch píšeme vždy y.", type: "tvrde_mekke" },
  { sentence: "D_ně rostou na záhonu.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce d píšeme vždy ý — dýně.", type: "tvrde_mekke" },
  { sentence: "T_kat může každý.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce t píšeme vždy y.", type: "tvrde_mekke" },

  // ═══════════════════════════════════════════════════════════════
  // MĚKKÉ SOUHLÁSKY — po ž, š, č, ř, c, j → i/í
  // ═══════════════════════════════════════════════════════════════
  { sentence: "V c_rkuse bylo veselo.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce c píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "Ř_kali jsme básničku.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce ř píšeme vždy í.", type: "tvrde_mekke" },
  { sentence: "Č_stíme si zuby ráno.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce č píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "Š_pky rostou u cesty.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce š píšeme vždy í.", type: "tvrde_mekke" },
  { sentence: "Ž_rafa má dlouhý krk.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce ž píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "J_skra vyletěla z ohně.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce j píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "Ř_pa roste na záhoně.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce ř píšeme vždy í.", type: "tvrde_mekke" },
  { sentence: "Š_řka silnice je dostatečná.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce š píšeme vždy í.", type: "tvrde_mekke" },
  { sentence: "Ž_vot je krásný.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce ž píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "Č_stota je důležitá.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce č píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "Nůž_čky leží na stole.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce ž píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "C_hla je červená.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce c píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "J_dlo vonělo po celém domě.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce j píšeme vždy í.", type: "tvrde_mekke" },
  { sentence: "Ř_dítka kola jsou ohnutá.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce ř píšeme vždy í.", type: "tvrde_mekke" },
  { sentence: "Š_šky padaly ze stromů.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce š píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "C_bule roste na záhoně.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce c píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "Š_kmý terén ztěžoval cestu.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce š píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "Ž_la tu stará paní.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce ž píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "J_ní ráno bylo mrazivé.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce j píšeme vždy i — jíní.", type: "tvrde_mekke" },
  { sentence: "Ž_dle stála u stolu.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce ž píšeme vždy i — židle.", type: "tvrde_mekke" },
  { sentence: "Č_ška na kávu je bílá.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce č píšeme vždy i — číška.", type: "tvrde_mekke" },
  { sentence: "Ř_mské číslice znáš?", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce ř píšeme vždy í.", type: "tvrde_mekke" },
  { sentence: "Š_dlo je ostrý nástroj.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce š píšeme vždy i — šídlo.", type: "tvrde_mekke" },

  // ═══════════════════════════════════════════════════════════════
  // TVRDÉ/MĚKKÉ — směs pro trénink rozpoznávání
  // ═══════════════════════════════════════════════════════════════
  { sentence: "Brouč_ci létají v létě.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce č píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "Mot_l má krásná křídla.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce t píšeme vždy ý.", type: "tvrde_mekke" },
  { sentence: "Ch_tří ptáci uniknou.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce ch píšeme vždy y — chytří.", type: "tvrde_mekke" },
  { sentence: "Oř_šky sbíráme na podzim.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce ř píšeme vždy í.", type: "tvrde_mekke" },
  { sentence: "R_ba plavala v potoce.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce r píšeme vždy y.", type: "tvrde_mekke" },
  { sentence: "J_na je krásné jméno.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce j píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "D_ra ve zdi byla velká.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Díra — dí se čte jako ďí → í.", type: "tvrde_mekke" },
  { sentence: "Ch_trý člověk si poradí.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce ch píšeme vždy y.", type: "tvrde_mekke" },
  { sentence: "Č_slo na domě je špatné.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce č píšeme vždy í.", type: "tvrde_mekke" },
  { sentence: "R_chle utíkali domů.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce r píšeme y — rychle.", type: "tvrde_mekke" },
  { sentence: "Ž_la v prstech pulzovala.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce ž píšeme vždy i — žíla.", type: "tvrde_mekke" },

  // ═══════════════════════════════════════════════════════════════
  // TVRDÉ/MĚKKÉ — další doplnění
  // ═══════════════════════════════════════════════════════════════
  { sentence: "Ch_ba se stala každému.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce ch píšeme vždy y.", type: "tvrde_mekke" },
  { sentence: "K_selina poleptala ruku.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce k píšeme vždy y.", type: "tvrde_mekke" },
  { sentence: "Č_tanka leží na lavici.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce č píšeme vždy í.", type: "tvrde_mekke" },
  { sentence: "Ř_dič zastavil na křižovatce.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce ř píšeme vždy í.", type: "tvrde_mekke" },
  { sentence: "Ž_hadlo včely bodá.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce ž píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "J_skřička svítila v tmě.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce j píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "Ch_trý chlapec věděl odpověď.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce ch píšeme vždy y.", type: "tvrde_mekke" },
  { sentence: "R_padlo bylo v příkopu.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce r píšeme vždy y — rypadlo.", type: "tvrde_mekke" },
  { sentence: "T_kev rostla na záhoně.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce t píšeme vždy y — tykev.", type: "tvrde_mekke" },
  { sentence: "D_ky tobě jsem to zvládl.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Díky — dí se čte jako ďí → í.", type: "tvrde_mekke" },
  { sentence: "K_nout hlavou je souhlas.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce k píšeme y — kývnout.", type: "tvrde_mekke" },
  { sentence: "Ř_dký les měl málo stromů.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce ř píšeme vždy í.", type: "tvrde_mekke" },
  { sentence: "C_zí lidé nám pomohli.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Po měkké souhlásce c píšeme vždy i.", type: "tvrde_mekke" },
  { sentence: "N_zký plot obklopuje dům.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Nízký — ní se čte jako ňí → í.", type: "tvrde_mekke" },
  { sentence: "Och_l jsem se rychle.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Po tvrdé souhlásce ch píšeme vždy y.", type: "tvrde_mekke" },

  // ═══════════════════════════════════════════════════════════════
  // VELKÁ PÍSMENA — vlastní jména (→ velké)
  // ═══════════════════════════════════════════════════════════════
  { sentence: "Jedeme na výlet do _rahy.", answer: "P", options: ["P", "p"], rule: "Praha — jméno města → velké písmeno.", type: "velka_pismena" },
  { sentence: "Můj kamarád je _etr.", answer: "P", options: ["P", "p"], rule: "Petr — vlastní jméno → velké písmeno.", type: "velka_pismena" },
  { sentence: "Řeka _ltava teče Prahou.", answer: "V", options: ["V", "v"], rule: "Vltava — jméno řeky → velké písmeno.", type: "velka_pismena" },
  { sentence: "Byli jsme na _oravě.", answer: "M", options: ["M", "m"], rule: "Morava — vlastní zeměpisné jméno → velké písmeno.", type: "velka_pismena" },
  { sentence: "Před školou čeká _va.", answer: "E", options: ["E", "e"], rule: "Eva — vlastní jméno → velké písmeno.", type: "velka_pismena" },
  { sentence: "Hora _něžka je nejvyšší.", answer: "S", options: ["S", "s"], rule: "Sněžka — jméno hory → velké písmeno.", type: "velka_pismena" },
  { sentence: "Ve třídě sedí _aruška.", answer: "M", options: ["M", "m"], rule: "Maruška — vlastní jméno → velké písmeno.", type: "velka_pismena" },
  { sentence: "Hrad _arlštejn je krásný.", answer: "K", options: ["K", "k"], rule: "Karlštejn — jméno hradu → velké písmeno.", type: "velka_pismena" },
  { sentence: "Jeli jsme do _stí nad Labem.", answer: "Ú", options: ["Ú", "ú"], rule: "Ústí — jméno města → velké písmeno.", type: "velka_pismena" },
  { sentence: "Potok _lšava teče údolím.", answer: "O", options: ["O", "o"], rule: "Olšava — jméno potoka → velké písmeno.", type: "velka_pismena" },
  { sentence: "Náš pes se jmenuje _lík.", answer: "A", options: ["A", "a"], rule: "Alík — vlastní jméno (domácí mazlíček) → velké písmeno.", type: "velka_pismena" },
  { sentence: "_omáš dostal jedničku.", answer: "T", options: ["T", "t"], rule: "Tomáš — vlastní jméno → velké písmeno.", type: "velka_pismena" },
  { sentence: "Moje sestra _enka jde do školy.", answer: "L", options: ["L", "l"], rule: "Lenka — vlastní jméno → velké písmeno.", type: "velka_pismena" },
  { sentence: "Město _rno leží na jihu.", answer: "B", options: ["B", "b"], rule: "Brno — jméno města → velké písmeno.", type: "velka_pismena" },
  { sentence: "Hora _íp je známá z pověstí.", answer: "Ř", options: ["Ř", "ř"], rule: "Říp — jméno hory → velké písmeno.", type: "velka_pismena" },
  { sentence: "Jezero _achovo leží v Čechách.", answer: "M", options: ["M", "m"], rule: "Máchovo — vlastní jméno → velké písmeno.", type: "velka_pismena" },
  { sentence: "Strýček _arla přijel na návštěvu.", answer: "K", options: ["K", "k"], rule: "Karel — vlastní jméno → velké písmeno.", type: "velka_pismena" },
  { sentence: "Planeta _ars je červená.", answer: "M", options: ["M", "m"], rule: "Mars — vlastní jméno → velké písmeno.", type: "velka_pismena" },
  { sentence: "Řeka _orava teče do Dunaje.", answer: "M", options: ["M", "m"], rule: "Morava — jméno řeky → velké písmeno.", type: "velka_pismena" },
  { sentence: "Tatínek jel do _stravska.", answer: "O", options: ["O", "o"], rule: "Ostravsko — zeměpisný název → velké písmeno.", type: "velka_pismena" },
  { sentence: "_eská republika je v Evropě.", answer: "Č", options: ["Č", "č"], rule: "Česká — jméno státu → velké písmeno.", type: "velka_pismena" },
  { sentence: "Ulice _arlova je v Praze.", answer: "K", options: ["K", "k"], rule: "Karlova — název ulice → velké písmeno.", type: "velka_pismena" },
  { sentence: "Pan _ovák je náš soused.", answer: "N", options: ["N", "n"], rule: "Novák — příjmení → velké písmeno.", type: "velka_pismena" },
  { sentence: "Babička bydlí v _lzni.", answer: "P", options: ["P", "p"], rule: "Plzeň — jméno města → velké písmeno.", type: "velka_pismena" },

  // ═══════════════════════════════════════════════════════════════
  // VELKÁ PÍSMENA — obecná jména (→ malé)
  // ═══════════════════════════════════════════════════════════════
  { sentence: "_es je plný hub.", answer: "l", options: ["L", "l"], rule: "Les — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Máme doma _očku.", answer: "k", options: ["K", "k"], rule: "Kočka — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Na _ahradě rostou jahody.", answer: "z", options: ["Z", "z"], rule: "Zahrada — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Pod _řesní se schovaly.", answer: "t", options: ["T", "t"], rule: "Třešní — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Venku fouká _ítr.", answer: "v", options: ["V", "v"], rule: "Vítr — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Ve _kole se učíme počítat.", answer: "š", options: ["Š", "š"], rule: "Škola — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Na _ebi svítilo slunce.", answer: "n", options: ["N", "n"], rule: "Nebe — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Dáme si _oláč k svačině.", answer: "k", options: ["K", "k"], rule: "Koláč — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Na _ouce rostou květiny.", answer: "l", options: ["L", "l"], rule: "Louka — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "V _ybníce plavou kapři.", answer: "r", options: ["R", "r"], rule: "Rybník — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Na _amerádu se dá spolehnout.", answer: "k", options: ["K", "k"], rule: "Kamarád — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Ráno _lunce svítí na okno.", answer: "s", options: ["S", "s"], rule: "Slunce — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "V _ese zpívají ptáci.", answer: "l", options: ["L", "l"], rule: "Les — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Na _tole leží kniha.", answer: "s", options: ["S", "s"], rule: "Stůl — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "V _omoře máme brambory.", answer: "k", options: ["K", "k"], rule: "Komora — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Na _estě stojí stromy.", answer: "c", options: ["C", "c"], rule: "Cesta — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Pod _ostelí leží boty.", answer: "p", options: ["P", "p"], rule: "Postelí — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },

  // ═══════════════════════════════════════════════════════════════
  // VELKÁ PÍSMENA — mix vlastní/obecné
  // ═══════════════════════════════════════════════════════════════
  { sentence: "Řeka _abe teče do moře.", answer: "L", options: ["L", "l"], rule: "Labe — jméno řeky → velké písmeno.", type: "velka_pismena" },
  { sentence: "Paní _čitelka nám dala úkol.", answer: "u", options: ["U", "u"], rule: "Učitelka — obecné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Hora _edvědín je vysoká.", answer: "M", options: ["M", "m"], rule: "Medvědín — jméno hory → velké písmeno.", type: "velka_pismena" },
  { sentence: "Vesnice _rnov leží u řeky.", answer: "B", options: ["B", "b"], rule: "Brnov — jméno vesnice → velké písmeno.", type: "velka_pismena" },
  { sentence: "Na _eleznici jezdí vlaky.", answer: "ž", options: ["Ž", "ž"], rule: "Železnice — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Jmenuje se _ana.", answer: "J", options: ["J", "j"], rule: "Jana — vlastní jméno → velké písmeno.", type: "velka_pismena" },
  { sentence: "Každé _ondělí mám kroužek.", answer: "p", options: ["P", "p"], rule: "Pondělí — den v týdnu → malé písmeno.", type: "velka_pismena" },
  { sentence: "V _rosinci napadne sníh.", answer: "p", options: ["P", "p"], rule: "Prosinec — měsíc → malé písmeno.", type: "velka_pismena" },
  { sentence: "Hora _raděd stojí na severu.", answer: "P", options: ["P", "p"], rule: "Praděd — jméno hory → velké písmeno.", type: "velka_pismena" },
  { sentence: "Kočka _ičinka spala u krbu.", answer: "M", options: ["M", "m"], rule: "Mičinka — jméno kočky → velké písmeno.", type: "velka_pismena" },
  { sentence: "V _řírodě je klid a pohoda.", answer: "p", options: ["P", "p"], rule: "Příroda — obecné podstatné jméno → malé písmeno.", type: "velka_pismena" },
  { sentence: "Pes _ařík štěkal na pošťáka.", answer: "B", options: ["B", "b"], rule: "Bařík — jméno psa → velké písmeno.", type: "velka_pismena" },
  { sentence: "Jedeme na _ysočinu.", answer: "V", options: ["V", "v"], rule: "Vysočina — zeměpisné jméno → velké písmeno.", type: "velka_pismena" },
  { sentence: "Město _iberec leží na severu.", answer: "L", options: ["L", "l"], rule: "Liberec — jméno města → velké písmeno.", type: "velka_pismena" },

  // ═══════════════════════════════════════════════════════════════
  // VYJMENOVANÁ — další doplnění
  // ═══════════════════════════════════════════════════════════════
  { sentence: "V_robek z továrny je hotový.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Výrobek — vyjmenované slovo po V → ý.", type: "vyjmenovana" },
  { sentence: "V_raz na tváři byl překvapený.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Výraz — vyjmenované slovo po V → ý.", type: "vyjmenovana" },
  { sentence: "Zab_vali se celý den.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Zabývali — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "M_ska na mouku stojí v rohu.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Miska — není vyjmenované slovo po M → i.", type: "vyjmenovana" },
  { sentence: "V_tězství oslavili doma.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Vítězství — není vyjmenované slovo po V → í.", type: "vyjmenovana" },
  { sentence: "P_škot se hodí k čaji.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Piškot — není vyjmenované slovo po P → i.", type: "vyjmenovana" },
  { sentence: "V_děl jsem pěkný západ slunce.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Viděl — není vyjmenované slovo po V → i.", type: "vyjmenovana" },
  { sentence: "M_lión je velké číslo.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Milión — není vyjmenované slovo po M → i.", type: "vyjmenovana" },
  { sentence: "S_paný cukr se rozpustil.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Sypaný — vyjmenované slovo po S → y.", type: "vyjmenovana" },
  { sentence: "V_bíral jsem dárek celý den.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Vybíral — vyjmenované slovo po V → y.", type: "vyjmenovana" },
  { sentence: "Sm_sl života je zajímavá otázka.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Smysl — vyjmenované slovo po M → y.", type: "vyjmenovana" },
  { sentence: "V_běhli jsme z domu.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Vyběhli — vyjmenované slovo po V → y.", type: "vyjmenovana" },
  { sentence: "M_dlové bublinky létaly.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Mýdlové — vyjmenované slovo po M → ý.", type: "vyjmenovana" },
  { sentence: "L_tost cítil celý den.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Lítost — není vyjmenované slovo po L → í.", type: "vyjmenovana" },
  { sentence: "V_kopali jámu na stromek.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Vykopali — vyjmenované slovo po V → y.", type: "vyjmenovana" },
  { sentence: "B_dlila tu nová rodina.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Bydlila — vyjmenované slovo po B → y.", type: "vyjmenovana" },
  { sentence: "V_chladil jsem se ve větru.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Vychladil — vyjmenované slovo po V → y.", type: "vyjmenovana" },
  { sentence: "M_slivec střežil les.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Myslivec — vyjmenované slovo po M → y.", type: "vyjmenovana" },
  { sentence: "V_plnili jsme dotazník.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Vyplnili — vyjmenované slovo po V → y.", type: "vyjmenovana" },
  { sentence: "L_žoval celou zimu.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Lyžoval — vyjmenované slovo po L → y.", type: "vyjmenovana" },
  { sentence: "Rozm_šlel jsem nad úkolem.", answer: "y/ý", options: ["y/ý", "i/í"], rule: "Rozmýšlel — vyjmenované slovo po M → ý.", type: "vyjmenovana" },
  { sentence: "Nedob_tná baterie nesvítí.", answer: "i/í", options: ["y/ý", "i/í"], rule: "Nedobitá — dobitá → i.", type: "vyjmenovana" },
];
