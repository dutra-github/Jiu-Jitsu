@echo off
REM Mata processos Node.js
taskkill /f /im node.exe >nul 2>&1

REM Inicia o backend
start "Backend" cmd /c "cd /d d:\Projetos\Projeto V.1 && npm run dev"

REM Inicia o frontend
start "Frontend" cmd /c "cd /d d:\Projetos\Projeto V.1\frontend && npm run dev"

echo Servidores iniciados em terminais separados
pause
