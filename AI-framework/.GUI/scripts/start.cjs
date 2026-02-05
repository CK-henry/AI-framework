#!/usr/bin/env node

/**
 * SKILL GUI 启动脚本
 * 快速启动开发服务器
 */

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  }
  console.log(`${colors[type]}${message}${colors.reset}`)
}

function checkDependencies() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json')
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules')

  if (!fs.existsSync(packageJsonPath)) {
    log('❌ 未找到 package.json', 'error')
    return false
  }

  if (!fs.existsSync(nodeModulesPath)) {
    log('❌ 未找到 node_modules，请先运行安装脚本', 'error')
    log('   运行: node .GUI/scripts/install.js', 'info')
    return false
  }

  return true
}

function main() {
  log('🚀 启动 SKILL GUI...', 'info')

  // 检查依赖
  if (!checkDependencies()) {
    process.exit(1)
  }

  // 检查项目索引
  const indexPath = path.join(__dirname, '..', '..', 'SKILL.index.json')
  if (!fs.existsSync(indexPath)) {
    log('⚠️  未找到 SKILL.index.json', 'warning')
    log('   建议先运行: node build-index-auto.js', 'warning')
  }

  // 启动开发服务器
  const guiDir = path.join(__dirname, '..')

  log('📂 工作目录: ' + guiDir, 'info')
  log('🌐 启动开发服务器...', 'info')
  log('', 'info')

  const child = spawn('npm', ['run', 'dev'], {
    cwd: guiDir,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  })

  child.on('error', (error) => {
    log('❌ 启动失败: ' + error.message, 'error')
    process.exit(1)
  })

  child.on('close', (code) => {
    if (code !== 0) {
      log(`❌ 进程退出，代码: ${code}`, 'error')
    }
    process.exit(code)
  })

  // 处理退出信号
  process.on('SIGINT', () => {
    log('\n👋 正在关闭服务器...', 'info')
    child.kill('SIGINT')
  })

  process.on('SIGTERM', () => {
    child.kill('SIGTERM')
  })
}

if (require.main === module) {
  main()
}