/**
 * 工具标签页状态管理 Composable
 * 管理已打开的工具和当前激活的工具
 */
import { useLocalStorage } from '@vueuse/core'

const STORAGE_KEY_TABS = 'devutils-open-tabs'
const STORAGE_KEY_ACTIVE = 'devutils-active-tab'

// 全局状态，确保跨组件共享
const openTabs = useLocalStorage<string[]>(STORAGE_KEY_TABS, [])
const activeTab = useLocalStorage<string>(STORAGE_KEY_ACTIVE, '')

export function useToolTabs() {
  // 打开工具
  function openTool(toolId: string) {
    if (!openTabs.value.includes(toolId)) {
      openTabs.value = [...openTabs.value, toolId]
    }
    activeTab.value = toolId
  }

  // 关闭工具
  function closeTool(toolId: string) {
    const index = openTabs.value.indexOf(toolId)
    if (index === -1) return

    const newTabs = openTabs.value.filter(id => id !== toolId)
    openTabs.value = newTabs

    // 如果关闭的是当前激活的标签，切换到相邻标签
    if (activeTab.value === toolId) {
      if (newTabs.length === 0) {
        activeTab.value = ''
      } else if (index >= newTabs.length) {
        activeTab.value = newTabs[newTabs.length - 1]
      } else {
        activeTab.value = newTabs[index]
      }
    }
  }

  // 切换到指定标签
  function switchTab(toolId: string) {
    if (openTabs.value.includes(toolId)) {
      activeTab.value = toolId
    }
  }

  // 关闭所有标签
  function closeAllTabs() {
    openTabs.value = []
    activeTab.value = ''
  }

  // 关闭其他标签
  function closeOtherTabs(toolId: string) {
    if (openTabs.value.includes(toolId)) {
      openTabs.value = [toolId]
      activeTab.value = toolId
    }
  }

  // 关闭左侧标签
  function closeLeftTabs(toolId: string) {
    const index = openTabs.value.indexOf(toolId)
    if (index <= 0) return
    const keep = openTabs.value.slice(index)
    openTabs.value = keep
    if (!keep.includes(activeTab.value)) {
      activeTab.value = toolId
    }
  }

  // 关闭右侧标签
  function closeRightTabs(toolId: string) {
    const index = openTabs.value.indexOf(toolId)
    if (index === -1 || index >= openTabs.value.length - 1) return
    openTabs.value = openTabs.value.slice(0, index + 1)
    if (!openTabs.value.includes(activeTab.value)) {
      activeTab.value = toolId
    }
  }

  // 检查工具是否已打开
  function isToolOpen(toolId: string): boolean {
    return openTabs.value.includes(toolId)
  }

  // 检查工具是否为当前激活
  function isToolActive(toolId: string): boolean {
    return activeTab.value === toolId
  }

  return {
    openTabs: readonly(openTabs),
    activeTab: readonly(activeTab),
    openTool,
    closeTool,
    switchTab,
    closeAllTabs,
    closeOtherTabs,
    closeLeftTabs,
    closeRightTabs,
    isToolOpen,
    isToolActive
  }
}
