@echo off
title FACTORY OS — Backend Server
color 0A

echo.
echo  ==========================================
echo   FACTORY OS — Backend Server
echo   Operator: SOPHEAK
echo  ==========================================
echo.
echo  [*] Starting server...
echo  [*] Do NOT close this window while using the app.
echo.

cd /d E:\SOPHEAKJS01_index\Grok

node Server.js

echo.
echo  [!] Server stopped. Press any key to restart or close window.
pause > nul