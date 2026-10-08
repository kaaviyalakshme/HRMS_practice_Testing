@echo off
REM Double-click to run the Add Employee tests. Needs Node.js 18+ (https://nodejs.org).
cd /d "%~dp0"
if not exist node_modules (
  echo Installing Playwright...
  call npm install || goto :err
  call npx playwright install chromium || goto :err
)
if not exist playwright\.auth\user.json (
  echo A browser will open. Sign in to INAI Sapiens, then wait - the session is saved automatically.
  call npm run login || goto :err
)
call npx playwright test --project=chromium --headed
call npx playwright show-report
goto :eof
:err
echo Something failed above. Check that Node.js is installed.
pause
