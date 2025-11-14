@echo on
echo BAT iniciado correctamente
pause

:: =========================================
:: PASO 1: INSTALAR DEPENDENCIAS CRÍTICAS EN 'release' (Para que setupDB.js funcione)
:: =========================================
echo Instalando dependencias criticas (mysql2, dotenv) en 'release'...
:: Usamos --prefix . para asegurar que se instalen en la carpeta actual (release)
CALL npm install --prefix . mysql2 dotenv
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR FATAL: Falló 'npm install' en 'release'.
    pause
    exit /b 1
)
pause

:: =========================================
:: PASO 2: MOVERSE A BACKEND E INSTALAR TODAS LAS DEPENDENCIAS
:: =========================================
echo Moviéndonos a backend...
cd /d "%~dp0..\backend"
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR FATAL: No se pudo cambiar al directorio 'backend'.
    pause
    exit /b 1
)
pause

echo Instalando TODAS las dependencias en 'backend' para app.js...
:: Instala express y el resto de las dependencias que app.js necesita
CALL npm install
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR FATAL: Falló 'npm install' en 'backend'.
    pause
    exit /b 1
)
pause

:: =========================================
:: PASO 3: VOLVER A 'release' Y EJECUTAR setupDB.js
:: =========================================
echo Volviendo a release...
cd /d "%~dp0"
if %errorlevel% neq 0 (
    echo ❌ ERROR volviendo a release.
    pause
    exit /b 1
)
pause

echo Ejecutando setupDB.js para inicializar la base de datos...
:: Ahora se ejecuta desde 'release' y encuentra mysql2 en 'release/node_modules'
CALL node setupDB.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR FATAL: Falló 'node setupDB.js'.
    pause
    exit /b 1
)
pause

:: =========================================
:: PASO 4: LIMPIEZA Y FINALIZACIÓN
:: =========================================
echo Limpiando dependencias temporales de release...
rd /s /q "node_modules" >nul 2>&1
del package-lock.json >nul 2>&1
del package.json >nul 2>&1
pause

echo.
echo =========================================
echo ✔ INICIALIZACIÓN COMPLETA.
echo El entorno 'backend' está listo.
echo =========================================
pause