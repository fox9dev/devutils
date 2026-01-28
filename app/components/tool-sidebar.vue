<script setup lang="ts">
import type { ToolCategory } from '~/types/tool'

const { t } = useI18n()
const { getFilteredTools, ToolCategoryInfo: categoryInfo } = useTools()

const collapsed = defineModel<boolean>('collapsed', { default: false })

const searchKeyword = ref('')
const sortBy = ref<'category' | 'name'>('category')

const route = useRoute()

// 当前选中的工具 ID
const currentToolId = computed(() => {
  const path = route.path
  if (path.startsWith('/tools/') && path !== '/tools/') {
    return path.replace('/tools/', '')
  }
  return null
})

// 过滤和排序后的工具
const filteredTools = computed(() => {
  return getFilteredTools({
    keyword: searchKeyword.value,
    sortBy: sortBy.value
  })
})

// 按分类分组的工具
const groupedTools = computed(() => {
  if (sortBy.value === 'name') {
    return null // 按名称排序时不分组
  }

  const groups = new Map<ToolCategory, typeof filteredTools.value>()
  for (const tool of filteredTools.value) {
    if (!groups.has(tool.category)) {
      groups.set(tool.category, [])
    }
    groups.get(tool.category)!.push(tool)
  }
  return groups
})

function toggleSort() {
  sortBy.value = sortBy.value === 'category' ? 'name' : 'category'
}
</script>

<template>
  <aside
    class="flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900"
    :class="collapsed ? 'w-14' : 'w-72'"
  >
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-gray-200 p-3 dark:border-gray-800">
      <template v-if="!collapsed">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('sidebar.toolList') }}</span>
      </template>
      <UButton
        :icon="collapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
        variant="ghost"
        size="xs"
        color="neutral"
        :class="collapsed ? 'mx-auto' : ''"
        @click="collapsed = !collapsed"
      />
    </div>

    <!-- Search & Sort -->
    <div
      v-if="!collapsed"
      class="space-y-2 border-b border-gray-200 p-3 dark:border-gray-800"
    >
      <UInput
        v-model="searchKeyword"
        :placeholder="t('sidebar.searchTools')"
        icon="i-lucide-search"
        size="sm"
        class="w-full"
      />
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500">
          {{ sortBy === 'category' ? t('sidebar.byCategory') : t('sidebar.byName') }}
        </span>
        <UButton
          :icon="sortBy === 'category' ? 'i-lucide-folder' : 'i-lucide-arrow-down-a-z'"
          variant="ghost"
          size="xs"
          color="neutral"
          @click="toggleSort"
        />
      </div>
    </div>

    <!-- Tool List -->
    <nav class="flex-1 overflow-y-auto p-2">
      <!-- Grouped by Category -->
      <template v-if="groupedTools && !collapsed">
        <div
          v-for="[category, tools] in groupedTools"
          :key="category"
          class="mb-4"
        >
          <div class="mb-2 flex items-center gap-1.5 px-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            <UIcon
              :name="categoryInfo[category].icon"
              class="size-3"
            />
            <span>{{ categoryInfo[category].label }}</span>
          </div>
          <div class="space-y-0.5">
            <NuxtLink
              v-for="tool in tools"
              :key="tool.id"
              :to="`/tools/${tool.id}`"
              class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
              :class="currentToolId === tool.id
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
            >
              <UIcon
                :name="tool.icon"
                class="size-4 shrink-0"
              />
              <span class="truncate">{{ tool.name }}</span>
            </NuxtLink>
          </div>
        </div>
      </template>

      <!-- Flat list (by name) -->
      <template v-else-if="!collapsed">
        <div class="space-y-0.5">
          <NuxtLink
            v-for="tool in filteredTools"
            :key="tool.id"
            :to="`/tools/${tool.id}`"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
            :class="currentToolId === tool.id
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
          >
            <UIcon
              :name="tool.icon"
              class="size-4 shrink-0"
            />
            <span class="truncate">{{ tool.name }}</span>
          </NuxtLink>
        </div>
      </template>

      <!-- Collapsed: Icon only -->
      <template v-else>
        <div class="space-y-1">
          <NuxtLink
            v-for="tool in filteredTools"
            :key="tool.id"
            :to="`/tools/${tool.id}`"
            class="flex items-center justify-center rounded-lg p-2 transition-colors"
            :class="currentToolId === tool.id
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
            :title="tool.name"
          >
            <UIcon
              :name="tool.icon"
              class="size-5"
            />
          </NuxtLink>
        </div>
      </template>

      <!-- Empty State -->
      <div
        v-if="filteredTools.length === 0 && !collapsed"
        class="flex flex-col items-center justify-center py-8 text-center"
      >
        <UIcon
          name="i-lucide-search-x"
          class="mb-2 size-8 text-gray-300 dark:text-gray-600"
        />
        <p class="text-sm text-gray-500">
          {{ t('sidebar.noToolsFound') }}
        </p>
      </div>
    </nav>
  </aside>
</template>
