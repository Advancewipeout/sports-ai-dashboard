@echo off
title Sports AI Ultimate Omni-Sport Local Autopilot Ticker
echo ===================================================
echo 🧠 ALL SPORTS SYSTEM ENGINE ENGINE ACTIVE
echo ===================================================
cd /d "%~dp0"

:: Automatically launch your local dashboard browser panel in the background
start cmd /c "streamlit run sports_ai_dashboard.py --server.port 8501"

:loop
cls
echo ===================================================
echo 🧠 AI SYSTEM MANAGER: CALCULATING AND SORTING MATCHES...
echo ===================================================
:: Runs your direct, unfiltered real-time data ticks and clears passed games automatically
python ai_processing_engine.py

timeout /t 1 >nul
goto loop
