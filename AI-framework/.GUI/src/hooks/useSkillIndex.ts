import { useEffect, useState } from 'react'
import { useAppStore } from '../store'

// 使用 SKILL 索引的 Hook
export function useSkillIndex() {
  const {
    index,
    loading,
    error,
    refreshIndex,
  } = useAppStore()

  useEffect(() => {
    // 初始加载
    console.log('useSkillIndex effect triggered:', { index, error })
    if (!index && !error) {
      console.log('Calling refreshIndex...')
      refreshIndex()
    }
  }, [index, error, refreshIndex])

  // 移除自动刷新功能，避免页面频繁跳动
  // 用户可以通过手动刷新按钮来更新数据

  return {
    index,
    loading,
    error,
    refresh: refreshIndex,
  }
}

// 搜索功能 Hook
export function useSearch() {
  const {
    searchQuery,
    searchResults,
    searchHistory,
    setSearchQuery,
    performSearch,
    addToSearchHistory,
    clearSearchHistory,
  } = useAppStore()

  const search = async (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      await performSearch(query)
      addToSearchHistory(query)
    }
  }

  return {
    query: searchQuery,
    results: searchResults,
    history: searchHistory,
    search,
    setQuery: setSearchQuery,
    clearHistory: clearSearchHistory,
  }
}

// 主题管理 Hook
export function useTheme() {
  const { theme, setTheme } = useAppStore()

  useEffect(() => {
    // 初始化主题
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      // system
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', isDark)

      // 监听系统主题变化
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches)
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  return {
    theme,
    setTheme,
    isDark: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
  }
}

// 文件内容加载 Hook
export function useFileContent(filePath: string | null) {
  const { getCachedContent, cacheFileContent } = useAppStore()
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!filePath) {
      setContent(null)
      return
    }

    // 检查缓存
    const cached = getCachedContent(filePath)
    if (cached) {
      setContent(cached)
      return
    }

    // 加载文件
    setLoading(true)
    setError(null)

    import('../utils/api').then(({ loadFileContent }) => {
      return loadFileContent(filePath)
    })
      .then((fileContent) => {
        setContent(fileContent)
        cacheFileContent(filePath, fileContent)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [filePath, getCachedContent, cacheFileContent])

  return { content, loading, error }
}

// 键盘快捷键 Hook
export function useKeyboardShortcuts() {
  const { toggleSidebar } = useAppStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + B: 切换侧边栏
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault()
        toggleSidebar()
      }

      // Ctrl/Cmd + K: 聚焦搜索框
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }

      // ESC: 清除搜索
      if (event.key === 'Escape') {
        const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement
        if (searchInput && document.activeElement === searchInput) {
          searchInput.blur()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])
}

// 响应式设计 Hook
export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
  }
}