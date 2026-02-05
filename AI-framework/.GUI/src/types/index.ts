// SKILL 索引数据类型定义
export interface SkillIndex {
  version: string
  mode: string
  updated: string
  stats: {
    totalFiles: number
    totalModules: number
    totalSections: number
    totalTags: number
  }
  modules: Record<string, Module>
  tagIndex: Record<string, string[]>
}

export interface Module {
  file: string
  title: string
  tags: string[]
  sections: Record<string, Section>
}

export interface Section {
  level: number
  title: string
  start: number
  end: number
  tags: string[]
}

// 搜索结果类型
export interface SearchResult {
  type: 'module' | 'section'
  moduleId: string
  sectionId?: string
  title: string
  description?: string
  tags: string[]
  score: number
  file: string
  start?: number
  end?: number
}

// 项目配置类型
export interface ProjectConfig {
  name: string
  path: string
  indexFile: string
  description?: string
}

// 应用状态类型
export interface AppState {
  // 索引数据
  index: SkillIndex | null
  loading: boolean
  error: string | null

  // 当前选中的项目
  currentProject: ProjectConfig | null

  // 搜索状态
  searchQuery: string
  searchResults: SearchResult[]
  searchHistory: string[]

  // UI 状态
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'system'

  // 文件内容缓存
  fileCache: Record<string, string>
}

// API 响应类型
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// 文件监听事件类型
export interface FileWatchEvent {
  type: 'change' | 'add' | 'unlink'
  path: string
  timestamp: number
}

// 统计信息类型
export interface ProjectStats {
  totalModules: number
  totalSections: number
  totalTags: number
  totalFiles: number
  lastUpdated: string
  modulesByType: Record<string, number>
  tagFrequency: Record<string, number>
}

// 依赖关系类型
export interface DependencyGraph {
  nodes: DependencyNode[]
  edges: DependencyEdge[]
}

export interface DependencyNode {
  id: string
  label: string
  type: 'module' | 'external'
  size?: number
}

export interface DependencyEdge {
  source: string
  target: string
  type: 'depends' | 'uses'
  weight?: number
}