param(
  [ValidateSet("Debug", "Release")]
  [string]$Variant = "Debug"
)

$ErrorActionPreference = "Stop"
$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$androidRoot = Join-Path $projectRoot "android-app"
$publicRoot = Join-Path $projectRoot "public"
$assetRoot = Join-Path $androidRoot "app\src\main\assets\www"

function Resolve-AndroidSdk {
  $candidates = @(
    $env:ANDROID_HOME,
    $env:ANDROID_SDK_ROOT,
    "$env:LOCALAPPDATA\Android\Sdk",
    "C:\Android\Sdk",
    "D:\Android\Sdk",
    "E:\Android\Sdk"
  ) | Where-Object { $_ -and (Test-Path -LiteralPath $_) }

  if (-not $candidates) {
    throw "Android SDK not found. Install Android Studio or command-line SDK, then set ANDROID_HOME or ANDROID_SDK_ROOT."
  }

  return (Resolve-Path -LiteralPath $candidates[0]).Path
}

$sdk = Resolve-AndroidSdk
$env:ANDROID_HOME = $sdk
$env:ANDROID_SDK_ROOT = $sdk

if (Test-Path -LiteralPath $assetRoot) {
  Remove-Item -LiteralPath $assetRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $assetRoot -Force | Out-Null
Copy-Item -Path (Join-Path $publicRoot "*") -Destination $assetRoot -Recurse -Force

$gradlew = Join-Path $androidRoot "gradlew.bat"
if (Test-Path -LiteralPath $gradlew) {
  $gradleCommand = $gradlew
} else {
  $gradle = Get-Command gradle -ErrorAction SilentlyContinue
  if (-not $gradle) {
    throw "Gradle not found and android-app/gradlew.bat is missing. Install Gradle, or generate a Gradle wrapper from Android Studio."
  }
  $gradleCommand = $gradle.Source
}

$task = if ($Variant -eq "Release") { "assembleRelease" } else { "assembleDebug" }
Push-Location $androidRoot
try {
  & $gradleCommand $task
} finally {
  Pop-Location
}

$apk = Join-Path $androidRoot "app\build\outputs\apk\$($Variant.ToLower())\app-$($Variant.ToLower()).apk"
if (Test-Path -LiteralPath $apk) {
  Write-Host "APK generated: $apk"
} else {
  throw "Gradle finished but APK was not found at $apk"
}