@echo off
"C:\Program Files\Git\cmd\git.exe" -C "C:\Users\QUASIE\Documents\isqstudios-main" add .
"C:\Program Files\Git\cmd\git.exe" -C "C:\Users\QUASIE\Documents\isqstudios-main" commit -m "Homepage redesign, animated tees/caps, admin password update, shop category routing"
"C:\Program Files\Git\cmd\git.exe" -C "C:\Users\QUASIE\Documents\isqstudios-main" push origin master:main --force > "C:\Users\QUASIE\Documents\isqstudios-main\push_out.txt" 2>&1
echo Exit: %ERRORLEVEL% >> "C:\Users\QUASIE\Documents\isqstudios-main\push_out.txt"
