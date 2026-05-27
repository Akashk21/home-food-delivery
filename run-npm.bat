@echo off
set NODE_PATH=C:\Users\AkashKumar\AppData\Local\Temp\node-portable\node-v20.18.0-win-x64
set PATH=%NODE_PATH%;%NODE_PATH%\node_modules\npm\bin;%PATH%
echo Node: 
call "%NODE_PATH%\node.exe" --version
echo Npm: 
call "%NODE_PATH%\npm.cmd" --version

cd /d "%~dp0"
if "%1"=="" (
  echo Usage: run-npm.bat [command]
  echo e.g.: run-npm.bat install
  exit /b 1
)
call "%NODE_PATH%\npm.cmd" %*