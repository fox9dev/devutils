/**
 * 工具标签页状态管理 Composable
 * 管理已打开的工具和当前激活的工具
 * 所有对外操作默认包含路由导航，确保状态与路由的原子性
 */
import { useLocalStorage } from '@vueuse/core'

const STORAGE_KEY_TABS = 'devutils-open-tabs'
const STORAGE_KEY_ACTIVE = 'devutils-active-tab'

// 全局状态，确保跨组件共享
const openTabs = useLocalStorage<string[]>(STORAGE_KEY_TABS, [])
const activeTab = useLocalStorage<string>(STORAGE_KEY_ACTIVE, '')

// 页面切换滑动方向：left = 向左滑（切到右侧 tab），right = 向右滑（切到左侧 tab），'' = 无动画
const slideDirection = ref<'slide-left' | 'slide-right' | ''>('')

type SlideDir = typeof slideDirection.value

interface TabActionOptions {
  /** 是否同时执行路由导航，默认 true。仅在路由 watcher 同步状态时设为 false */
  navigate?: boolean
}

export function useToolTabs() {
  /** 根据旧/新激活 tab 在当前 openTabs 中的位置计算滑动方向（须在修改 openTabs 之前调用） */
  function calcSlideDirection(fromId: string, toId: string): SlideDir {
    if (!fromId || fromId === toId) return ''
    const fromIdx = openTabs.value.indexOf(fromId)
    const toIdx = openTabs.value.indexOf(toId)
    if (fromIdx === -1 || toIdx === -1) return ''
    return toIdx > fromIdx ? 'slide-left' : 'slide-right'
  }

  /** 导航到当前激活标签页，或回退到 /workspace */
  function navigateToActive() {
    navigateTo(activeTab.value ? `/workspace/${activeTab.value}` : '/workspace')
  }

  /** 设置滑动方向 + 激活标签 + 按需导航（原子操作） */
  function activateAndNavigate(toolId: string, direction: SlideDir, options?: TabActionOptions) {
    slideDirection.value = direction
    activeTab.value = toolId
    if (options?.navigate !== false) navigateToActive()
  }

  /** 打开工具 */
  function openTool(toolId: string, options?: TabActionOptions) {
    const prevActive = activeTab.value
    if (!openTabs.value.includes(toolId)) {
      openTabs.value = [...openTabs.value, toolId]
    }
    activateAndNavigate(toolId, calcSlideDirection(prevActive, toolId), options)
  }

  /** 关闭工具 */
  function closeTool(toolId: string, options?: TabActionOptions) {
    const index = openTabs.value.indexOf(toolId)
    if (index === -1) return

    const isActive = activeTab.value === toolId
    openTabs.value = openTabs.value.filter(id => id !== toolId)

    if (!isActive) {
      // 关闭非激活标签，不切换
      slideDirection.value = ''
      if (options?.navigate !== false) navigateToActive()
      return
    }

    // 关闭的是当前激活标签，确定新标签及方向
    if (openTabs.value.length === 0) {
      activateAndNavigate('', '', options)
    } else {
      // 右侧邻居补位(原 index+1) → 从右进；否则最后一个(原 index-1) → 从左进
      const fallToRight = index < openTabs.value.length
      const newActive = fallToRight ? openTabs.value[index]! : openTabs.value.at(-1)!
      activateAndNavigate(newActive, fallToRight ? 'slide-left' : 'slide-right', options)
    }
  }

  /** 切换到指定标签 */
  function switchTab(toolId: string, options?: TabActionOptions) {
    if (!openTabs.value.includes(toolId)) return
    activateAndNavigate(toolId, calcSlideDirection(activeTab.value, toolId), options)
  }

  /** 关闭所有标签 */
  function closeAllTabs(options?: TabActionOptions) {
    openTabs.value = []
    activateAndNavigate('', '', options)
  }

  /** 关闭其他标签，保留指定标签 */
  function closeOtherTabs(toolId: string, options?: TabActionOptions) {
    if (!openTabs.value.includes(toolId)) return
    // 须在修改 openTabs 之前计算方向
    const direction = calcSlideDirection(activeTab.value, toolId)
    openTabs.value = [toolId]
    activateAndNavigate(toolId, direction, options)
  }

  /** 关闭左侧标签 */
  function closeLeftTabs(toolId: string, options?: TabActionOptions) {
    const index = openTabs.value.indexOf(toolId)
    if (index <= 0) return

    const prevActive = activeTab.value
    openTabs.value = openTabs.value.slice(index)

    if (openTabs.value.includes(prevActive)) {
      // 激活标签未被关闭，无需切换
      slideDirection.value = ''
      if (options?.navigate !== false) navigateToActive()
    } else {
      // 旧激活在左侧被关闭，新激活(toolId)在其右方 → 从右进
      activateAndNavigate(toolId, 'slide-left', options)
    }
  }

  /** 关闭右侧标签 */
  function closeRightTabs(toolId: string, options?: TabActionOptions) {
    const index = openTabs.value.indexOf(toolId)
    if (index === -1 || index >= openTabs.value.length - 1) return

    const prevActive = activeTab.value
    openTabs.value = openTabs.value.slice(0, index + 1)

    if (openTabs.value.includes(prevActive)) {
      // 激活标签未被关闭，无需切换
      slideDirection.value = ''
      if (options?.navigate !== false) navigateToActive()
    } else {
      // 旧激活在右侧被关闭，新激活(toolId)在其左方 → 从左进
      activateAndNavigate(toolId, 'slide-right', options)
    }
  }

  /** 检查工具是否已打开 */
  function isToolOpen(toolId: string): boolean {
    return openTabs.value.includes(toolId)
  }

  /** 检查工具是否为当前激活 */
  function isToolActive(toolId: string): boolean {
    return activeTab.value === toolId
  }

  return {
    openTabs: readonly(openTabs),
    activeTab: readonly(activeTab),
    slideDirection: readonly(slideDirection),
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
