<script setup lang="ts">
/**
 * 落地页
 * 展示网站介绍、功能特性、工具概览、下载入口
 */

definePageMeta({
  layout: 'default'
})

const { tools } = useTools()
const { openTool } = useToolTabs()

// 展示的热门工具（前6个）
const featuredTools = computed(() => tools.value.slice(0, 6))

// 核心特性
const features = [
  {
    icon: 'lucide:zap',
    title: '即开即用',
    description: '无需安装，打开即可使用所有开发工具'
  },
  {
    icon: 'lucide:shield-check',
    title: '隐私安全',
    description: '所有数据在本地处理，不会上传至服务器'
  },
  {
    icon: 'lucide:wifi-off',
    title: '离线可用',
    description: '无需网络连接，随时随地高效工作'
  },
  {
    icon: 'lucide:rocket',
    title: '高性能',
    description: '原生 JavaScript 实现，快速响应'
  }
]

// 下载入口
const downloads = [
  { icon: 'simple-icons:apple', label: 'macOS', href: '#', disabled: true },
  { icon: 'simple-icons:windows', label: 'Windows', href: '#', disabled: true },
  { icon: 'simple-icons:linux', label: 'Linux', href: '#', disabled: true }
]

// 跳转到工具
function goToTool(toolId: string) {
  openTool(toolId)
}
</script>

<template>
  <div>
    <!-- Hero 区域 -->
    <section class="relative overflow-hidden">
      <!-- 背景渐变 -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-green-500/10" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent" />

      <div class="container mx-auto px-4 py-20 md:py-32 relative">
        <div class="max-w-3xl mx-auto text-center">
          <!-- 标题 -->
          <h1 class="text-4xl md:text-6xl font-bold text-[var(--ui-text)] mb-6">
            开发者
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-green-500">
              实用工具箱
            </span>
          </h1>

          <!-- 副标题 -->
          <p class="text-lg md:text-xl text-[var(--ui-text-muted)] mb-8">
            一站式开发工具集合，JSON 格式化、Base64 编解码、URL 编解码、时间戳转换等常用工具。
            <br class="hidden md:block">
            本地运行，隐私安全，离线可用。
          </p>

          <!-- 隐私说明 -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm mb-8">
            <UIcon
              name="lucide:shield-check"
              class="w-4 h-4"
            />
            <span>所有数据在本地处理，不会上传至服务器</span>
          </div>

          <!-- CTA 按钮 -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <UButton
              to="/workspace"
              size="lg"
              icon="lucide:rocket"
              class="px-8"
            >
              立即使用
            </UButton>
            <UButton
              to="/tools"
              size="lg"
              variant="outline"
              icon="lucide:grid-3x3"
            >
              浏览所有工具
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- 特性展示 -->
    <section class="py-16 md:py-24 bg-[var(--ui-bg-elevated)]">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-center text-[var(--ui-text)] mb-12">
          为什么选择 DevUtils？
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="flex flex-col items-center text-center p-6 rounded-2xl bg-[var(--ui-bg)] border border-[var(--ui-border)]"
          >
            <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 text-primary-500 mb-4">
              <UIcon
                :name="feature.icon"
                class="w-6 h-6"
              />
            </div>
            <h3 class="text-lg font-semibold text-[var(--ui-text)] mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-[var(--ui-text-muted)]">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 工具概览 -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-[var(--ui-text)]">
            热门工具
          </h2>
          <UButton
            to="/tools"
            variant="ghost"
            trailing-icon="lucide:arrow-right"
          >
            查看全部
          </UButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ToolCard
            v-for="tool in featuredTools"
            :key="tool.id"
            :tool="tool"
          />
        </div>
      </div>
    </section>

    <!-- 下载入口 -->
    <section class="py-16 md:py-24 bg-[var(--ui-bg-elevated)]">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-[var(--ui-text)] mb-4">
            桌面应用即将推出
          </h2>
          <p class="text-[var(--ui-text-muted)] mb-8">
            更强大的离线体验，更多本地功能，敬请期待
          </p>

          <div class="flex flex-wrap items-center justify-center gap-4">
            <UButton
              v-for="download in downloads"
              :key="download.label"
              :href="download.href"
              variant="outline"
              size="lg"
              :icon="download.icon"
              :disabled="download.disabled"
            >
              {{ download.label }}
              <span
                v-if="download.disabled"
                class="text-xs opacity-60 ml-1"
              >(敬请期待)</span>
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
