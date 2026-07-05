@echo off
"C:\Program Files\Git\cmd\git.exe" -C "C:\Users\QUASIE\Documents\isqstudios-main" add .
"C:\Program Files\Git\cmd\git.exe" -C "C:\Users\QUASIE\Documents\isqstudios-main" commit -m "Lookbook split into two rows of 6, all images working"
"C:\Program Files\Git\cmd\git.exe" -C "C:\Users\QUASIE\Documents\isqstudios-main" push origin master:main > "C:\Users\QUASIE\Documents\isqstudios-main\push_out.txt" 2>&1
echo Exit: %ERRORLEVEL% >> "C:\Users\QUASIE\Documents\isqstudios-main\push_out.txt"
