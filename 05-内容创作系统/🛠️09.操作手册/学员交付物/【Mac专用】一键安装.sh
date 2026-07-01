#!/bin/bash
# ============================================================
# 999课程 一键安装脚本（Mac版）v2.0
# 在终端运行：chmod +x 一键安装.sh && ./一键安装.sh
# Upgrades: settings.json cleanup, proxy→Claudian, CLI path→Claudian, multi-version conflict
# ============================================================

# 不用 set -e，避免非致命错误中断整个脚本

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok() { echo -e "  ${GREEN}[√]${NC} $1"; }
info() { echo -e "  ${YELLOW}[*]${NC} $1"; }
fail() { echo -e "  ${RED}[!]${NC} $1"; }

# 脚本所在目录（交付包根目录）
PACK_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "  ╔═══════════════════════════════════════════╗"
echo "  ║      999课程 工具一键安装（Mac版）        ║"
echo "  ╚═══════════════════════════════════════════╝"
echo ""
echo "  本脚本将自动安装以下工具："
echo "    [1] Homebrew（包管理器，已有则跳过）"
echo "    [2] Obsidian（知识库主程序）"
echo "    [3] Claude Code CLI（AI 引擎）"
echo "    [4] Node.js（运行环境）"
echo "    [5] 插件文件 + 知识库模板"
echo ""
echo "  整个过程大约 5-10 分钟，请保持网络通畅。"
echo ""
read -p "  按回车开始安装..." _

# ============================================================
# 预检：自动探测终端代理
# ============================================================
echo ""
echo "  ========================================"
echo "  [预检] 探测终端代理..."
echo "  ========================================"

PROXY_SET=0
if [[ -n "$HTTPS_PROXY" ]]; then
    ok "HTTPS_PROXY already set: $HTTPS_PROXY"
    PROXY_SET=1
fi

if [[ "$PROXY_SET" == "0" ]]; then
    for port in 7890 7897 7898 1080 1087 8080; do
        if nc -z -w1 127.0.0.1 $port 2>/dev/null; then
            export HTTPS_PROXY="http://127.0.0.1:$port"
            export HTTP_PROXY="http://127.0.0.1:$port"
            export ALL_PROXY="http://127.0.0.1:$port"
            ok "found proxy on port $port, auto-configured."
            PROXY_SET=1
            break
        fi
    done
fi

if [[ "$PROXY_SET" == "0" ]]; then
    info "no local proxy detected, using direct connection."
    info "if download fails, please enable your VPN/proxy tool first."
fi

# ============================================================
# [UPGRADE 2] 清理 settings.json 残留 API 配置
# ============================================================
echo ""
echo "  ========================================"
echo "  [预检] 清理残留配置..."
echo "  ========================================"

USER_SETTINGS="$HOME/.claude/settings.json"
if [[ -f "$USER_SETTINGS" ]]; then
    if grep -q "ANTHROPIC_" "$USER_SETTINGS" 2>/dev/null; then
        info "检测到全局 settings.json 中有残留 API 配置，正在清理..."
        info "路径: $USER_SETTINGS"
        # Use python3 (macOS built-in) to remove ANTHROPIC_* env keys
        python3 -c "
import json
with open('$USER_SETTINGS', 'r') as f:
    j = json.load(f)
if 'env' in j:
    keys = [k for k in j['env'] if k.startswith('ANTHROPIC_')]
    for k in keys:
        del j['env'][k]
    if not j['env']:
        del j['env']
with open('$USER_SETTINGS', 'w') as f:
    json.dump(j, f, indent=2, ensure_ascii=False)
" 2>/dev/null
        ok "已清理 ANTHROPIC_ 残留配置。"
    else
        ok "全局配置无残留，跳过。"
    fi
else
    ok "无全局 settings.json，跳过。"
fi

# ============================================================
# 第0步：安装 Homebrew（如果没有）
# ============================================================
echo ""
echo "  ========================================"
echo "  [0/5] 检查 Homebrew..."
echo "  ========================================"

