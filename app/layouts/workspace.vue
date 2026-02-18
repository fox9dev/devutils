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

useToolHistoryProvider()
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-default">
    <AppHeader />
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧工具列表 -->
      <ToolSidebar />

      <!-- 右侧工作区 -->
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <!-- 标签页：用过渡避免关闭最后/全部时布局瞬间跳动 -->
        <Transition name="tabs-bar">
          <div
            v-if="openTabs.length"
            class="shrink-0 overflow-hidden"
          >
            <ToolTabs class="flex-1 min-w-0" />
            <ToolHistory class="flex-1 min-w-0" />
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
  </div>
</template>

<style scoped>
/* 进入：打开第一个 tab 时 */
.tabs-bar-enter-active {
  transition: max-height 0.2s ease-out, opacity 0.15s ease-out;
}

.tabs-bar-enter-from {
  max-height: 0;
  opacity: 0;
}

.tabs-bar-enter-to {
  max-height: 80px;
  opacity: 1;
}

/* 离开：关闭最后一个/全部 tab 时 */
.tabs-bar-leave-active {
  transition: max-height 0.2s ease-out, opacity 0.15s ease-out;
}

.tabs-bar-leave-from {
  max-height: 80px;
  opacity: 1;
}

.tabs-bar-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
