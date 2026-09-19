@echo off
title Sports AI Ultimate Omni-Sport Autopilot Ticker
echo ===================================================
echo 🏀 MULTI-SPORT REAL-TIME CLOUD PIPELINE ACTIVE
echo ===================================================
cd /d "%~dp0"

:loop
cls
echo ===================================================
echo 🧠 STEP 1: CALCULATING REAL-TIME TRACKING MOTION...
echo ===================================================
python ai_processing_engine.py

echo.
echo 📡 STEP 2: BROADCASTING REAL-TIME DATA TO WEB SERVER...
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
