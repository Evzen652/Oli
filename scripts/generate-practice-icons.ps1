# Hromadne generovani 15 ikon -- minimalisticke single-object prompty pro spolehlivy dewhite.
$ErrorActionPreference = "Continue"

$SUPABASE_URL = "https://uusaczibimqvaazpaopy.supabase.co"
$ANON_KEY = "sb_publishable_33yUDPztgleFHYtChSvGKQ_rMlyktGV"

$PREFIX = "Cute 3D Pixar-style educational illustration for children's learning app, showing"
$SUFFIX = ". Single centered composition, smooth rounded volumetric 3D surfaces, soft cinematic shading, vibrant pastel colors with one strong accent. Clean pure solid white background. Modern professional 3D render quality, warm welcoming children educational app aesthetic. Square format."

# Kazdy prompt: JEDEN objekt vystreden, BEZ sparkles/trails/floating elementu (rusi flood-fill dewhite).
# Compact silhouette = uspesny dewhite (brightness>230 detekce z okraju funguje).
$icons = @(
  @{ key = "practice-icon-star"; desc = "a single chubby rounded 3D five-pointed star shape, bright pastel gold color, smooth volumetric surfaces; cute minimal compact icon design, centered, no other elements" }
  @{ key = "practice-icon-lightbulb"; desc = "a single chubby rounded 3D lightbulb shape, bright pastel yellow glass with subtle warm glow inside, silver screw base; cute minimal compact icon design, centered, no other elements" }
  @{ key = "practice-icon-rocket"; desc = "a single chubby rounded 3D rocket shape pointing straight up, pastel coral body with white tip, mint green fins at bottom, round porthole window in middle; cute minimal compact icon design, centered, no other elements" }
  @{ key = "practice-icon-compass"; desc = "a single chubby rounded 3D compass shape, round white face with bold red north arrow pointing up and black south arrow pointing down, gold rim around the case; cute minimal compact icon design, centered, no other elements" }
  @{ key = "practice-icon-clock"; desc = "a single chubby rounded 3D round clock shape, white face with bold black hands pointing at 10 and 2 position, simple round gold rim, no numerals; cute minimal compact icon design, centered, no other elements" }
  @{ key = "practice-icon-dice"; desc = "a single chubby rounded 3D dice cube shape, clean white faces with bold pastel coral dots showing five on front face, rounded corners; cute minimal compact icon design, centered, no other elements" }
  @{ key = "practice-icon-palette"; desc = "a single chubby rounded 3D artist palette shape, oval pastel cream body with thumb hole, small rounded blobs of pastel paint colors around the edge; cute minimal compact icon design, centered, no other elements" }
  @{ key = "practice-icon-calculator"; desc = "a single chubby rounded 3D calculator shape, pastel mint green body with small dark rounded buttons and a light display screen at top; cute minimal compact icon design, centered, no other elements" }
  @{ key = "practice-icon-bell"; desc = "a single chubby rounded 3D bell shape, pastel gold body with a small round clapper visible at the bottom, smooth dome top; cute minimal compact icon design, centered, no other elements" }
)

$totalSuccess = 0
$failedKeys = New-Object System.Collections.ArrayList
$idx = 0

foreach ($icon in $icons) {
  $idx++
  $key = $icon.key
  $fullPrompt = "$PREFIX $($icon.desc)$SUFFIX"

  $body = @{
    keys = @($key)
    force = $true
    customPrompts = @{ $key = $fullPrompt }
  } | ConvertTo-Json -Depth 5 -Compress

  Write-Host ""
  Write-Host "[$idx/$($icons.Count)] $key"

  try {
    $response = Invoke-WebRequest -Uri "$SUPABASE_URL/functions/v1/generate-prvouka-images" -Method POST -Headers @{ "Authorization" = "Bearer $ANON_KEY"; "apikey" = $ANON_KEY; "Content-Type" = "application/json" } -Body $body -TimeoutSec 180 -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    if ($data.results -and $data.results.PSObject.Properties.Name -contains $key) {
      Write-Host "  OK"
      $totalSuccess++
    } elseif ($data.errors -and $data.errors.PSObject.Properties.Name -contains $key) {
      Write-Host "  FAIL: $($data.errors.$key)"
      $null = $failedKeys.Add($key)
    } else {
      Write-Host "  UNKNOWN response"
      $null = $failedKeys.Add($key)
    }
  } catch {
    Write-Host "  EXCEPTION: $($_.Exception.Message)"
    $null = $failedKeys.Add($key)
  }
}

Write-Host ""
Write-Host "================================"
Write-Host "Hotovo: $totalSuccess / $($icons.Count)"
if ($failedKeys.Count -gt 0) {
  Write-Host "Selhalo: $($failedKeys -join ', ')"
}
