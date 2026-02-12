@echo off
SETLOCAL

:: 1. Get the current date and time in a consistent format (YYYY-MM-DD HH:mm:ss)
FOR /F "usebackq" %%i IN (`powershell -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) DO SET TIMESTAMP=%%i
SET "COMMIT_MSG=Auto-commit: %TIMESTAMP%"

ECHO.
ECHO --- Starting Git Automation ---
ECHO Commit Message: "%COMMIT_MSG%"
ECHO -------------------------------

:: 2. Add all files to the staging area
ECHO.
ECHO Running: git add .
git add .
IF ERRORLEVEL 1 (
    ECHO ❌ Git add failed. Exiting.
    GOTO :END
)

:: 3. Commit staged changes
ECHO.
ECHO Running: git commit -m "%COMMIT_MSG%"
git commit -m "%COMMIT_MSG%"
IF ERRORLEVEL 1 (
    ECHO ⚠️ Git commit detected no changes or failed. Continuing to push in case of untracked remote changes.
)

:: 4. Push changes to the remote repository
ECHO.
ECHO Running: git push
git push
IF ERRORLEVEL 1 (
    ECHO ❌ Git push failed. Check network or permissions.
    GOTO :END
)

ECHO.
ECHO ✅ **SUCCESS! All staged changes committed and pushed.**

:END
ECHO.
pause
ENDLOCAL