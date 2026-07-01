@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul 2>&1

:: ============================================================
:: 999 Course One-Click Installer (Windows) v2.0
:: Upgrades: Git Bash path, settings.json cleanup, proxy→Claudian,
::           CLI path→Claudian, multi-version conflict detection
:: ============================================================

title 999课程 一键安装

:: Record script directory
set "PACK_DIR=%~dp0"
if "%PACK_DIR:~-1%"=="\" set "PACK_DIR=%PACK_DIR:~0,-1%"

:: Validate PACK_DIR
if not exist "!PACK_DIR!\plugins" (
    echo.
    echo  [!] 找不到安装文件，请确保从安装包文件夹内运行此脚本
    echo      当前路径: !PACK_DIR!
    echo.
    pause
    exit /b 1
)

echo.
echo  ============================================
echo       999 AI一人公司 - 一键安装 v2.0
echo  ============================================
echo.
echo  本脚本将自动安装以下工具:
echo    [1] Obsidian (笔记软件)
echo    [2] Claude Code CLI (AI命令行工具)
echo    [3] Node.js (运行环境)
echo    [4] Playwright MCP (浏览器自动化)
echo    [5] 6个Obsidian插件
echo    [6] 知识库模板 (文件夹结构 + AI技能)
echo.
echo  大约需要5-10分钟，请保持网络连接。
echo.
pause

:: ============================================================
:: Step 0: Auto-detect proxy for terminal
:: ============================================================
echo.
echo  ========================================
echo  [0] Auto-detect proxy...
echo  ========================================

set "PROXY_SET=0"
set "PROXY_PORT="
if defined HTTPS_PROXY (
    echo  [OK] HTTPS_PROXY already set: %HTTPS_PROXY%
    set "PROXY_SET=1"
)
if "!PROXY_SET!"=="0" (
    for %%p in (7890 7897 7898 1080 1087 8080) do (
        if "!PROXY_SET!"=="0" (
            powershell -Command "try { $c = New-Object Net.Sockets.TcpClient; $c.Connect('127.0.0.1', %%p); $c.Close(); exit 0 } catch { exit 1 }" >nul 2>&1
            if !errorLevel! equ 0 (
                set "HTTPS_PROXY=http://127.0.0.1:%%p"
                set "HTTP_PROXY=http://127.0.0.1:%%p"
                set "PROXY_PORT=%%p"
                echo  [OK] found proxy on port %%p, auto-configured.
                set "PROXY_SET=1"
            )
        )
    )
)
if "!PROXY_SET!"=="0" (
    echo  [--] no local proxy detected, using direct connection.
    echo       if download fails, please enable your VPN/proxy tool first.
)

:: ============================================================
:: Step 0.3: Clean user settings.json (prevent stale API config)
:: [UPGRADE 2] Remove residual ANTHROPIC_* env vars from global settings
:: ============================================================
echo.
echo  ========================================
echo  [0.3] 清理残留配置...
echo  ========================================

set "USER_SETTINGS=%USERPROFILE%\.claude\settings.json"
if exist "!USER_SETTINGS!" (
    :: Check if file contains ANTHROPIC_ keys that would override Claudian
    findstr /I "ANTHROPIC_" "!USER_SETTINGS!" >nul 2>&1
    if !errorLevel! equ 0 (
        echo  [!!] 检测到全局 settings.json 中有残留 API 配置，正在清理...
        echo      路径: !USER_SETTINGS!
        :: Use PowerShell to remove env.ANTHROPIC_* keys from settings.json
        powershell -Command "$f='!USER_SETTINGS!'; $j=Get-Content $f -Raw | ConvertFrom-Json; if($j.env){$keys=@($j.env.PSObject.Properties.Name | Where-Object {$_ -like 'ANTHROPIC_*'}); foreach($k in $keys){$j.env.PSObject.Properties.Remove($k)}; if(-not $j.env.PSObject.Properties.Name){$j.PSObject.Properties.Remove('env')}}; $j | ConvertTo-Json -Depth 10 | Set-Content $f -Encoding UTF8; Write-Host '  [OK] 已清理 ANTHROPIC_ 残留配置。'"
    ) else (
        echo  [OK] 全局配置无残留，跳过。
    )
) else (
    echo  [OK] 无全局 settings.json，跳过。
)

:: ============================================================
:: Step 0.5: Check Git (required by Claude Code on Windows)
:: ============================================================
echo.
echo  ========================================
echo  [0.5] 检查 Git...
echo  ========================================

