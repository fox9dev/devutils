<script setup lang="ts">
import { ToolCategoryInfo } from '~/types/tool'
import type { Tool, ToolCategory } from '~/types/tool'

definePageMeta({
  layout: 'default'
})

const { getFilteredTools, getAllCategories } = useTools()

const searchKeyword = ref('')
const selectedCategory = ref<ToolCategory | null>(null)

// 获取所有分类
const categories = computed(() => getAllCategories())

// 过滤后的工具
const filteredTools = computed(() => {
  return getFilteredTools({
    keyword: searchKeyword.value,
    category: selectedCategory.value,
    sortBy: 'category'
  })
})

// 按分类分组的工具
const groupedTools = computed(() => {
  const groups = new Map<ToolCategory, Tool[]>()
  for (const tool of filteredTools.value) {
    if (!groups.has(tool.category)) {
      groups.set(tool.category, [])
    }
    groups.get(tool.category)!.push(tool)
  }
  return groups
})

// 清除搜索
function clearSearch() {
  searchKeyword.value = ''
  selectedCategory.value = null
}

useSeoMeta({
  title: '全部工具 - DevUtils',
  description: '浏览所有开发工具，包括 JSON 格式化、编码转换、文本处理等实用工具。'
})
</script>

<template>
  <div class="h-full overflow-y-auto bg-gray-50 dark:bg-gray-950">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8 text-center">
        <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          全部工具
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          发现并使用各种开发者工具，提升您的工作效率
        </p>
      </div>

      <!-- Search & Filter Section -->
      <div class="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <!-- Search Input -->
        <div class="mb-4">
          <UInput
            v-model="searchKeyword"
            placeholder="搜索工具名称、描述或关键词..."
            icon="i-lucide-search"
            size="lg"
            class="w-full"
            :ui="{ base: 'text-base' }"
          >
            <template
              v-if="searchKeyword"
              #trailing
            >
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                size="xs"
                color="neutral"
                @click="searchKeyword = ''"
              />
            </template>
          </UInput>
        </div>

        <!-- Category Filter -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">分类筛选：</span>
          <UButton
            :color="selectedCategory === null ? 'primary' : 'neutral'"
            :variant="selectedCategory === null ? 'solid' : 'outline'"
            size="sm"
            @click="selectedCategory = null"
          >
            全部
          </UButton>
          <UButton
            v-for="category in categories"
            :key="category"
            :color="selectedCategory === category ? 'primary' : 'neutral'"
            :variant="selectedCategory === category ? 'solid' : 'outline'"
            size="sm"
            :icon="ToolCategoryInfo[category].icon"
            @click="selectedCategory = category"
          >
            {{ ToolCategoryInfo[category].label }}
          </UButton>
        </div>
      </div>

      <!-- Tools Count -->
      <div class="mb-4 flex items-center justify-between">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          找到 <span class="font-medium text-gray-900 dark:text-white">{{ filteredTools.length }}</span> 个工具
        </p>
        <UButton
          v-if="searchKeyword || selectedCategory"
          variant="ghost"
          size="sm"
          icon="i-lucide-rotate-ccw"
          @click="clearSearch"
        >
          清除筛选
        </UButton>
      </div>

      <!-- Tools List Grouped by Category -->
      <div
        v-if="groupedTools.size > 0"
        class="space-y-8"
      >
        <div
          v-for="[category, tools] in groupedTools"
          :key="category"
        >
          <!-- Category Header -->
          <div class="mb-4 flex items-center gap-2">
            <div class="flex size-8 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-950">
              <UIcon
                :name="ToolCategoryInfo[category].icon"
                class="size-4 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ ToolCategoryInfo[category].label }}
            </h2>
            <span class="text-sm text-gray-500 dark:text-gray-400">({{ tools.length }})</span>
          </div>

          <!-- Tools Grid -->
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NuxtLink
              v-for="tool in tools"
              :key="tool.id"
              :to="`/tools/${tool.id}`"
              class="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-700"
            >
              <!-- Tool Icon -->
              <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 transition-colors group-hover:bg-primary-100 dark:bg-gray-800 dark:group-hover:bg-primary-950">
                <UIcon
                  :name="tool.icon"
                  class="size-6 text-gray-600 transition-colors group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400"
                />
              </div>

              <!-- Tool Info -->
              <div class="min-w-0 flex-1">
                <h3 class="mb-1 font-medium text-gray-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                  {{ tool.name }}
                </h3>
                <p class="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                  {{ tool.description }}
                </p>
              </div>

              <!-- Arrow Icon -->
              <UIcon
                name="i-lucide-chevron-right"
                class="mt-1 size-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-primary-600 dark:text-gray-600 dark:group-hover:text-primary-400"
              />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <div class="mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <UIcon
            name="i-lucide-search-x"
            class="size-8 text-gray-400 dark:text-gray-600"
          />
        </div>
        <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">
          未找到匹配的工具
        </h3>
        <p class="mb-4 text-gray-500 dark:text-gray-400">
          尝试使用其他关键词或清除筛选条件
        </p>
        <UButton
          variant="soft"
          @click="clearSearch"
        >
          清除筛选条件
        </UButton>
      </div>
    </div>
  </div>
</template>
