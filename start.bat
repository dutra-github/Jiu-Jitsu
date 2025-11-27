@echo off
echo ===================================================
echo Sistema de Gerenciamento para Academias de Jiu-Jitsu
echo ===================================================
echo.

cd /d "%~dp0"

echo Verificando dependencias...
if not exist node_modules (
    echo Instalando dependencias do backend...
    call npm install
)

if not exist frontend\node_modules (
    echo Instalando dependencias do frontend...
    cd frontend
    call npm install
    cd ..
)

echo.
echo Configurando o banco de dados...
echo.

echo Executando migracoes do Prisma...
call npx prisma migrate dev --name init

echo.
echo Populando o banco de dados com dados de exemplo...
call node prisma/seed.js

echo.
echo ===================================================
echo Iniciando a aplicacao...
echo ===================================================
echo.
echo Backend: http://localhost:3000/api
echo Frontend: http://localhost:5173
echo.
echo Credenciais de acesso:
echo Email: admin@jiujitsu.com
echo Senha: senha123
echo.
echo Pressione Ctrl+C para encerrar a aplicacao
echo.

call npm run dev:all
