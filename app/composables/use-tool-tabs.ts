import type { ToolTab } from '~/types/tool'

/**
 * 工具标签页管理 Composable
 */
export function useToolTabs() {
  const { getToolById } = useTools()

  // 打开的标签页列表
  const tabs = useState<ToolTab[]>('tool-tabs', () => [])
  // 当前激活的标签页 key
  const activeTabKey = useState<string | null>('active-tab-key', () => null)

  /**
   * 打开工具标签页
   * 如果工具已打开则激活，否则新建标签页
   */
  function openTool(toolId: string): void {
    const tool = getToolById(toolId)
    if (!tool) return

    // 检查是否已有该工具的标签页
    const existingTab = tabs.value.find(t => t.toolId === toolId)
    if (existingTab) {
      activeTabKey.value = existingTab.key
      return
    }

    // 创建新标签页
    const newTab: ToolTab = {
      toolId,
      key: `${toolId}-${Date.now()}`,
      title: tool.name
    }
    tabs.value.push(newTab)
    activeTabKey.value = newTab.key
  }

  /**
   * 关闭标签页
   */
  function closeTab(key: string): void {
    const index = tabs.value.findIndex(t => t.key === key)
    if (index === -1) return

    tabs.value.splice(index, 1)

    // 如果关闭的是当前标签页，激活相邻标签页
    if (activeTabKey.value === key) {
      if (tabs.value.length > 0) {
        // 优先激活右侧，否则激活左侧
        const newIndex = Math.min(index, tabs.value.length - 1)
        const newTab = tabs.value[newIndex]
        activeTabKey.value = newTab ? newTab.key : null
      } else {
        activeTabKey.value = null
      }
    }
  }

  /**
   * 激活标签页
   */
  function activateTab(key: string): void {
    if (tabs.value.some(t => t.key === key)) {
      activeTabKey.value = key
    }
  }

  /**
   * 获取当前激活的标签页
   */
  const activeTab = computed(() => {
    if (!activeTabKey.value) return null
    return tabs.value.find(t => t.key === activeTabKey.value) || null
  })

  /**
   * 关闭其他标签页
   */
  function closeOtherTabs(key: string): void {
    const tab = tabs.value.find(t => t.key === key)
    if (tab) {
      tabs.value = [tab]
      activeTabKey.value = key
    }
  }

  /**
   * 关闭所有标签页
   */
  function closeAllTabs(): void {
    tabs.value = []
    activeTabKey.value = null
  }

  return {
    tabs,
    activeTabKey,
    activeTab,
    getToolById,
    openTool,
    closeTab,
    activateTab,
    closeOtherTabs,
    closeAllTabs
  }
}
