@echo off
title Personal News Source
cd /d "%~dp0"

where node >nul 2>nul || (
  echo Node.js is required. Install it from https://nodejs.org then run this again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies, this only happens once...
  call npm install || ( echo Install failed. & pause & exit /b 1 )
)

echo Building...
call npm run build || ( echo Build failed. & pause & exit /b 1 )

echo.
echo Opening http://localhost:4173 in your browser...
start "" http://localhost:4173

node server.mjs
