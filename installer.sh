#!/bin/bash
set -e

echo "🚀 ADHD Ace Installer"
echo "============================"

# ----------------------------
# Prompt user for Gemini API key
# ----------------------------
echo "🔑 To continue, you need a Gemini API key from Google AI Studio."
echo "Visit: https://makersuite.google.com/app/apikey to generate one."
read -p "👉 Paste your Gemini API key: " api_key

# ----------------------------
# Define Paths
# ----------------------------
REPO_URL="https://github.com/Marrowdust/AdhdAce.git"
INSTALL_PARENT="$HOME/adhdace"
INSTALL_DIR="$INSTALL_PARENT/AdhdAce"
SCRIPT_PATH="$HOME/start-adhdace.sh"
DESKTOP_FILE="$HOME/.local/share/applications/adhdace.desktop"
ICON_DEST="$HOME/.local/share/icons/adhdace-icon.png"
LOG="/tmp/adhdace_next_output.log"

# ----------------------------
# Remove old desktop shortcut
# ----------------------------
[ -f "$DESKTOP_FILE" ] && rm "$DESKTOP_FILE"

# ----------------------------
# Clone the repo
# ----------------------------
echo "📦 Cloning AdhdAce repo..."
rm -rf "$INSTALL_PARENT"
mkdir -p "$INSTALL_PARENT"
git clone "$REPO_URL" "$INSTALL_DIR"

# ----------------------------
# Install dependencies
# ----------------------------
cd "$INSTALL_DIR"
echo "📚 Installing dependencies..."
npm install

# ----------------------------
# Write new .env file
# ----------------------------
echo "🧪 Creating clean .env file with your key..."
echo "GOOGLE_API_KEY=\"$api_key\"" > .env

# ----------------------------
# Create launch script
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
  notify-send "AdhdAce" "❌ Could not find running app URL"
fi
EOF

chmod +x "$SCRIPT_PATH"

# ----------------------------
# Create .desktop shortcut
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
update-desktop-database "$HOME/.local/share/applications/" 2>/dev/null || true

# ----------------------------
# Done
# ----------------------------
echo "✅ Done! Launch AdhdAce from your applications menu or with:"
echo "   bash $SCRIPT_PATH"
