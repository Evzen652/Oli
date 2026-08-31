# Prebarveni bile plochy v akvarelove ilustraci (napr. deska knihy).
#
# JAK: obarvuje NASOBENIM pres jas, takze zustane akvarelova textura i
# stinovani — nevznikne plocha z vektoru. -Strength michá vysledek zpet
# s puvodnim papirem (0.70 je vyrazne, ale porad akvarel; 1.0 uz je plna barva).
#
# Vyber plochy: flood-fill od seedu pres "papir" (kryci, svetly, malo sytý),
# pak ZAPLNENI DER — co je uzavrene uvnitr te plochy, patri k ni taky.
# Bez toho zustanou skla bryli a bile halo kolem obroucek neobarvene.
# Barevne obroucky, inkoust, hrnek i bile stranky se vyradi samy: bud
# neprojdou testem na papir, nebo nejsou uvnitr vybrane plochy.
#
# POUZITI
#   scripts\tint-illustration.ps1 -In src\assets\obr.png -Out out.png `
#     -Seed "450,120;700,350" -Color "#F97316" -Strength 0.70 `
#     -Preview nahled.png -PreviewBg "#CCFBF1"
#
# Seed = bod uvnitr plochy, ktera se ma prebarvit; vic seedu oddel strednikem.
# Barvy karet: bgBlue #EAF2FF, bgGreen #CCFBF1, bgOrange #FFF1E6 (Landing.tsx),
# znackova oranzova #F97316.
#
# Pozor: pixely se ctou pres LockBits — Graphics.DrawImage premultiplikuje
# a u alfa 0 vynuluje RGB. Viz scripts\fix-landing-alpha.ps1.

param([string]$In, [string]$Out, [string]$Seed = "450,120", [string]$Color = "#F97316", [double]$Strength = 1.0, [string]$Preview = "", [string]$PreviewBg = "#CCFBF1")

Add-Type -AssemblyName System.Drawing

$cs = @"
using System;using System.Drawing;using System.Drawing.Imaging;using System.Runtime.InteropServices;

