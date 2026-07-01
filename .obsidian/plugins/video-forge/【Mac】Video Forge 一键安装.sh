#!/bin/bash
# ============================================
# Video Forge 一键安装程序 (macOS)
# 运行方式：打开终端，拖入此文件回车执行
# 或：chmod +x 本文件 && ./本文件
# ============================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

ERRORS=0

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║     Video Forge 一键安装程序 (macOS)       ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ============================================
# 第1步：检查 Homebrew
# ============================================
echo "[1/6] 检查 Homebrew..."
if command -v brew &>/dev/null; then
    echo -e "      ${GREEN}已安装${NC}"
else
    echo "      未安装，正在安装 Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    # Apple Silicon 需要额外配置 PATH
    if [[ -f /opt/homebrew/bin/brew ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    fi
    if command -v brew &>/dev/null; then
        echo -e "      ${GREEN}Homebrew 安装成功${NC}"
    else
        echo -e "      ${RED}[!] Homebrew 安装失败，请手动安装: https://brew.sh${NC}"
        ((ERRORS++))
    fi
fi
echo ""

# ============================================
# 第2步：检查 Node.js
# ============================================
echo "[2/6] 检查 Node.js..."
if command -v node &>/dev/null; then
    echo -e "      ${GREEN}已安装: $(node --version)${NC}"
else
    echo "      未安装，999安装包应该已包含。尝试用 Homebrew 安装..."
    brew install node
    if command -v node &>/dev/null; then
        echo -e "      ${GREEN}Node.js 安装成功: $(node --version)${NC}"
    else
        echo -e "      ${RED}[!] Node.js 安装失败${NC}"
        ((ERRORS++))
    fi
fi
echo ""

# ============================================
# 第3步：检查/安装 Python
# ============================================
echo "[3/6] 检查 Python..."
PYTHON_CMD=""
if command -v python3 &>/dev/null; then
    PYTHON_CMD="python3"
elif command -v python &>/dev/null; then
    PYTHON_CMD="python"
fi

if [[ -n "$PYTHON_CMD" ]]; then
    echo -e "      ${GREEN}已安装: $($PYTHON_CMD --version)${NC}"
else
    echo "      未安装，正在用 Homebrew 安装..."
    brew install python@3.11
    if command -v python3 &>/dev/null; then
        PYTHON_CMD="python3"
        echo -e "      ${GREEN}Python 安装成功: $($PYTHON_CMD --version)${NC}"
    else
        echo -e "      ${RED}[!] Python 安装失败，请手动安装: https://www.python.org/downloads/${NC}"
        ((ERRORS++))
    fi
fi
echo ""

# ============================================
# 第4步：安装 Python 依赖
# ============================================
echo "[4/6] 安装 Whisper 依赖..."
if [[ -n "$PYTHON_CMD" ]]; then
    $PYTHON_CMD -m pip install --upgrade pip -q 2>/dev/null || true
    $PYTHON_CMD -m pip install faster-whisper flask -q 2>&1

    # 验证安装
    if $PYTHON_CMD -c "import faster_whisper; import flask" 2>/dev/null; then
        echo -e "      ${GREEN}依赖安装完成${NC}"
    else
        echo -e "      ${RED}[!] 依赖安装失败，请手动运行: pip3 install faster-whisper flask${NC}"
        ((ERRORS++))
    fi
else
    echo -e "      ${YELLOW}[跳过] Python 未安装${NC}"
fi
echo ""

# ============================================
# 第5步：安装 ffmpeg
# ============================================
echo "[5/6] 检查 ffmpeg..."
if command -v ffmpeg &>/dev/null; then
    echo -e "      ${GREEN}已安装${NC}"
else
    echo "      未安装，正在用 Homebrew 安装..."
    brew install ffmpeg
    if command -v ffmpeg &>/dev/null; then
        echo -e "      ${GREEN}ffmpeg 安装成功${NC}"
    else
        echo -e "      ${YELLOW}安装失败（可选功能，不影响正常使用）${NC}"
    fi
fi
echo ""

# ============================================
# 第6步：安装 Remotion 依赖
# ============================================
echo "[6/6] 安装 Remotion 视频渲染引擎..."

# 找到 vault 根目录（脚本在 .obsidian/plugins/video-forge/ 下）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VAULT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
REMOTION_DIR="$VAULT_DIR/01.项目/VideoForge/remotion-project"

if [[ -f "$REMOTION_DIR/package.json" ]]; then
    if [[ -d "$REMOTION_DIR/node_modules" ]]; then
        echo -e "      ${GREEN}已安装（node_modules 存在）${NC}"
    else
        echo "      正在安装 Remotion 依赖（首次约需3分钟）..."
        cd "$REMOTION_DIR"
        npm install --loglevel=error
        if [[ $? -eq 0 ]]; then
            echo -e "      ${GREEN}Remotion 安装完成${NC}"
        else
            echo -e "      ${RED}[!] Remotion 安装失败，请手动进入目录运行 npm install${NC}"
            ((ERRORS++))
        fi
    fi
else
    echo -e "      ${RED}[!] 未找到 Remotion 项目目录${NC}"
    echo "      请确保知识库中有 01.项目/VideoForge/remotion-project/ 文件夹"
    ((ERRORS++))
fi
echo ""

# ============================================
# 配置 Whisper 自启（macOS 用 launchd）
# ============================================
echo "配置 Whisper 后台服务..."

if [[ -n "$PYTHON_CMD" ]]; then
    PYTHON_PATH="$(which $PYTHON_CMD)"

    # 复制 whisper_server.py 到本地
    mkdir -p "$HOME/.video-forge"
    if [[ -f "$SCRIPT_DIR/whisper_server.py" ]]; then
        cp "$SCRIPT_DIR/whisper_server.py" "$HOME/.video-forge/whisper_server.py"
    elif [[ -f "$SCRIPT_DIR/../avatar-forge/whisper_server.py" ]]; then
        cp "$SCRIPT_DIR/../avatar-forge/whisper_server.py" "$HOME/.video-forge/whisper_server.py"
    fi

    if [[ -f "$HOME/.video-forge/whisper_server.py" ]]; then
        # 创建 launchd plist（开机自启）
        PLIST_PATH="$HOME/Library/LaunchAgents/com.videoforge.whisper.plist"
        cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.videoforge.whisper</string>
    <key>ProgramArguments</key>
    <array>
        <string>$PYTHON_PATH</string>
        <string>$HOME/.video-forge/whisper_server.py</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$HOME/.video-forge/whisper.log</string>
    <key>StandardErrorPath</key>
    <string>$HOME/.video-forge/whisper-error.log</string>
</dict>
</plist>
EOF

        # 加载服务
        launchctl unload "$PLIST_PATH" 2>/dev/null || true
        launchctl load "$PLIST_PATH"
        echo -e "      ${GREEN}Whisper 开机自启已配置${NC}"

        # 等待启动
        sleep 3
        if curl -s http://localhost:5111/health | grep -q "ok" 2>/dev/null; then
            echo -e "      ${GREEN}Whisper 服务已启动${NC}"
        else
            echo -e "      ${YELLOW}Whisper 首次启动需下载模型（约3GB），请等待几分钟${NC}"
        fi
    else
        echo -e "      ${RED}[!] 未找到 whisper_server.py${NC}"
        ((ERRORS++))
    fi
else
    echo -e "      ${YELLOW}[跳过] Python 未安装${NC}"
fi
echo ""

# ============================================
# 汇总结果
# ============================================
echo "══════════════════════════════════════════"
if [[ $ERRORS -eq 0 ]]; then
    echo -e " ${GREEN}全部安装成功！${NC}"
    echo ""
    echo " 接下来："
    echo " 1. 打开 Obsidian"
    echo " 2. 设置 → 第三方插件 → 启用 Video Forge"
    echo " 3. 进入 Video Forge 设置，填写 API Key"
    echo " 4. 写好文案后，Cmd+P → 搜索「生成视频」"
else
    echo -e " 安装完成，但有 ${RED}${ERRORS} 个问题${NC}需要手动处理（见上方 [!] 标记）"
    echo " 解决后重新运行本脚本即可。"
fi
echo "══════════════════════════════════════════"
echo ""
