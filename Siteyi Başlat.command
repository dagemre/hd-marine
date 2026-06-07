#!/bin/bash
# HD Marine — Local geliştirme sunucusunu başlatır
# Çift tıklayınca: bağımlılıkları kurar (ilk seferde), dev server'ı açar, tarayıcıyı açar.

cd "$(dirname "$0")/hd-marine" || { echo "❌ hd-marine klasörü bulunamadı"; read -r; exit 1; }

echo "═══════════════════════════════════════"
echo "  HD MARINE — Local Geliştirme Ortamı"
echo "═══════════════════════════════════════"
echo ""

# Node kontrolü
if ! command -v node >/dev/null 2>&1; then
  # Homebrew / nvm yollarını dene
  export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
  [ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"
fi

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js bulunamadı."
  echo "   Kurulum için: https://nodejs.org (LTS sürümü önerilir)"
  echo ""
  echo "Kapatmak için Enter'a bas..."
  read -r
  exit 1
fi

echo "✅ Node.js $(node -v)"

# Bağımlılık kontrolü — platform değişimini de algılar.
# (Claude'un sandbox'ı Linux; orada kurulan native binary'ler Mac'te çalışmaz.
#  Marker uyuşmazsa node_modules + .next silinip bu platform için yeniden kurulur.)
PLATFORM="$(node -p 'process.platform + "-" + process.arch')"
MARKER="node_modules/.platform"
if [ ! -d node_modules ] || [ "$(cat "$MARKER" 2>/dev/null)" != "$PLATFORM" ]; then
  echo ""
  echo "📦 Bağımlılıklar bu bilgisayar ($PLATFORM) için kuruluyor (birkaç dakika sürebilir)..."
  rm -rf node_modules .next
  npm install || { echo "❌ npm install başarısız"; read -r; exit 1; }
  echo "$PLATFORM" > "$MARKER"
else
  # package.json güncellenmişse eksik paketleri sessizce tamamla
  npm install --no-audit --no-fund >/dev/null 2>&1 || true
fi

# Tarayıcıyı server ayağa kalkınca aç
(
  for i in $(seq 1 60); do
    sleep 1
    if curl -s -o /dev/null "http://localhost:3000"; then
      open "http://localhost:3000"
      break
    fi
  done
) &

echo ""
echo "🚀 Geliştirme sunucusu başlatılıyor: http://localhost:3000"
echo "   Durdurmak için bu pencerede Ctrl+C"
echo ""
npm run dev