set "GIT_BASH_PATH="
where git >nul 2>&1
if !errorLevel! equ 0 (
    echo  [OK] Git 已安装，跳过。
) else (
    if exist "!PACK_DIR!\installers\Git-installer.exe" (
        echo  [..] 正在安装 Git，请在弹出的窗口中点击 Next 完成安装...
        start /wait "" "!PACK_DIR!\installers\Git-installer.exe"
        echo  [OK] Git 安装完成。
    ) else (
        echo  [..] 未检测到 Git，正在在线安装...
        winget install Git.Git --accept-package-agreements --accept-source-agreements -h
        if !errorLevel! neq 0 (
            echo  [失败] Git 安装失败，请手动下载安装: https://git-scm.com/downloads/win
        ) else (
            echo  [OK] Git 安装完成。
        )
    )
)

:: ============================================================
:: [UPGRADE 1] Auto-detect Git Bash path for non-default installs
:: ============================================================
echo  [..] 检测 Git Bash 路径...
:: Try standard locations first
if exist "C:\Program Files\Git\bin\bash.exe" (
    set "GIT_BASH_PATH=C:\Program Files\Git\bin\bash.exe"
) else if exist "C:\Program Files (x86)\Git\bin\bash.exe" (
    set "GIT_BASH_PATH=C:\Program Files (x86)\Git\bin\bash.exe"
) else if exist "D:\Git\bin\bash.exe" (
    set "GIT_BASH_PATH=D:\Git\bin\bash.exe"
) else if exist "D:\Program Files\Git\bin\bash.exe" (
    set "GIT_BASH_PATH=D:\Program Files\Git\bin\bash.exe"
) else (
    :: Use PowerShell to search registry for Git install path
    for /f "tokens=*" %%g in ('powershell -Command "try { $p = (Get-ItemProperty 'HKLM:\SOFTWARE\GitForWindows' -EA Stop).InstallPath; $b = Join-Path $p 'bin\bash.exe'; if(Test-Path $b){$b} } catch {}"') do (
        set "GIT_BASH_PATH=%%g"
    )
)
if defined GIT_BASH_PATH (
    echo  [OK] Git Bash: !GIT_BASH_PATH!
) else (
    echo  [--] 未找到 Git Bash，Claude Code 可能无法正常启动。
    echo       如果后续报错，请手动安装 Git 到默认路径。
)

:: ============================================================
:: Step 1: Install Obsidian
:: ============================================================
echo.
echo  ========================================
echo  [1/5] 检查 Obsidian...
echo  ========================================

set "OBS_FOUND=0"
where obsidian >nul 2>&1 && set "OBS_FOUND=1"
if exist "%LOCALAPPDATA%\Obsidian\Obsidian.exe" set "OBS_FOUND=1"
if exist "%APPDATA%\..\Local\Obsidian\Obsidian.exe" set "OBS_FOUND=1"
if exist "C:\Users\%USERNAME%\AppData\Local\Obsidian\Obsidian.exe" set "OBS_FOUND=1"
if exist "%ProgramFiles%\Obsidian\Obsidian.exe" set "OBS_FOUND=1"
if "!OBS_FOUND!"=="0" (
    winget list Obsidian.Obsidian --accept-source-agreements >nul 2>&1 && set "OBS_FOUND=1"
)

if "!OBS_FOUND!"=="1" (
    echo  [OK] Obsidian 已安装，跳过。
) else (
    if exist "!PACK_DIR!\installers\Obsidian.exe" (
        echo  [..] 正在安装 Obsidian，请在弹出的窗口中点击安装...
        start /wait "" "!PACK_DIR!\installers\Obsidian.exe"
        echo  [OK] Obsidian 安装完成。
    ) else (
        echo  [..] 正在在线安装 Obsidian...
        winget install Obsidian.Obsidian --accept-package-agreements --accept-source-agreements -h
        if !errorLevel! neq 0 (
            echo  [失败] Obsidian 安装失败，请手动下载安装: https://obsidian.md
        ) else (
            echo  [OK] Obsidian 安装完成。
        )
    )
)

:: ============================================================
:: [UPGRADE 5] Detect Claude Code multi-version conflicts
:: ============================================================
echo.
echo  ========================================
echo  [1.5] 检查 Claude Code 版本冲突...
echo  ========================================

set "CLAUDE_COUNT=0"
set "CLAUDE_PATHS="

