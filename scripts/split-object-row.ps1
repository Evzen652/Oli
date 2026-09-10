# Rozreze list se tremi predmety vedle sebe na tri ctvercova PNG.
#
# Klicove: vsechny tri se orizavaji SPOLECNOU stranou ctverce, ne kazdy podle
# sveho obsahu. Jinak by se hvezda po zmenseni na stejnou dlazdici zvetsila na
# velikost knihy a vzajemne pomery ze skici by se ztratily - tataz past jako
# u avataru roli (docs/ILLUSTRATION_STYLE.md sekce 5).
param(
  [Parameter(Mandatory=$true)][string]$In,
  [Parameter(Mandatory=$true)][string]$OutDir,
  [string[]]$Names = @("a","b","c"),
  [int]$Size = 128,
  [int]$Threshold = 232,   # kanal pod touto hodnotou = kresba (papir je ~247,244,236)
  [double]$Margin = 0.10,
  [switch]$Measure,
  [switch]$Tight
)

Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Bitmap]::FromFile((Resolve-Path $In).Path)
$w = $src.Width; $h = $src.Height

$rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
$data = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly,
                      [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$stride = $data.Stride
$bytes = New-Object byte[] ($stride * $h)
[System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
$src.UnlockBits($data)

# bbox v kazde tretine listu
$boxes = @()
for ($k = 0; $k -lt 3; $k++) {
  $x0 = [int]($w * $k / 3); $x1 = [int]($w * ($k + 1) / 3) - 1
  $minX = $w; $minY = $h; $maxX = -1; $maxY = -1
  for ($y = 0; $y -lt $h; $y++) {
    $row = $y * $stride
    for ($x = $x0; $x -le $x1; $x++) {
      $i = $row + $x * 4
      if ($bytes[$i] -lt $Threshold -or $bytes[$i+1] -lt $Threshold -or $bytes[$i+2] -lt $Threshold) {
        if ($x -lt $minX) { $minX = $x }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  if ($maxX -lt 0) { throw "V tretine $k nic neni - zkontroluj -Threshold." }
  $boxes += ,@($minX, $minY, $maxX, $maxY)
  Write-Output ("{0}: bbox ({1},{2})-({3},{4})  {5}x{6}" -f $Names[$k], $minX, $minY, $maxX, $maxY,
                ($maxX - $minX + 1), ($maxY - $minY + 1))
}

if ($Measure) { $src.Dispose(); return }

# Spolecna strana = nejvetsi rozmer napric vsemi tremi + margin.
$maxSide = 0
foreach ($b in $boxes) {
  $s = [Math]::Max($b[2] - $b[0] + 1, $b[3] - $b[1] + 1)
  if ($s -gt $maxSide) { $maxSide = $s }
}
$side = [int]($maxSide * (1 + 2 * $Margin))
Write-Output ("spolecna strana ctverce: {0} px" -f $side)

if (-not (Test-Path -LiteralPath $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }

for ($k = 0; $k -lt 3; $k++) {
  $b = $boxes[$k]
  $cx = ($b[0] + $b[2]) / 2
  $cy = ($b[1] + $b[3]) / 2
  # -Tight: kazdy predmet ma vlastni stranu, tedy vyplni svou dlazdici stejne.
  # Pak se pomery ridi z CSS a ne tim, kolik mista predmet zabral na listu.
  if ($Tight) {
    $side = [int]([Math]::Max($b[2] - $b[0] + 1, $b[3] - $b[1] + 1) * (1 + 2 * $Margin))
  }
  $dst = New-Object System.Drawing.Bitmap $Size, $Size,
         ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($dst)
  # Platno predvyplnene barvou papiru, ne bilou - vyrez muze prectahovat pres
  # okraj listu a natvrdo bila by tam udelala viditelny schod.
  $g.Clear([System.Drawing.Color]::FromArgb(255, 247, 244, 236))
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $sr = New-Object System.Drawing.RectangleF ($cx - $side / 2), ($cy - $side / 2), $side, $side
  $dr = New-Object System.Drawing.RectangleF 0, 0, $Size, $Size
  $g.DrawImage($src, $dr, $sr, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $out = Join-Path $OutDir ($Names[$k] + ".png")
  $dst.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $dst.Dispose()
  Write-Output ("zapsano {0}" -f $out)
}
$src.Dispose()
