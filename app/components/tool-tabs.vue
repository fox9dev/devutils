<script setup lang="ts">
const { tabs, activeTabKey, closeTab, activateTab } = useToolTabs()
const { getToolById } = useTools()

const router = useRouter()
const route = useRoute()

// 同步路由与标签页状态
watch(() => route.path, (path) => {
  if (path.startsWith('/tools/') && path !== '/tools/') {
    const toolId = path.replace('/tools/', '')
    const tool = getToolById(toolId)
    if (tool) {
      // 检查是否已有该工具的标签页
      const existingTab = tabs.value.find(t => t.toolId === toolId)
      if (!existingTab) {
        // 创建新标签页
        tabs.value.push({
          toolId,
          key: `${toolId}-${Date.now()}`,
          title: tool.name
        })
      }
      // 激活对应标签页
      const tab = tabs.value.find(t => t.toolId === toolId)
      if (tab) {
        activeTabKey.value = tab.key
      }
    }
  }
}, { immediate: true })

function handleCloseTab(event: MouseEvent, key: string) {
  event.preventDefault()
  event.stopPropagation()

  const tabIndex = tabs.value.findIndex(t => t.key === key)

  closeTab(key)

  // 如果关闭的是当前激活的标签页，导航到其他标签页
  if (tabs.value.length > 0 && activeTabKey.value !== key) {
    // 已经有其他激活的标签页
  } else if (tabs.value.length > 0) {
    // 激活相邻标签页并导航
    const newIndex = Math.min(tabIndex, tabs.value.length - 1)
    const newTab = tabs.value[newIndex]
    if (newTab) {
      activeTabKey.value = newTab.key
      router.push(`/tools/${newTab.toolId}`)
    }
  } else {
    // 没有标签页了，返回工具首页
    router.push('/tools')
  }
}

function handleTabClick(tab: typeof tabs.value[0]) {
  activateTab(tab.key)
  router.push(`/tools/${tab.toolId}`)
}
</script>

<template>
  <div
    v-if="tabs.length > 0"
    class="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="flex flex-1 items-center gap-1 overflow-x-auto py-1">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        class="group flex shrink-0 cursor-pointer items-center gap-2 rounded-t-lg border border-b-0 px-3 py-1.5 text-sm transition-colors"
        :class="activeTabKey === tab.key
          ? 'border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
          : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'"
        @click="handleTabClick(tab)"
      >
        <UIcon
          v-if="getToolById(tab.toolId)?.icon"
          :name="getToolById(tab.toolId)?.icon ?? ''"
          class="size-4"
        />
        <span class="max-w-32 truncate">{{ tab.title }}</span>
        <button
          class="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-gray-200 group-hover:opacity-100 dark:hover:bg-gray-700"
          :class="activeTabKey === tab.key ? 'opacity-100' : ''"
          @click="handleCloseTab($event, tab.key)"
        >
          <UIcon
            name="i-lucide-x"
            class="size-3"
          />
        </button>
      </div>
    </div>
  </div>
</template>
