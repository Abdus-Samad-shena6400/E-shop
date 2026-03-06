@echo off
REM E-Commerce Backend Quick Start Script for Windows

echo.
echo 🚀 E-Commerce Backend Setup
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

REM Check if npm can be found
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed or not accessible.
    pause
    exit /b 1
)

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
echo ⚙️  Creating .env file...
if not exist .env (
    copy .env.example .env
    echo ✅ .env file created. Update MONGODB_URI if needed.
) else (
    echo ✅ .env file already exists.
)

echo.
echo 🗂️  Seeding database with products...
call npm run seed

if errorlevel 1 (
    echo ⚠️  Database seeding failed (MongoDB might not be running)
    echo Make sure MongoDB is running on your system.
)

echo.
echo 🎉 Setup complete!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Server will run on: http://localhost:5000
echo.
pause