:: Check winget install
if exist "%USERPROFILE%\.local\bin\claude.exe" (
    set /a CLAUDE_COUNT+=1
    set "CLAUDE_PATHS=!CLAUDE_PATHS! [winget] %USERPROFILE%\.local\bin\claude.exe"
)
:: Check npm global install
for /f "tokens=*" %%n in ('powershell -Command "try { $p = (npm root -g 2>$null) + '\@anthropic-ai\claude-code'; if(Test-Path $p){'found'} } catch {}"') do (
    if "%%n"=="found" (
        set /a CLAUDE_COUNT+=1
        set "CLAUDE_PATHS=!CLAUDE_PATHS! [npm]"
    )
)
:: Check scoop/chocolatey or other locations
for /f "tokens=*" %%s in ('powershell -Command "Get-Command claude -EA SilentlyContinue | Select-Object -ExpandProperty Source"') do (
    echo "%%s" | findstr /I /C:".local\bin" >nul 2>&1
    if !errorLevel! neq 0 (
        set /a CLAUDE_COUNT+=1
        set "CLAUDE_PATHS=!CLAUDE_PATHS! [other] %%s"
    )
)

if !CLAUDE_COUNT! GTR 1 (
    echo  [!!] 检测到多个 Claude Code 版本共存，可能导致冲突!
    echo      !CLAUDE_PATHS!
    echo.
    echo  建议: 只保留一个版本。如果通过 npm 安装过，请运行:
    echo    npm uninstall -g @anthropic-ai/claude-code
    echo.
    echo  按任意键继续安装（或 Ctrl+C 退出手动清理）...
    pause >nul
) else (
    echo  [OK] 无版本冲突。
)

:: ============================================================
:: Step 2: Install Claude Code CLI
:: ============================================================
echo.
echo  ========================================
echo  [2/5] 检查 Claude Code CLI...
echo  ========================================

set "CLAUDE_FOUND=0"
set "CLAUDE_CLI_PATH="
where claude >nul 2>&1 && set "CLAUDE_FOUND=1"
if exist "%USERPROFILE%\.local\bin\claude.exe" (
    set "CLAUDE_FOUND=1"
    set "CLAUDE_CLI_PATH=%USERPROFILE%\.local\bin\claude.exe"
)
if "!CLAUDE_FOUND!"=="0" (
    winget list Anthropic.ClaudeCode --accept-source-agreements >nul 2>&1 && set "CLAUDE_FOUND=1"
)

if "!CLAUDE_FOUND!"=="1" (
    echo  [OK] Claude Code 已安装。
    :: [UPGRADE 4] Detect actual CLI path
    if not defined CLAUDE_CLI_PATH (
        for /f "tokens=*" %%c in ('powershell -Command "try { (Get-Command claude -EA Stop).Source } catch {}"') do (
            set "CLAUDE_CLI_PATH=%%c"
        )
    )
    if defined CLAUDE_CLI_PATH (
        echo  [OK] CLI 路径: !CLAUDE_CLI_PATH!
    )
) else (
    echo  [..] 正在安装 Claude Code CLI...
    winget install Anthropic.ClaudeCode --accept-package-agreements --accept-source-agreements -h
    :: verify after install
    set "CLAUDE_OK=0"
    where claude >nul 2>&1 && set "CLAUDE_OK=1"
    if exist "%USERPROFILE%\.local\bin\claude.exe" (
        set "CLAUDE_OK=1"
        set "CLAUDE_CLI_PATH=%USERPROFILE%\.local\bin\claude.exe"
    )
    if "!CLAUDE_OK!"=="1" (
        echo  [OK] Claude Code 安装完成。
    ) else (
        echo.
        echo  ****************************************************
        echo  *  Claude Code install FAILED                      *
        echo  *  Please run manually:                            *
        echo  *  npm install -g @anthropic-ai/claude-code        *
        echo  *  Make sure VPN/proxy is enabled.                 *
        echo  ****************************************************
        echo.
    )
)

:: Configure PATH for Claude (always check)
set "CLAUDE_PATH=%USERPROFILE%\.local\bin"
echo %PATH% | findstr /I /C:"%CLAUDE_PATH%" >nul 2>&1
if !errorLevel! neq 0 (
    echo  [..] 配置环境变量...
    powershell -Command "[Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path', 'User') + ';%CLAUDE_PATH%', 'User')"
    set "PATH=%PATH%;%CLAUDE_PATH%"
    echo  [OK] 环境变量已配置。
)

