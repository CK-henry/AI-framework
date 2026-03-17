import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AppState, SkillIndex, ProjectConfig } from '../types'
import { searchByTags, loadSkillIndex } from '../utils/api'

interface AppActions {
  // 索引管理
  setIndex: (index: SkillIndex | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  refreshIndex: () => Promise<void>

  // 项目管理
  setCurrentProject: (project: ProjectConfig | null) => void

  // 搜索功能
  setSearchQuery: (query: string) => void
  performSearch: (query: string) => Promise<void>
  addToSearchHistory: (query: string) => void
  clearSearchHistory: () => void

  // UI 状态
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // 文件缓存
  cacheFileContent: (path: string, content: string) => void
  getCachedContent: (path: string) => string | null
}

const initialState: AppState = {
  index: null,
  loading: true,
  error: null,
  currentProject: null,
  searchQuery: '',
  searchResults: [],
  searchHistory: JSON.parse(localStorage.getItem('skill-gui-search-history') || '[]'),
  sidebarCollapsed: false,
  theme: (localStorage.getItem('skill-gui-theme') as AppState['theme']) || 'system',
  fileCache: {},
}

export const useAppStore = create<AppState & AppActions>()(devtools(
  (set, get) => ({
    ...initialState,

    // 索引管理
    setIndex: (index) => set({ index }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    refreshIndex: async () => {
      set({ loading: true, error: null })
      try {
        const index = await loadSkillIndex()
        set({ index, loading: false })
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : '加载索引失败',
          loading: false
        })
      }
    },

    // 项目管理
    setCurrentProject: (project) => set({ currentProject: project }),

    // 搜索功能
    setSearchQuery: (query) => set({ searchQuery: query }),

    performSearch: async (query) => {
      const { index } = get()
      if (!index || !query.trim()) {
        set({ searchResults: [] })
        return
      }

      try {
        const results = searchByTags(index, query.split(/[,\s]+/).filter(Boolean))
        set({ searchResults: results })
      } catch (error) {
        console.error('搜索失败:', error)
        set({ searchResults: [] })
      }
    },

    addToSearchHistory: (query) => {
      const { searchHistory } = get()
      const newHistory = [query, ...searchHistory.filter(q => q !== query)].slice(0, 10)
      set({ searchHistory: newHistory })
      localStorage.setItem('skill-gui-search-history', JSON.stringify(newHistory))
    },

    clearSearchHistory: () => {
      set({ searchHistory: [] })
      localStorage.removeItem('skill-gui-search-history')
    },

    // UI 状态
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    setTheme: (theme) => {
      set({ theme })
      localStorage.setItem('skill-gui-theme', theme)

      // 应用主题
      const root = document.documentElement
      if (theme === 'dark') {
        root.classList.add('dark')
      } else if (theme === 'light') {
        root.classList.remove('dark')
      } else {
        // system
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark', isDark)
      }
    },

    // 文件缓存
    cacheFileContent: (path, content) => {
      set((state) => ({
        fileCache: { ...state.fileCache, [path]: content }
      }))
    },

    getCachedContent: (path) => {
      return get().fileCache[path] || null
    },
  }),
  {
    name: 'skill-gui-store',
  }
))