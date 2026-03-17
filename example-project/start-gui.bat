@echo off
chcp 65001 >nul
title SKILL GUI

echo.
echo ========================================
echo   SKILL GUI 文档管理系统
echo ========================================
echo.

:: 解析端口参数
set PORT=5173
if not "%1"=="" set PORT=%1

:: 获取脚本所在目录
set SCRIPT_DIR=%~dp0

:: 进入 .GUI 目录
cd /d "%SCRIPT_DIR%.GUI"
if errorlevel 1 (
    echo [!] 错误：找不到 .GUI 目录
    echo [!] 请确保在项目根目录运行此脚本
    pause
    exit /b 1
)

:: 检查 node_modules 是否存在
if not exist "node_modules" (
    echo [*] 首次运行，正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo [!] 依赖安装失败，请检查 Node.js 是否已安装
        pause
        exit /b 1
    )
    echo.
)

:: 检查索引文件是否存在
if not exist "%SCRIPT_DIR%SKILL.index.json" (
    echo [*] 未找到索引文件，正在生成...
    cd /d "%SCRIPT_DIR%"
    if exist "build-index-auto.js" (
        node build-index-auto.js
    ) else (
        echo [!] 警告：找不到 build-index-auto.js
    )
    cd /d "%SCRIPT_DIR%.GUI"
    echo.
)

echo [*] 启动开发服务器 (端口: %PORT%)...
echo [*] 访问地址: http://localhost:%PORT%
echo [*] 按 Ctrl+C 停止服务器
echo.

npx vite --port %PORT%
