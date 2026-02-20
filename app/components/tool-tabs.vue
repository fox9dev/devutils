<script setup lang="ts">
/**
 * 工具标签页组件
 * 显示已打开的工具标签，支持切换和关闭；右键菜单使用 Nuxt UI ContextMenu：关闭当前/其他/左侧/右侧/全部
 */

const { openTabs, activeTab, isToolActive, switchTab, closeTool, closeOtherTabs, closeLeftTabs, closeRightTabs, closeAllTabs } = useToolTabs()
const { getTool } = useTools()

const scrollContainerRef = ref<HTMLElement | null>(null)

// 激活的 tab 变化时，将其滚动到可视范围内
watch(activeTab, () => {
  nextTick(() => {
    const container = scrollContainerRef.value
    if (!container || !activeTab.value) return
    const tabEl = container.querySelector(`[data-tool-id="${activeTab.value}"]`) as HTMLElement | null
    tabEl?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
  })
}, { immediate: true })

const openTools = computed(() => openTabs.value.map(id => getTool(id)).filter(tool => !!tool))

function handleCloseTab(event: MouseEvent | KeyboardEvent, toolId: string) {
  event.stopPropagation()
  closeTool(toolId)
}

function canCloseLeft(toolId: string) {
  const index = openTabs.value.indexOf(toolId)
  return index > 0
}

function canCloseRight(toolId: string) {
  const index = openTabs.value.indexOf(toolId)
  return index >= 0 && index < openTabs.value.length - 1
}

function getContextItems(toolId: string) {
  return [
    [
      {
        label: '关闭当前',
        icon: 'i-lucide-x',
        onSelect() {
          closeTool(toolId)
        }
      },
      {
        label: '关闭其他',
        icon: 'i-lucide-panel-right-close',
        onSelect() {
          closeOtherTabs(toolId)
        }
      },
      {
        label: '关闭左侧',
        icon: 'i-lucide-chevrons-left',
        disabled: !canCloseLeft(toolId),
        onSelect() {
          closeLeftTabs(toolId)
        }
      },
      {
        label: '关闭右侧',
        icon: 'i-lucide-chevrons-right',
        disabled: !canCloseRight(toolId),
        onSelect() {
          closeRightTabs(toolId)
        }
      }
    ],
    [
      {
        label: '关闭所有',
        icon: 'i-lucide-trash-2',
        color: 'error' as const,
        onSelect() {
          closeAllTabs()
        }
      }
    ]
  ]
}
</script>

<template>
  <div
    ref="scrollContainerRef"
    class="flex items-center gap-2 w-full bg-default overflow-x-auto px-2 scroll-px-2"
  >
    <UContextMenu
      v-for="tool in openTools"
      :key="tool.id"
      :items="getContextItems(tool.id)"
      :ui="{ content: 'min-w-40' }"
    >
      <div
        :data-tool-id="tool.id"
        role="button"
        tabindex="0"
        class="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
        :class="[
          isToolActive(tool.id)
            ? 'bg-primary-500/10 text-primary-500'
            : 'bg-elevated/60 text-default hover:bg-elevated'
        ]"
        @click="switchTab(tool.id)"
        @keydown.enter="switchTab(tool.id)"
      >
        <UIcon
          :name="tool.icon"
          class="w-4 h-4 shrink-0"
        />
        <span>{{ tool.name || tool.id }}</span>
        <span
          role="button"
          tabindex="0"
          class="flex items-center justify-center w-4 h-4 rounded opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 hover:bg-elevated transition-opacity"
          :class="isToolActive(tool.id) ? 'hover:bg-primary-500/20' : ''"
          @click="handleCloseTab($event, tool.id)"
          @keydown.enter.stop="handleCloseTab($event, tool.id)"
        >
          <UIcon
            name="lucide:x"
            class="w-3 h-3"
          />
        </span>
      </div>
    </UContextMenu>
  </div>
</template>
