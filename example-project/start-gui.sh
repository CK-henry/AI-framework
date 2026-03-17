#!/bin/bash

echo ""
echo "========================================"
echo "  SKILL GUI 文档管理系统"
echo "========================================"
echo ""

# 解析端口参数，默认 5173
PORT=${1:-5173}

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 进入 .GUI 目录
cd "$SCRIPT_DIR/.GUI" || {
    echo "[!] 错误：找不到 .GUI 目录"
    echo "[!] 请确保在项目根目录运行此脚本"
    exit 1
}

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "[*] 首次运行，正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[!] 依赖安装失败，请检查 Node.js 是否已安装"
        exit 1
    fi
    echo ""
fi

# 检查索引文件是否存在
if [ ! -f "$SCRIPT_DIR/SKILL.index.json" ]; then
    echo "[*] 未找到索引文件，正在生成..."
    cd "$SCRIPT_DIR"
    if [ -f "build-index-auto.js" ]; then
        node build-index-auto.js
    else
        echo "[!] 警告：找不到 build-index-auto.js"
    fi
    cd "$SCRIPT_DIR/.GUI"
    echo ""
fi

echo "[*] 启动开发服务器 (端口: $PORT)..."
echo "[*] 访问地址: http://localhost:$PORT"
echo "[*] 按 Ctrl+C 停止服务器"
echo ""

npx vite --port $PORT
