<script setup lang="ts">
/**
 * 工具工作区首页
 * 路径: /workspace/
 * 当没有选择具体工具时显示此页面
 */

definePageMeta({
  layout: 'workspace'
})

// SEO 元信息
useSeoMeta({
  title: '工作区',
  description: 'DevUtils 工作区，从左侧工具栏选择工具开始使用。支持 JSON 格式化、Base64 编解码、URL 编解码、文本对比、时间戳转换。',
  ogTitle: 'DevUtils - 工作区',
  ogDescription: 'DevUtils 工作区，多款开发工具集中一处，即开即用。',
  ogUrl: 'https://devutils.fox9.dev/workspace/'
})
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center gap-4 text-center">
    <div class="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500/10">
      <UIcon
        name="lucide:layout-dashboard"
        class="w-8 h-8 text-primary-500"
      />
    </div>
    <div>
      <h3 class="text-lg font-semibold text-default">
        欢迎使用 DevUtils
      </h3>
      <div class="text-muted mt-1 flex items-center">
        <UIcon
          name="lucide:mouse-pointer-click"
          class="w-4 h-4 mr-2"
        />
        <span>从左侧选择一个工具开始使用</span>
      </div>
    </div>
    <div class="flex items-center gap-2 text-xs text-muted">
      <UIcon
        name="lucide:shield-check"
        class="w-4 h-4 text-green-500"
      />
      <span>所有数据在本地处理，隐私安全</span>
    </div>
  </div>
</template>
