import owlSrc from "@/assets/oli-owl.png";

export { owlSrc as logoNoText };

interface OlyLogoProps {
  size?: "xs" | "sm" | "md";
  variant?: "text" | "notext";
  onClick?: () => void;
}

const SIZE = {
  xs: { owl: "h-9 w-9",  text: "text-2xl" },
  sm: { owl: "h-12 w-12", text: "text-3xl" },
  md: { owl: "h-20 w-20", text: "text-5xl" },
};

export function OlyLogo({ size = "md", variant = "text", onClick }: OlyLogoProps) {
  const s = SIZE[size];
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 focus:outline-none hover:opacity-80 transition-opacity"
      aria-label="Oli – zpět na úvod"
    >
      <img
        src={owlSrc}
        alt=""
        className={`${s.owl} object-contain`}
      />
      {variant === "text" && (
        <span
          className={`${s.text} font-extrabold leading-none select-none`}
          style={{
            fontFamily: "'Nunito', sans-serif",
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Oli
        </span>
      )}
    </button>
  );
}
