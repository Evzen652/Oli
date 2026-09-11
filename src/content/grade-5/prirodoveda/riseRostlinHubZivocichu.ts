import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { trideni, type Zarazeni } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a na úrovni jen deset pevných sad. Teď banka organismů: L1 běžní
// zástupci, L2 méně nápadní (mech, plíseň, korál), L3 zrádní (rosnatka,
// sasanka mořská, choroš).

const Z: Zarazeni[] = [
  { uroven: 1, polozka: "dub", skupina: "rostliny", proc: "Dub má zelené listy a živiny si vyrábí ze světla." },
  { uroven: 1, polozka: "tulipán", skupina: "rostliny", proc: "Tulipán je kvetoucí rostlina se zelenými listy." },
  { uroven: 1, polozka: "jahodník", skupina: "rostliny", proc: "Jahodník má zelené listy a kvete." },
  { uroven: 1, polozka: "hřib", skupina: "houby", proc: "Hřib nemá zelené barvivo a živí se látkami z půdy a z kořenů stromů." },
  { uroven: 1, polozka: "muchomůrka", skupina: "houby", proc: "Muchomůrka je jedovatá houba bez zeleného barviva." },
  { uroven: 1, polozka: "zajíc", skupina: "živočichové", proc: "Zajíc se pohybuje a potravu musí sníst." },
  { uroven: 1, polozka: "včela", skupina: "živočichové", proc: "Včela je hmyz — živočich, který se živí nektarem." },
  { uroven: 1, polozka: "kapr", skupina: "živočichové", proc: "Kapr je ryba, tedy živočich." },

  { uroven: 2, polozka: "mech", skupina: "rostliny", proc: "Mech je zelený a vyrábí si živiny ze světla, i když nekvete." },
  { uroven: 2, polozka: "kapradina", skupina: "rostliny", proc: "Kapradina nekvete, ale je zelená a fotosyntetizuje." },
  { uroven: 2, polozka: "plíseň na chlebu", skupina: "houby", proc: "Plíseň je drobná houba, která rozkládá potraviny." },
  { uroven: 2, polozka: "kvasinky", skupina: "houby", proc: "Kvasinky jsou drobounké houby, díky nimž kyne těsto." },
  { uroven: 2, polozka: "žížala", skupina: "živočichové", proc: "Žížala je živočich, který se živí zbytky rostlin v půdě." },
  { uroven: 2, polozka: "medúza", skupina: "živočichové", proc: "Medúza je mořský živočich, i když nemá kosti ani mozek." },
  { uroven: 2, polozka: "korál", skupina: "živočichové", proc: "Korál vypadá jako rostlina, ale jsou to drobní živočichové." },

  { uroven: 3, polozka: "rosnatka", skupina: "rostliny", proc: "Rosnatka chytá hmyz, ale je zelená a fotosyntetizuje — je to rostlina." },
  { uroven: 3, polozka: "přeslička", skupina: "rostliny", proc: "Přeslička je zelená výtrusná rostlina." },
  { uroven: 3, polozka: "choroš", skupina: "houby", proc: "Choroš roste na kmeni stromu jako polička a rozkládá dřevo." },
  { uroven: 3, polozka: "hlíva ústřičná", skupina: "houby", proc: "Hlíva roste na dřevě a nemá zelené barvivo." },
  { uroven: 3, polozka: "sasanka mořská", skupina: "živočichové", proc: "Sasanka mořská vypadá jako květina, ale je to živočich, který loví drobnou kořist." },
  { uroven: 3, polozka: "houbovec (mořská houba)", skupina: "živočichové", proc: "Mořská houba se jen tak jmenuje — je to jednoduchý přisedlý živočich." },
];

function gen(level: number): PracticeTask[] {
  return trideni(Z, level, "Roztřiď organismy do říší: rostliny, houby, živočichové.");
}

export const RISEROSTLINHUBZIVOCICHU: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-rise-rostlin-hub-zivocichu",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-rise-rostlin-hub-zivocichu",
    title: "Říše rostlin, hub, živočichů",
    studentTitle: "Živý svět",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Třídění organismů",
    briefDescription: "Poznáš rozdíly mezi říšemi rostlin, hub a živočichů.",
    keywords: ["říše", "rostliny", "houby", "živočichové", "třídění", "organismy", "fotosyntéza"],
    goals: ["Rozlišit základní říše živých organismů", "Popsat způsob výživy rostlin, hub a živočichů", "Zařadit konkrétní organismy do správné říše"],
    boundaries: ["Neprobírá buněčnou biologii do hloubky", "Neprobírá evoluci"],
    gradeRange: [5, 5],
    inputType: "categorize",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Vzpomeň si: rostliny si živiny vyrábějí fotosyntézou, houby rozkládají, živočichové konzumují jiné organismy.",
      steps: ["Zjisti, jak se organismus živí.", "Má chlorofyl? → rostlina", "Rozkládá mrtvé věci? → houba", "Loví nebo spásá jiné organismy? → živočich"],
      commonMistake: "Houby nejsou rostliny – nemají chlorofyl a nefotosyntetizují.",
      example: "Hřib → houba (rozkladač). Dub → rostlina (producent). Zajíc → živočich (konzument).",
    },
  },
];
