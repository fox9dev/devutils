/**
 * 工具管理 Composable
 * 提供工具列表、搜索等功能
 */
import type { ToolMeta } from '~/types/tool'

export function useTools() {
  const router = useRouter()

  // 所有工具列表
  const tools = computed<ToolMeta[]>(() =>
    router
      .getRoutes()
      .filter(route => route.meta?.tool)
      .map(route => route.meta.tool as ToolMeta)
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
  )

  // 搜索工具
  function searchTools(query: string): ToolMeta[] {
    if (!query || query.trim() === '') {
      return tools.value
    }

    const q = query.toLowerCase().trim()

    return tools.value.filter((tool) => {
      if (tool.name.toLowerCase().includes(q)) return true
      if (tool.description.toLowerCase().includes(q)) return true
      if (tool.id.toLowerCase().includes(q)) return true
      if (tool.keywords.some(kw => kw.toLowerCase().includes(q))) return true
      return false
    })
  }

  // 获取单个工具
  function getTool(id: string): ToolMeta | undefined {
    return tools.value.find(tool => tool.id === id)
  }

  // 检查工具是否存在
  function hasToolById(id: string): boolean {
    return tools.value.some(tool => tool.id === id)
  }

  return {
    tools,
    searchTools,
    getTool,
    hasToolById
  }
}
