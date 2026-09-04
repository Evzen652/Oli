import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { oliPozdrav } from "@/lib/oliPoses";
import { PaintedArrow } from "@/components/icons/PaintedArrow";
import { gradeIllustration } from "@/lib/gradeIllustrations";
import { isGradeAvailable } from "@/lib/contentAvailability";
import { startTrial } from "@/lib/anonTrial";
import { serverStartTrial } from "@/lib/anonServerSync";
import { writeLocal } from "@/lib/safeStorage";
import { LandingNav } from "@/pages/LandingNav";
import { BackButton } from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";

const S = "https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images";

const COLORS = [
  "bg-red-300","bg-orange-300","bg-yellow-300","bg-lime-300",
  "bg-green-300","bg-teal-300","bg-cyan-300","bg-sky-300",
  "bg-blue-300","bg-indigo-300","bg-violet-300","bg-purple-300",
  "bg-fuchsia-300","bg-pink-300","bg-rose-300","bg-amber-300",
];
const DOT_SIZES = [20, 24, 28, 32, 18, 22, 26, 30];

type Dot = { x: number; y: number; vx: number; vy: number; r: number; color: string };

function BouncingDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init dots
    dotsRef.current = Array.from({ length: 32 }, (_, i) => {
      const r = DOT_SIZES[i % DOT_SIZES.length] / 2;
      return {
        x: r + Math.random() * (window.innerWidth - r * 2),
        y: r + Math.random() * (window.innerHeight - r * 2),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r,
        color: COLORS[i % COLORS.length],
      };
    });

    // Tailwind color → hex lookup
    const colorMap: Record<string, string> = {
      "bg-red-300": "#fca5a5", "bg-orange-300": "#fdba74", "bg-yellow-300": "#fde047",
      "bg-lime-300": "#bef264", "bg-green-300": "#86efac", "bg-teal-300": "#5eead4",
      "bg-cyan-300": "#67e8f9", "bg-sky-300": "#7dd3fc", "bg-blue-300": "#93c5fd",
      "bg-indigo-300": "#a5b4fc", "bg-violet-300": "#c4b5fd", "bg-purple-300": "#d8b4fe",
      "bg-fuchsia-300": "#f0abfc", "bg-pink-300": "#f9a8d4", "bg-rose-300": "#fda4af",
      "bg-amber-300": "#fcd34d",
    };

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      for (const d of dotsRef.current) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x - d.r < 0)  { d.x = d.r;    d.vx = Math.abs(d.vx); }
        if (d.x + d.r > w)  { d.x = w - d.r; d.vx = -Math.abs(d.vx); }
        if (d.y - d.r < 0)  { d.y = d.r;    d.vy = Math.abs(d.vy); }
        if (d.y + d.r > h)  { d.y = h - d.r; d.vy = -Math.abs(d.vy); }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = colorMap[d.color] ?? "#ccc";
        ctx.globalAlpha = 0.4;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0" aria-hidden="true" />;
}

/**
 * Barvy dlaždic ročníků — **tlumená akvarelová paleta, ne Tailwind duha**.
 *
 * Dvě věci naráz, které jdou proti sobě: dlaždice mají působit jako **jedna
 * sada**, a zároveň **vesele**. Řeší to dělba rolí — o „jedné sadě" rozhoduje
 * **společná světlost** (85 % nahoře, 77 % dole), o veselosti **sytost**
 * (75 %). Mění se jen tón; kdyby se lišila i světlost, rozpadne se to na
 * devět nesouvisejících barev.
 *
 * Cesta sem vedla přes tři zavržené verze — každá selhala na něčem jiném:
 *  1. Tailwind `-400/-500` (S přes 90 %, L ~52 %) — vedle akvarelů křičely,
 *     protože měly nízkou světlost, ne proto, že byly syté;
 *  2. tlumená (S 40 %, L 66–76 %) — ke kresbám seděla, ale devět sytých
 *     odstínů vedle sebe pořád četlo jako duha;
 *  3. skoro jednotná (S 30 %, L 86–92 %) — jedna sada ano, ale bez života.
 *
 * Hexy, ne Tailwind třídy: Tailwind tuhle kombinaci sytosti a světlosti
 * v paletě systematicky nemá.
 */
