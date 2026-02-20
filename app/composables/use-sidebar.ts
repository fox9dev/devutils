/**
 * 侧边栏状态管理 Composable
 * 使用 Cookie 持久化，确保 SSR 时服务端与客户端状态一致，无闪烁
 */

const STORAGE_KEY_COLLAPSED = 'devutils-sidebar-collapsed'
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60

export function useSidebar() {
  const collapsed = useCookie(STORAGE_KEY_COLLAPSED, {
    default: () => false,
    maxAge: COOKIE_MAX_AGE
  })

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
