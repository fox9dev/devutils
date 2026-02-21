<script setup lang="ts">
/**
 * 工具侧边栏组件
 * 显示工具列表，支持搜索、按名称排序
 */

const { searchTools } = useTools()
const { collapsed, toggle } = useSidebar()
const { isToolActive, openTool } = useToolTabs()

const input = useTemplateRef('input')

defineShortcuts({
  '/': () => {
    if (collapsed.value) {
      toggle()
    }
    nextTick(() => {
      input.value?.inputRef?.focus()
    })
  }
})

// 搜索关键词
const searchQuery = ref('')

// 显示的工具列表：有搜索时用搜索结果并排序，否则用按名称排序的完整列表
const displayTools = computed(() => searchTools(searchQuery.value))
</script>

<template>
  <aside
    data-sidebar
    class="flex flex-col h-full box-content border-r border-default bg-default transition-[width] duration-300 ease-out"
    :class="collapsed ? 'w-13' : 'w-64'"
  >
    <!-- 顶部操作栏：统一结构，折叠时只显示居中折叠按钮 -->
    <div
      class="grid border-b border-default items-center transition-[grid-template-columns] duration-300 ease-out"
      :class="[
        collapsed ? 'grid-cols-1 gap-0 p-2' : 'grid-cols-[1fr_auto] gap-2 p-2'
      ]"
    >
      <div
        v-show="!collapsed"
        data-sidebar-search
        class="min-w-0 overflow-hidden"
      >
        <UInput
          ref="input"
          v-model="searchQuery"
          placeholder="搜索工具..."
          class="w-full"
          icon="lucide:search"
        >
          <template #trailing>
            <UKbd value="/" />
          </template>
        </UInput>
      </div>
      <div
        data-sidebar-toggle
        class="flex shrink-0 transition-[justify-content] duration-300 ease-out"
        :class="collapsed ? 'justify-center' : 'justify-end'"
      >
        <UButton
          class="text-muted hover:bg-elevated hover:text-default"
          variant="ghost"
          :icon="collapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'"
          :aria-label="collapsed ? '展开侧边栏' : '折叠侧边栏'"
          @click="toggle"
        />
      </div>
    </div>

    <!-- 工具列表：统一结构，仅文字做透明度过渡，图标始终保留 -->
    <div class="flex-1 overflow-y-auto min-h-0">
      <div class="flex flex-col p-2 gap-1">
        <UTooltip
          v-for="tool in displayTools"
          :key="tool.id"
          :text="tool.name"
          :content="{ side: 'right' }"
          :delay-duration="150"
        >
          <div
            class="p-2 flex items-center rounded-lg text-sm transition-[color,background-color] duration-300"
            role="button"
            tabindex="0"
            :class="[
              collapsed ? 'mx-0' : 'text-left min-w-0',
              isToolActive(tool.id)
                ? 'bg-primary-500 text-white'
                : 'text-muted hover:bg-elevated hover:text-default'
            ]"
            @click="openTool(tool.id)"
            @keydown.enter.stop="openTool(tool.id)"
          >
            <UIcon
              :name="tool.icon"
              class="w-5 h-5 shrink-0"
            />
            <span
              data-sidebar-label
              class="truncate min-w-0 overflow-hidden transition-[opacity,max-width,margin] duration-300 ease-out"
              :class="collapsed ? 'opacity-0 max-w-0 ml-0' : 'opacity-100 max-w-40 ml-2'"
            >
              {{ tool.name }}
            </span>
          </div>
        </UTooltip>

        <!-- 空状态（仅展开时显示） -->
        <div
          v-if="!collapsed && searchQuery && displayTools.length === 0"
          class="flex flex-col items-center justify-center gap-2 p-4 text-center"
        >
          <UIcon
            name="lucide:search-x"
            class="w-8 h-8 text-muted"
          />
          <p class="text-sm text-muted">
            没有找到匹配的工具
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>
