@echo off
echo 🚀 Deploying your Quiz App to Vercel...
echo.

REM Check if vercel is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
)

echo Starting deployment...
echo.

REM Deploy to Vercel
vercel --prod

echo.
echo 🎉 Deployment complete!
echo.
echo 📝 Next steps:
echo 1. Add your Gmail credentials in Vercel dashboard
echo 2. Set NEXT_PUBLIC_SITE_URL to your Vercel URL
echo 3. Test your live quiz!
echo.
echo 💡 Don't forget to configure Gmail App Password for emails!
pause
