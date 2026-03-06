@echo off
REM E-Commerce Frontend Quick Start Script for Windows

echo.
echo 🚀 E-Commerce Frontend Setup
echo ====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version
echo.

echo ✅ npm version: 
npm --version
echo.

echo 📦 Installing dependencies...
call npm install

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Frontend dependencies installed!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Application will run on: http://localhost:5173 (or another port if 5173 is busy)
echo.
echo Make sure the backend is running on http://localhost:5000
echo.
pause
