@echo off
title Sports AI Ultimate Omni-Sport Local Autopilot Ticker
echo ===================================================
echo 🧠 ALL SPORTS SYSTEM ENGINE CORE LOCAL ACTIVE
echo ===================================================
cd /d "%~dp0"

:: Clear local port bindings and launch your high-speed browser pane cleanly
start cmd /c "streamlit run sports_ai_dashboard.py --server.port 8501 --client.showErrorDetails=false"

:loop
cls
echo ===================================================
echo 🧠 AI SYSTEM MANAGER: STREAMING DYNAMIC LIVE DATA PANELS...
echo ===================================================
python ai_processing_engine.py

timeout /t 1 >nul
goto loop
