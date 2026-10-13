# Pulls the existing media from chiefazu.com into ./assets so the new site
# serves everything locally. Run from the project root:
#   powershell -ExecutionPolicy Bypass -File scripts\fetch-assets.ps1
# Skips files that already exist. Nothing is overwritten.

$base = "https://chiefazu.com/"
$files = @(
  "assets/img/hero.jpg", "assets/img/hero-m.jpg", "assets/img/about.jpg", "assets/img/walls.jpg", "assets/img/og.jpg",
  "assets/img/book-siku.jpg", "assets/img/book-pacha.jpg", "assets/img/book-2-of-us.jpg", "assets/img/book-samsons-nephew.jpg",
  "assets/img/book-sana.jpg", "assets/img/book-jumatatu.jpg", "assets/img/book-confession-pt-2.jpg", "assets/img/book-forgive-and-forget.jpg",
  "assets/video/juzi.jpg", "assets/video/juzi.mp4", "assets/video/juzi-2.mp4", "assets/video/juzi-3.mp4",
  "assets/video/siku.jpg", "assets/video/siku.mp4", "assets/video/wote.jpg", "assets/video/wote.mp4",
  "assets/icons/spotify.svg", "assets/icons/applemusic.svg", "assets/icons/audiomack.svg", "assets/icons/youtube.svg",
  "assets/icons/favicon.ico", "assets/icons/favicon-32.png", "assets/icons/favicon-192.png", "assets/icons/favicon-180.png",
  "assets/books/siku.pdf", "assets/books/siku.epub", "assets/books/pacha.pdf", "assets/books/pacha.epub",
  "assets/books/2-of-us.pdf", "assets/books/2-of-us.epub", "assets/books/samsons-nephew.pdf", "assets/books/samsons-nephew.epub",
  "assets/books/sana.pdf", "assets/books/sana.epub", "assets/books/jumatatu.pdf", "assets/books/jumatatu.epub",
  "assets/books/confession-pt-2.pdf", "assets/books/confession-pt-2.epub", "assets/books/forgive-and-forget.pdf", "assets/books/forgive-and-forget.epub"
)

$root = Split-Path -Parent $PSScriptRoot
foreach ($f in $files) {
  $dest = Join-Path $root $f
  if (Test-Path $dest) { Write-Host "skip  $f"; continue }
  New-Item -ItemType Directory -Force (Split-Path -Parent $dest) | Out-Null
  try {
    Invoke-WebRequest -Uri ($base + $f) -OutFile $dest -UseBasicParsing -ErrorAction Stop
    Write-Host "ok    $f"
  } catch {
    Write-Host "miss  $f  ($($_.Exception.Message))"
  }
}
Write-Host "`nDone. Set CONFIG.assetFallback = '' in js/main.js before deploying."
