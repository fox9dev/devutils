/**
 * 侧边栏状态管理 Composable
 * 使用 useState + Cookie 持久化
 * useState 保证 hydration 一致性（预渲染页面无 Cookie 上下文）
 * Cookie 负责跨请求持久化，SSR 时从请求读取、预渲染后在客户端补偿
 */

const STORAGE_KEY_COLLAPSED = 'devutils-sidebar-collapsed'
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60

export function useSidebar() {
  const cookie = useCookie<boolean>(STORAGE_KEY_COLLAPSED, {
    default: () => false,
    maxAge: COOKIE_MAX_AGE
  })

  // SSR: 从请求 Cookie 初始化；预渲染: 无 Cookie，取默认值 false
  // 客户端 hydration: 从 Nuxt payload 恢复，与服务端/预渲染一致
  const collapsed = useState('sidebar-collapsed', () => cookie.value ?? false)

  // 预渲染页面在客户端 hydration 后，从实际 Cookie 补偿真实状态
  // 阻塞脚本已通过 CSS 覆盖保证首帧视觉正确，此处同步 Vue 状态后移除覆盖
  if (import.meta.client) {
    onNuxtReady(() => {
      if (cookie.value !== collapsed.value) {
        collapsed.value = cookie.value ?? false
      }
      nextTick(() => {
        document.documentElement.classList.remove('sidebar-collapsed-init')
      })
    })
  }

  function syncCookie() {
    cookie.value = collapsed.value
  }

  function toggle() {
    collapsed.value = !collapsed.value
    syncCookie()
  }

  function expand() {
    collapsed.value = false
    syncCookie()
  }

  function collapse() {
    collapsed.value = true
    syncCookie()
  }

  return {
    collapsed: readonly(collapsed),
    toggle,
    expand,
    collapse
  }
}
