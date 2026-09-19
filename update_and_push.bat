@echo off
title Sports AI Ultimate Cloud Auto-Sync
echo ===================================================
echo 🏀 AUTOMATED LIVE CLOCK CLOUD PUSH ACTIVE
echo ===================================================
cd /d "%~dp0"

:loop
echo.
echo 📡 [%time%] Step 1: Processing live scores and Groq API edge adjustments...
python ai_processing_engine.py

echo.
echo 🌐 [%time%] Step 2: Syncing live dataset with Streamlit Cloud via GitHub Desktop...
set PATH=%PATH%;%LocalAppData%\GitHubDesktop\bin;%ProgramFiles%\Git\cmd;%ProgramFiles%\Git\bin
git add master_predictions_sheet.csv settled_bets_ledger.csv >nul 2>&1
git commit -m "Auto-syncing live court clock ticker" --quiet >nul 2>&1
git push origin main --quiet >nul 2>&1

echo.
echo ===================================================
echo ✅ Cloud dataset synchronized! Next update sweep in 15 seconds...
echo ===================================================
timeout /t 15 >nul
goto loop
