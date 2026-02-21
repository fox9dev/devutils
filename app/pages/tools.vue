<script setup lang="ts">
/**
 * 工具列表页
 * 展示所有工具，支持搜索
 */
definePageMeta({ layout: 'default' })

// SEO 元信息
useSeoMeta({
  title: '所有开发工具',
  description: '浏览 DevUtils 全部开发者工具：JSON 格式化、Base64 编解码、URL 编解码、文本对比、时间戳转换等，支持搜索筛选，免费在线使用。',
  keywords: '开发工具列表,在线工具,JSON格式化,Base64,URL编解码,文本对比,时间戳转换',
  ogTitle: 'DevUtils - 所有开发工具',
  ogDescription: '浏览 DevUtils 全部开发者工具，支持搜索筛选，免费在线使用。',
  ogUrl: 'https://devutils.fox9.dev/tools'
})

const { searchTools } = useTools()

const input = useTemplateRef('input')

defineShortcuts({
  '/': () => {
    input.value?.inputRef?.focus()
  }
})

// 搜索关键词
const searchQuery = ref('')

// 过滤后的工具：有搜索时按关键词过滤并排序，否则显示全部（按名称排序）
const filteredTools = computed(() => searchTools(searchQuery.value))

function clearSearch() {
  searchQuery.value = ''
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 transition-all">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-default mb-2">
        所有工具
      </h1>
      <p class="text-muted">
        共 {{ filteredTools.length }} 个工具，选择一个开始使用
      </p>
    </div>

    <!-- 搜索 -->
    <div class="flex flex-col sm:flex-row gap-4 mb-8">
      <UInput
        ref="input"
        v-model="searchQuery"
        placeholder="搜索工具..."
        icon="lucide:search"
        class="flex-1"
        size="xl"
      >
        <template #trailing>
          <UKbd value="/" />
        </template>
      </UInput>
    </div>

    <!-- 工具列表 -->
    <div
      v-if="filteredTools.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <ToolCard
        v-for="tool in filteredTools"
        :key="tool.id"
        :tool="tool"
      />
    </div>

    <!-- 空状态 -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <div class="flex items-center justify-center w-16 h-16 rounded-2xl bg-elevated mb-4">
        <UIcon
          name="lucide:search-x"
          class="w-8 h-8 text-muted"
        />
      </div>
      <h3 class="text-lg font-semibold text-default mb-2">
        没有找到匹配的工具
      </h3>
      <p class="text-sm text-muted mb-4">
        尝试使用其他关键词或清空搜索
      </p>
      <UButton
        variant="outline"
        @click="clearSearch"
      >
        清空搜索
      </UButton>
    </div>
  </div>
</template>
