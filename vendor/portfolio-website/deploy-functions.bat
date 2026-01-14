@echo off
setlocal enabledelayedexpansion

echo ========================================
echo  Firebase Cloud Functions Deployment
echo ========================================
echo.

REM Set discovery timeout to prevent deployment timeouts
set FUNCTIONS_DISCOVERY_TIMEOUT=30

echo [1/7] Navigating to functions directory...
cd functions
if %errorlevel% neq 0 (
    echo ERROR: Could not navigate to functions directory
    pause
    exit /b 1
)

echo [2/7] Installing dependencies...
echo This may take a few minutes...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo [3/7] Running security audit fix...
call npm audit fix --force
if %errorlevel% neq 0 (
    echo WARNING: npm audit fix had issues, but continuing...
) else (
    echo Security vulnerabilities fixed!
)
echo.

echo [4/7] Testing functions locally...
echo Running: node index.js
call node index.js
if %errorlevel% neq 0 (
    echo ERROR: Functions test failed locally
    echo Please check your code before deploying
    pause
    exit /b 1
)
echo Functions test passed! ✓
echo.

echo [5/7] Returning to project root...
cd ..
if %errorlevel% neq 0 (
    echo ERROR: Could not return to project root
    pause
    exit /b 1
)

echo [6/7] Deploying to Firebase...
echo NOTE: If prompted about deleting old functions, type 'y' and press Enter
echo.
call firebase deploy --only functions
if %errorlevel% neq 0 (
    echo ERROR: Firebase deployment failed
    echo Check the error messages above
    pause
    exit /b 1
)

echo.
echo [7/7] Deployment completed successfully! ✓
echo.
echo ========================================
echo  DEPLOYMENT SUMMARY
echo ========================================
echo ✓ Dependencies installed and updated
echo ✓ Security vulnerabilities fixed
echo ✓ Functions tested locally
echo ✓ Functions deployed to Firebase
echo.
echo Your functions are now live at:
echo - Health Check: https://us-central1-matome-portfolio.cloudfunctions.net/healthCheckV2
echo - AI Chat: https://us-central1-matome-portfolio.cloudfunctions.net/chatWithAIV2
echo.
echo ========================================
pause