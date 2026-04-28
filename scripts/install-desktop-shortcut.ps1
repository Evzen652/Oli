# install-desktop-shortcut.ps1
# Vytvoří na ploše ikonu "Oli — start", která spustí oli-start.ps1.
# Spusť jednou per PC (pravý klik → Run with PowerShell).

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$StartScript = Join-Path $ScriptDir "oli-start.ps1"

if (-not (Test-Path $StartScript)) {
    Write-Host "❌ Nenašel jsem oli-start.ps1 v $ScriptDir" -ForegroundColor Red
    Read-Host "Enter pro konec"
    exit 1
}

# Najdi Desktop / Plocha (i při lokalizaci v češtině přes special folder)
$Desktop = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $Desktop "Oli — start.lnk"

$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-NoExit -ExecutionPolicy Bypass -File `"$StartScript`""
$Shortcut.WorkingDirectory = (Split-Path -Parent $ScriptDir)
$Shortcut.IconLocation = "powershell.exe,0"
$Shortcut.Description = "Stáhne nejnovější změny a spustí Oli dev server"
$Shortcut.Save()

Write-Host ""
Write-Host "✅ Hotovo!" -ForegroundColor Green
Write-Host "   Shortcut: $ShortcutPath" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Teď můžeš dvojkliknout na 'Oli — start' na ploše." -ForegroundColor Cyan
Write-Host ""
Read-Host "Enter pro konec"
