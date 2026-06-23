#!/usr/bin/env bash
# Local development — Vite dev server (not PM2)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PORT="${PORT:-3094}"

echo "==> Smart Travels Frontend — development start"

if [[ ! -f .env ]]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
fi

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting Vite dev server on http://localhost:${PORT}"
npm run dev -- --host 0.0.0.0 --port "$PORT"
