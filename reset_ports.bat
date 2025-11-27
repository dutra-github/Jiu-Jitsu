@echo off
REM Mata processos Node.js e na porta 5180
taskkill /f /im node.exe >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5180"') do taskkill /f /pid %%a >nul 2>&1

REM Altera as portas nos arquivos de configuração
powershell -Command "(Get-Content 'server.js') -replace '3000', '3100' | Set-Content 'server.js'"
powershell -Command "(Get-Content 'frontend/vite.config.js') -replace '5174', '5180' | Set-Content 'frontend/vite.config.js'"
powershell -Command "(Get-Content 'frontend/src/services/api.js') -replace '3001', '3100' | Set-Content 'frontend/src/services/api.js'"

echo Portas reconfiguradas com sucesso:
echo - Backend: 3100
echo - Frontend: 5180
echo - API: http://localhost:3100/api

REM Inicia os servidores
start "Backend" cmd /k "cd /d D:\Projetos\Projeto V.1 && npm run dev"
start "Frontend" cmd /k "cd /d D:\Projetos\Projeto V.1\frontend && npm run dev"
