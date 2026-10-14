@echo off
TITLE SpamShield AI - Backend Server
echo.
echo  SpamShield AI - Starting FastAPI Backend...
echo  ============================================
echo.

REM Check if models exist
if not exist "models\metrics.json" (
    echo  [!] Models not found! Training now...
    echo.
    py train_models.py
    echo.
)

echo  [OK] Starting server at http://localhost:8000
echo  Press Ctrl+C to stop.
echo.
py -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
