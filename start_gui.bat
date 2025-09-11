@echo off
echo Starting Railway RAG System with GUI...

echo.
echo Starting API Server...
start /B python api_server.py

echo.
echo Waiting for API server to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting React Frontend...
cd frontend
start /B npm start

echo.
echo System is starting...
echo Frontend will be available at: http://localhost:3000
echo API server running at: http://localhost:8000
echo.
echo Press any key to close this window (servers will continue running)
pause > nul
