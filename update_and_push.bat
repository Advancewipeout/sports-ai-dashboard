@echo off
title Sports AI Ultimate Omni-Sport Local Autopilot Ticker
echo ===================================================
echo 🏀 MULTI-SPORT REAL-TIME LOCAL DESK ACTIVE
echo ===================================================
cd /d "%~dp0"

:: Force start your uncached local browser interface window
start cmd /c "streamlit run sports_ai_dashboard.py --server.port 8501"

echo.
echo ===================================================
echo ✅ SUCCESS: Local automated workspace initialized!
echo ⏳ Keeping matrix channels synchronized...
echo ===================================================
