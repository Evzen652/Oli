import { useNavigate } from "react-router-dom";
import { OlyLogo } from "@/components/OlyLogo";

export default function Onboarding() {
  const navigate = useNavigate();

  const handleGradeSelect = (grade: number) => {
    localStorage.setItem("oli_anon_grade", String(grade));
    localStorage.setItem("oli_anon_started", new Date().toISOString());
    navigate("/student?anon=1");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="max-w-sm w-full space-y-8 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <OlyLogo size="lg" />
          <h1 className="text-3xl font-bold text-gray-900">Vítej v OLI!</h1>
          <p className="text-gray-500 text-lg">Jaký chodíš ročník?</p>
        </div>

        {/* Mřížka ročníků */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((grade) => (
            <button
              key={grade}
              onClick={() => handleGradeSelect(grade)}
              className="aspect-square rounded-2xl border-2 border-violet-200 bg-white
                         text-2xl font-bold text-violet-700
                         hover:bg-violet-50 hover:border-violet-400 hover:shadow-md
                         active:scale-95 transition-all cursor-pointer"
            >
              {grade}.
            </button>
          ))}
        </div>

        {/* Odkaz pro rodiče */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Jsi rodič?{" "}
            <a
              href="/auth?mode=register"
              className="text-violet-600 hover:underline font-medium"
            >
              Zaregistrovat se →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
