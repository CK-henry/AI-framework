import type { SkillIndex, SearchResult } from '../types'

// 检测是否为静态模式（直接打开 HTML 文件）
const isStaticMode = () => {
  return window.location.protocol === 'file:' ||
         window.location.href.includes('/dist/') ||
         !window.location.port // 没有端口号通常意味着静态文件
}

// 获取数据文件路径
const getDataPath = (filePath: string) => {
  if (isStaticMode()) {
    // 静态模式：从 data 目录加载
    return `./data/${filePath}`
  }
  // 开发模式：从 /parent/ 路径加载
  return `/parent/${filePath}`
}

// 加载 SKILL 索引文件
export async function loadSkillIndex(): Promise<SkillIndex> {
  try {
    const indexPath = getDataPath('SKILL.index.json')
    console.log('开始加载索引文件:', indexPath, '模式:', isStaticMode() ? '静态' : '开发')

    const response = await fetch(indexPath)
    console.log('响应状态:', response.status, response.statusText)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('索引文件加载成功:', data)
    return data as SkillIndex
  } catch (error) {
    console.error('加载索引文件失败:', error)
    throw new Error('无法加载项目索引文件，请确保 SKILL.index.json 存在')
  }
}

// 加载文件内容
export async function loadFileContent(filePath: string): Promise<string> {
  try {
    const fullPath = getDataPath(filePath)
    const response = await fetch(fullPath)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.text()
  } catch (error) {
    console.error('加载文件失败:', filePath, error)
    throw new Error(`无法加载文件: ${filePath}`)
  }
}

// 基于标签搜索
export function searchByTags(index: SkillIndex, queryTags: string[]): SearchResult[] {
  const results: SearchResult[] = []

  // 搜索模块
  for (const [moduleId, module] of Object.entries(index.modules)) {
    let moduleScore = 0

    // 模块级标签匹配 (+10 分/tag)
    for (const tag of module.tags) {
      for (const queryTag of queryTags) {
        if (tag.toLowerCase().includes(queryTag.toLowerCase()) ||
            queryTag.toLowerCase().includes(tag.toLowerCase())) {
          moduleScore += 10
        }
      }
    }

    // 如果模块匹配，添加到结果
    if (moduleScore > 0) {
      results.push({
        type: 'module',
        moduleId,
        title: module.title,
        description: `模块: ${module.title}`,
        tags: module.tags,
        score: moduleScore,
        file: module.file,
      })
    }

    // 搜索模块内的 sections
    for (const [sectionId, section] of Object.entries(module.sections)) {
      let sectionScore = 0

      // Section 级标签匹配 (+5 分/tag)
      for (const tag of section.tags || []) {
        for (const queryTag of queryTags) {
          if (tag.toLowerCase().includes(queryTag.toLowerCase()) ||
              queryTag.toLowerCase().includes(tag.toLowerCase())) {
            sectionScore += 5
          }
        }
      }

      // 标题匹配 (+3 分)
      for (const queryTag of queryTags) {
        if (section.title.toLowerCase().includes(queryTag.toLowerCase())) {
          sectionScore += 3
        }
      }

      if (sectionScore > 0) {
        results.push({
          type: 'section',
          moduleId,
          sectionId,
          title: section.title,
          description: `${module.title} > ${section.title}`,
          tags: section.tags || [],
          score: sectionScore + (moduleScore * 0.1), // 继承部分模块分数
          file: module.file,
          start: section.start,
          end: section.end,
        })
      }
    }
  }

  // 按分数排序
  return results.sort((a, b) => b.score - a.score)
}

// 模糊搜索
export function fuzzySearch(index: SkillIndex, query: string): SearchResult[] {
  const results: SearchResult[] = []
  const lowerQuery = query.toLowerCase()

  for (const [moduleId, module] of Object.entries(index.modules)) {
    // 搜索模块标题
    if (module.title.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'module',
        moduleId,
        title: module.title,
        description: `模块: ${module.title}`,
        tags: module.tags,
        score: 10,
        file: module.file,
      })
    }

    // 搜索 sections
    for (const [sectionId, section] of Object.entries(module.sections)) {
      if (section.title.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'section',
          moduleId,
          sectionId,
          title: section.title,
          description: `${module.title} > ${section.title}`,
          tags: section.tags || [],
          score: 5,
          file: module.file,
          start: section.start,
          end: section.end,
        })
      }
    }
  }

  return results.sort((a, b) => b.score - a.score)
}

// 获取模块的依赖关系
export function getModuleDependencies(index: SkillIndex, moduleId: string): string[] {
  const module = index.modules[moduleId]
  if (!module) return []

  // 这里可以扩展，从 SKILL.md 内容中解析依赖关系
  // 目前返回空数组，后续可以通过解析文档内容来实现
  return []
}

// 获取热门标签（只统计模块级别的标签）
export function getPopularTags(index: SkillIndex, limit = 20): Array<{ tag: string; count: number }> {
  const tagCounts: Record<string, number> = {}

  // 统计模块标签频率
  for (const module of Object.values(index.modules)) {
    for (const tag of module.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    }
  }

  // 排序并返回前 N 个
  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }))
}

// 获取项目统计信息
export function getProjectStats(index: SkillIndex) {
  // 统计真正的 API 数量（只计算 H3 和 H4）
  let totalAPIs = 0
  const modulesByLevel: Record<number, number> = {}

  for (const module of Object.values(index.modules)) {
    for (const section of Object.values(module.sections)) {
      modulesByLevel[section.level] = (modulesByLevel[section.level] || 0) + 1
      // 只统计 H3 和 H4 作为 API
      if (section.level >= 3) {
        totalAPIs++
      }
    }
  }

  const stats = {
    totalModules: index.stats.totalModules,
    totalSections: totalAPIs, // 使用真正的 API 数量
    totalTags: index.stats.totalTags,
    totalFiles: index.stats.totalFiles,
    lastUpdated: index.updated,
    modulesByLevel,
    popularTags: getPopularTags(index, 10),
  }

  return stats
}

// 高亮搜索结果
export function highlightSearchTerms(text: string, terms: string[]): string {
  let result = text
  for (const term of terms) {
    const regex = new RegExp(`(${term})`, 'gi')
    result = result.replace(regex, '<mark class="search-highlight">$1</mark>')
  }
  return result
}

// 检查索引文件是否存在
export async function checkIndexFile(): Promise<boolean> {
  try {
    const indexPath = getDataPath('SKILL.index.json')
    const response = await fetch(indexPath, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}
