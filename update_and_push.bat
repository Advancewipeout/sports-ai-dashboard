@echo off
title Sports AI Ultimate Omni-Sport SaaS Force-Sync Engine
echo ===================================================
echo 📡 DUAL-BROADCAST AUTOPILOT PIPELINE STARTING
echo ===================================================
cd /d "%~dp0"

:: ===== CONFIG =====
:: Set to 1 only if you intentionally want to force push (--force).
set "FORCE_PUSH=0"

:: If you're using a virtualenv, this will activate it if present.
if exist "%~dp0venv\Scripts\activate.bat" (
    echo Activating virtualenv...
    call "%~dp0venv\Scripts\activate.bat"
) else (
    echo No venv activate script found, continuing with system Python.
)

:: Start Streamlit dashboard in a separate window if not already running.
:: Uses the singular filename we standardized to: sport_ai_dashboard.py
start "Streamlit" cmd /c "streamlit run sport_ai_dashboard.py --server.port 8501 --server.headless true --server.enableCORS false" 

:loop
cls
echo ===================================================
echo 🧠 AI ENGINE: SCALPING REAL-TIME LIVE MARKET DATA...
echo ===================================================
:: Run your generator. Prefer the improved manage_layered_data_stream.py (atomic writes).
if exist "%~dp0manage_layered_data_stream.py" (
    python "%~dp0manage_layered_data_stream.py"
) else if exist "%~dp0manage_layered_data_stream_old.py" (
    python "%~dp0manage_layered_data_stream_old.py"
) else (
    :: fallback to original script name if you had previously used a different name
    python "%~dp0ai_processing_engine.py"
)

echo.
echo 📡 PREPARING CLOUD SYNC (git operations) ...
echo ===================================================
:: Safety: don't push secrets
if exist ".streamlit\secrets.toml" (
    echo WARNING: .streamlit\secrets.toml detected in repo root. Skipping git push to avoid leaking secrets.
) else (
    :: Add the files we expect to keep in repo
    git add master_predictions_sheet.csv settled_bets_ledger.csv sport_ai_dashboard.py ai_processing_engine.py manage_layered_data_stream.py 2>nul

    :: Create a timestamped commit message
    set "MSG=Autopilot Sync - %DATE% %TIME%"

    :: Commit if there are changes (quiet if none)
    git commit -m "%MSG%" --quiet 2>nul
    if %errorlevel% EQU 0 (
        echo Changes committed.
        if "%FORCE_PUSH%"=="1" (
            echo FORCE_PUSH enabled -> pushing with --force
            git push origin main --force --quiet
        ) else (
            git push origin main --quiet
        )
        if %errorlevel% EQU 0 (
            echo ✅ SUCCESS: Cloud repository synchronized.
        ) else (
            echo ⚠️ Push returned a non-zero exit code. Check your remote and credentials.
        )
    ) else (
        echo No changes to commit. Skipping push.
    )
)

echo.
echo ===================================================
echo ⏳ Running next automatic live data sweep in 15 seconds...
echo ===================================================
timeout /t 15 >nul
goto loop