@echo off
cd /d "%~dp0"

echo Configurando variáveis de ambiente...
set NODE_ENV=development
set DEBUG=vite:*

echo Iniciando servidor frontend em modo de desenvolvimento...
npm run dev -- --mode development
