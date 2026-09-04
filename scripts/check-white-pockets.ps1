# Najde v ilustraci KRYCÍ skoro bile pixely — tedy presne to, co na barevne
# dlazdici vyleze jako bily flek.
#
# PROC EXISTUJE: `ILLUSTRATION_STYLE.md` §2.5 rika, ze uzavrene diry (mezery
# mezi kulickami pocitadla, svlaky zidle, ucho hrnku) se flood-fillem od okraju
# nevyplni a zustanou krycí bile. Kontrola okem to NEODHALI: na bilem nahledu
# se bily flek neprojevi vubec a na barevnem podkladu ho pri male velikosti
# oko prehlidne. U pocitadla (grade-2) tak proslo 11 449 bilych pixelu, tedy
# 25 % kresby, prestoze slozeni na sytou barvu vypadalo v poradku.
#
# POUZITI
#   scripts\check-white-pockets.ps1 -Files src\assets\grade-2.png
#   scripts\check-white-pockets.ps1 -Files (Get-ChildItem src\assets\*.png).FullName
#
# JAK CIST VYSTUP
#   "krycí bile" pod ~1 % krycí plochy = odlesky v ocich, v poradku.
#   Vyssi podil nebo velka souvisla oblast = pozadi, ktere se nevyriznulo.
#   Bily flek, ktery je SPRAVNE (stranky knihy, deska sesitu), pozna clovek
#   podle bbox — proto skript nic sam nemaze, jen hlasi.
#
# OPRAVA: `scripts\fix-landing-alpha.ps1 -In obr.png -ScanOnly` vypise kapsy
# s id, pak tytez ids preda pres `-ClearIds`.
param(
  [Parameter(Mandatory = $true)][string[]]$Files,
  [int]$WhiteThr = 232,      # vsechny kanaly nad = "skoro bila"
  [int]$AlphaThr = 200       # pod = uz pruhledne, nezajima nas
)
Add-Type -AssemblyName System.Drawing

$cs = @"
using System;
using System.Collections.Generic;
public static class WhiteBlob {
  public static int Largest(bool[] mask, int w, int h, out int bx0, out int by0, out int bx1, out int by1) {
    bool[] seen = new bool[w*h];
    int best = 0; bx0=0; by0=0; bx1=0; by1=0;
    var st = new Stack<int>();
    for (int i = 0; i < w*h; i++) {
      if (!mask[i] || seen[i]) continue;
      st.Push(i); seen[i] = true;
      int cnt = 0, x0=w, y0=h, x1=-1, y1=-1;
      while (st.Count > 0) {
        int p = st.Pop(); cnt++;
        int x = p % w, y = p / w;
        if (x<x0) x0=x; if (x>x1) x1=x; if (y<y0) y0=y; if (y>y1) y1=y;
        if (x>0   && mask[p-1] && !seen[p-1]) { seen[p-1]=true; st.Push(p-1); }
        if (x<w-1 && mask[p+1] && !seen[p+1]) { seen[p+1]=true; st.Push(p+1); }
        if (y>0   && mask[p-w] && !seen[p-w]) { seen[p-w]=true; st.Push(p-w); }
        if (y<h-1 && mask[p+w] && !seen[p+w]) { seen[p+w]=true; st.Push(p+w); }
      }
      if (cnt > best) { best = cnt; bx0=x0; by0=y0; bx1=x1; by1=y1; }
    }
    return best;
  }
}
"@
Add-Type -TypeDefinition $cs

Write-Output ("soubor                krycí bile      podil   nejvetsi souvisla   bbox")
foreach ($p in $Files) {
  $b = [System.Drawing.Bitmap]::FromFile($p)
  $w = $b.Width; $h = $b.Height
  $d = $b.LockBits((New-Object System.Drawing.Rectangle 0,0,$w,$h), [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $st = $d.Stride
  $buf = New-Object byte[] ([Math]::Abs($st) * $h)
  [System.Runtime.InteropServices.Marshal]::Copy($d.Scan0, $buf, 0, $buf.Length)
  $b.UnlockBits($d); $b.Dispose()

  $mask = New-Object bool[] ($w * $h)
  $cnt = 0; $opaque = 0
  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
      $o = $y * $st + $x * 4
      if ($buf[$o+3] -lt $AlphaThr) { continue }
      $opaque++
      if ($buf[$o] -ge $WhiteThr -and $buf[$o+1] -ge $WhiteThr -and $buf[$o+2] -ge $WhiteThr) {
        $mask[$y * $w + $x] = $true; $cnt++
      }
    }
  }
  $bx0 = 0; $by0 = 0; $bx1 = 0; $by1 = 0
  $largest = [WhiteBlob]::Largest($mask, $w, $h, [ref]$bx0, [ref]$by0, [ref]$bx1, [ref]$by1)
  $pct = 100.0 * $cnt / [Math]::Max(1, $opaque)
  $flag = if ($pct -ge 1.0) { "  <== PROVERIT" } else { "" }
  Write-Output ("{0,-20} {1,8} px {2,7:N1} % {3,12} px    {4},{5}-{6},{7}{8}" -f `
    (Split-Path $p -Leaf), $cnt, $pct, $largest, $bx0, $by0, $bx1, $by1, $flag)
}
