import type { PracticeTask } from "@/lib/types";
import { choice } from "../_shared";

// Společné pro témata o vzorech podstatných jmen (2026-09-11).
//
// Úloha „jaký tvar má slovo X v N. pádě“: dítě dostane větu s mezerou
// a u každé špatné možnosti se dozví, do kterého pádu ten tvar patří.
// Nápověda ukazuje tvar VZORU v tom pádě — koncovku si dítě přenese samo.
// Pozor na únik: tvar nesmí být podřetězcem slova, které nápověda zmiňuje
// (2. pád mn. č. „škol“ je uvnitř „škola“), detektor hledá podřetězec.

export interface Tvar { form: string; pad: string }

export function tvarUlohy(
  slovo: string,
  pad: string,
  veta: string,
  spravne: string,
  spatne: [Tvar, Tvar, Tvar],
  vzor: string,
  tvarVzoru: string,
): PracticeTask {
  return choice(`Jaký tvar má slovo „${slovo}“ v ${pad}?`, spravne,
    spatne.map((t) => ({ value: t.form, why: `„${t.form}“ je ${t.pad}.` })) as [
      { value: string; why: string }, { value: string; why: string }, { value: string; why: string },
    ], {
      hints: [
        `Doplň do věty „${veta}“ tvar slova „${slovo}“.`,
        `„${slovo}“ se skloňuje podle vzoru ${vzor}. Ten má v tomto pádě tvar „${tvarVzoru}“ — stejnou koncovku dej i slovu „${slovo}“.`,
      ],
      explanation: `Ve větě „${veta.replace("…", spravne)}“ je ${pad}. Vzor ${vzor} tu má tvar „${tvarVzoru}“, proto „${spravne}“.`,
    });
}
