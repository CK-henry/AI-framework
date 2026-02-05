// 修复导入
export * from './useSkillIndex'

// 文件内容加载 Hook（占位符，实际实现在 useSkillIndex.ts 中）
export function useFileContent(_filePath: string | null) {
  return { content: null, loading: false, error: null }
}