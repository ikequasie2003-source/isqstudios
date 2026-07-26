@echo off
"C:\Program Files\Git\cmd\git.exe" -C "C:\Users\QUASIE\Documents\isqstudios-main" pull origin main --rebase > "C:\Users\QUASIE\Documents\isqstudios-main\pull_out.txt" 2>&1
echo Exit: %ERRORLEVEL% >> "C:\Users\QUASIE\Documents\isqstudios-main\pull_out.txt"
