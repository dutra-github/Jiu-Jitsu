@echo off
setlocal

:: Define o diretório do projeto
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo Iniciando servidores do Sistema de Gerenciamento de Academia de Jiu-Jitsu...

:: Mata processos nas portas 3200 e 3201
echo Verificando e matando processos existentes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3200') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3201') do taskkill /F /PID %%a 2>nul

:: Atualiza a senha do admin
echo Atualizando senha do admin...
node "%PROJECT_DIR%scripts\updateAdminPassword.js"

:: Aguarda um momento
timeout /t 2 /nobreak > nul

:: Inicia o backend
echo Iniciando servidor backend na porta 3200...
cd /d "%PROJECT_DIR%"
start "Backend Server" cmd /k "npm run dev"

:: Aguarda o backend iniciar
timeout /t 5 /nobreak > nul

:: Inicia o frontend
echo Iniciando servidor frontend na porta 3201...
cd /d "%PROJECT_DIR%frontend"
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Servidores iniciados!
echo Backend: http://localhost:3200
echo Frontend: http://localhost:3201
echo.
echo Credenciais de acesso:
echo Email: admin@example.com
echo Senha: teste@login
echo.
echo Pressione qualquer tecla para sair...
pause > nul

endlocal
