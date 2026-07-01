@echo off
chcp 65001 >nul
title Video Forge 一键安装
color 0A

echo.
echo ============================================
echo      Video Forge 一键安装程序 [Windows]
echo ============================================
echo.

set ERRORS=0
set NEED_REBOOT=0

REM ============================================
REM 第1步：检查 Node.js(999安装包应该已装好)
REM ============================================
echo [1/6] 检查 Node.js...
where node >nul 2>&1
if %errorlevel%==0 (
    for /f "tokens=*" %%v in ('node --version') do echo       已安装: %%v
) else (
    echo       [!] 未检测到 Node.js
    echo       请先运行999安装包的一键安装，或手动安装: https://nodejs.org/
    set /a ERRORS+=1
)
echo.

REM ============================================
REM 第2步：检查/安装 Python
REM ============================================
echo [2/6] 检查 Python...

REM 尝试多种方式找 Python
set PYTHON_CMD=
where python >nul 2>&1
if %errorlevel%==0 (
    set PYTHON_CMD=python
    goto :python_found
)
where python3 >nul 2>&1
if %errorlevel%==0 (
    set PYTHON_CMD=python3
    goto :python_found
)

REM 检查常见安装路径
for %%v in (Python313 Python312 Python311 Python310) do (
    if exist "%LOCALAPPDATA%\Programs\Python\%%v\python.exe" (
        set PYTHON_CMD=%LOCALAPPDATA%\Programs\Python\%%v\python.exe
        goto :python_found
    )
)

REM Python 未找到，尝试用 winget 自动安装
echo       未检测到 Python，正在尝试自动安装...
where winget >nul 2>&1
if %errorlevel%==0 (
    echo       使用 winget 安装 Python 3.11...
    winget install Python.Python.3.11 --accept-source-agreements --accept-package-agreements -h
    if %errorlevel%==0 (
        echo       Python 安装成功！需要重启终端生效。
        set NEED_REBOOT=1
        set PYTHON_CMD=python
        goto :python_found
    )
)

echo       [!] 自动安装失败，请手动安装 Python:
echo       1. 打开 https://www.python.org/downloads/
echo       2. 下载 Python 3.11
echo       3. 安装时务必勾选 "Add Python to PATH"
echo       4. 安装完成后重新运行本脚本
set /a ERRORS+=1
goto :python_done

:python_found
for /f "tokens=*" %%v in ('%PYTHON_CMD% --version 2^>^&1') do echo       已安装: %%v

:python_done
echo.

REM ============================================
REM 第3步：安装 Python 依赖
REM ============================================
echo [3/6] 安装 Whisper 依赖(faster-whisper + flask)...

if "%PYTHON_CMD%"=="" (
    echo       [跳过] Python 未安装，无法安装依赖
    goto :pip_done
)

%PYTHON_CMD% -m pip install --upgrade pip -q 2>nul
%PYTHON_CMD% -m pip install faster-whisper flask -q 2>nul

REM 验证是否安装成功
%PYTHON_CMD% -c "import faster_whisper; import flask" 2>nul
if %errorlevel%==0 (
    echo       已安装
) else (
    echo       [!] 安装失败，请手动运行: pip install faster-whisper flask
    set /a ERRORS+=1
)

:pip_done
echo.

REM ============================================
REM 第4步：安装 ffmpeg(可选)
REM ============================================
echo [4/6] 检查 ffmpeg...
where ffmpeg >nul 2>&1
if %errorlevel%==0 (
    echo       已安装
) else (
    echo       未安装(可选功能，不影响正常使用)
    echo       如需声音克隆大文件压缩，请手动安装: https://ffmpeg.org/download.html
)
echo.

REM ============================================
REM 第5步：安装 Remotion 依赖
REM ============================================
echo [5/6] 安装 Remotion 视频渲染引擎...

REM 找到 remotion-project 目录
set SCRIPT_DIR=%~dp0
REM 插件在 .obsidian/plugins/video-forge/，vault 根目录在上3层
for %%i in ("%SCRIPT_DIR%..\..\..") do set VAULT_DIR=%%~fi

set REMOTION_DIR=%VAULT_DIR%\01.项目\VideoForge\remotion-project

