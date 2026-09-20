@echo off
title Sports AI Ultimate Omni-Sport SaaS Force-Sync Engine
echo ===================================================
echo 📡 DUAL-BROADCAST 100%% AUTOPILOT PIPELINE ACTIVE
echo ===================================================
cd /d "%~dp0"

:: 1. Keep your local presentation host window pane running cleanly in the background
start cmd /c "streamlit run sports_ai_dashboard.py --server.port 8501 --client.showErrorDetails=false"

:loop
cls
echo ===================================================
echo 🧠 AI ENGINE: SCALPING REAL-TIME LIVE MARKET DATA...
echo ===================================================
python ai_processing_engine.py

echo.
echo 📡 BROADCASTING FORCED OVERWRITE TO STREAMLIT.APP SERVER...
set PATH=%PATH%;%LocalAppData%\GitHubDesktop\bin;%ProgramFiles%\Git\cmd;%ProgramFiles%\Git\bin

:: ✅ THE TRUE AUTOPILOT ENGINE: Automatically stages, titles the commit with a live timestamp,
:: and forcefully pushes it straight to the internet repository with zero manual clicks required!
git add master_predictions_sheet.csv settled_bets_ledger.csv sports_ai_dashboard.py ai_processing_engine.py
git commit -m "Autopilot Sync - %time%" --quiet
git push origin main --force --quiet

echo.
echo ===================================================
echo ✅ SUCCESS: Cloud database synchronization unblocked!
echo ⏳ Running next automatic live data sweep in 15 seconds...
echo ===================================================
timeout /t 15 >nul
goto loop
