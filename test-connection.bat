@echo off
echo ===================================================
echo Teste de Conexao - Sistema de Academias de Jiu-Jitsu
echo ===================================================
echo.

echo Executando teste de conexao...
cd /d "%~dp0"
node "%~dp0test-connection.js"

echo.
echo Pressione qualquer tecla para sair...
pause > nul
