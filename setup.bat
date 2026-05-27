@echo off
set NODE_PATH=C:\Users\AkashKumar\AppData\Local\Temp\node-portable\node-v20.18.0-win-x64
set PATH=%NODE_PATH%;%PATH%

echo Node.js version:
call "%NODE_PATH%\node.exe" --version

echo NPM version:
call "%NODE_PATH%\npm.cmd" --version

echo.
echo Installing dependencies...
cd /d "%~dp0"
call "%NODE_PATH%\npm.cmd" install

echo.
echo Generating Prisma client...
call "%NODE_PATH%\npm.cmd" exec prisma generate

echo.
echo Pushing database schema...
call "%NODE_PATH%\npm.cmd" exec prisma db push

echo.
echo Database setup complete!

echo.
echo Starting development server...
echo Open http://localhost:3000 in your browser.
call "%NODE_PATH%\npm.cmd" run dev