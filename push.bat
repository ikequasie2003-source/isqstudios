@echo off
"C:\Program Files\Git\cmd\git.exe" -C "C:\Users\QUASIE\Documents\isqstudios-main" add .
"C:\Program Files\Git\cmd\git.exe" -C "C:\Users\QUASIE\Documents\isqstudios-main" commit -m "Smooth CSS wave animation on admin login, media sync from Supabase"
"C:\Program Files\Git\cmd\git.exe" -C "C:\Users\QUASIE\Documents\isqstudios-main" push origin master:main > "C:\Users\QUASIE\Documents\isqstudios-main\push_out.txt" 2>&1
echo Exit: %ERRORLEVEL% >> "C:\Users\QUASIE\Documents\isqstudios-main\push_out.txt"
