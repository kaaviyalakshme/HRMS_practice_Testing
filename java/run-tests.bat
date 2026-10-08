@echo off
REM Double-click to run the Java tests. Needs JDK 17+ and Maven on PATH.
cd /d "%~dp0"
call mvn -q test-compile || goto :err
if not exist ..\playwright\.auth\user.json (
  call mvn -q exec:java -Dexec.args="install chromium" || goto :err
  echo A browser will open. Sign in to INAI Sapiens, then wait - the session is saved automatically.
  call mvn test -Plogin || goto :err
)
call mvn test -DHEADLESS=false
pause
goto :eof
:err
echo Something failed above. Check that Java 17+ and Maven are installed.
pause
