<script setup lang="ts">
import type { ToolMeta } from '~/types/tool'

/**
 * 工作区布局
 * 用于工具详情页，左侧工具栏 + 右侧工作区
 */
const route = useRoute()
const { openTabs, openTool } = useToolTabs()

onMounted(() => {
  const tool = route.meta?.tool as ToolMeta | undefined
  if (tool && tool.id) {
    openTool(tool.id, { navigate: false })
  }
})
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-default">
    <AppHeader />
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧工具列表 -->
      <ToolSidebar />

      <!-- 右侧工作区 -->
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <!-- 标签页：固定高度 + height 过渡，避免关闭最后标签时内容先塌陷再过渡导致两次跳动 -->
        <Transition name="tabs-bar">
          <div
            v-if="openTabs.length"
            class="h-13 shrink-0 overflow-hidden flex items-center border-b border-default"
          >
            <ToolTabs />
          </div>
        </Transition>

        <!-- 工具内容：响应式左右留白 + 大屏最大宽度；out-in 使页面切换时先离开再进入 -->
        <div class="flex-1 overflow-auto min-h-0">
          <div class="workspace-content h-full w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:max-w-350 xl:px-12 2xl:max-w-400 2xl:px-16">
            <slot />
          </div>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.tabs-bar-enter-active,
.tabs-bar-leave-active {
  transition: height 0.25s ease, opacity 0.2s ease;
  overflow: hidden;
}

.tabs-bar-enter-from,
.tabs-bar-leave-to {
  height: 0;
  opacity: 0;
}
</style>