:: ============================================================
:: Step 3: Install Node.js
:: ============================================================
echo.
echo  ========================================
echo  [3/5] 检查 Node.js...
echo  ========================================

set "NODE_FOUND=0"
where node >nul 2>&1 && set "NODE_FOUND=1"
if "!NODE_FOUND!"=="0" (
    winget list OpenJS.NodeJS --accept-source-agreements >nul 2>&1 && set "NODE_FOUND=1"
)

set "NODE_UPGRADE=0"
if "!NODE_FOUND!"=="1" (
    for /f "tokens=*" %%i in ('node --version') do set "NODE_VER=%%i"
    :: Extract major version number, e.g. v16.20.0 -> 16
    set "NODE_VER_NUM=!NODE_VER:v=!"
    for /f "tokens=1 delims=." %%m in ("!NODE_VER_NUM!") do set "NODE_MAJOR=%%m"
    if !NODE_MAJOR! LSS 18 (
        echo  [!!] Node.js 版本过低 ^(!NODE_VER!^)，需要 v18-v20，正在升级...
        set "NODE_UPGRADE=1"
        set "NODE_FOUND=0"
    ) else if !NODE_MAJOR! GTR 20 (
        echo  [!!] Node.js 版本过高 ^(!NODE_VER!^)，需要降级到 v20 LTS...
        set "NODE_UPGRADE=1"
        set "NODE_FOUND=0"
    ) else (
        echo  [OK] Node.js 已安装 ^(!NODE_VER!^)，跳过。
    )
)
if "!NODE_FOUND!"=="0" (
    if "!NODE_UPGRADE!"=="1" (
        echo  [..] 正在卸载旧版 Node.js，请稍候...
        :: Use PowerShell to find ProductCode and uninstall via msiexec
        powershell -Command "$codes = Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*','HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*' -EA SilentlyContinue | Where-Object { $_.DisplayName -like 'Node.js*' } | Select-Object -ExpandProperty PSChildName; foreach($c in $codes){ Start-Process msiexec -ArgumentList '/x',$c,'/qn','/norestart' -Wait -NoNewWindow }"
        :: Also try winget
        winget uninstall OpenJS.NodeJS -h --accept-source-agreements >nul 2>&1
        winget uninstall OpenJS.NodeJS.LTS -h --accept-source-agreements >nul 2>&1
        :: Verify with fresh check (bypass cmd cache)
        set "STILL_INSTALLED=0"
        for /f "tokens=*" %%v in ('powershell -Command "try { (Get-Command node -EA Stop).Source } catch { }"') do set "STILL_INSTALLED=1"
        if "!STILL_INSTALLED!"=="1" (
            echo  [!!] 自动卸载失败，尝试直接覆盖安装 v20...
        ) else (
            echo  [OK] 旧版已卸载。
        )
    )
    if exist "!PACK_DIR!\installers\node.msi" (
        echo  [..] 正在安装 Node.js v20 LTS，请在弹出的窗口中点击 Next 完成安装...
        msiexec /i "!PACK_DIR!\installers\node.msi"
        echo  [OK] Node.js 安装完成。
    ) else (
        echo  [..] 正在在线安装 Node.js...
        winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements -h
        if !errorLevel! neq 0 (
            echo  [失败] Node.js 安装失败，请手动下载安装: https://nodejs.org
        ) else (
            echo  [OK] Node.js 安装完成。
        )
    )
)

:: ============================================================
:: Step 3.5: Add Playwright MCP (browser automation)
:: ============================================================
echo.
echo  ========================================
echo  [3.5] 添加 Playwright MCP (浏览器自动化)...
echo  ========================================

where claude >nul 2>&1
if !errorLevel! equ 0 (
    cmd /c claude mcp add playwright -s user -- npx @playwright/mcp@latest >nul 2>&1
    echo  [OK] Playwright MCP 已添加。
) else (
    echo  [跳过] 未检测到 Claude Code，跳过 Playwright MCP。
)

:: ============================================================
:: Step 4: Copy plugins
:: ============================================================
echo.
echo  ========================================
echo  [4/5] 安装插件...
echo  ========================================

set "HAS_D=0"
if exist "D:\" set "HAS_D=1"

