#!/bin/bash

set -e

echo "🚀 ADHD Ace Installer"
echo "========================="

# ----------------------------
# Paths & Constants
# ----------------------------
REPO_URL="https://github.com/Marrowdust/AdhdAce.git"
INSTALL_PARENT="$HOME/adhdace"
INSTALL_DIR="$INSTALL_PARENT/AdhdAce"
SCRIPT_PATH="$HOME/start-adhdace.sh"
DESKTOP_FILE="$HOME/.local/share/applications/adhdace.desktop"
ICON_SOURCE="./adhdace-icon.png"
ICON_DEST="$HOME/.local/share/icons/adhdace-icon.png"
LOG="/tmp/adhdace_next_output.log"

# ----------------------------
# Clone the repository
# ----------------------------
echo "📦 Cloning AdhdAce repository..."
mkdir -p "$INSTALL_PARENT"
git clone "$REPO_URL" "$INSTALL_DIR"

cd "$INSTALL_DIR" || exit 1

# ----------------------------
# Install dependencies
# ----------------------------
echo "📚 Installing Node dependencies..."
npm install

# ----------------------------
# Setup .env file
# ----------------------------
if [ ! -f ".env" ]; then
  echo "⚙️ Setting up .env file..."
  cp .env.example .env
  read -p "🔐 Enter your Google AI API Key: " api_key
  echo "GOOGLE_API_KEY=\"$api_key\"" >> .env
else
  echo "✅ .env already exists. Skipping."
fi

# ----------------------------
# Create run script
# ----------------------------
echo "📜 Creating launch script..."
cat <<EOF > "$SCRIPT_PATH"
#!/bin/bash
cd "$INSTALL_DIR" || exit 1
rm -f $LOG /tmp/adhdace_genkit.log
pkill -f "npm run dev" 2>/dev/null
pkill -f "npm run genkit:dev" 2>/dev/null
nohup npm run genkit:dev > /tmp/adhdace_genkit.log 2>&1 &
nohup bash -c "npm run dev 2>&1 | tee $LOG" &
for i in {1..30}; do
  sleep 1
  URL=\$(grep -Eo 'http://localhost:[0-9]+' "$LOG" | head -n 1)
  if [[ -n "\$URL" ]]; then break; fi
done
if [[ -n "\$URL" ]]; then
  brave "\$URL" >/dev/null 2>&1 &
else
  notify-send "AdhdAce" "❌ Could not find Next.js URL"
fi
EOF

chmod +x "$SCRIPT_PATH"

# ----------------------------
# Handle icon
# ----------------------------
echo "🖼️ Installing app icon..."
mkdir -p "$(dirname "$ICON_DEST")"
if [ -f "$ICON_SOURCE" ]; then
  cp "$ICON_SOURCE" "$ICON_DEST"
  echo "✅ Icon installed."
else
  echo "⚠️ Icon file ($ICON_SOURCE) not found. You can place a PNG file there later."
fi

# ----------------------------
# Create .desktop file
# ----------------------------
echo "🧩 Creating desktop launcher..."
mkdir -p "$(dirname "$DESKTOP_FILE")"
cat <<EOF > "$DESKTOP_FILE"
[Desktop Entry]
Name=AdhdAce App
Exec=bash $SCRIPT_PATH
Icon=$ICON_DEST
Type=Application
Terminal=false
Categories=Development;
EOF

chmod +x "$DESKTOP_FILE"
update-desktop-database "$HOME/.local/share/applications/"

# ----------------------------
# Done!
# ----------------------------
echo "✅ Installation complete!"
echo "🧠 You can now search 'AdhdAce App' in your system launcher or run:"
echo "   bash $SCRIPT_PATH"
