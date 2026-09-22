/**
 * Grade 6 — veřejný export (2. stupeň, pilot).
 *
 * Pravidla a tone-of-voice viz `src/content/grade-6/README.md`.
 * GRADE_6_TOPICS obsahuje JEN hotové topics (žádné skelety → žádný broken
 * obsah v běžící app). Témata se přidávají postupně, jak procházejí
 * Definition of Done (README sekce „Definition of Done").
 */

import type { TopicMetadata } from "@/lib/types";

// Fyzika (pilot — výpočetní vzor)
import { MERENI_DELKY } from "./fyzika/mereniDelky";
import { MERENI_HMOTNOSTI } from "./fyzika/mereniHmotnosti";
import { MERENI_OBJEMU } from "./fyzika/mereniObjemu";
import { HUSTOTA } from "./fyzika/hustota";
import { MERENI_TEPLOTY } from "./fyzika/mereniTeploty";
import { MERENI_CASU } from "./fyzika/mereniCasu";

// Fyzika — Látky a tělesa (pojmový vzor)
import { LATKA_A_TELESO } from "./fyzika/latkaATeleso";
import { SKUPENSTVI_LATEK } from "./fyzika/skupenstviLatek";
import { ATOMY_MOLEKULY } from "./fyzika/atomyMolekuly";
import { POHYB_CASTIC } from "./fyzika/pohybCastic";
import { ELEKTRICKY_NABOJ } from "./fyzika/elektrickyNaboj";
import { ELEKTRICKY_OBVOD } from "./fyzika/elektrickyObvod";
import { MAGNETY } from "./fyzika/magnety";

// Dějepis (pilot — faktický vzor)
import { PERIODIZACE_LETOPOCET } from "./dejepis/periodizaceLetopocet";
import { DOBA_KAMENNA_PERIODIZACE } from "./dejepis/dobaKamennaPeriodizace";
import { HISTORICKE_PRAMENY } from "./dejepis/historickePrameny";
import { POMOCNE_VEDY_HISTORICKE } from "./dejepis/pomocneVedyHistoricke";
import { CO_JE_DEJEPIS } from "./dejepis/coJeDejepis";
import { HOMINIZACE } from "./dejepis/hominizace";
import { NEOLITICKA_REVOLUCE } from "./dejepis/neolitickaRevoluce";
import { DOBA_BRONZOVA_ZELEZNA } from "./dejepis/dobaBronzovaZelezna";
import { LOVCI_MAMUTU_VESTONICKA_VENUSE } from "./dejepis/lovciMamutuVestonickaVenuse";
import { KELTOVE_GERMANI_SLOVANE } from "./dejepis/keltoveGermaniSlovane";
import { MEZOPOTAMIE } from "./dejepis/mezopotamie";
import { STAROVEKY_EGYPT } from "./dejepis/starovekyEgypt";
import { KULTURA_STAROVEKEHO_VYCHODU } from "./dejepis/kulturaStarovekehoVychodu";
import { STAROVEKA_INDIE } from "./dejepis/starovekaIndie";
import { STAROVEKA_CINA } from "./dejepis/starovekaCina";
import { KRETA_MYKENY_TROJA } from "./dejepis/kretaMykenyTroja";
import { RECKE_MESTSKE_STATY } from "./dejepis/reckeMestskeStaty";
import { RECKO_PERSKE_VALKY_PELOPONESKA_VALKA } from "./dejepis/reckoPerskeValkyPeloponeskaValka";
import { ANTIKA_RECKO_KULTURA } from "./dejepis/antikaReckoKultura";
import { VZNIK_RIMA_KRALOVSTVI_REPUBLIKA } from "./dejepis/vznikRimaRepublika";
import { PUNSKE_VALKY_DOBYTI_STREDOMORI } from "./dejepis/punskeValky";
import { RIMSKE_CISARSTVI_TOPICS } from "./dejepis/rimskeCisarstvi";
import { VZNIK_SIRENI_KRESTANSTVI } from "./dejepis/vznikSireniKrestanstvi";
import { STEHOVANI_NARODU_PAD_ZAPADORIMSKE_RISE } from "./dejepis/stehovaniNaroduPadZapadorimskeRise";

