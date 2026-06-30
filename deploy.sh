#!/usr/bin/env bash
# Production deploy — static build served via PM2
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PM2_APP_NAME="${PM2_APP_NAME:-st-frontend}"

echo "==> Smart Travels Frontend — PM2 deploy"

if ! command -v pm2 &>/dev/null; then
  echo "Error: pm2 is not installed. Run: npm install -g pm2"
  exit 1
fi

if [[ ! -f .env ]]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "⚠️  Set VITE_API_URL to your production API URL in .env"
fi

# Load env vars for build and PM2
set -a
# shellcheck disable=SC1091
source .env
set +a

echo "Installing dependencies..."
npm install

echo "Building production bundle..."
BUILD_API_URL="${VITE_API_URL_PRODUCTION:-https://api.smarttravels.co.tz/api}"
echo "   VITE_API_URL=${BUILD_API_URL}"
VITE_API_URL="$BUILD_API_URL" npm run build

if [[ ! -d dist ]]; then
  echo "Error: dist/ folder not found after build."
  exit 1
fi

export PM2_APP_NAME

if pm2 describe "$PM2_APP_NAME" &>/dev/null; then
  echo "Restarting PM2 app: $PM2_APP_NAME"
  pm2 restart ecosystem.config.cjs --env production --update-env
else
  echo "Starting PM2 app: $PM2_APP_NAME"
  pm2 start ecosystem.config.cjs --env production
fi

pm2 save

echo ""
echo "✅ Frontend deployed with PM2"
echo "   App name : $PM2_APP_NAME"
echo "   Port     : ${PORT:-3094}"
echo "   Logs     : pm2 logs $PM2_APP_NAME"
echo "   Status   : pm2 status $PM2_APP_NAME"
