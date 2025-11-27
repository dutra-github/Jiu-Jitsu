@echo off
setlocal enabledelayedexpansion

:: Define o diretório do projeto
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo Reiniciando ambiente de desenvolvimento...

:: Mata processos nas portas 3200 e 3201
echo Finalizando processos...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3200"') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3201"') do taskkill /F /PID %%a 2>nul

:: Aguarda um momento
timeout /t 2 /nobreak > nul

:: Limpa caches e arquivos temporários
echo Limpando ambiente de desenvolvimento...

:: Limpa caches do Vite
if exist "%PROJECT_DIR%frontend\.vite" (
    rmdir /s /q "%PROJECT_DIR%frontend\.vite"
)
if exist "%PROJECT_DIR%frontend\node_modules\.vite" (
    rmdir /s /q "%PROJECT_DIR%frontend\node_modules\.vite"
)

:: Limpa builds
if exist "%PROJECT_DIR%frontend\dist" (
    rmdir /s /q "%PROJECT_DIR%frontend\dist"
)

:: Remove node_modules
if exist "%PROJECT_DIR%frontend\node_modules" (
    rmdir /s /q "%PROJECT_DIR%frontend\node_modules"
)
if exist "%PROJECT_DIR%node_modules" (
    rmdir /s /q "%PROJECT_DIR%node_modules"
)

:: Limpa caches do npm de forma segura
echo Limpando cache do npm...
call npm cache verify
call npm cache clean --force 2>nul

:: Reinstala dependências com correções de segurança
echo Reinstalando dependências...

cd /d "%PROJECT_DIR%"
echo Instalando e corrigindo dependências do backend...
call npm install
call npm audit fix --force

:: Gera o Prisma Client
echo Gerando Prisma Client...
call npx prisma generate

:: Verifica e atualiza o banco de dados
echo Verificando banco de dados...
call npx prisma db push

cd /d "%PROJECT_DIR%frontend"
echo Instalando e corrigindo dependências do frontend...
call npm install
call npm audit fix

:: Atualiza pacotes com problemas conhecidos
echo Atualizando pacotes específicos...
call npm install @jridgewell/sourcemap-codec@latest
call npm install lru-cache@latest

:: Verifica instalação do Vite
echo Verificando instalação do Vite...
call npm install -g vite@latest

:: Inicia backend
echo Iniciando backend...
start "Backend Server" cmd /k "%PROJECT_DIR%start-backend.bat"

:: Aguarda backend iniciar
timeout /t 5 /nobreak > nul

:: Inicia frontend
echo Iniciando frontend...
start "Frontend Server" cmd /k "%PROJECT_DIR%frontend\start-frontend.bat"

echo.
echo Servidores reiniciados!
echo Backend: http://localhost:3200
echo Frontend: http://localhost:3201
echo.
echo Pressione qualquer tecla para sair...
pause > nul

endlocal
