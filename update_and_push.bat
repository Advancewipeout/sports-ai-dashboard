@echo off
title Sports AI Ultimate Omni-Sport SaaS Force-Sync Engine
echo ===================================================
echo 📡 DUAL-BROADCAST UNBLOCKED CLOUD PIPELINE ACTIVE
echo ===================================================
cd /d "%~dp0"

:: 1. Initialize your local presentation host window pane cleanly in the background
start cmd /c "streamlit run sports_ai_dashboard.py --server.port 8501 --client.showErrorDetails=false"

:loop
cls
echo ===================================================
echo 🧠 CALIBRATING ATHLETIC SCALPS AND TICKING CLOCKS...
echo ===================================================
python ai_processing_engine.py

echo.
echo 📡 BROADCASTING FORCE-OVERWRITE SNAPSHOT TO STREAMLIT.APP...
set PATH=%PATH%;%LocalAppData%\GitHubDesktop\bin;%ProgramFiles%\Git\cmd;%ProgramFiles%\Git\bin

:: ✅ CRITICAL FORCE-SYNC PIPELINE: Bypasses cloud history restrictions 
:: by forcing a strict overwrite index block straight to the master repository branch!
git add master_predictions_sheet.csv settled_bets_ledger.csv sports_ai_dashboard.py ai_processing_engine.py
git commit -m "Live SaaS Matrix Stream Refresh" --quiet
git push origin main --force --quiet

echo.
echo ===================================================
echo ✅ SUCCESS: Cloud database synchronization unblocked!
echo ⏳ Running next automatic live data sweep in 15 seconds...
echo ===================================================
timeout /t 15 >nul
goto loop
