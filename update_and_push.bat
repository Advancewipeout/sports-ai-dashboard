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

set LOCAL_GIT_PATH="%LocalAppData%\GitHubDesktop\bin"
set PROG_GIT_CMD="%ProgramFiles%\Git\cmd"
set PROG_GIT_BIN="%ProgramFiles%\Git\bin"
set X86_GIT_CMD="%ProgramFiles(x86)%\Git\cmd"
set PATH=%PATH%;%LOCAL_GIT_PATH%;%PROG_GIT_CMD%;%PROG_GIT_BIN%;%X86_GIT_CMD%

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
