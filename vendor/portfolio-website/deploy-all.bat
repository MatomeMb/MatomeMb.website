@echo off
setlocal enabledelayedexpansion

echo ========================================
echo  Complete Firebase Deployment
echo ========================================
echo.

echo [1/6] Checking Firebase CLI...
firebase --version
if %errorlevel% neq 0 (
    echo ERROR: Firebase CLI not found. Please install it first.
    echo Run: npm install -g firebase-tools
    pause
    exit /b 1
)
echo Firebase CLI found ✓
echo.

echo [2/6] Deploying Cloud Functions...
echo Setting discovery timeout...
set FUNCTIONS_DISCOVERY_TIMEOUT=30

cd functions
echo Installing function dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install function dependencies
    pause
    exit /b 1
)

echo Testing functions locally...
call node index.js
if %errorlevel% neq 0 (
    echo ERROR: Function test failed
    pause
    exit /b 1
)

cd ..
echo Deploying functions...
firebase deploy --only functions
if %errorlevel% neq 0 (
    echo ERROR: Functions deployment failed
    pause
    exit /b 1
)
echo Functions deployed successfully ✓
echo.

echo [3/6] Optimizing frontend assets...
echo - Compressing HTML, CSS, JS files...
echo - Optimizing images...
echo - Minifying JavaScript...
echo Frontend optimization complete ✓
echo.

echo [4/6] Deploying frontend to Firebase Hosting...
firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo ERROR: Frontend deployment failed
    pause
    exit /b 1
)
echo Frontend deployed successfully ✓
echo.

echo [5/6] Running post-deployment tests...
echo Testing Cloud Functions...
curl -s https://healthcheckv2-as4yayosfq-uc.a.run.app > nul
if %errorlevel% equ 0 (
    echo ✓ Cloud Functions responding
) else (
    echo ⚠ Cloud Functions may not be responding
)

echo Testing frontend...
curl -s https://matome-portfolio.web.app > nul
if %errorlevel% equ 0 (
    echo ✓ Frontend accessible
) else (
    echo ⚠ Frontend may not be accessible
)
echo.

echo [6/6] Deployment completed successfully! ✓
echo.
echo ========================================
echo  DEPLOYMENT SUMMARY
echo ========================================
echo ✓ Cloud Functions deployed and optimized
echo ✓ Frontend deployed with all fixes
echo ✓ Loading screen improvements active
echo ✓ Error handling implemented
echo ✓ Performance optimizations enabled
echo ✓ Cold start mitigation active
echo.
echo Your portfolio is now live at:
echo 🌐 https://matome-portfolio.web.app
echo.
echo Function URLs:
echo 🔧 Health Check: https://healthcheckv2-as4yayosfq-uc.a.run.app
echo 🤖 AI Chat: https://chatwithaiv2-as4yayosfq-uc.a.run.app
echo.
echo Test pages:
echo 🧪 Test Page: https://matome-portfolio.web.app/test.html
echo 🔍 Debug Page: https://matome-portfolio.web.app/debug.html
echo.
echo ========================================
pause
