@echo off
title Sports AI Ultimate Omni-Sport Autopilot Ticker
echo ===================================================
echo 🏀 MULTI-SPORT REAL-TIME CLOUD PIPELINE ACTIVE
echo ===================================================
cd /d "%~dp0"

:loop
cls
echo ===================================================
echo 🧠 AI ENGINE: SCALPING REAL-TIME LIVE MARKET DATA...
echo ===================================================
python ai_processing_engine.py

echo.
echo 📡 SERVER SNAPSHOT BROADCAST: DEPLOYING REPOSITORY TO WEB DESK...
set PATH=%PATH%;%LocalAppData%\GitHubDesktop\bin;%ProgramFiles%\Git\cmd;%ProgramFiles%\Git\bin
git add master_predictions_sheet.csv settled_bets_ledger.csv sports_ai_dashboard.py ai_processing_engine.py
git commit -m "Auto-syncing real live scoreboard clocks" --quiet
git push origin main --quiet

echo.
echo ===================================================
echo ✅ SUCCESS: Cloud dashboard updated perfectly!
echo ⏳ Running next automatic live data sweep in 15 seconds...
echo ===================================================
timeout /t 15 >nul
goto loop
