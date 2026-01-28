import type { Tool, ToolCategory } from '~/types/tool'
import { ToolCategoryInfo } from '~/types/tool'

/**
 * 工具管理 Composable
 * 从路由元数据动态读取工具信息
 */
export function useTools() {
  const router = useRouter()

  /**
   * 从路由中提取所有工具的元数据
   */
  const tools = computed(() => {
    return router
      .getRoutes()
      .filter(route => route.path.startsWith('/tools/') && route.meta?.tool)
      .map(route => route.meta.tool as Tool)
  })

  /**
   * 根据 ID 获取工具
   */
  function getToolById(id: string): Tool | undefined {
    return tools.value.find(tool => tool.id === id)
  }

  /**
   * 根据分类获取工具
   */
  function getToolsByCategory(category: ToolCategory): Tool[] {
    return tools.value.filter(tool => tool.category === category)
  }

  /**
   * 获取所有分类
   */
  function getAllCategories(): ToolCategory[] {
    return [...new Set(tools.value.map(tool => tool.category))]
  }

  /**
   * 搜索工具
   */
  function searchTools(keyword: string): Tool[] {
    const lowerKeyword = keyword.toLowerCase()
    return tools.value.filter(
      tool =>
        tool.name.toLowerCase().includes(lowerKeyword)
        || tool.description.toLowerCase().includes(lowerKeyword)
        || tool.keywords.some(kw => kw.toLowerCase().includes(lowerKeyword))
    )
  }

  /**
   * 获取热门工具
   */
  function getFeaturedTools(): Tool[] {
    return tools.value.filter(tool => tool.featured)
  }

  /**
   * 获取过滤后的工具列表
   */
  function getFilteredTools(options: {
    keyword?: string
    category?: ToolCategory | null
    sortBy?: 'category' | 'name'
  }): Tool[] {
    let result = [...tools.value]

    // 按分类过滤
    if (options.category) {
      result = result.filter(t => t.category === options.category)
    }

    // 按关键词搜索
    if (options.keyword) {
      const lowerKeyword = options.keyword.toLowerCase()
      result = result.filter(
        t =>
          t.name.toLowerCase().includes(lowerKeyword)
          || t.description.toLowerCase().includes(lowerKeyword)
          || t.keywords.some(kw => kw.toLowerCase().includes(lowerKeyword))
      )
    }

    // 排序
    if (options.sortBy === 'name') {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name, 'zh-CN')
      )
    } else if (options.sortBy === 'category') {
      result = [...result].sort((a, b) => {
        const catCompare = a.category.localeCompare(b.category)
        if (catCompare !== 0) return catCompare
        return a.name.localeCompare(b.name, 'zh-CN')
      })
    }

    return result
  }

  /**
   * 按分类分组工具
   */
  function getToolsGroupedByCategory(): Map<ToolCategory, Tool[]> {
    const groups = new Map<ToolCategory, Tool[]>()
    for (const tool of tools.value) {
      if (!groups.has(tool.category)) {
        groups.set(tool.category, [])
      }
      groups.get(tool.category)!.push(tool)
    }
    return groups
  }

  return {
    /** 所有工具列表 */
    tools,
    /** 工具分类信息 */
    ToolCategoryInfo,
    /** 根据 ID 获取工具 */
    getToolById,
    /** 根据分类获取工具 */
    getToolsByCategory,
    /** 获取所有分类 */
    getAllCategories,
    /** 搜索工具 */
    searchTools,
    /** 获取热门工具 */
    getFeaturedTools,
    /** 获取过滤后的工具列表 */
    getFilteredTools,
    /** 按分类分组工具 */
    getToolsGroupedByCategory
  }
}