if exist "%REMOTION_DIR%\package.json" (
    if exist "%REMOTION_DIR%\node_modules" (
        echo       已安装(node_modules 存在)
    ) else (
        echo       正在安装 Remotion 依赖(首次约需3分钟)...
        cd /d "%REMOTION_DIR%"
        call npm install --loglevel=error 2>&1
        if %errorlevel%==0 (
            echo       Remotion 安装完成
        ) else (
            echo       [!] Remotion 安装失败，请手动进入目录运行 npm install
            set /a ERRORS+=1
        )
    )
) else (
    echo       [!] 未找到 Remotion 项目目录: %REMOTION_DIR%
    echo       请确保知识库中有 01.项目/VideoForge/remotion-project/ 文件夹
    set /a ERRORS+=1
)
echo.

REM ============================================
REM 第6步：安装 Whisper 开机自启
REM ============================================
echo [6/6] 配置 Whisper 开机自启...

if "%PYTHON_CMD%"=="" (
    echo       [跳过] Python 未安装
    goto :whisper_done
)

REM 找 pythonw.exe
set PYTHONW=
for %%v in (Python313 Python312 Python311 Python310) do (
    if exist "%LOCALAPPDATA%\Programs\Python\%%v\pythonw.exe" (
        set PYTHONW=%LOCALAPPDATA%\Programs\Python\%%v\pythonw.exe
    )
)
if "%PYTHONW%"=="" (
    for /f "tokens=*" %%p in ('where pythonw 2^>nul') do set PYTHONW=%%p
)

if "%PYTHONW%"=="" (
    echo       [!] 未找到 pythonw.exe，Whisper 将无法后台运行
    set /a ERRORS+=1
    goto :whisper_done
)

REM 复制 whisper_server.py
if not exist "C:\Tools\whisper" mkdir "C:\Tools\whisper"

REM 优先从同目录找，再从 avatar-forge 找
if exist "%SCRIPT_DIR%whisper_server.py" (
    copy /y "%SCRIPT_DIR%whisper_server.py" "C:\Tools\whisper\whisper_server.py" >nul
) else (
    set AVATAR_DIR=%SCRIPT_DIR%..\avatar-forge\whisper_server.py
    if exist "%AVATAR_DIR%" (
        copy /y "%AVATAR_DIR%" "C:\Tools\whisper\whisper_server.py" >nul
    )
)

if not exist "C:\Tools\whisper\whisper_server.py" (
    echo       [!] 未找到 whisper_server.py
    set /a ERRORS+=1
    goto :whisper_done
)

REM 写入开机启动
set STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
echo @echo off > "%STARTUP%\WhisperServer.bat"
echo "%PYTHONW%" "C:\Tools\whisper\whisper_server.py" >> "%STARTUP%\WhisperServer.bat"
echo       开机自启已配置

REM 立即启动
start "" /min "%PYTHONW%" "C:\Tools\whisper\whisper_server.py"
timeout /t 3 /nobreak >nul
tasklist /fi "imagename eq pythonw.exe" | find "pythonw.exe" >nul
if %errorlevel%==0 (
    echo       Whisper 服务已启动
) else (
    echo       Whisper 首次启动需下载模型(约3GB)，请等待几分钟
)

:whisper_done
echo.

REM ============================================
REM 汇总结果
REM ============================================
echo ============================================
if %ERRORS%==0 (
    if %NEED_REBOOT%==1 (
        echo  安装完成！请关闭此窗口，重新打开 PowerShell 再运行一次本脚本。
        echo  (Python 刚安装，需要刷新环境变量)
    ) else (
        echo  全部安装成功！
        echo.
        echo  接下来：
        echo  1. 打开 Obsidian
        echo  2. 设置 → 第三方插件 → 启用 Video Forge
        echo  3. 进入 Video Forge 设置，填写 API Key
        echo  4. 写好文案后，Ctrl+P → 搜索「生成视频」
    )
) else (
    echo  安装完成，但有 %ERRORS% 个问题需要手动处理(见上方 [!] 标记)
    echo  解决后重新运行本脚本即可。
)
echo ============================================
echo.
pause