const GRADE_META: Record<number, {
  from: string; to: string; border: string; rotate: string;
}> = {
  1: { from: "#F5C9BC", to: "#F2AC97", border: "#ED8768", rotate: "-rotate-3" },  // korálová
  2: { from: "#F5DBBC", to: "#F2C797", border: "#EDAF68", rotate: "rotate-2"  },  // okrová
  3: { from: "#F5EABC", to: "#F2DF97", border: "#EDD368", rotate: "-rotate-2" },  // hořčicová
  4: { from: "#D7F5BC", to: "#C1F297", border: "#A6ED68", rotate: "rotate-3"  },  // šalvějová
  5: { from: "#BCF5DE", to: "#97F2CC", border: "#68EDB6", rotate: "-rotate-1" },  // mátová
  6: { from: "#BCEEF5", to: "#97E5F2", border: "#68DCED", rotate: "rotate-2"  },  // petrolejová
  7: { from: "#BCD5F5", to: "#97BEF2", border: "#68A2ED", rotate: "-rotate-3" },  // zaprášená modrá
  8: { from: "#CDBCF5", to: "#B297F2", border: "#9068ED", rotate: "rotate-1"  },  // levandulová
  9: { from: "#F5BCCF", to: "#F297B5", border: "#ED6895", rotate: "-rotate-2" },  // růžová
};

/**
 * Číslo na dlaždici „brzy" — tmavý inkoust, stejná rodina jako kontura kreseb.
 *
 * Krytí je **0,8, ne 0,6**. Dlaždice nedostupného ročníku se navíc odbarvuje
 * a ztlumuje, takže se výsledná barva posune ke světlé. Na finální paletě
 * vychází nejhorší případ (levandulová) **3,69**; u zavržené skoro jednotné
 * verze spadl při krytí 0,6 na **2,98**, tedy pod práh 3,0 pro velký text.
 *
 * Kontrast se počítá proti barvě PO filtrech, ne proti hexu z `GRADE_META` —
 * ten je znatelně sytější a dal by falešně příznivé číslo.
 */
const GRADE_INK = "#4A4038";

