# Udela z JPG s bilym pozadim pruhledne PNG.
#
# POUZITI
#   scripts\make-logo.ps1 -In list.jpg -Out src\assets\oli-owl.png -Size 320 -Square $false
#   scripts\make-logo.ps1 -In list.jpg -Out public\favicon.png    -Size 256
#
# -Square $false zachova PRIROZENY POMER STRAN. Pro celou sovu je to podstatne:
# OliLogo ma box h-20 w-20 + object-contain, takze ctvercove vypodlozena kresba
# (sova ma pomer 0,79) by se zmensila o dalsich ~21 %. Pri prirozenem pomeru
# vyplni celou vysku boxu. Pro favikonu naopak ctverec chceme.
#
# Pozadi se hleda FLOOD-FILLEM OD OKRAJU, ne podle jasu — bile odlesky v ocich
# a svetle plochy uvnitr kresby tak zustanou krycí (ILLUSTRATION_STYLE §2).
# Zmensuje se zvlast RGB slozene na bile a zvlast maska; barva se pak z bileho
# podkladu odpocita  C = (C_bila - (1-a)*255) / a,  aby na tmavem podkladu
# nevznikl bily lem.
param(
  [string]$In,
  [string]$Out,
  [int]$Size = 256,            # delka DELSI strany
  [int]$Thr = 244,
  [double]$Pad = 1.04,         # rezerva kolem kresby
  [bool]$Square = $true,
  [switch]$NoCrop,             # nechat vyrez beze zmeny, jen prevest bilou na alfu
  [string]$Preview = ""
)

Add-Type -AssemblyName System.Drawing

$cs = @"
using System;
using System.Collections.Generic;