if command -v brew &>/dev/null; then
    ok "Homebrew 已安装，跳过。"
else
    info "正在安装 Homebrew...（可能需要输入电脑密码，输入时不会显示，输完回车即可）"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    # Apple Silicon Mac 需要额外配置 PATH
    if [[ -f "/opt/homebrew/bin/brew" ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    fi
    ok "Homebrew 安装完成。"
fi

# ============================================================
# 第1步：安装 Obsidian
# ============================================================
echo ""
echo "  ========================================"
echo "  [1/5] 检查 Obsidian..."
echo "  ========================================"

if [[ -d "/Applications/Obsidian.app" ]]; then
    ok "Obsidian 已安装，跳过。"
else
    info "正在安装 Obsidian..."
    brew install --cask obsidian
    ok "Obsidian 安装完成。"
fi

# ============================================================
# [UPGRADE 5] 检测 Claude Code 多版本冲突
# ============================================================
echo ""
echo "  ========================================"
echo "  [1.5] 检查 Claude Code 版本冲突..."
echo "  ========================================"

CLAUDE_COUNT=0
CLAUDE_PATHS=""
# Check official install
if [[ -f "$HOME/.local/bin/claude" ]]; then
    CLAUDE_COUNT=$((CLAUDE_COUNT + 1))
    CLAUDE_PATHS="$CLAUDE_PATHS [official] $HOME/.local/bin/claude"
fi
# Check npm global install
NPM_CLAUDE=$(npm root -g 2>/dev/null)/@anthropic-ai/claude-code
if [[ -d "$NPM_CLAUDE" ]]; then
    CLAUDE_COUNT=$((CLAUDE_COUNT + 1))
    CLAUDE_PATHS="$CLAUDE_PATHS [npm]"
fi
# Check brew install
if brew list --formula 2>/dev/null | grep -q "claude"; then
    CLAUDE_COUNT=$((CLAUDE_COUNT + 1))
    CLAUDE_PATHS="$CLAUDE_PATHS [brew]"
fi

if [[ "$CLAUDE_COUNT" -gt 1 ]]; then
    fail "检测到多个 Claude Code 版本共存，可能导致冲突!"
    fail "$CLAUDE_PATHS"
    echo ""
    info "建议只保留一个版本。如果通过 npm 安装过，请运行:"
    echo "    npm uninstall -g @anthropic-ai/claude-code"
    echo ""
    read -p "  按回车继续安装（或 Ctrl+C 退出手动清理）..." _
else
    ok "无版本冲突。"
fi

# ============================================================
# 第2步：安装 Claude Code CLI
# ============================================================
echo ""
echo "  ========================================"
echo "  [2/5] 检查 Claude Code CLI..."
echo "  ========================================"

CLAUDE_CLI_PATH=""
if command -v claude &>/dev/null; then
    ok "Claude Code 已安装，跳过。"
    CLAUDE_CLI_PATH=$(which claude 2>/dev/null)
    if [[ -n "$CLAUDE_CLI_PATH" ]]; then
        ok "CLI 路径: $CLAUDE_CLI_PATH"
    fi
else
    info "正在安装 Claude Code CLI..."
    # 官方安装方式
    curl -fsSL https://claude.ai/install.sh | sh
    # 刷新 PATH
    export PATH="$HOME/.local/bin:$PATH"
    if command -v claude &>/dev/null; then
        ok "Claude Code 安装完成。"
        CLAUDE_CLI_PATH=$(which claude 2>/dev/null)
    else
        fail "Claude Code 安装可能未成功，请稍后在终端输入 claude --version 验证。"
    fi
fi

# ============================================================
# 第3步：安装 Node.js
# ============================================================
echo ""
echo "  ========================================"
echo "  [3/5] 检查 Node.js..."
echo "  ========================================"

if command -v node &>/dev/null; then
    NODE_VER=$(node --version)
    NODE_MAJOR=$(echo "$NODE_VER" | sed 's/v//' | cut -d. -f1)
    if [[ "$NODE_MAJOR" -lt 18 ]]; then
        info "Node.js 版本过低（$NODE_VER），需要 v18-v20，正在升级..."
        brew install node@20
        brew link --overwrite node@20
        ok "Node.js 升级完成。"
    elif [[ "$NODE_MAJOR" -gt 20 ]]; then
        info "Node.js 版本过高（$NODE_VER），需要降级到 v20 LTS..."
        brew install node@20
        brew link --overwrite node@20
        ok "Node.js 降级完成。"
    else
        ok "Node.js 已安装（$NODE_VER），跳过。"
    fi
else
    info "正在安装 Node.js LTS..."
    brew install node
    ok "Node.js 安装完成。"
fi

# ============================================================
# 第3.5步：添加 Playwright MCP（浏览器自动化）
# ============================================================
echo ""
echo "  ========================================"
echo "  [3.5] 添加 Playwright MCP..."
echo "  ========================================"

if command -v claude &>/dev/null; then
    claude mcp add playwright -s user -- npx @playwright/mcp@latest >/dev/null 2>&1
    ok "Playwright MCP 已添加。"
else
    info "Claude Code 未找到，跳过 Playwright MCP。"
fi

# ============================================================
# 第4步：复制插件文件
# ============================================================
echo ""
echo "  ========================================"
echo "  [4/5] 安装 Obsidian 插件..."
echo "  ========================================"

# 确定知识库位置
echo ""
echo "  请选择知识库安装位置："
echo "    [1] ~/Documents/我的知识库（推荐）"
echo "    [2] 自定义路径"
echo ""
read -p "  输入数字（默认1）：" VAULT_CHOICE
VAULT_CHOICE=${VAULT_CHOICE:-1}

if [[ "$VAULT_CHOICE" == "1" ]]; then
    VAULT_DIR="$HOME/Documents/我的知识库"
else
    read -p "  请输入完整路径：" VAULT_DIR
fi

VAULT_DIR=${VAULT_DIR:-"$HOME/Documents/我的知识库"}

echo ""
info "知识库位置：$VAULT_DIR"

# 创建目录
mkdir -p "$VAULT_DIR/.obsidian/plugins"

PLUGINS_DIR="$VAULT_DIR/.obsidian/plugins"
SRC_PLUGINS="$PACK_DIR/plugins"

if [[ ! -d "$SRC_PLUGINS" ]]; then
    fail "找不到插件文件夹：$SRC_PLUGINS"
    fail "请确保 plugins 文件夹和本脚本在同一目录下。"
    exit 1
fi

# 逐个复制插件
for plugin in claudian nano-banana-image-generator web-clipper-obsidian-plugin obsidian42-brat copy-document-as-html copy-image; do
    if [[ -d "$SRC_PLUGINS/$plugin" ]]; then
        info "安装插件：$plugin"
        cp -R "$SRC_PLUGINS/$plugin" "$PLUGINS_DIR/"
        ok "$plugin 已安装。"
    fi
done

# ============================================================
# 第5步：复制知识库模板
# ============================================================
echo ""
echo "  ========================================"
echo "  [5/5] 导入知识库模板..."
echo "  ========================================"

SRC_VAULT="$PACK_DIR/vault"

if [[ ! -d "$SRC_VAULT" ]]; then
    fail "找不到知识库模板文件夹：$SRC_VAULT"
    info "如果模板在课程中单独发放，跳过此步，手动导入即可。"
else
    info "正在导入知识库模板..."
    # 复制除 .obsidian 外的所有内容
    for item in "$SRC_VAULT"/*; do
        basename=$(basename "$item")
        if [[ "$basename" != ".obsidian" ]]; then
            cp -R "$item" "$VAULT_DIR/"
        fi
    done
    # 复制隐藏文件（.claude 等）
    for item in "$SRC_VAULT"/.[^.]*; do
        basename=$(basename "$item")
        if [[ "$basename" != ".obsidian" && -e "$item" ]]; then
            cp -R "$item" "$VAULT_DIR/"
        fi
    done
    ok "知识库模板导入完成。"
fi

# ============================================================
# [UPGRADE 3] 代理写入 Claudian 环境变量
# [UPGRADE 4] CLI 路径写入 claudian-settings.json
# ============================================================
echo ""
echo "  ========================================"
echo "  [6] 自动配置 Claudian 插件..."
echo "  ========================================"

CLAUDIAN_DATA="$PLUGINS_DIR/claudian/data.json"
CLAUDIAN_SETTINGS="$VAULT_DIR/.claude/claudian-settings.json"

# --- 6a: Write proxy to Claudian data.json ---
if [[ -d "$PLUGINS_DIR/claudian" ]]; then
    info "配置 Claudian 环境变量..."
    python3 -c "
import json, os

f = '$CLAUDIAN_DATA'
j = {}
if os.path.exists(f):
    try:
        with open(f, 'r') as fh:
            j = json.load(fh)
    except:
        j = {}

env_arr = []
proxy_set = '$PROXY_SET'
https_proxy = '$HTTPS_PROXY'
http_proxy = '$HTTP_PROXY'

if proxy_set == '1':
    env_arr.append({'name': 'HTTPS_PROXY', 'value': https_proxy})
    env_arr.append({'name': 'HTTP_PROXY', 'value': http_proxy})

if env_arr:
    j['environmentVariables'] = env_arr
    with open(f, 'w') as fh:
        json.dump(j, fh, indent=2, ensure_ascii=False)
    print('  done')
else:
    print('  skip')
" 2>/dev/null

    if [[ "$PROXY_SET" == "1" ]]; then
        ok "代理已写入: $HTTPS_PROXY"
    else
        info "无代理，跳过环境变量写入。"
    fi
else
    info "Claudian 插件未安装，跳过环境变量配置。"
fi

# --- 6b: Write CLI path to claudian-settings.json ---
if [[ -f "$CLAUDIAN_SETTINGS" && -n "$CLAUDE_CLI_PATH" ]]; then
    info "配置 Claudian CLI 路径..."
    python3 -c "
import json
f = '$CLAUDIAN_SETTINGS'
with open(f, 'r') as fh:
    j = json.load(fh)
j['claudeCliPath'] = '$CLAUDE_CLI_PATH'
with open(f, 'w') as fh:
    json.dump(j, fh, indent=2, ensure_ascii=False)
" 2>/dev/null
    ok "CLI 路径已写入: $CLAUDE_CLI_PATH"
elif [[ ! -f "$CLAUDIAN_SETTINGS" ]]; then
    info "claudian-settings.json 不存在，跳过 CLI 路径配置。"
fi

# ============================================================
# 完成
# ============================================================
echo ""
echo "  ╔═══════════════════════════════════════════╗"
echo "  ║            ✅ 安装全部完成！              ║"
echo "  ╚═══════════════════════════════════════════╝"
echo ""
echo "  ****************************************************"
echo "  *  YOUR VAULT PATH:"
echo "  *  $VAULT_DIR"
echo "  *"
echo "  *  IMPORTANT: Open THIS folder in Obsidian."
echo "  *  Do NOT open the 'vault' folder in the installer."
echo "  ****************************************************"
echo ""
echo "  接下来只需 3 步（手动）："
echo ""
echo "    1. 打开 Obsidian → 选择上面星号框里的知识库路径"
echo "    2. 设置 → 第三方插件 → 关闭安全模式 → 启用所有插件"
echo "    3. 在 Claudian 聊天框说「帮我安装」，AI 会搞定剩下的配置"
echo ""
echo "  如果遇到问题，在 Claudian 里问 AI，或联系学员群助教。"
echo ""