export default function Onboarding() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGradeSelect = (grade: number) => {
    if (selected !== null) return;
    if (!isGradeAvailable(grade)) {
      toast({ title: "Připravuje se", description: `Obsah pro ${grade}. ročník brzy přidáme.` });
      return;
    }
    setSelected(grade);
    // Zápis smí selhat (anonymní režim, zakázaná data stránek) — trial se
    // pak neuloží, ale dítě se do procvičování dostane. Dřív tu výjimka
    // zabila první klik nového návštěvníka.
    writeLocal("oli_anon_grade", String(grade));
    writeLocal("oli_anon_started", new Date().toISOString());
    startTrial(grade);
    serverStartTrial(grade); // Fáze 3: zrcadlení trialu na server (fire-and-forget)
    setTimeout(() => navigate("/student?anon=1"), 650);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-hidden">
      <LandingNav />



      <div className="flex-1 flex flex-col items-center p-8">
        <div className="max-w-lg w-full">
          <div className="mb-6">
            <BackButton />
          </div>
        </div>
        <div className="max-w-lg w-full space-y-10 text-center">

          <div className="flex flex-col items-center gap-4">
            {/* Mávající póza, ne logo — nadpis pod ní je „Ahoj! Já jsem Oli." */}
            <img src={oliPozdrav} alt="" className="h-20 w-20 object-contain" />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Ahoj! Já jsem Oli.
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Pomůžu ti se vším, co máš teď ve škole.<br />
                Jen mi řekni, do které třídy chodíš a jdeme na to.
              </p>
            </div>
          </div>


          {/* Rodičovský vstup — viditelně před výběrem ročníku */}
          <a
            href="/auth?mode=register"
            className="flex items-center justify-between rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-5 py-3.5 hover:bg-emerald-100 transition-colors text-left"
          >
            <div>
              <p className="font-bold text-emerald-900 text-base">Jsem rodič</p>
              <p className="text-sm text-emerald-700">Chci zadávat úkoly a sledovat pokrok dítěte</p>
            </div>
            <PaintedArrow className="h-5 w-5 text-emerald-500 shrink-0 ml-3" />
          </a>

          <div className="space-y-4">
            <p className="text-slate-800 font-bold text-2xl">Vyber svůj ročník</p>
            <div className="grid grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((grade) => {
                const available = isGradeAvailable(grade);
                const m = GRADE_META[grade];
                const isSelected = selected === grade;
                const isOther = selected !== null && selected !== grade;
                const illustration = gradeIllustration(grade);
                return (
                  <button
                    key={grade}
                    onClick={() => handleGradeSelect(grade)}
                    style={{
                      transition: "transform 0.4s cubic-bezier(.34,1.56,.64,1), opacity 0.35s ease, box-shadow 0.3s ease",
                      transform: isSelected
                        ? "scale(1.25) rotate(0deg)"
                        : isOther
                        ? "scale(0.82)"
                        : undefined,
                      // Ztlumení nedostupného ročníku MUSÍ být tady, ne třídou.
                      // Inline `style` přebíjí Tailwind, takže `opacity-60`
                      // v `className` se nikdy neuplatnilo — ověřeno přes
                      // `getComputedStyle`, vracelo 1. Dlaždice „brzy" se tedy
                      // jen odbarvovaly, nikdy neztlumily.
                      opacity: isOther ? 0.35 : available ? 1 : 0.7,
                      boxShadow: isSelected ? "0 0 0 6px rgba(255,255,255,0.7), 0 8px 32px rgba(0,0,0,0.18)" : undefined,
                      // Hexy z GRADE_META, ne Tailwind třídy — tlumené odstíny
                      // akvarelů Tailwind v paletě nemá.
                      backgroundImage: `linear-gradient(to bottom right, ${m.from}, ${m.to})`,
                      borderColor: m.border,
                      color: GRADE_INK,
                    }}
                    className={`
                      relative overflow-hidden aspect-square rounded-2xl border-2
                      flex flex-col items-center justify-center shadow-md
                      ${selected === null ? "cursor-pointer hover:shadow-xl hover:rotate-0 hover:scale-105 active:scale-95 transition-all duration-200" : "cursor-default"}
                      ${selected === null ? m.rotate : ""}
                      ${/* Šest z devíti ročníků je „brzy", takže o dojmu ze
                            stránky rozhoduje hlavně odbarvení. Původní 0,35
                            z nich dělalo šedivé placky i na veselé paletě.
                            Zjemněno na 0,55: barevnost dlaždice stoupla
                            z 11,7 na 21,4 a kontrast čísla drží 4,10.
                            Ztlumení (opacity) je v `style` — třídou se
                            neuplatní, viz komentář výše. */
                        available ? "" : "saturate-[0.55]"}
                    `}
                  >
                    {/* Ročník s obsahem dostane portrét + číslo jako odznak;
                        ročník „brzy" zůstává u holého čísla. Rozdíl mezi
                        hotovým a chystaným je tím vidět, ne jen z popisku. */}
                    {illustration ? (
                      <>
                        <img
                          src={illustration}
                          alt=""
                          className="h-[72%] w-[72%] object-contain drop-shadow-sm select-none"
                        />
                        <span className="absolute top-1.5 left-1.5 h-8 w-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-slate-800 text-base font-black leading-none select-none">
                          {grade}
                        </span>
                      </>
                    ) : (
                      <span className="text-[5rem] font-black leading-none opacity-80 select-none">
                        {grade}
                      </span>
                    )}
                    {!available && (
                      <span className="absolute bottom-1.5 inset-x-0 text-center text-[0.65rem] font-bold uppercase tracking-wider select-none">
                        brzy
                      </span>
                    )}
                    {isSelected && (
                      <span
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          animation: "gradeRipple 0.6s ease-out forwards",
                          background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <style>{`
            @keyframes gradeRipple {
              0%   { opacity: 1; transform: scale(0.3); }
              100% { opacity: 0; transform: scale(2.2); }
            }
          `}</style>

          <div className="pt-4 border-t border-slate-200 space-y-1.5">
            <p className="text-sm text-slate-600 leading-relaxed">
              Chcete dítěti zadávat úkoly a sledovat pokrok?
            </p>
            <a
              href="/auth?mode=register"
              className="text-sm font-medium text-orange-500 hover:text-orange-600 hover:underline transition-colors inline-flex items-center gap-1.5"
            >
              Jsem tady jako rodič <PaintedArrow className="h-4 w-4" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
