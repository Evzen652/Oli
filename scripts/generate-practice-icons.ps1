# Hromadne generovani 15 dekorativnich ikon pro question title rotation.
$ErrorActionPreference = "Continue"

$SUPABASE_URL = "https://uusaczibimqvaazpaopy.supabase.co"
$ANON_KEY = "sb_publishable_33yUDPztgleFHYtChSvGKQ_rMlyktGV"

$PREFIX = "Cute 3D Pixar-style educational illustration for children's learning app, showing"
$SUFFIX = ". Single centered composition, smooth rounded volumetric 3D surfaces, soft cinematic shading, vibrant pastel colors with one strong accent. Clean pure solid white background. Modern professional 3D render quality, warm welcoming children educational app aesthetic. Square format."

$icons = @(
  @{ key = "practice-icon-pencil"; desc = "small 3D illustration of a stylized pastel violet pencil floating diagonally with a tiny glowing star next to its tip leaving a soft sparkle trail; pastel violet and soft gold palette; NO characters, NO faces, NO text" }
  @{ key = "practice-icon-lightbulb"; desc = "small 3D illustration of a glowing pastel yellow lightbulb with soft warm light radiating outward and a few tiny sparkles around it; pastel amber and cream palette; NO characters, NO faces, NO text" }
  @{ key = "practice-icon-rocket"; desc = "small 3D illustration of a stylized pastel rocket flying diagonally upward with a trail of soft pastel exhaust and a few tiny stars; pastel coral and cream palette; NO characters, NO faces, NO text" }
  @{ key = "practice-icon-star"; desc = "small 3D illustration of a pastel five-pointed star with a gentle glow and several smaller sparkles around it forming a constellation; pastel gold and cream palette; NO characters, NO faces, NO text" }
  @{ key = "practice-icon-magnifier"; desc = "small 3D illustration of a stylized magnifying glass with golden handle and clear glass with tiny sparkle reflecting in the lens; pastel cream and gold palette; NO characters, NO faces, NO text" }
  @{ key = "practice-icon-compass"; desc = "small 3D illustration of a stylized round compass with a north arrow pointing upward, ornate brass details on white face; pastel cream and gold palette; NO characters, NO faces, NO text" }
  @{ key = "practice-icon-key"; desc = "small 3D illustration of a stylized vintage golden key with ornate head and decorative teeth, floating at a slight angle with a tiny sparkle; pastel gold and cream palette; NO characters, NO faces, NO text" }
  @{ key = "practice-icon-trophy"; desc = "small 3D illustration of a tiny stylized golden trophy cup with two handles on a small round base; pastel gold and cream palette; NO characters, NO faces, NO text" }
  @{ key = "practice-icon-book"; desc = "small 3D illustration of a single small open book with a pastel violet ribbon bookmark hanging down, pages slightly fluttering; pastel violet and cream palette; NO characters, NO faces, NO readable text on pages, NO words" }
  @{ key = "practice-icon-balloon"; desc = "small 3D illustration of a stylized hot air balloon with a tiny basket below, soft horizontal pastel stripes on the balloon; pastel mint and cream palette; NO characters, NO faces, NO text" }
  @{ key = "practice-icon-medal"; desc = "small 3D illustration of a tiny gold medal with a star embossed on it hanging from a pastel ribbon; pastel gold and rose palette; NO characters, NO faces, NO text, NO numbers" }
  @{ key = "practice-icon-puzzle"; desc = "small 3D illustration of a single decorative jigsaw puzzle piece floating at a slight angle; pastel sky blue palette; NO characters, NO faces, NO text" }
  @{ key = "practice-icon-gem"; desc = "small 3D illustration of a stylized faceted crystal gem with a soft sparkle around it, slightly translucent appearance; pastel violet and cream palette; NO characters, NO faces, NO text" }
  @{ key = "practice-icon-feather"; desc = "small 3D illustration of a single white feather quill with golden tip and soft pastel barbs; pastel cream and gold palette; NO characters, NO faces, NO text" }
  @{ key = "practice-icon-clock"; desc = "small 3D illustration of a tiny stylized round clock with classic numerals showing 10 hours 10 minutes position, decorative hands; pastel cream and gold palette; NO characters, NO faces, NO words" }
)

$totalSuccess = 0
$failedKeys = New-Object System.Collections.ArrayList
$chunkSize = 3
$totalChunks = [Math]::Ceiling($icons.Count / $chunkSize)

for ($i = 0; $i -lt $icons.Count; $i += $chunkSize) {
  $endIdx = [Math]::Min($i + $chunkSize - 1, $icons.Count - 1)
  $chunk = @($icons[$i..$endIdx])

  $keys = @($chunk | ForEach-Object { $_.key })
  $customPrompts = @{}
  foreach ($icon in $chunk) {
    $customPrompts[$icon.key] = "$PREFIX $($icon.desc)$SUFFIX"
  }

  $body = @{
    keys = $keys
    force = $true
    customPrompts = $customPrompts
  } | ConvertTo-Json -Depth 5

  $chunkNum = [int]($i / $chunkSize) + 1
  Write-Host ""
  Write-Host "[$chunkNum/$totalChunks] Generuji: $($keys -join ', ')"

  try {
    $response = Invoke-WebRequest -Uri "$SUPABASE_URL/functions/v1/generate-prvouka-images" -Method POST -Headers @{ "Authorization" = "Bearer $ANON_KEY"; "apikey" = $ANON_KEY; "Content-Type" = "application/json" } -Body $body -TimeoutSec 300 -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    if ($data.results) {
      foreach ($k in $data.results.PSObject.Properties.Name) {
        Write-Host "  OK $k"
        $totalSuccess++
      }
    }
    if ($data.errors) {
      foreach ($k in $data.errors.PSObject.Properties.Name) {
        Write-Host "  FAIL $k -- $($data.errors.$k)"
        $null = $failedKeys.Add($k)
      }
    }
  } catch {
    Write-Host "  EXCEPTION: $($_.Exception.Message)"
    foreach ($k in $keys) { $null = $failedKeys.Add($k) }
  }
}

Write-Host ""
Write-Host "================================"
Write-Host "Hotovo: $totalSuccess / $($icons.Count)"
if ($failedKeys.Count -gt 0) {
  Write-Host "Selhalo: $($failedKeys -join ', ')"
}
