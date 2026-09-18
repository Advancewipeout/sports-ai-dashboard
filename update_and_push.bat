@echo off
title Sports AI Cloud Auto-Sync
echo ===================================================
echo 🧠 RUNNING UPDATES AND SYNCING TO STREAMLIT.APP
echo ===================================================
cd /d "%~dp0"

echo.
echo 📡 Step 1: Building newest game schedules...
python live_schedule_builder.py

echo.
echo ⚡ Step 2: Processing calculations via Groq API...
python ai_processing_engine.py

echo.
echo 🌐 Step 3: Pushing new dataset to GitHub Cloud...

:: Force check standard Windows paths for GitHub Desktop's Git tool
set PATH=%PATH%;%LocalAppData%\GitHubDesktop\bin;%ProgramFiles%\Git\cmd;%ProgramFiles%\Git\bin

git add master_predictions_sheet.csv
git commit -m "Auto-update sports predictions sheet"
git push origin main

echo.
echo ===================================================
echo ✅ SUCCESS: Cloud updates sent! 
echo Your live site at smittysports-ai-dashboard.streamlit.app 
echo will refresh automatically in about 15 seconds.
echo ===================================================
pause