public static class Tint
{
    public static string Run(string inPath, string outPath, string seeds, string hex, double strength)
    {
        Color bc = ColorTranslator.FromHtml(hex);
        int W, H, N; byte[] buf;
        using (Bitmap src = new Bitmap(inPath)) {
            W = src.Width; H = src.Height; N = W*H;
            BitmapData bd = src.LockBits(new Rectangle(0,0,W,H), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            buf = new byte[N*4]; Marshal.Copy(bd.Scan0, buf, 0, buf.Length); src.UnlockBits(bd);
        }

        // papir = kryci, svetly, malo sytý  (inkoust, bryle i hrnek se vyradi samy)
        bool[] paper = new bool[N];
        for (int i=0;i<N;i++) {
            int o=i*4; int b=buf[o], g=buf[o+1], r=buf[o+2], a=buf[o+3];
            int mn=Math.Min(r,Math.Min(g,b)), mx=Math.Max(r,Math.Max(g,b));
            paper[i] = (a>=250) && (mn>=170) && (mx-mn<=42);
        }

        bool[] sel = new bool[N]; int[] st = new int[N]; int total=0;
        foreach (string s in seeds.Split(';')) {
            if (s.Trim().Length==0) continue;
            string[] p = s.Split(',');
            int sx=int.Parse(p[0].Trim()), sy=int.Parse(p[1].Trim());
            int seed = sy*W+sx;
            if (!paper[seed]) return "seed (" + sx + "," + sy + ") neni papir";
            if (sel[seed]) continue;
            int sp=0; st[sp++]=seed; sel[seed]=true; int cnt=0;
            while (sp>0) {
                int i=st[--sp]; int x=i%W,y=i/W; cnt++;
                if(x>0){int j=i-1; if(paper[j]&&!sel[j]){sel[j]=true;st[sp++]=j;}}
                if(x<W-1){int j=i+1; if(paper[j]&&!sel[j]){sel[j]=true;st[sp++]=j;}}
                if(y>0){int j=i-W; if(paper[j]&&!sel[j]){sel[j]=true;st[sp++]=j;}}
                if(y<H-1){int j=i+W; if(paper[j]&&!sel[j]){sel[j]=true;st[sp++]=j;}}
            }
            total += cnt;
        }

        // Zaplneni der: co je UZAVRENE uvnitr vybrane plochy (skla bryli, bile
        // halo kolem obroucek, drobne tecky na hrane desky), patri taky k desce.
        // Barevne obroucky a inkoust si vyradi az test na "papir" nize.
        bool[] outside = new bool[N];
        int sp2 = 0;
        for (int x=0;x<W;x++) {
            if(!sel[x]&&!outside[x]){outside[x]=true;st[sp2++]=x;}
            int i2=(H-1)*W+x; if(!sel[i2]&&!outside[i2]){outside[i2]=true;st[sp2++]=i2;}
        }
        for (int y=0;y<H;y++) {
            int i1=y*W; if(!sel[i1]&&!outside[i1]){outside[i1]=true;st[sp2++]=i1;}
            int i2=y*W+W-1; if(!sel[i2]&&!outside[i2]){outside[i2]=true;st[sp2++]=i2;}
        }
        while (sp2>0) {
            int i=st[--sp2]; int x=i%W,y=i/W;
            if(x>0){int j=i-1; if(!sel[j]&&!outside[j]){outside[j]=true;st[sp2++]=j;}}
            if(x<W-1){int j=i+1; if(!sel[j]&&!outside[j]){outside[j]=true;st[sp2++]=j;}}
            if(y>0){int j=i-W; if(!sel[j]&&!outside[j]){outside[j]=true;st[sp2++]=j;}}
            if(y<H-1){int j=i+W; if(!sel[j]&&!outside[j]){outside[j]=true;st[sp2++]=j;}}
        }
        int holes=0;
        for (int i=0;i<N;i++) if (!sel[i] && !outside[i]) { sel[i]=true; holes++; }

        // nasobeni pres jas: bily papir -> plna barva, stin -> tmavsi odstin.
        // Zachova akvarelovou texturu i stinovani desky.
        // strength < 1 michá vysledek zpet s puvodnim papirem -> jemnejsi,
        // akvarelovejsi odstin misto plne plochy
        int painted=0;
        for (int i=0;i<N;i++) {
            if (!sel[i]) continue;
            int o=i*4;
            bool gap = (buf[o+3] == 0);   // pruhledna tecka uvnitr desky
            // barevne obroucky a inkoust nechat byt
            if (!paper[i] && !gap) continue;
            if (gap) buf[o+3] = 255;
            double l = ((buf[o]+buf[o+1]+buf[o+2])/3.0) / 255.0;
            buf[o]   = (byte)Math.Round(buf[o]   * (1-strength) + bc.B * l * strength);
            buf[o+1] = (byte)Math.Round(buf[o+1] * (1-strength) + bc.G * l * strength);
            buf[o+2] = (byte)Math.Round(buf[o+2] * (1-strength) + bc.R * l * strength);
            painted++;
        }
        total = painted;

        using (Bitmap dst = new Bitmap(W,H,PixelFormat.Format32bppArgb)) {
            BitmapData bd = dst.LockBits(new Rectangle(0,0,W,H), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
            Marshal.Copy(buf,0,bd.Scan0,buf.Length); dst.UnlockBits(bd);
            dst.Save(outPath, ImageFormat.Png);
        }
        return "obarveno " + total + " px barvou " + hex + " (zaplneno der: " + holes + ")";
    }

    public static void Composite(string inPath, string outPath, string hexBg)
    {
        Color bgc = ColorTranslator.FromHtml(hexBg);
        using (Bitmap src = new Bitmap(inPath)) {
            int w=src.Width,h=src.Height;
            BitmapData bd = src.LockBits(new Rectangle(0,0,w,h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            byte[] p = new byte[w*h*4]; Marshal.Copy(bd.Scan0,p,0,p.Length); src.UnlockBits(bd);
            for (int i=0;i<w*h;i++) { int o=i*4; double a=p[o+3]/255.0;
                p[o]  =(byte)Math.Round(p[o]  *a + bgc.B*(1-a));
                p[o+1]=(byte)Math.Round(p[o+1]*a + bgc.G*(1-a));
                p[o+2]=(byte)Math.Round(p[o+2]*a + bgc.R*(1-a));
                p[o+3]=255; }
            using (Bitmap d = new Bitmap(w,h,PixelFormat.Format32bppArgb)) {
                BitmapData b2 = d.LockBits(new Rectangle(0,0,w,h), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
                Marshal.Copy(p,0,b2.Scan0,p.Length); d.UnlockBits(b2);
                d.Save(outPath, ImageFormat.Png);
            }
        }
    }
}
"@
Add-Type -TypeDefinition $cs -ReferencedAssemblies System.Drawing

[Tint]::Run($In, $Out, $Seed, $Color, $Strength)
if ($Preview -ne "") { [Tint]::Composite($Out, $Preview, $PreviewBg) }
