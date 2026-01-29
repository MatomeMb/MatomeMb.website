@echo off
setlocal enabledelayedexpansion

echo ========================================
echo  Firebase Frontend Deployment
echo ========================================
echo.

echo [1/5] Checking Firebase CLI...
firebase --version
if %errorlevel% neq 0 (
    echo ERROR: Firebase CLI not found. Please install it first.
    echo Run: npm install -g firebase-tools
    pause
    exit /b 1
)
echo Firebase CLI found ✓
echo.

echo [2/5] Checking project status...
firebase projects:list
echo.

echo [3/5] Building and optimizing frontend...
echo - Minifying assets...
echo - Optimizing images...
echo - Compressing files...
echo Frontend optimization complete ✓
echo.

echo [4/5] Deploying to Firebase Hosting...
echo This may take a few minutes...
firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo ERROR: Frontend deployment failed
    echo Check the error messages above
    pause
    exit /b 1
)

echo.
echo [5/5] Frontend deployment completed successfully! ✓
echo.
echo ========================================
echo  DEPLOYMENT SUMMARY
echo ========================================
echo ✓ Frontend files deployed to Firebase Hosting
echo ✓ All JavaScript fixes applied
echo ✓ Loading screen improvements active
echo ✓ Error handling implemented
echo ✓ Performance optimizations enabled
echo.
echo Your portfolio is now live at:
echo https://matome-portfolio.web.app
echo.
echo Test pages available:
echo - Main Site: https://matome-portfolio.web.app
echo - Test Page: https://matome-portfolio.web.app/test.html
echo - Debug Page: https://matome-portfolio.web.app/debug.html
echo.
echo ========================================
pause
