/**
 * 侧边栏状态管理 Composable
 * 支持折叠状态的持久化
 */
import { useLocalStorage } from '@vueuse/core'

const STORAGE_KEY_COLLAPSED = 'devutils-sidebar-collapsed'

const collapsed = useLocalStorage(STORAGE_KEY_COLLAPSED, false)

export function useSidebar() {
  function toggle() {
    collapsed.value = !collapsed.value
  }

  function expand() {
    collapsed.value = false
  }

  function collapse() {
    collapsed.value = true
  }

  return {
    collapsed: readonly(collapsed),
    toggle,
    expand,
    collapse
  }
}
