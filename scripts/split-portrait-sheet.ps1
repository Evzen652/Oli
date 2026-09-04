# Rozreze list s vice portrety vedle sebe na jednotlive ctvercove avatary
# a vyrovna je na STEJNOU velikost hlavy.
#
# PROC podle hlavy a ne podle obsahu: model hlavy nesrovna ani kdyz si o to
# reknes. U prvni dvojice (2026-08-31) byla maminčina hlava o 22 % vetsi nez
# chlapcova — proste rozriznout list by dalo v dlazdicich viditelne ruzne
# velke obliceje. Vyrez je proto ctverec o strane 1,75 x vyska hlavy,
# vystredeny na hlavu; po zvetseni na -Size ma pak hlava v obou 57 % vysky.
#
# POSTUP
#   1) Zmer polohu a vysku hlav:
#        scripts\split-portrait-sheet.ps1 -In list.jpg -Measure
#      Vypise bloky obsahu a profil sirek po radcich. Vyska hlavy = od vrchu
#      vlasu po nejuzsi misto (krk), tedy tam, kde sirka klesne na minimum
#      pred tim, nez zase zacne rust (ramena).
#   2) Rozrez:
#        scripts\split-portrait-sheet.ps1 -In list.jpg -OutDir out `
#          -Subjects "role-rodic:366:79:330;role-zak:1110:109:270" -Size 256
#      Format polozky: nazev:stredHlavyX:vrchHlavyY:vyskaHlavy
#   3) Vyrez bile pozadi:
#        scripts\fix-landing-alpha.ps1 -In out\role-rodic.png -Out ... -Preview ...
#
# Velikost: dlazdice vyberu role je 64 px, na 3x retinu staci 192 px.
# -Size 256 dava 4x rezervu a soubor ~107 kB; 512 uz je zbytecnych ~410 kB.

param(
  [Parameter(Mandatory = $true)][string]$In,
  [string]$OutDir,
  [string]$Subjects,
  [int]$Size = 256,
  [switch]$Measure
)

Add-Type -AssemblyName System.Drawing

$cs = @"
using System;using System.Drawing;using System.Drawing.Imaging;
using System.Runtime.InteropServices;using System.Text;
public static class Sheet {
  static byte[] buf; static int W, H;
  static void Load(string p){
    using(Bitmap b=new Bitmap(p)){
      W=b.Width;H=b.Height;
      BitmapData bd=b.LockBits(new Rectangle(0,0,W,H),ImageLockMode.ReadOnly,PixelFormat.Format32bppArgb);
      buf=new byte[W*H*4];Marshal.Copy(bd.Scan0,buf,0,buf.Length);b.UnlockBits(bd);}}
  static bool Ink(int x,int y){
    int o=(y*W+x)*4;int b=buf[o],g=buf[o+1],r=buf[o+2];
    return Math.Min(r,Math.Min(g,b))<225;}
  public static string Measure(string p,int step){
    Load(p);
    StringBuilder sb=new StringBuilder();
    sb.AppendLine("rozmer "+W+"x"+H);
    bool[] empty=new bool[W];
    for(int x=0;x<W;x++){bool e=true;for(int y=0;y<H;y++)if(Ink(x,y)){e=false;break;}empty[x]=e;}
    int i=0;
    while(i<W){
      if(empty[i]){i++;continue;}
      int s=i; while(i<W&&!empty[i])i++;
      int e2=i-1,top=H,bot=0;
      for(int x=s;x<=e2;x++)for(int y=0;y<H;y++)if(Ink(x,y)){if(y<top)top=y;if(y>bot)bot=y;}
      sb.AppendLine("blok x "+s+".."+e2+"  y "+top+".."+bot);
      for(int y=top;y<=bot;y+=step){
        int lo=-1,hi=-1;
        for(int x=s;x<=e2;x++)if(Ink(x,y)){if(lo<0)lo=x;hi=x;}
        sb.AppendLine("   y="+y+" sirka="+(lo<0?0:hi-lo+1)+" stred="+(lo<0?0:(lo+hi)/2));}
    }
    return sb.ToString();}
}
"@
Add-Type -TypeDefinition $cs -ReferencedAssemblies System.Drawing

if ($Measure) { [Sheet]::Measure($In, 30); return }

if (-not $OutDir -or -not $Subjects) { throw "Bez -Measure je potreba -OutDir a -Subjects" }
New-Item -ItemType Directory -Force $OutDir | Out-Null

$src = New-Object System.Drawing.Bitmap $In
"zdroj $($src.Width)x$($src.Height)"

foreach ($spec in $Subjects.Split(';')) {
  if (-not $spec.Trim()) { continue }
  $f = $spec.Split(':')
  $name = $f[0]; $cx = [int]$f[1]; $headTop = [int]$f[2]; $headH = [int]$f[3]

  $side = [int][math]::Round($headH * 1.75)
  $left = [int]($cx - $side / 2)
  $top  = [int]($headTop - $side * 0.12)     # vzduch nad hlavou
  if ($left -lt 0) { $left = 0 }
  if ($top  -lt 0) { $top  = 0 }
  if ($left + $side -gt $src.Width)  { $left = $src.Width  - $side }
  if ($top  + $side -gt $src.Height) { $top  = $src.Height - $side }

  $dst = New-Object System.Drawing.Bitmap ([int]$Size), ([int]$Size)
  $g = [System.Drawing.Graphics]::FromImage($dst)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::White)
  $g.DrawImage($src,
    (New-Object System.Drawing.Rectangle 0, 0, $Size, $Size),
    (New-Object System.Drawing.Rectangle $left, $top, $side, $side),
    [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $dst.Save("$OutDir\$name.png", [System.Drawing.Imaging.ImageFormat]::Png)
  $dst.Dispose()
  "  {0}: vyrez {1}x{1} na ({2},{3}) -> {4} px, hlava {5:P0} vysky" -f $name, $side, $left, $top, $Size, ($headH / $side)
}
$src.Dispose()
