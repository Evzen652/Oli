import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { OlyLogo } from "@/components/OlyLogo";
import { hasContentForGrade } from "@/lib/contentAvailability";
import { startTrial } from "@/lib/anonTrial";
import { LandingNav } from "@/pages/LandingNav";
import { BackButton } from "@/components/BackButton";

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

const GRADE_META: Record<number, {
  gradient: string; border: string; text: string; rotate: string;
}> = {
  1: { gradient: "from-red-400 to-rose-500",       border: "border-red-500",     text: "text-white",       rotate: "-rotate-3"  },
  2: { gradient: "from-orange-400 to-amber-500",   border: "border-orange-500",  text: "text-white",       rotate: "rotate-2"   },
  3: { gradient: "from-yellow-300 to-amber-400",   border: "border-yellow-500",  text: "text-yellow-900",  rotate: "-rotate-2"  },
  4: { gradient: "from-lime-400 to-green-500",     border: "border-green-600",   text: "text-green-900",   rotate: "rotate-3"   },
  5: { gradient: "from-emerald-400 to-teal-500",   border: "border-teal-600",    text: "text-white",       rotate: "-rotate-1"  },
  6: { gradient: "from-cyan-400 to-sky-500",       border: "border-sky-600",     text: "text-white",       rotate: "rotate-2"   },
  7: { gradient: "from-blue-400 to-indigo-500",    border: "border-indigo-600",  text: "text-white",       rotate: "-rotate-3"  },
  8: { gradient: "from-violet-400 to-purple-600",  border: "border-violet-700",  text: "text-white",       rotate: "rotate-1"   },
  9: { gradient: "from-fuchsia-400 to-pink-600",   border: "border-fuchsia-600", text: "text-white",       rotate: "-rotate-2"  },
};

export default function Onboarding() {
  const navigate = useNavigate();

  const handleGradeSelect = (grade: number) => {
    localStorage.setItem("oli_anon_grade", String(grade));
    localStorage.setItem("oli_anon_started", new Date().toISOString());
    startTrial(grade); // spustí 14-denní trial (idempotent)
    navigate("/student?anon=1");
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
            <OlyLogo size="md" variant="notext" />
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


          <div className="space-y-4">
            <p className="text-slate-700 font-semibold text-base">Vyber ročník</p>
            <div className="grid grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((grade) => {
                const hasContent = hasContentForGrade(grade);
                const m = GRADE_META[grade];
                return (
                  <button
                    key={grade}
                    onClick={() => handleGradeSelect(grade)}
                    title={hasContent ? undefined : "Obsah připravujeme — zatím dostaneš cvičení z jiného ročníku"}
                    className={`
                      relative overflow-hidden aspect-square rounded-2xl border-2 bg-gradient-to-br
                      transition-all duration-200 cursor-pointer active:scale-95
                      flex items-center justify-center shadow-md hover:shadow-xl hover:rotate-0 hover:scale-105
                      ${m.gradient} ${m.border} ${m.text} ${m.rotate}
                      ${!hasContent ? "opacity-60" : ""}
                    `}
                  >
                    <span className="text-[5rem] font-black leading-none opacity-60 select-none">
                      {grade}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-1.5">
            <p className="text-sm text-slate-600 leading-relaxed">
              Chcete dítěti zadávat úkoly a sledovat pokrok?
            </p>
            <a
              href="/auth?mode=register"
              className="text-sm font-medium text-orange-500 hover:text-orange-600 hover:underline transition-colors inline-flex"
            >
              Jsem tady jako rodič →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
