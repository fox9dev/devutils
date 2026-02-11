<script setup lang="ts">
/**
 * 顶部导航栏组件
 * 包含 Logo、导航菜单、主题切换、搜索、GitHub 链接
 */
import type { CommandPaletteGroup } from '@nuxt/ui'
import type { ToolMeta } from '~/types/tool'
import { useMagicKeys, whenever } from '@vueuse/core'

enum Theme {
  Light = 'light',
  Dark = 'dark'
}

const colorMode = useColorMode()

const route = useRoute()
const { searchTools } = useTools()
const { openTool } = useToolTabs()

// 搜索弹窗开关（用于图标点击与快捷键）
const searchOpen = ref(false)
// 搜索关键词（与 CommandPalette 双向绑定，用 searchTools 过滤，支持 keywords 检索但不展示）
const searchTerm = ref('')

// 用 searchTools 过滤（含 name/description/id/keywords），列表只展示 name、description、icon，不展示 keywords
const commandGroups = computed<CommandPaletteGroup[]>(() => [
  {
    id: 'tools',
    ignoreFilter: true, // 禁用内置 Fuse 过滤，由 searchTools 统一过滤
    items: searchTools(searchTerm.value).map((tool: ToolMeta) => ({
      id: tool.id,
      label: tool.name,
      suffix: tool.description,
      icon: tool.icon,
      onSelect() {
        searchOpen.value = false
        openTool(tool.id)
      }
    }))
  }
])

// 多平台快捷键：Mac 用 Cmd+K，Windows/Linux 用 Ctrl+K
const keys = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (
      (e.metaKey || e.ctrlKey)
      && e.key === 'k'
      && e.type === 'keydown'
    ) {
      e.preventDefault()
    }
  }
})
const metaK = keys['Meta+K']
const ctrlK = keys['Ctrl+K']
whenever(() => metaK?.value === true, () => {
  searchOpen.value = true
})
whenever(() => ctrlK?.value === true, () => {
  searchOpen.value = true
})

// 导航菜单项
const navItems = [
  { label: '工具', to: '/tools', icon: 'lucide:wrench' },
  { label: '工作区', to: '/workspace', icon: 'lucide:layout-dashboard' }
]

// 主题选项
const themeOptions = [
  { label: '浅色', value: Theme.Light, icon: 'lucide:sun' },
  { label: '深色', value: Theme.Dark, icon: 'lucide:moon' }
]

// 当前主题
const currentTheme = computed(() => themeOptions.find(t => t.value === colorMode.preference) || themeOptions[0])

// 切换主题
function changeTheme() {
  colorMode.preference = colorMode.preference === Theme.Light ? Theme.Dark : Theme.Light
}

// 检查是否当前路由
function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// 移动端菜单状态
const mobileMenuOpen = ref(false)
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-default"
    :class="mobileMenuOpen ? 'bg-default' : 'backdrop-blur-lg'"
  >
    <div class="container mx-auto flex h-16 items-center justify-between px-4 transition-all">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-lg font-semibold"
      >
        <UIcon
          name="lucide:terminal"
          class="size-6"
        />
        <span class="hidden sm:inline">DevUtils</span>
      </NuxtLink>

      <!-- 桌面端导航 -->
      <nav class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            isActive(item.to) ? 'text-primary-500 bg-primary-500/10' : 'text-muted hover:text-default hover:bg-elevated'
          ]"
        >
          <UIcon
            :name="item.icon"
            class="h-4 w-4"
          />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- 右侧操作区 -->
      <div class="flex items-center gap-2">
        <!-- 搜索：点击或 Cmd/Ctrl+K 打开 -->
        <UButton
          variant="ghost"
          size="lg"
          icon="lucide:search"
          aria-label="搜索工具"
          class="cursor-pointer"
          @click="searchOpen = true"
        />

        <!-- 主题切换 -->
        <UButton
          variant="ghost"
          size="lg"
          :icon="currentTheme!.icon"
          aria-label="切换主题"
          class="cursor-pointer"
          @click="changeTheme"
        />

        <!-- GitHub 链接 -->
        <UButton
          as="a"
          href="https://github.com/fox9dev/devutils"
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          size="lg"
          icon="simple-icons:github"
          aria-label="GitHub"
        />

        <!-- 移动端菜单按钮 -->
        <UButton
          variant="ghost"
          size="lg"
          :icon="mobileMenuOpen ? 'lucide:x' : 'lucide:menu'"
          class="md:hidden cursor-pointer"
          aria-label="打开菜单"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
      </div>
    </div>

    <!-- 移动端导航菜单 -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-b border-default bg-default px-4 py-3 absolute w-full"
      >
        <div class="flex flex-col gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
            :class="[
              isActive(item.to)
                ? 'text-primary-500 bg-primary-500/10'
                : 'text-muted hover:text-default hover:bg-elevated'
            ]"
            @click="mobileMenuOpen = false"
          >
            <UIcon
              :name="item.icon"
              class="h-4 w-4"
            />
            {{ item.label }}
          </NuxtLink>
        </div>
      </nav>
    </Transition>

    <!-- 搜索工具弹窗：UModal + UCommandPalette，支持 Cmd/Ctrl+K -->
    <UModal
      v-model:open="searchOpen"
      description="搜索工具"
      title="搜索工具"
      :ui="{ content: 'max-w-3xl p-0 overflow-hidden', body: 'p-0' }"
    >
      <template #content>
        <UCommandPalette
          v-model:open="searchOpen"
          v-model:search-term="searchTerm"
          :groups="commandGroups"
          placeholder="搜索工具..."
          icon="lucide:search"
          close
          class="h-[50vh] border-0 shadow-none"
        />
      </template>
    </UModal>
  </header>
</template>
