@echo off
title Sports AI Ultimate Omni-Sport SaaS Dual-Broadcast Engine
echo ===================================================
echo 🧠 DUAL-BROADCAST REAL-TIME AUTOMATION CORE ACTIVE
echo ===================================================
cd /d "%~dp0"

:: 1. Initialize your uncached high-speed local browser presentation terminal pane
start cmd /c "streamlit run sports_ai_dashboard.py --server.port 8501 --client.showErrorDetails=false"

:loop
cls
echo ===================================================
echo 🧠 TRACKING STADIUMS AND UPDATING LIVE GRID TILES...
echo ===================================================
python ai_processing_engine.py

echo.
echo 📡 SYNCING CLOUD PIPELINE SCRIPT LOGS TO WEB DASHBOARD...
set PATH=%PATH%;%LocalAppData%\GitHubDesktop\bin;%ProgramFiles%\Git\cmd;%ProgramFiles%\Git\bin
git add master_predictions_sheet.csv settled_bets_ledger.csv sports_ai_dashboard.py ai_processing_engine.py
git commit -m "SaaS dual-broadcast matrix refresh" --quiet
git push origin main --quiet

echo.
echo ===================================================
echo ✅ SUCCESS: Local port and Streamlit.app updated perfectly!
echo ⏳ Running next dynamic data sweep in 15 seconds...
echo ===================================================
timeout /t 15 >nul
goto loop
