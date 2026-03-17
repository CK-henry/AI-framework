#!/usr/bin/env node

/**
 * SKILL GUI 安装脚本
 * 自动检测项目环境并安装依赖
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // cyan
    success: '\x1b[32m', // green
    warning: '\x1b[33m', // yellow
    error: '\x1b[31m',   // red
    reset: '\x1b[0m'
  }
  console.log(`${colors[type]}${message}${colors.reset}`)
}

function checkCommand(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function main() {
  log('🚀 SKILL GUI 安装程序', 'info')
  log('=' .repeat(50), 'info')

  // 检查 Node.js 版本
  const nodeVersion = process.version
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])

  if (majorVersion < 16) {
    log('❌ 需要 Node.js 16 或更高版本', 'error')
    log(`   当前版本: ${nodeVersion}`, 'error')
    process.exit(1)
  }

  log(`✅ Node.js 版本: ${nodeVersion}`, 'success')

  // 检查包管理器
  const hasNpm = checkCommand('npm')
  const hasYarn = checkCommand('yarn')
  const hasPnpm = checkCommand('pnpm')

  if (!hasNpm && !hasYarn && !hasPnpm) {
    log('❌ 未找到包管理器 (npm/yarn/pnpm)', 'error')
    process.exit(1)
  }

  // 选择包管理器
  let packageManager = 'npm'
  if (hasPnpm) {
    packageManager = 'pnpm'
  } else if (hasYarn) {
    packageManager = 'yarn'
  }

  log(`📦 使用包管理器: ${packageManager}`, 'info')

  // 检查项目结构
  const projectRoot = path.resolve(__dirname, '..')
  const indexFile = path.join(projectRoot, 'SKILL.index.json')
  const buildScript = path.join(projectRoot, 'build-index-auto.js')

  log('🔍 检查项目结构...', 'info')

  if (!fs.existsSync(indexFile)) {
    log('⚠️  未找到 SKILL.index.json，请先运行索引生成工具', 'warning')
    if (fs.existsSync(buildScript)) {
      log('   运行: node build-index-auto.js', 'info')
    }
  } else {
    log('✅ 找到 SKILL.index.json', 'success')
  }

  if (!fs.existsSync(buildScript)) {
    log('⚠️  未找到 build-index-auto.js', 'warning')
  } else {
    log('✅ 找到索引生成工具', 'success')
  }

  // 安装依赖
  log('📥 安装依赖...', 'info')

  try {
    const installCommand = packageManager === 'npm' ? 'npm install' :
                          packageManager === 'yarn' ? 'yarn install' :
                          'pnpm install'

    execSync(installCommand, {
      stdio: 'inherit',
      cwd: __dirname
    })

    log('✅ 依赖安装完成', 'success')
  } catch (error) {
    log('❌ 依赖安装失败', 'error')
    log(error.message, 'error')
    process.exit(1)
  }

  // 创建启动脚本
  const startScript = `#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')

const guiDir = path.join(__dirname, '.GUI')
const child = spawn('${packageManager}', ['run', 'dev'], {
  cwd: guiDir,
  stdio: 'inherit'
})

child.on('close', (code) => {
  process.exit(code)
})
`

  fs.writeFileSync(path.join(projectRoot, 'start-gui.js'), startScript)

  if (process.platform !== 'win32') {
    execSync('chmod +x start-gui.js', { cwd: projectRoot })
  }

  log('✅ 创建启动脚本: start-gui.js', 'success')

  // 完成
  log('', 'info')
  log('🎉 安装完成！', 'success')
  log('', 'info')
  log('启动方式：', 'info')
  log('  方式1: node start-gui.js', 'info')
  log('  方式2: cd .GUI && npm run dev', 'info')
  log('', 'info')
  log('访问地址: http://localhost:5173', 'info')
  log('', 'info')
}

if (require.main === module) {
  main()
}