echo.
if "!HAS_D!"=="1" (
    echo  请选择知识库存放位置:
    echo    [1] D:\ObsidianVaults\MyVault [推荐]
    echo    [2] %USERPROFILE%\Documents\MyVault
    echo    [3] 自定义路径
) else (
    echo  请选择知识库存放位置:
    echo    [1] %USERPROFILE%\Documents\MyVault [推荐]
    echo    [2] 自定义路径
)
echo.
set /p "VAULT_CHOICE=  输入数字 (默认1): "
if "!VAULT_CHOICE!"=="" set "VAULT_CHOICE=1"

if "!HAS_D!"=="1" (
    if "!VAULT_CHOICE!"=="1" set "VAULT_DIR=D:\ObsidianVaults\MyVault"
    if "!VAULT_CHOICE!"=="2" set "VAULT_DIR=%USERPROFILE%\Documents\MyVault"
    if "!VAULT_CHOICE!"=="3" set /p "VAULT_DIR=  输入完整路径: "
) else (
    if "!VAULT_CHOICE!"=="1" set "VAULT_DIR=%USERPROFILE%\Documents\MyVault"
    if "!VAULT_CHOICE!"=="2" set /p "VAULT_DIR=  输入完整路径: "
)

if "!VAULT_DIR!"=="" set "VAULT_DIR=%USERPROFILE%\Documents\MyVault"

echo.
echo  [..] 知识库位置: !VAULT_DIR!

if not exist "!VAULT_DIR!\." mkdir "!VAULT_DIR!" 2>nul
if not exist "!VAULT_DIR!\." (
    powershell -Command "New-Item -Path '!VAULT_DIR!' -ItemType Directory -Force | Out-Null" 2>nul
)
if not exist "!VAULT_DIR!\." (
    echo  [!!] selected path denied, fallback to Documents...
    set "VAULT_DIR=%USERPROFILE%\Documents\MyVault"
    echo  [..] 新位置: !VAULT_DIR!
    if not exist "!VAULT_DIR!\." mkdir "!VAULT_DIR!" 2>nul
    if not exist "!VAULT_DIR!\." (
        powershell -Command "New-Item -Path '!VAULT_DIR!' -ItemType Directory -Force | Out-Null"
    )
)
set "PLUGINS_DIR=!VAULT_DIR!\.obsidian\plugins"
if not exist "!PLUGINS_DIR!\." mkdir "!PLUGINS_DIR!" 2>nul
if not exist "!PLUGINS_DIR!\." (
    powershell -Command "New-Item -Path '!PLUGINS_DIR!' -ItemType Directory -Force | Out-Null"
)

set "SRC_PLUGINS=!PACK_DIR!\plugins"

if not exist "!SRC_PLUGINS!" (
    echo.
    echo  [!!] 找不到插件文件夹: !SRC_PLUGINS!
    echo.
    pause
    exit /b 1
)

for %%d in (claudian nano-banana-image-generator web-clipper-obsidian-plugin obsidian42-brat copy-document-as-html copy-image) do (
    if exist "!SRC_PLUGINS!\%%d" (
        echo  [..] 安装插件: %%d
        xcopy "!SRC_PLUGINS!\%%d" "!PLUGINS_DIR!\%%d\" /E /I /Y /Q >nul 2>&1
        echo  [OK] %%d 已安装。
    ) else (
        echo  [--] 插件 %%d 不在安装包中，跳过。
    )
)

:: ============================================================
:: Step 5: Copy vault template
:: ============================================================
echo.
echo  ========================================
echo  [5/5] 导入知识库模板...
echo  ========================================

set "SRC_VAULT=!PACK_DIR!\vault"

if exist "!SRC_VAULT!" (
    echo  [..] 正在导入知识库模板...
    for /d %%d in ("!SRC_VAULT!\*") do (
        set "FOLDER_NAME=%%~nxd"
        if /I not "!FOLDER_NAME!"==".obsidian" (
            xcopy "%%d" "!VAULT_DIR!\!FOLDER_NAME!\" /E /I /Y /Q >nul 2>&1
        )
    )
    for %%f in ("!SRC_VAULT!\*.*") do (
        copy "%%f" "!VAULT_DIR!\" /Y >nul 2>&1
    )
    if exist "!SRC_VAULT!\.claude" (
        xcopy "!SRC_VAULT!\.claude" "!VAULT_DIR!\.claude\" /E /I /Y /Q >nul 2>&1
    )
    echo  [OK] 知识库模板已导入。
) else (
    echo  [--] 未找到知识库模板，跳过。
)

