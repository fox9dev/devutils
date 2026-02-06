<script setup lang="ts">
import type { ToolMeta } from '~/types/tool'
/**
 * 工作区布局
 * 用于工具详情页，左侧工具栏 + 右侧工作区
 */

const route = useRoute()
const { openTool, openTabs } = useToolTabs()

// 从路由路径中获取工具 ID
// 优先从路由路径参数获取，如果没有则从 meta 获取
const toolId = computed(() => {
  const toolMeta = route.meta.tool as ToolMeta | undefined
  if (toolMeta) {
    return toolMeta.id
  }
  return null
})

// 当路由变化时，自动打开工具
watch(toolId, (id) => {
  if (id) {
    openTool(id)
  }
}, { immediate: true })
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-default">
    <AppHeader />
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧工具列表 -->
      <ToolSidebar />

      <!-- 右侧工作区 -->
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <!-- 标签页：进入/离开带过渡，避免突兀出现和关闭最后 tab 时头部抖动 -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out overflow-hidden"
          enter-from-class="opacity-0 -translate-y-1 max-h-0"
          enter-to-class="opacity-100 translate-y-0 max-h-28"
          leave-active-class="transition-all duration-150 ease-in overflow-hidden"
          leave-from-class="opacity-100 translate-y-0 max-h-28"
          leave-to-class="opacity-0 -translate-y-1 max-h-0"
        >
          <ToolTabs v-if="openTabs.length" />
        </Transition>

        <!-- 工具内容：响应式左右留白 + 大屏最大宽度，切换时淡入 -->
        <div class="flex-1 overflow-auto min-h-0">
          <div
            class="workspace-content min-h-full w-full mx-auto
              px-4 sm:px-6 md:px-8 lg:px-10
              xl:max-w-[1400px] xl:px-12
              2xl:max-w-[1600px] 2xl:px-16"
          >
            <Transition
              mode="out-in"
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <div :key="toolId ?? 'empty'" class="contents">
                <keep-alive>
                  <slot />
                </keep-alive>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
