# Oprava alfa kanalu akvarelovych ilustraci na landing page.
#
# PROC: puvodni serverovy "dewhite" mazal pixely podle JASU kdekoli v kresbe.
# Svetla plet ma jas tesne pod prahem, takze ji prokousal -> obliceje na
# barevnych kartach prosvitaji pozadim. Jinde naopak zustaly krycí bile fleky
# (uzavrene oblasti, kam se mazani nedostalo) nebo se vyrizla bila, ktera do
# kresby patri (deska knihy). RGB zustalo ve vsech pripadech zachovane, takze
# staci prepocitat alfu — originaly nejsou potreba.
#
# JAK: pozadi se hleda flood-fillem OD OKRAJU (ne podle jasu), takze vnitrek
# kresby zustane nedotceny. Plne pruhledne pixely (alfa 0) se nechavaji — ty uz
# byly vyriznute zamerne (pozadi pod stolem, mezi nohami zidle). Obnovuje se
# jen ROZEZRANA castecna alfa.
#
# POZOR: pixely se MUSI cist pres LockBits. Graphics.DrawImage premultiplikuje
# a u alfa==0 vynuluje RGB, cimz znici data, ktera potrebujeme.
#
# POUZITI
#   1) Nejdriv sken — vypise uzavrene "kapsy" s id, plochou a bbox:
#      scripts\fix-landing-alpha.ps1 -In src\assets\obr.png -ScanOnly
#   2) Podle bbox rozhodni, co je pozadi a co kresba (bila stranka sesitu,
#      displej tabletu a podrazky bot jsou KRESBA — na ty nesahat).
#   3) Oprava s nahledem na barve karty:
#      scripts\fix-landing-alpha.ps1 -In src\assets\obr.png -Out out.png `
#        -ClearIds 47,39 -FillSeeds "450,120" -Preview nahled.png -PreviewBg "#CCFBF1"
#
#   -ClearIds   ... bile kapsy, ktere maji byt PRUHLEDNE (mezery mezi svlaky
#                   zidle, plocha uvnitr ramu presypacich hodin)
#   -FillSeeds  ... opacny pripad: pruhledna plocha, ktera ma byt KRYCÍ
#                   (deska knihy). Seed = bod uvnitr. Skript hlasi
#                   "POZOR-PROSAKLO-NA-OKRAJ", kdyz vylevka unikne ven.
#
# Barvy karet: bgBlue #EAF2FF, bgGreen #CCFBF1, bgOrange #FFF1E6 (Landing.tsx).
# Cisla id plati jen pro dany vstupni soubor — po zmene skriptu je nutne
# skenovat znovu, protoze se zmeni cislovani komponent.

param(
  [string]$In,
  [string]$Out,
  [int[]]$ClearIds = @(),      # uzavrene bile kapsy -> pruhledne
  [string]$FillSeeds = "",     # "x,y;x,y" -> vylit pruhlednou plochu zpet do krycí
  [string]$Preview = "",
  [string]$PreviewBg = "#CCFBF1",
  [switch]$ScanOnly
)

Add-Type -AssemblyName System.Drawing

$cs = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Collections.Generic;
using System.Text;

public static class Fix4
{
    static int W, H, N;
    static byte[] buf;
    static bool[] isCut, isWhite, cand, bg;
    static int[] st;

