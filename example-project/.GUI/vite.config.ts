import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // 静态模式使用相对路径，开发模式使用绝对路径
  base: command === 'build' ? './' : '/',
  plugins: [
    react(),
    // 自定义插件：提供父目录文件访问（仅开发模式）
    {
      name: 'serve-parent-files',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // 处理 /parent/ 开头的请求，映射到父目录
          if (req.url?.startsWith('/parent/')) {
            const filePath = path.resolve(__dirname, '..', req.url.slice(8))
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const content = fs.readFileSync(filePath)
              const ext = path.extname(filePath)
              const contentType = ext === '.json' ? 'application/json' :
                                 ext === '.md' ? 'text/markdown' :
                                 'text/plain'
              res.setHeader('Content-Type', contentType)
              res.end(content)
              return
            }
          }
          next()
        })
      }
    },
    // 构建后复制数据文件
    {
      name: 'copy-data-files',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist')
        const dataDir = path.resolve(distDir, 'data')

        // 创建 data 目录
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true })
        }

        // 复制 SKILL.index.json
        const indexSrc = path.resolve(__dirname, '..', 'SKILL.index.json')
        if (fs.existsSync(indexSrc)) {
          fs.copyFileSync(indexSrc, path.resolve(dataDir, 'SKILL.index.json'))
          console.log('✓ 已复制 SKILL.index.json')
        }

        // 复制所有 .skill.md 文件
        const srcDir = path.resolve(__dirname, '..', 'src')
        if (fs.existsSync(srcDir)) {
          const copyMdFiles = (dir: string, relativePath = '') => {
            const files = fs.readdirSync(dir)
            for (const file of files) {
              const fullPath = path.join(dir, file)
              const stat = fs.statSync(fullPath)
              if (stat.isDirectory()) {
                copyMdFiles(fullPath, path.join(relativePath, file))
              } else if (file.endsWith('.skill.md') || file.endsWith('.md')) {
                const targetDir = path.resolve(dataDir, 'src', relativePath)
                if (!fs.existsSync(targetDir)) {
                  fs.mkdirSync(targetDir, { recursive: true })
                }
                fs.copyFileSync(fullPath, path.resolve(targetDir, file))
                console.log(`✓ 已复制 src/${relativePath}/${file}`)
              }
            }
          }
          copyMdFiles(srcDir)
        }

        console.log('\n构建完成！')
        console.log('静态模式：直接用浏览器打开 dist/index.html')
        console.log('服务模式：npm run dev 或 npm run preview')
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    fs: {
      // 允许访问父目录的文件（读取项目的 SKILL.md 文件）
      allow: ['..', '.'],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
}))
