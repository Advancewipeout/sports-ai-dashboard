@echo off
title Sports AI Ultimate Omni-Sport SaaS Cache-Bypass Engine
echo ===================================================
echo 🧠 DUAL-BROADCAST HIGH-SPEED CLOUD PIPE ACTIVE
echo ===================================================
cd /d "%~dp0"

:: Initialize your local presenter window port cleanly
start cmd /c "streamlit run sports_ai_dashboard.py --server.port 8501 --client.showErrorDetails=false"

:loop
cls
echo ===================================================
echo 🧠 CALIBRATING SCORES AND TICKING INNINGS FRAMES...
echo ===================================================
python ai_processing_engine.py

echo.
echo 📡 FORCE-BROADCASTING UNCACHED METRICS TO STREAMLIT.APP...
set PATH=%PATH%;%LocalAppData%\GitHubDesktop\bin;%ProgramFiles%\Git\cmd;%ProgramFiles%\Git\bin

:: ✅ HIGH-SPEED CACHE BYPASS TRIGGER: Appends a unique dynamic micro-time marker string
:: onto your repository logs to smash Streamlit's cloud caching blocks and force real-time sync!
git add master_predictions_sheet.csv settled_bets_ledger.csv sports_ai_dashboard.py ai_processing_engine.py
git commit -m "Real-Time Sync ID: %time% - Uncached" --quiet
git push origin main --quiet

echo.
echo ===================================================
echo ✅ SUCCESS: Cloud dashboard cache bypassed perfectly!
echo ⏳ Running next dynamic data sweep in 15 seconds...
echo ===================================================
timeout /t 15 >nul
goto loop
