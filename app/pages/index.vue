<script setup lang="ts">
/**
 * 落地页
 * 展示网站介绍、功能特性、热门工具概览
 */

definePageMeta({
  layout: 'default'
})

// SEO 元信息
useSeoMeta({
  title: '开发者实用工具箱',
  description: '免费在线开发者工具箱，提供 JSON 格式化、Base64 编解码、URL 编解码、文本对比、时间戳转换等常用开发工具。所有数据本地处理，隐私安全，无需安装，离线可用。',
  keywords: 'DevUtils,开发者工具,在线工具箱,JSON格式化,Base64编解码,URL编解码,文本对比,时间戳转换,开发工具箱',
  ogTitle: 'DevUtils - 开发者实用工具箱',
  ogDescription: '免费在线开发者工具箱，提供 JSON 格式化、Base64 编解码、URL 编解码等常用开发工具。本地运行，隐私安全。',
  ogUrl: 'https://devutils.fox9.dev'
})

const { tools } = useTools()

// 热门工具：固定取工具列表前 6 个
const featuredTools = computed(() => tools.value.slice(0, 6))

// 核心特性
const features = [
  {
    icon: 'lucide:layout-grid',
    title: '工具聚合',
    description: '一站式工具箱，多款常用工具集中一处'
  },
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
    icon: 'lucide:code-2',
    title: '完全开源',
    description: '代码公开透明，可自由使用、修改与二次开发'
  }
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero 区域 -->
    <section class="relative overflow-hidden">
      <div class="container mx-auto px-4 py-20 md:py-32 relative">
        <div class="max-w-3xl mx-auto text-center">
          <!-- 标题 -->
          <h1 class="text-4xl md:text-6xl font-bold text-default mb-6">
            开发者
            <span class="text-transparent bg-clip-text bg-linear-to-r from-sky-500 to-teal-500 dark:from-sky-400 dark:to-teal-400">
              实用工具箱
            </span>
          </h1>

          <!-- 副标题 -->
          <p class="text-lg md:text-xl text-muted mb-8">
            一站式开发工具集合，JSON 格式化、Base64 编解码、URL 编解码、时间戳转换等常用工具。
            <br class="hidden md:block">
            本地运行，隐私安全，离线可用。
          </p>

          <!-- 隐私说明 -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300 text-sm mb-8 border border-sky-200/50 dark:border-sky-500/20">
            <UIcon
              name="lucide:shield-check"
              class="w-4 h-4"
            />
            <span>所有数据在本地处理，不会上传至服务器</span>
          </div>

          <!-- CTA 按钮 -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <UButton
              to="/workspace/"
              icon="lucide:rocket"
              class="px-8 bg-linear-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 border-0"
            >
              立即使用
            </UButton>
            <UButton
              to="/tools"
              variant="outline"
              icon="lucide:grid-3x3"
              class="border-sky-200 dark:border-sky-700 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30"
            >
              浏览所有工具
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- 特性展示 -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-center text-default mb-12">
          为什么选择 DevUtils？
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="flex flex-col items-center text-center p-6 rounded-2xl bg-white/70 dark:bg-zinc-800/50 border border-sky-100/60 dark:border-zinc-700/50 shadow-sm"
          >
            <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 dark:text-sky-400 mb-4">
              <UIcon
                :name="feature.icon"
                class="w-6 h-6"
              />
            </div>
            <h3 class="text-lg font-semibold text-default mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-muted">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门工具：固定为工具列表前 6 个 -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-default">
            热门工具
          </h2>
          <UButton
            to="/tools"
            variant="ghost"
            trailing-icon="lucide:arrow-right"
            class="text-sky-600 dark:text-sky-400"
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
  </div>
</template>
