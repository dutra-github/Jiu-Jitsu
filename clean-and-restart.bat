@echo off
setlocal

:: Define o diretório do projeto
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo Limpando e reiniciando o ambiente de desenvolvimento...

:: Mata todos os processos node
echo Finalizando processos Node.js...
taskkill /F /IM node.exe 2>nul

:: Limpa caches
echo Limpando caches...
if exist "%PROJECT_DIR%frontend\.vite" (
    rmdir /s /q "%PROJECT_DIR%frontend\.vite"
)
if exist "%PROJECT_DIR%frontend\node_modules\.vite" (
    rmdir /s /q "%PROJECT_DIR%frontend\node_modules\.vite"
)
if exist "%PROJECT_DIR%frontend\dist" (
    rmdir /s /q "%PROJECT_DIR%frontend\dist"
)

:: Aguarda um momento
timeout /t 2 /nobreak > nul

:: Inicia os servidores
echo Iniciando servidores...
call "%PROJECT_DIR%start-servers.bat"

echo.
echo Ambiente reiniciado com sucesso!
echo Frontend: http://localhost:3201
echo Backend: http://localhost:3200
echo.
echo Pressione qualquer tecla para sair...
pause > nul

endlocal