public static class Mask2
{
    public static byte[] Flood(byte[] buf, int stride, int w, int h, int thr)
    {
        byte[] bg = new byte[w * h];
        var q = new Queue<int>();
        Action<int,int> push = (x, y) => {
            if (x < 0 || y < 0 || x >= w || y >= h) return;
            int i = y * w + x;
            if (bg[i] != 0) return;
            int o = y * stride + x * 4;
            if (buf[o] < thr || buf[o+1] < thr || buf[o+2] < thr) return;
            bg[i] = 1; q.Enqueue(i);
        };
        for (int x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
        for (int y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
        while (q.Count > 0) {
            int i = q.Dequeue();
            int x = i % w, y = i / w;
            push(x - 1, y); push(x + 1, y); push(x, y - 1); push(x, y + 1);
        }
        return bg;
    }
}
"@
Add-Type -TypeDefinition $cs -ReferencedAssemblies System.Drawing

$src = [System.Drawing.Bitmap]::FromFile($In)
$W = $src.Width; $H = $src.Height
$flat = New-Object System.Drawing.Bitmap $W, $H, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($flat)
$g.Clear([System.Drawing.Color]::White)
$g.DrawImage($src, 0, 0, $W, $H)
$g.Dispose(); $src.Dispose()

$d = $flat.LockBits((New-Object System.Drawing.Rectangle 0,0,$W,$H), [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$stride = $d.Stride
$buf = New-Object byte[] ([Math]::Abs($stride) * $H)
[System.Runtime.InteropServices.Marshal]::Copy($d.Scan0, $buf, 0, $buf.Length)
$flat.UnlockBits($d)

$bg = [Mask2]::Flood($buf, $stride, $W, $H, $Thr)

$minX = $W; $minY = $H; $maxX = -1; $maxY = -1
for ($y = 0; $y -lt $H; $y++) {
  $row = $y * $W
  for ($x = 0; $x -lt $W; $x++) {
    if ($bg[$row + $x] -eq 0) {
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}
$cw = $maxX - $minX + 1; $ch = $maxY - $minY + 1
Write-Output "obsah: $cw x $ch   pomer $([Math]::Round($cw/$ch,2))"

# --- platno ---
if ($NoCrop) {
  # Ponech vyrez tak, jak prisel na vstupu — jen prevedi bile pozadi na alfu.
  # Nutne u portretu ze `split-portrait-sheet.ps1`: ten uz vyrezal ctverec
  # podle VELIKOSTI HLAVY. Preorez na obsah by to zahodil a v dlazdicich by
  # zase byly ruzne velke obliceje (viz ILLUSTRATION_STYLE §5).
  $minX = 0; $minY = 0; $cw = $W; $ch = $H
  $canW = $W; $canH = $H
} elseif ($Square) {
  $canW = [int]([Math]::Max($cw, $ch) * $Pad); $canH = $canW
} else {
  $canW = [int]($cw * $Pad); $canH = [int]($ch * $Pad)
}
$offX = [int](($canW - $cw) / 2); $offY = [int](($canH - $ch) / 2)

$bigRgb  = New-Object System.Drawing.Bitmap $canW, $canH, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bigMask = New-Object System.Drawing.Bitmap $canW, $canH, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$dr = $bigRgb.LockBits((New-Object System.Drawing.Rectangle 0,0,$canW,$canH), [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$dm = $bigMask.LockBits((New-Object System.Drawing.Rectangle 0,0,$canW,$canH), [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$sr = $dr.Stride
$bufR = New-Object byte[] ([Math]::Abs($sr) * $canH)
$bufM = New-Object byte[] ([Math]::Abs($sr) * $canH)
for ($i = 0; $i -lt $bufR.Length; $i += 4) {
  $bufR[$i] = 255; $bufR[$i+1] = 255; $bufR[$i+2] = 255; $bufR[$i+3] = 255
  $bufM[$i+3] = 255
}
for ($y = 0; $y -lt $ch; $y++) {
  $sy = $minY + $y; $dy = $offY + $y
  for ($x = 0; $x -lt $cw; $x++) {
    $sx = $minX + $x; $dx = $offX + $x
    $so = $sy * $stride + $sx * 4
    $do_ = $dy * $sr + $dx * 4
    $bufR[$do_] = $buf[$so]; $bufR[$do_+1] = $buf[$so+1]; $bufR[$do_+2] = $buf[$so+2]
    if ($bg[$sy * $W + $sx] -eq 0) { $bufM[$do_] = 255; $bufM[$do_+1] = 255; $bufM[$do_+2] = 255 }
  }
}
[System.Runtime.InteropServices.Marshal]::Copy($bufR, 0, $dr.Scan0, $bufR.Length)
[System.Runtime.InteropServices.Marshal]::Copy($bufM, 0, $dm.Scan0, $bufM.Length)
$bigRgb.UnlockBits($dr); $bigMask.UnlockBits($dm)
$flat.Dispose()

# --- cilovy rozmer ---
if ($canW -ge $canH) { $outW = $Size; $outH = [int][Math]::Round($Size * $canH / $canW) }
else                 { $outH = $Size; $outW = [int][Math]::Round($Size * $canW / $canH) }

function Shrink2([System.Drawing.Bitmap]$b, [int]$w, [int]$h) {
  $o = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gg = [System.Drawing.Graphics]::FromImage($o)
  $gg.Clear([System.Drawing.Color]::Transparent)
  $gg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $gg.DrawImage($b, (New-Object System.Drawing.Rectangle 0,0,$w,$h))
  $gg.Dispose()
  return $o
}
$smRgb  = Shrink2 $bigRgb $outW $outH
$smMask = Shrink2 $bigMask $outW $outH
$bigRgb.Dispose(); $bigMask.Dispose()

$dst = New-Object System.Drawing.Bitmap $outW, $outH, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$dA = $smRgb.LockBits((New-Object System.Drawing.Rectangle 0,0,$outW,$outH), [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$dB = $smMask.LockBits((New-Object System.Drawing.Rectangle 0,0,$outW,$outH), [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$dC = $dst.LockBits((New-Object System.Drawing.Rectangle 0,0,$outW,$outH), [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$st = $dA.Stride
$aBuf = New-Object byte[] ([Math]::Abs($st) * $outH)
$bBuf = New-Object byte[] ([Math]::Abs($st) * $outH)
$cBuf = New-Object byte[] ([Math]::Abs($st) * $outH)
[System.Runtime.InteropServices.Marshal]::Copy($dA.Scan0, $aBuf, 0, $aBuf.Length)
[System.Runtime.InteropServices.Marshal]::Copy($dB.Scan0, $bBuf, 0, $bBuf.Length)
for ($i = 0; $i -lt $cBuf.Length; $i += 4) {
  $a = $bBuf[$i]
  if ($a -lt 8) { continue }
  $af = $a / 255.0
  for ($k = 0; $k -lt 3; $k++) {
    $v = ($aBuf[$i+$k] - (1 - $af) * 255) / $af
    if ($v -lt 0) { $v = 0 } elseif ($v -gt 255) { $v = 255 }
    $cBuf[$i+$k] = [byte][Math]::Round($v)
  }
  $cBuf[$i+3] = $a
}
[System.Runtime.InteropServices.Marshal]::Copy($cBuf, 0, $dC.Scan0, $cBuf.Length)
$smRgb.UnlockBits($dA); $smMask.UnlockBits($dB); $dst.UnlockBits($dC)
$smRgb.Dispose(); $smMask.Dispose()

$dst.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "ulozeno: $Out  ($outW x $outH)"
$dst.Dispose()
