$ErrorActionPreference = "Stop"
$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$node = "D:\tool\node\node.exe"
if (-not (Test-Path -LiteralPath $node)) {
  $nodeCommand = Get-Command node -ErrorAction Stop
  $node = $nodeCommand.Source
}
Push-Location $projectRoot
try {
  & $node server.js
} finally {
  Pop-Location
}