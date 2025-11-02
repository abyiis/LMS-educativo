@echo off
echo ====================================
echo    Iniciando LMS Educativo
echo ====================================
echo.

echo [1/2] Iniciando Backend...
start "LMS Backend" cmd /k "cd backend && npm install && npm start"
timeout /t 5 /nobreak > nul

echo [2/2] Iniciando Frontend...
start "LMS Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ====================================
echo    Servidores Iniciados
echo ====================================
echo - Backend:  http://localhost:3000
echo - Frontend: http://localhost:5173
echo ====================================
echo.
echo Presiona cualquier tecla para cerrar...
pause > nul