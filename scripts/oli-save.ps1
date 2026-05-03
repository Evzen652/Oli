# oli-save.ps1
# Uloží rozpracovanou práci a pošle ji na GitHub.
# Spusť na konci session — pak můžeš přejít na druhý PC a tam spustit oli-start.ps1
#
# Použití:
#   1) Dvojklik na oli-save.lnk na ploše
#   2) Nebo: pravý klik → Run with PowerShell
#   3) Nebo: v PS spusť .\scripts\oli-save.ps1

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location $ProjectRoot

Write-Host ""
Write-Host "════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  🦉 Oli — uložení a odeslání na GitHub" -ForegroundColor Magenta
Write-Host "════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  Folder: $ProjectRoot" -ForegroundColor DarkGray
Write-Host ""

# ── Co se změnilo? ────────────────────────────────────────────────────────────
$status = git status --short
if (-not $status) {
    Write-Host "✓ Žádné změny — není co ukládat." -ForegroundColor Green
    Write-Host ""
    Read-Host "Stiskni Enter pro ukončení"
    exit 0
}

Write-Host "📝 Změněné soubory:" -ForegroundColor Yellow
git status --short | ForEach-Object { Write-Host "   $_" -ForegroundColor DarkGray }
Write-Host ""

# ── Commit zpráva ─────────────────────────────────────────────────────────────
$defaultMsg = "wip: ulozeno $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
Write-Host "Commit zpráva (Enter = '$defaultMsg'):" -ForegroundColor Cyan
$msg = Read-Host "  >"
if ([string]::IsNullOrWhiteSpace($msg)) { $msg = $defaultMsg }

Write-Host ""

# ── git add + commit ──────────────────────────────────────────────────────────
Write-Host "📦 Přidávám soubory..." -ForegroundColor Yellow
git add -A
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ git add selhal." -ForegroundColor Red
    Read-Host "Stiskni Enter pro ukončení"; exit 1
}

Write-Host "💾 Commituju..." -ForegroundColor Yellow
git commit -m $msg
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ git commit selhal." -ForegroundColor Red
    Read-Host "Stiskni Enter pro ukončení"; exit 1
}

Write-Host ""

# ── git push ──────────────────────────────────────────────────────────────────
Write-Host "📤 Odesílám na GitHub..." -ForegroundColor Yellow
git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ git push selhal." -ForegroundColor Red
    Write-Host "   Zkus: git push --set-upstream origin $(git rev-parse --abbrev-ref HEAD)" -ForegroundColor DarkGray
    Read-Host "Stiskni Enter pro ukončení"; exit 1
}

Write-Host ""
Write-Host "════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ Hotovo! Projekt je uložen na GitHubu." -ForegroundColor Green
Write-Host "  Na druhém PC spusť oli-start.ps1" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Read-Host "Stiskni Enter pro ukončení"