:: ============================================================
:: [UPGRADE 3] Auto-write proxy to Claudian environment variables
:: [UPGRADE 4] Auto-write CLI path to claudian-settings.json
:: [UPGRADE 1] Auto-write Git Bash path to Claudian env
:: ============================================================
echo.
echo  ========================================
echo  [6] 自动配置 Claudian 插件...
echo  ========================================

set "CLAUDIAN_DATA=!PLUGINS_DIR!\claudian\data.json"
set "CLAUDIAN_SETTINGS=!VAULT_DIR!\.claude\claudian-settings.json"

:: --- 6a: Write proxy + Git Bash path to Claudian data.json (env vars) ---
if exist "!PLUGINS_DIR!\claudian" (
    echo  [..] 配置 Claudian 环境变量...
    :: Build env vars via PowerShell (handles backslash escaping properly)
    set "NEED_PROXY=0"
    set "NEED_GIT=0"
    if "!PROXY_SET!"=="1" (
        set "NEED_PROXY=1"
        echo  [OK] 代理已写入: !HTTPS_PROXY!
    )
    if defined GIT_BASH_PATH (
        echo "!GIT_BASH_PATH!" | findstr /I /C:"Program Files\Git\bin\bash.exe" >nul 2>&1
        if !errorLevel! neq 0 (
            set "NEED_GIT=1"
            echo  [OK] Git Bash 非默认路径已写入: !GIT_BASH_PATH!
        ) else (
            echo  [OK] Git Bash 在默认路径，无需额外配置。
        )
    )
    if "!NEED_PROXY!!NEED_GIT!"=="00" (
        echo  [--] 无需写入额外环境变量。
    ) else (
        powershell -Command "$f='!CLAUDIAN_DATA!'; $j=@{}; if(Test-Path $f){try{$j=Get-Content $f -Raw -EA Stop | ConvertFrom-Json -AsHashtable}catch{$j=@{}}}; $arr=@(); if('!NEED_PROXY!'-eq'1'){$arr+=@{name='HTTPS_PROXY';value='!HTTPS_PROXY!'};$arr+=@{name='HTTP_PROXY';value='!HTTP_PROXY!'}}; if('!NEED_GIT!'-eq'1'){$arr+=@{name='CLAUDE_CODE_GIT_BASH_PATH';value='!GIT_BASH_PATH!'}}; $j['environmentVariables']=$arr; $j | ConvertTo-Json -Depth 10 | Set-Content $f -Encoding UTF8"
        echo  [OK] Claudian 环境变量已配置。
    )
) else (
    echo  [--] Claudian 插件未安装，跳过环境变量配置。
)

:: --- 6b: Write CLI path to claudian-settings.json ---
if exist "!CLAUDIAN_SETTINGS!" (
    if defined CLAUDE_CLI_PATH (
        echo  [..] 配置 Claudian CLI 路径...
        :: Escape backslashes for JSON
        set "CLI_ESC=!CLAUDE_CLI_PATH:\=\\!"
        powershell -Command "$f='!CLAUDIAN_SETTINGS!'; $j=Get-Content $f -Raw | ConvertFrom-Json; $j.claudeCliPath='!CLI_ESC!'; $j | ConvertTo-Json -Depth 10 | Set-Content $f -Encoding UTF8"
        echo  [OK] CLI 路径已写入: !CLAUDE_CLI_PATH!
    ) else (
        echo  [--] 未检测到 CLI 路径，跳过。
    )
) else (
    echo  [--] claudian-settings.json 不存在，跳过 CLI 路径配置。
)

:: ============================================================
:: Step 7: Register Whisper auto-start
:: ============================================================
echo.
:: [VideoForge] Whisper auto-start temporarily disabled - will be enabled in future update

:: ============================================================
:: Done
:: ============================================================
echo.
echo  ============================================
echo       安装完成!
echo  ============================================
echo.
echo  ****************************************************
echo  *  YOUR VAULT PATH:
echo  *  !VAULT_DIR!
echo  *
echo  *  IMPORTANT: Open THIS folder in Obsidian.
echo  *  Do NOT open the "vault" folder in the installer.
echo  ****************************************************
echo.
echo  Next steps:
echo.
echo    1. Open Obsidian - Open folder as vault - select: !VAULT_DIR!
echo    2. Settings - Community plugins - Turn off Safe mode - Enable all plugins
echo    3. Type [help me install] in Claudian chat - AI will handle the rest
echo.
pause
