#!/bin/bash
set -e

echo "🧠 ADHD Ace Installer"
echo "============================"

# 1. Ask for Gemini API Key
read -p "🔑 Enter your Gemini API key (from https://makersuite.google.com/app/apikey): " api_key

# 2. Define paths
REPO_URL="https://github.com/Marrowdust/AdhdAce.git"
INSTALL_PARENT="$HOME/adhdace"
INSTALL_DIR="$INSTALL_PARENT/AdhdAce"
SCRIPT_PATH="$HOME/start-adhdace.sh"
DESKTOP_FILE="$HOME/.local/share/applications/adhdace.desktop"
ICON_URL="https://raw.githubusercontent.com/Marrowdust/AdhdAce/main/icon.png"
ICON_PATH="$HOME/.local/share/icons/adhdace-icon.png"
NODE_PATH="$(which node)"
NPM_PATH="$(which npm)"
GREP_PATH="$(which grep)"
TEE_PATH="$(which tee)"
PKILL_PATH="$(which pkill)"
SLEEP_PATH="$(which sleep)"
BRAVE_PATH="$(which brave)"
NOTIFY_PATH="$(which notify-send)"

# 3. Clean previous install
rm -rf "$INSTALL_PARENT"
mkdir -p "$INSTALL_PARENT"
git clone "$REPO_URL" "$INSTALL_DIR"
cd "$INSTALL_DIR"

# 4. Install dependencies
$NPM_PATH install

# 5. Write .env with the user input
echo "GOOGLE_API_KEY=\"$api_key\"" > .env

# 6. Write launch script (using working one you gave)
cat <<EOF > "$SCRIPT_PATH"
#!/bin/bash

APP_DIR="$INSTALL_DIR"
LOG="/tmp/adhdace_next_output.log"

cd "\$APP_DIR" || exit 1

# Clean up
rm -f "\$LOG" /tmp/adhdace_genkit.log
$PKILL_PATH -f "npm run dev" 2>/dev/null
$PKILL_PATH -f "npm run genkit:dev" 2>/dev/null

# Start Genkit
nohup $NPM_PATH run genkit:dev > /tmp/adhdace_genkit.log 2>&1 &

# Start Next.js and log output
nohup bash -c "$NPM_PATH run dev 2>&1 | $TEE_PATH \$LOG" &

# Wait for the URL
for i in {1..30}; do
  $SLEEP_PATH 1
  URL=\$($GREP_PATH -Eo 'http://localhost:[0-9]+' "\$LOG" | head -n 1)
  if [[ -n "\$URL" ]]; then break; fi
done

# Open browser or show error
if [[ -n "\$URL" ]]; then
  $BRAVE_PATH "\$URL" >/dev/null 2>&1 &
else
  $NOTIFY_PATH "AdhdAce" "❌ Could not find Next.js URL"
fi
EOF

chmod +x "$SCRIPT_PATH"

# 7. Download icon
mkdir -p "$(dirname "$ICON_PATH")"
curl -s -o "$ICON_PATH" "$ICON_URL"

# 8. Create .desktop launcher
mkdir -p "$(dirname "$DESKTOP_FILE")"
cat <<EOF > "$DESKTOP_FILE"
[Desktop Entry]
Name=AdhdAce App
Exec=bash -c "nohup $SCRIPT_PATH & disown"
Icon=$ICON_PATH
Type=Application
Terminal=false
Categories=Development;
EOF

chmod +x "$DESKTOP_FILE"
update-desktop-database "$HOME/.local/share/applications/" 2>/dev/null || true

echo "✅ Done! You can now launch 'AdhdAce App' from your app menu."