    static void Load(string path)
    {
        // POZOR: Graphics.DrawImage premultiplikuje a u alpha==0 vynuluje RGB.
        // Cteme proto primo pres LockBits ze zdrojoveho bitmapu.
        using (Bitmap src = new Bitmap(path))
        {
            W = src.Width; H = src.Height; N = W * H;
            BitmapData bd = src.LockBits(new Rectangle(0,0,W,H), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            buf = new byte[N*4];
            Marshal.Copy(bd.Scan0, buf, 0, buf.Length);
            src.UnlockBits(bd);
        }
        isCut = new bool[N]; isWhite = new bool[N]; cand = new bool[N]; bg = new bool[N]; st = new int[N];
        for (int i = 0; i < N; i++) {
            int o = i*4; int b = buf[o], gg = buf[o+1], r = buf[o+2], a = buf[o+3];
            int mn = Math.Min(r, Math.Min(gg, b)), mx = Math.Max(r, Math.Max(gg, b));
            isCut[i]   = (a == 0);
            isWhite[i] = (mn >= 215) && (mx - mn <= 22);
            cand[i]    = isCut[i] || isWhite[i];
        }
    }

    static void Flood()
    {
        int sp = 0;
        for (int x = 0; x < W; x++) {
            if (cand[x] && !bg[x]) { bg[x]=true; st[sp++]=x; }
            int i2=(H-1)*W+x; if (cand[i2] && !bg[i2]) { bg[i2]=true; st[sp++]=i2; }
        }
        for (int y = 0; y < H; y++) {
            int i1=y*W; if (cand[i1] && !bg[i1]) { bg[i1]=true; st[sp++]=i1; }
            int i2=y*W+W-1; if (cand[i2] && !bg[i2]) { bg[i2]=true; st[sp++]=i2; }
        }
        while (sp > 0) {
            int i = st[--sp]; int x = i % W, y = i / W;
            if (x>0)   { int j=i-1; if (cand[j]&&!bg[j]) { bg[j]=true; st[sp++]=j; } }
            if (x<W-1) { int j=i+1; if (cand[j]&&!bg[j]) { bg[j]=true; st[sp++]=j; } }
            if (y>0)   { int j=i-W; if (cand[j]&&!bg[j]) { bg[j]=true; st[sp++]=j; } }
            if (y<H-1) { int j=i+W; if (cand[j]&&!bg[j]) { bg[j]=true; st[sp++]=j; } }
        }
    }

    static List<int[]> Pockets(int[] clearIds)
    {
        HashSet<int> clear = clearIds == null ? new HashSet<int>() : new HashSet<int>(clearIds);
        int[] lab = new int[N]; for (int i=0;i<N;i++) lab[i]=-1;
        List<int[]> comps = new List<int[]>();
        int id = 0;
        for (int s=0;s<N;s++) {
            if (!cand[s] || bg[s] || lab[s]>=0) continue;
            List<int> px = new List<int>();
            int sp=0; st[sp++]=s; lab[s]=id;
            int minx=W,miny=H,maxx=0,maxy=0,cut=0;
            while (sp>0) {
                int i=st[--sp]; int x=i%W,y=i/W; px.Add(i); if (isCut[i]) cut++;
                if(x<minx)minx=x; if(x>maxx)maxx=x; if(y<miny)miny=y; if(y>maxy)maxy=y;
                if(x>0){int j=i-1; if(cand[j]&&!bg[j]&&lab[j]<0){lab[j]=id;st[sp++]=j;}}
                if(x<W-1){int j=i+1; if(cand[j]&&!bg[j]&&lab[j]<0){lab[j]=id;st[sp++]=j;}}
                if(y>0){int j=i-W; if(cand[j]&&!bg[j]&&lab[j]<0){lab[j]=id;st[sp++]=j;}}
                if(y<H-1){int j=i+W; if(cand[j]&&!bg[j]&&lab[j]<0){lab[j]=id;st[sp++]=j;}}
            }
            if (clear.Contains(id)) foreach (int i in px) bg[i]=true;
            comps.Add(new int[]{px.Count,minx,miny,maxx,maxy,id,cut});
            id++;
        }
        return comps;
    }

    // paint-bucket: od seedu pres pixely s alpha==0, zastavi se na cemkoli krycim
    // vraci "pocet;dotklo-se-okraje"
    static string BucketFill(int sx, int sy, bool[] filled)
    {
        int seed = sy*W + sx;
        if (buf[seed*4+3] != 0) return "0;seed-neni-pruhledny";
        bool[] vis = new bool[N];
        int sp=0; st[sp++]=seed; vis[seed]=true;
        int count=0; bool touchedEdge=false;
        while (sp>0) {
            int i=st[--sp]; int x=i%W,y=i/W;
            filled[i]=true; count++;
            if (x==0||y==0||x==W-1||y==H-1) touchedEdge=true;
            if(x>0){int j=i-1; if(!vis[j]&&buf[j*4+3]==0){vis[j]=true;st[sp++]=j;}}
            if(x<W-1){int j=i+1; if(!vis[j]&&buf[j*4+3]==0){vis[j]=true;st[sp++]=j;}}
            if(y>0){int j=i-W; if(!vis[j]&&buf[j*4+3]==0){vis[j]=true;st[sp++]=j;}}
            if(y<H-1){int j=i+W; if(!vis[j]&&buf[j*4+3]==0){vis[j]=true;st[sp++]=j;}}
        }
        return count + ";" + (touchedEdge ? "POZOR-PROSAKLO-NA-OKRAJ" : "uzavrene-ok");
    }

    public static string Scan(string inPath, int minArea)
    {
        Load(inPath); Flood();
        List<int[]> comps = Pockets(null);
        int cutInside=0; foreach (int[] c in comps) cutInside += c[6];
        comps.Sort(delegate(int[] a, int[] b){ return b[0].CompareTo(a[0]); });
        StringBuilder sb = new StringBuilder();
        sb.AppendLine(W+"x"+H+"  kapes: "+comps.Count+"  vyriznutych px uvnitr: "+cutInside);
        foreach (int[] c in comps) {
            if (c[0] < minArea) continue;
            sb.AppendLine(string.Format("  id={0,-4} plocha={1,-7} bbox=({2},{3})-({4},{5})  vyriznutych={6}",
                c[5], c[0], c[1], c[2], c[3], c[4], c[6]));
        }
        return sb.ToString();
    }

    public static string Repair(string inPath, string outPath, int[] clearIds, string fillSeeds)
    {
        Load(inPath); Flood(); Pockets(clearIds);
        StringBuilder log = new StringBuilder();

        bool[] filled = new bool[N];
        if (!string.IsNullOrEmpty(fillSeeds)) {
            foreach (string s in fillSeeds.Split(';')) {
                if (s.Trim().Length == 0) continue;
                string[] p = s.Split(',');
                int sx = int.Parse(p[0].Trim()), sy = int.Parse(p[1].Trim());
                log.Append("  seed(" + sx + "," + sy + ") -> " + BucketFill(sx, sy, filled) + "\n");
            }
        }

        int restored=0, cleared=0;
        const int solid=248, fade=215;
        for (int i=0;i<N;i++) {
            int o=i*4; byte oldA=buf[o+3]; byte newA;
            int r=buf[o+2], gg=buf[o+1], b=buf[o];

            // Plne pruhledne uz je vyrizle zamerne (pozadi pod stolem, mezi nohami
            // zidle) -> nechat. Obnovuje se jen ROZEZRANA castecna alfa.
            if (filled[i]) newA = 255;                        // vylito zpet seedem
            else if (isCut[i]) newA = 0;
            else if (bg[i]) {
                int br=(r+gg+b)/3;
                if (br>=solid) newA=0;
                else { int aa=(solid-br)*255/(solid-fade); newA=(byte)(aa>255?255:(aa<0?0:aa)); }
            }
            else newA = 255;

            if (newA>oldA+8) restored++;
            if (oldA>200 && newA<40) cleared++;
            buf[o+3]=newA;
        }

        using (Bitmap outBmp = new Bitmap(W,H,PixelFormat.Format32bppArgb)) {
            BitmapData bd = outBmp.LockBits(new Rectangle(0,0,W,H), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
            Marshal.Copy(buf,0,bd.Scan0,buf.Length);
            outBmp.UnlockBits(bd);
            outBmp.Save(outPath, ImageFormat.Png);
        }
        log.Append("  obnoveno=" + restored + "  odstraneno bilych=" + cleared);
        return log.ToString();
    }

    public static string Composite(string inPath, string outPath, string hexBg)
    {
        Color bgc = ColorTranslator.FromHtml(hexBg);
        using (Bitmap src = new Bitmap(inPath)) {
            int w=src.Width,h=src.Height;
            BitmapData bd = src.LockBits(new Rectangle(0,0,w,h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            byte[] p = new byte[w*h*4];
            Marshal.Copy(bd.Scan0,p,0,p.Length);
            src.UnlockBits(bd);
            for (int i=0;i<w*h;i++) {
                int o=i*4; double a=p[o+3]/255.0;
                p[o]  =(byte)Math.Round(p[o]  *a + bgc.B*(1-a));
                p[o+1]=(byte)Math.Round(p[o+1]*a + bgc.G*(1-a));
                p[o+2]=(byte)Math.Round(p[o+2]*a + bgc.R*(1-a));
                p[o+3]=255;
            }
            using (Bitmap dst = new Bitmap(w,h,PixelFormat.Format32bppArgb)) {
                BitmapData bd2 = dst.LockBits(new Rectangle(0,0,w,h), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
                Marshal.Copy(p,0,bd2.Scan0,p.Length);
                dst.UnlockBits(bd2);
                dst.Save(outPath, ImageFormat.Png);
            }
            return "";
        }
    }
}
"@
Add-Type -TypeDefinition $cs -ReferencedAssemblies System.Drawing

if ($ScanOnly) { [Fix4]::Scan($In, 300) }
else {
  [Fix4]::Repair($In, $Out, $ClearIds, $FillSeeds)
  if ($Preview -ne "") { [Fix4]::Composite($Out, $Preview, $PreviewBg) | Out-Null; "  nahled: $Preview" }
}
