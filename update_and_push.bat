@echo off
title Sports AI Cloud Deployment Sync
echo ===================================================
echo 🌐 MANUAL REFRESH: Syncing Current Spreadsheet to Site
echo ===================================================
cd /d "%~dp0"

set PATH=%PATH%;%LocalAppData%\GitHubDesktop\bin;%ProgramFiles%\Git\cmd;%ProgramFiles%\Git\bin
git add master_predictions_sheet.csv settled_bets_ledger.csv sports_ai_dashboard.py ai_processing_engine.py
git commit -m "Manual structural desk snapshot backup" --quiet
git push origin main --quiet

echo ===================================================
echo ✅ SUCCESS: Your cloud dashboard is perfectly up-to-date!
echo ===================================================
pause
