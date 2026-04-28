# oli-start.ps1
# 1-click startér pro Oli development na Windows.
# - přepne se do worktree branch claude/cranky-shirley
# - stáhne nejnovější změny z GitHubu
# - nainstaluje chybějící závislosti
# - spustí Vite dev server na http://localhost:8081
#
# Použití:
#   1) Dvojklik na .lnk shortcut na ploše (vytvoří se automaticky níže)
#   2) Nebo: pravý klik → Run with PowerShell
#   3) Nebo: v PS spusť .\scripts\oli-start.ps1
#
# Pokud PowerShell hlásí "running scripts is disabled", spusť jednou:
#   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

$ErrorActionPreference = "Stop"

# ──────────────────────────────────────────────────────────────────────
# Najdi projektovou složku — funguje z čehokoli (script si najde root)
# ──────────────────────────────────────────────────────────────────────
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location $ProjectRoot

Write-Host ""
Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🦉 Oli — start session" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Folder: $ProjectRoot" -ForegroundColor DarkGray
Write-Host ""

# ──────────────────────────────────────────────────────────────────────
# 1) Git pull — nejnovější změny
# ──────────────────────────────────────────────────────────────────────
Write-Host "📥 Stahuju nejnovější změny z GitHubu..." -ForegroundColor Yellow
$currentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
Write-Host "   Branch: $currentBranch" -ForegroundColor DarkGray

git pull
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ git pull selhal." -ForegroundColor Red
    Write-Host "   Možná máš lokální necommitované změny — zkontroluj 'git status'." -ForegroundColor Red
    Write-Host ""
    Read-Host "Stiskni Enter pro ukončení"
    exit 1
}

Write-Host ""

# ──────────────────────────────────────────────────────────────────────
# 2) npm install — jen když je nutné
# ──────────────────────────────────────────────────────────────────────
$nodeModulesExists = Test-Path "node_modules"
$packageLockChanged = $false

if (-not $nodeModulesExists) {
    Write-Host "📦 node_modules chybí — instaluji závislosti..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install selhal." -ForegroundColor Red
        Read-Host "Stiskni Enter pro ukončení"
        exit 1
    }
} else {
    Write-Host "✓ node_modules existují, přeskakuji npm install" -ForegroundColor Green
}

Write-Host ""

# ──────────────────────────────────────────────────────────────────────
# 3) Spuštění dev serveru
# ──────────────────────────────────────────────────────────────────────
Write-Host "🚀 Spouštím dev server na http://localhost:8081 ..." -ForegroundColor Yellow
Write-Host "   (zastav Ctrl+C)" -ForegroundColor DarkGray
Write-Host ""

npm run dev
