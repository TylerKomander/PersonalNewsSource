#!/usr/bin/env bash
# Mac/Linux launcher. On Windows, double-click start.cmd instead.
set -e
cd "$(dirname "$0")"

command -v node >/dev/null 2>&1 || { echo "Node.js is required: https://nodejs.org"; exit 1; }

[ -d node_modules ] || { echo "Installing dependencies, this only happens once..."; npm install; }

echo "Building..."
npm run build

echo "Opening http://localhost:4173 ..."
( sleep 2
  if command -v xdg-open >/dev/null 2>&1; then xdg-open http://localhost:4173
  elif command -v open >/dev/null 2>&1; then open http://localhost:4173
  fi ) &

node server.mjs