// Matematika — Číslo a proměnná
import { NASOBENI_A_DELENI_DESETINNYCH_CISEL } from "./matematika/nasobeniADeleniDesetinnychCisel";
import { POCETNI_OPERACE_DESETINNA_KOMPLEXNE } from "./matematika/pocetniOperaceDesetinnaKomplexne";
import { ZNAKY_DELITELNOSTI } from "./matematika/znakyDelitelnosti";
import { PRVOCISLA_ROZKLAD } from "./matematika/prvocislaRozklad";
import { NSN_NSD_6 } from "./matematika/nsnNsd";
// Matematika — Geometrie v rovině a v prostoru
import { UHLY_DRUHY_SCITANI_TOPICS } from "./matematika/uhlyDruhyScitani";
import { UHEL_RYSOVANI_MERENI } from "./matematika/uhelRysovaniMereni";
import { TROJUHELNIKY_UHLY_VYSKA_TEZNICE_6 } from "./matematika/trojuhelnikyUhlyVyskaTeznice";
import { SIT_KRYCHLE_A_KVADRU_POVRCH_A_OBJEM } from "./matematika/sitKrychleAKvadruPovrchAObjem";
import { OSOVA_STREDOVA_SOUMERNOST } from "./matematika/osovaStredovaSoumernost";
// Matematika — Nestandardní úlohy, Práce s daty
import { LOGICKE_UVAHY_KOMBINACNI_USUDEK } from "./matematika/logickeUvahyKombinacniUsudek";
import { TABULKY_A_DIAGRAMY } from "./matematika/tabulkyADiagramy";
// Přírodopis — Obecná biologie
import { VZNIK_ZEME_PODMINKY_PRO_ZIVOT } from "./prirodopis/vznikZemePodminkyProZivot";
import { VYVOJ_ZIVOTA_GEOLOGICKA_OBDOBI } from "./prirodopis/vyvojZivotaGeologickaObdobi";
import { TAXONOMICKE_SKUPINY } from "./prirodopis/taxonomickeSkupiny";
import { MIKROSKOP } from "./prirodopis/mikroskop";
import { STAVBA_BUNKY } from "./prirodopis/stavbaBunky";
// Přírodopis — Nebuněční a bakterie, Biologie hub
import { VIRY_STAVBA_VYZNAM } from "./prirodopis/viryStavbaVyznam";
import { BAKTERIE_TOPICS } from "./prirodopis/bakterie";
import { SINICE_VYSKYT_VYZNAM } from "./prirodopis/siniceVyskytVyznam";
import { PRVOCI_ZASTUPCI_NEMOCI } from "./prirodopis/prvociZastupciNemoci";
import { HOUBY_STAVBA_VYZIVA_VYZNAM } from "./prirodopis/houbyStavbaVyziva";
import { JEDLE_A_JEDOVATE_HOUBY } from "./prirodopis/jedleAJedovateHouby";
import { LISEJNIKY_SYMBIOZA } from "./prirodopis/lisejnikySymbioza";
// Přírodopis — Biologie rostlin, Biologie živočichů
import { RASY_STAVBA_ZASTUPCI_VYZNAM } from "./prirodopis/rasyStavbaZastupciVyznam";
import { MECHOROSTY_ZASTUPCI_VYZNAM } from "./prirodopis/mechorostyZastupciVyznam";
import { KAPRADOROSTY } from "./prirodopis/kapradorosty";
import { ZAHAVCI_NEZMAR_MEDUZA_KORALY } from "./prirodopis/zahavciNezmarMeduzaKoraly";
import { PLOSTENCI_HLISTI } from "./prirodopis/plostenciHlisti";
import { MEKKYSI_PLZI_MLZI_HLAVONOZCI } from "./prirodopis/mekkysiPlziMlziHlavonozci";
import { KROUZKOVCI_ZIZALA_PIJAVKA } from "./prirodopis/krouzkovciZizalaPijavka";
import { PAVOUKOVCI_PAVOUCI_STIRI_KLISTATA_TOPICS } from "./prirodopis/pavoukovciPavouciStiriKlistata";
import { KORYSI_TOPICS } from "./prirodopis/korysi";
import { HMYZ_STAVBA_TELA_DRUHY_VYVOJ } from "./prirodopis/hmyzStavbaTelaDruhyVyvoj";
// Zeměpis — Mapa a glóbus
import { GLOBUS_MAPA_MERITKO } from "./zemepis/globusMapaMeritko";
import { MAPOVE_ZNACKY_ORIENTACE } from "./zemepis/mapoveZnackyOrientace";
import { ZEMEPISNA_SIT } from "./zemepis/zemepisnaSit";
// Zeměpis — Vesmír a Země
import { VESMIR_SLUNECNI_SOUSTAVA } from "./zemepis/vesmirSlunecniSoustava";
import { TVAR_A_POHYBY_ZEME } from "./zemepis/tvarAPohybyZeme";
import { ROCNI_DOBY_CASOVA_PASMA } from "./zemepis/rocniDobyCasovaPasma";
// Zeměpis — Krajinné sféry
import { ATMOSFERA_POCASI_PODNEBI } from "./zemepis/atmosferaPocasiPodnebi";
import { HYDROSFERA_VODA_NA_ZEMI } from "./zemepis/hydrosferaVodaNaZemi";
import { LITOSFERA_STAVBA_ZEME_DESKY } from "./zemepis/litosferaStavbaZemeDesky";
import { PEDOSFERA_BIOSFERA } from "./zemepis/pedosferaBiosfera";
// Zeměpis — Polární oblasti
import { ARKTIDA_POLOHA_KLIMA_VYZNAM } from "./zemepis/arktidaPolohaKlimaVyznam";
import { ANTARKTIDA_POLOHA_KLIMA } from "./zemepis/antarktidaPolohaKlima";
// Zeměpis — Afrika
import { AFRIKA_POLOHA_POVRCH_VODSTVO_PODNEBI } from "./zemepis/afrikaPolohaPovrchVodstvoPodnebi";
import { AFRICKE_PRIRODNI_OBLASTI } from "./zemepis/africkePrirodniOblasti";
import { OBYVATELSTVO_HOSPODARSTVI_AFRIKY } from "./zemepis/obyvatelstvoHospodarstviAfriky";
// Zeměpis — Austrálie a Oceánie
import { AUSTRALIE_OCEANIE_POLOHA_POVRCH_KLIMA } from "./zemepis/australieOceaniePolohaPovrchKlima";
import { PRIRODA_ENDEMITY_VELKY_BARIEROVY_UTES } from "./zemepis/prirodaEndemityVelkyBarierovyUtes";
import { AUSTRALIE_OBYVATELSTVO_OSTROVY_OCEANIE } from "./zemepis/australieObyvatelstvoOstrovyOceanie";
// Čeština — Tvarosloví
import { OPAKOVANI_SLOVNICH_DRUHU_OHEBNE_NEOHEBNE } from "./cjl/opakovaniSlovnichDruhuOhebneNeohebne";
import { PODSTATNA_JMENA_SKLONOVANI_MLUVNICKE_KATEGORIE } from "./cjl/podstatnaJmenaSklonovaniMluvnickeKategorie";
import { SLOVESA_TRIDY_A_VZORY } from "./cjl/slovesaTridyAVzory";
// Čeština — Nauka o slovní zásobě
import { SLOVNI_ZASOBA_A_JEJI_OBOHACOVANI } from "./cjl/slovniZasobaAJejiObohacovani";
import { SYNONYMA_ANTONYMA_HOMONYMA } from "./cjl/synonymaAntonymaHomonyma";
// Čeština — Skladba
import { VETA_JEDNODUCHA_ZAKLADNI_A_ROZVIJEJICI_VETNE_CLENY } from "./cjl/vetaJednoduchaZakladniARozvijejiciVetneCleny";
import { PREDMET_PRISLOVECNE_URCENI_PRIVLASTEK_DOPLNEK } from "./cjl/predmetPrislovecneUrceniPrivlastekDoplnek";
// Čeština — Zvuková stránka jazyka
import { PRIZVUK_INTONACE_FRAZOVANI } from "./cjl/prizvukIntonaceFrazovani";
import { SPISOVNA_VYSLOVNOST_MODULACE_SOUVISLE_RECI } from "./cjl/spisovnaVyslovnostModulaceSouvisleReci";
// Čeština — Slohová výchova
import { DOPIS_SOUKROMY_A_UREDNI } from "./cjl/dopisSoukromyAUredni";
import { POPIS_PROSTY_ODBORNY_UMELECKY } from "./cjl/popisProstyOdbornyUmelecky";
import { VYPRAVENI_VYSTAVBA_KOMPOZICE_ZAPLETKA } from "./cjl/vypraveniVystavbaKompoziceZapletka";
import { ZPRAVA_A_OZNAMENI_ROZDILY } from "./cjl/zpravaAOznameniRozdily";
// Čeština — Čtení a naslouchání
import { KLICOVA_SLOVA_HLAVNI_MYSLENKY_TEXTU } from "./cjl/klicovaSlovaHlavniMyslenkyTextu";
import { PRAKTICKE_VECNE_CTENI_STUDIJNI_CTENI } from "./cjl/praktickeVecneCteniStudijniCteni";

