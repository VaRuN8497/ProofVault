@echo off
title ProofVault - GitHub Push
color 0A

echo ==========================================
echo        ProofVault GitHub Auto Push
echo ==========================================
echo.

cd /d "%~dp0"

echo [1/5] Checking Git...
git --version
if errorlevel 1 (
    echo.
    echo ERROR: Git is not installed or not in PATH.
    pause
    exit /b 1
)

echo.
echo [2/5] Adding all changes...
git add .

echo.
echo [3/5] Creating commit...
git commit -m "Update ProofVault"

echo.
echo [4/5] Setting GitHub repository...
git remote remove origin 2>nul
git remote add origin https://github.com/VaRuN8497/ProofVault.git

echo.
echo [5/5] Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ==========================================
echo             PUSH COMPLETE
echo ==========================================
echo.
echo Repository:
echo https://github.com/VaRuN8497/ProofVault
echo.
pause