import { useState, useEffect } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  threshold?: number;
}

export function DewhiteImg({ src, alt, className, style, threshold = 245 }: Props) {
  const [out, setOut] = useState(src);
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      try {
        const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const px = d.data;
        const fade = threshold - 35;
        for (let i = 0; i < px.length; i += 4) {
          const brightness = (px[i] + px[i + 1] + px[i + 2]) / 3;
          if (brightness > threshold) { px[i + 3] = 0; }
          else if (brightness > fade) { px[i + 3] = Math.round((threshold - brightness) * (255 / (threshold - fade))); }
        }
        ctx.putImageData(d, 0, 0);
        setOut(canvas.toDataURL("image/png"));
      } catch { /* tainted canvas — show original */ }
    };
    img.src = src;
  }, [src, threshold]);
  return <img src={out} alt={alt} className={className} style={style} />;
}
