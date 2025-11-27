@echo off
taskkill /f /im node.exe >nul 2>&1
cd /d d:\Projetos\Projeto V.1
node server.js
