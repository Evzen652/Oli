# Ořízne kresbu na obsah (bbox nebílých pixelů), doplní na čtverec a zmenší.
# Pixely se čtou přes LockBits — Graphics.DrawImage premultiplikuje a u alfa 0
# vynuluje RGB, viz docs/ILLUSTRATION_STYLE.md §4.
param(
  [Parameter(Mandatory=$true)][string]$In,
  [Parameter(Mandatory=$true)][string]$Out,
  [int]$Size = 512,
  [int]$Threshold = 245,   # kanál pod touto hodnotou = kresba, ne papír
  [double]$Margin = 0.06   # podíl strany bboxu ponechaný kolem dokola
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

$minX = $w; $minY = $h; $maxX = -1; $maxY = -1
for ($y = 0; $y -lt $h; $y++) {
  $row = $y * $stride
  for ($x = 0; $x -lt $w; $x++) {
    $i = $row + $x * 4
    if ($bytes[$i] -lt $Threshold -or $bytes[$i+1] -lt $Threshold -or $bytes[$i+2] -lt $Threshold) {
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}

if ($maxX -lt 0) { $src.Dispose(); throw "V $In nejsou zadne nebile pixely." }

$bw = $maxX - $minX + 1
$bh = $maxY - $minY + 1
Write-Output ("bbox {0},{1} {2}x{3} (zdroj {4}x{5})" -f $minX, $minY, $bw, $bh, $w, $h)

# Čtverec kolem středu bboxu, delší strana + margin na obou koncích.
$side = [int]([Math]::Max($bw, $bh) * (1 + 2 * $Margin))
$cx = $minX + $bw / 2
$cy = $minY + $bh / 2
$sx = [int]($cx - $side / 2)
$sy = [int]($cy - $side / 2)

$dst = New-Object System.Drawing.Bitmap $Size, $Size,
       ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($dst)
$g.Clear([System.Drawing.Color]::White)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Zdrojový čtverec smí přesahovat obrázek — chybějící okraj zůstane bílý,
# protože plátno je předvyplněné bílou.
$srcRect = New-Object System.Drawing.RectangleF $sx, $sy, $side, $side
$dstRect = New-Object System.Drawing.RectangleF 0, 0, $Size, $Size
$g.DrawImage($src, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$dst.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$dst.Dispose(); $src.Dispose()
Write-Output ("zapsano {0} ({1}x{1})" -f $Out, $Size)