export const GRADE_6_TOPICS: TopicMetadata[] = [
  // Čeština — Jazyková výchova
  ...OPAKOVANI_SLOVNICH_DRUHU_OHEBNE_NEOHEBNE,
  ...PODSTATNA_JMENA_SKLONOVANI_MLUVNICKE_KATEGORIE,
  ...SLOVESA_TRIDY_A_VZORY,
  ...SLOVNI_ZASOBA_A_JEJI_OBOHACOVANI,
  ...SYNONYMA_ANTONYMA_HOMONYMA,
  ...VETA_JEDNODUCHA_ZAKLADNI_A_ROZVIJEJICI_VETNE_CLENY,
  ...PREDMET_PRISLOVECNE_URCENI_PRIVLASTEK_DOPLNEK,
  ...PRIZVUK_INTONACE_FRAZOVANI,
  ...SPISOVNA_VYSLOVNOST_MODULACE_SOUVISLE_RECI,
  // Čeština — Komunikační a slohová výchova
  ...DOPIS_SOUKROMY_A_UREDNI,
  ...POPIS_PROSTY_ODBORNY_UMELECKY,
  ...VYPRAVENI_VYSTAVBA_KOMPOZICE_ZAPLETKA,
  ...ZPRAVA_A_OZNAMENI_ROZDILY,
  ...KLICOVA_SLOVA_HLAVNI_MYSLENKY_TEXTU,
  ...PRAKTICKE_VECNE_CTENI_STUDIJNI_CTENI,
  // Zeměpis — Geografické informace, zdroje dat, kartografie
  ...GLOBUS_MAPA_MERITKO,
  ...MAPOVE_ZNACKY_ORIENTACE,
  ...ZEMEPISNA_SIT,
  // Zeměpis — Přírodní obraz Země
  ...VESMIR_SLUNECNI_SOUSTAVA,
  ...TVAR_A_POHYBY_ZEME,
  ...ROCNI_DOBY_CASOVA_PASMA,
  ...ATMOSFERA_POCASI_PODNEBI,
  ...HYDROSFERA_VODA_NA_ZEMI,
  ...LITOSFERA_STAVBA_ZEME_DESKY,
  ...PEDOSFERA_BIOSFERA,
  // Zeměpis — Regiony světa: Polární oblasti
  ...ARKTIDA_POLOHA_KLIMA_VYZNAM,
  ...ANTARKTIDA_POLOHA_KLIMA,
  // Zeměpis — Regiony světa: Afrika
  ...AFRIKA_POLOHA_POVRCH_VODSTVO_PODNEBI,
  ...AFRICKE_PRIRODNI_OBLASTI,
  ...OBYVATELSTVO_HOSPODARSTVI_AFRIKY,
  // Zeměpis — Regiony světa: Austrálie a Oceánie
  ...AUSTRALIE_OCEANIE_POLOHA_POVRCH_KLIMA,
  ...PRIRODA_ENDEMITY_VELKY_BARIEROVY_UTES,
  ...AUSTRALIE_OBYVATELSTVO_OSTROVY_OCEANIE,
  // Přírodopis — Obecná biologie
  ...VZNIK_ZEME_PODMINKY_PRO_ZIVOT,
  ...VYVOJ_ZIVOTA_GEOLOGICKA_OBDOBI,
  ...TAXONOMICKE_SKUPINY,
  ...MIKROSKOP,
  ...STAVBA_BUNKY,
  // Přírodopis — Nebuněční a bakterie
  ...VIRY_STAVBA_VYZNAM,
  ...BAKTERIE_TOPICS,
  ...SINICE_VYSKYT_VYZNAM,
  ...PRVOCI_ZASTUPCI_NEMOCI,
  // Přírodopis — Biologie hub
  ...HOUBY_STAVBA_VYZIVA_VYZNAM,
  ...JEDLE_A_JEDOVATE_HOUBY,
  ...LISEJNIKY_SYMBIOZA,
  // Přírodopis — Biologie rostlin
  ...RASY_STAVBA_ZASTUPCI_VYZNAM,
  ...MECHOROSTY_ZASTUPCI_VYZNAM,
  ...KAPRADOROSTY,
  // Přírodopis — Biologie živočichů
  ...ZAHAVCI_NEZMAR_MEDUZA_KORALY,
  ...PLOSTENCI_HLISTI,
  ...MEKKYSI_PLZI_MLZI_HLAVONOZCI,
  ...KROUZKOVCI_ZIZALA_PIJAVKA,
  ...PAVOUKOVCI_PAVOUCI_STIRI_KLISTATA_TOPICS,
  ...KORYSI_TOPICS,
  ...HMYZ_STAVBA_TELA_DRUHY_VYVOJ,
  // Matematika — Číslo a proměnná
  ...NASOBENI_A_DELENI_DESETINNYCH_CISEL,
  ...POCETNI_OPERACE_DESETINNA_KOMPLEXNE,
  ...ZNAKY_DELITELNOSTI,
  ...PRVOCISLA_ROZKLAD,
  ...NSN_NSD_6,
  // Matematika — Geometrie v rovině a v prostoru
  ...UHLY_DRUHY_SCITANI_TOPICS,
  ...UHEL_RYSOVANI_MERENI,
  ...TROJUHELNIKY_UHLY_VYSKA_TEZNICE_6,
  ...SIT_KRYCHLE_A_KVADRU_POVRCH_A_OBJEM,
  ...OSOVA_STREDOVA_SOUMERNOST,
  // Matematika — Nestandardní úlohy, Práce s daty
  ...LOGICKE_UVAHY_KOMBINACNI_USUDEK,
  ...TABULKY_A_DIAGRAMY,
  // Fyzika — Měření fyzikálních veličin
  ...MERENI_DELKY,
  ...MERENI_HMOTNOSTI,
  ...MERENI_OBJEMU,
  ...HUSTOTA,
  ...MERENI_TEPLOTY,
  ...MERENI_CASU,
  // Fyzika — Látky a tělesa
  ...LATKA_A_TELESO,
  ...SKUPENSTVI_LATEK,
  ...ATOMY_MOLEKULY,
  ...POHYB_CASTIC,
  ...ELEKTRICKY_NABOJ,
  ...ELEKTRICKY_OBVOD,
  ...MAGNETY,
  // Dějepis — Úvod do dějepisu
  ...PERIODIZACE_LETOPOCET,
  // Dějepis — Pravěk
  ...DOBA_KAMENNA_PERIODIZACE,
  // Dějepis — Úvod do dějepisu
  ...CO_JE_DEJEPIS,
  ...HISTORICKE_PRAMENY,
  ...POMOCNE_VEDY_HISTORICKE,
  // Dějepis — Pravěk
  ...HOMINIZACE,
  ...NEOLITICKA_REVOLUCE,
  ...DOBA_BRONZOVA_ZELEZNA,
  ...LOVCI_MAMUTU_VESTONICKA_VENUSE,
  ...KELTOVE_GERMANI_SLOVANE,
  // Dějepis — Nejstarší státy
  ...MEZOPOTAMIE,
  ...STAROVEKY_EGYPT,
  ...KULTURA_STAROVEKEHO_VYCHODU,
  // Dějepis — Starověká Indie a Čína
  ...STAROVEKA_INDIE,
  ...STAROVEKA_CINA,
  // Dějepis — Antika: Řecko
  ...KRETA_MYKENY_TROJA,
  ...RECKE_MESTSKE_STATY,
  ...RECKO_PERSKE_VALKY_PELOPONESKA_VALKA,
  ...ANTIKA_RECKO_KULTURA,
  // Dějepis — Antika: Řím
  ...VZNIK_RIMA_KRALOVSTVI_REPUBLIKA,
  ...PUNSKE_VALKY_DOBYTI_STREDOMORI,
  ...RIMSKE_CISARSTVI_TOPICS,
  ...VZNIK_SIRENI_KRESTANSTVI,
  ...STEHOVANI_NARODU_PAD_ZAPADORIMSKE_RISE,
];
