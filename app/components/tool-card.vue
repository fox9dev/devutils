<script setup lang="ts">
/**
 * 工具卡片组件
 * 用于展示工具信息，支持点击跳转
 */
import type { ToolMeta } from '~/types/tool'

const props = defineProps<{
  tool: ToolMeta
}>()

const { openTool } = useToolTabs()

// 点击卡片时打开工具
function handleClick() {
  openTool(props.tool.id)
}
</script>

<template>
  <div
    class="group relative flex flex-col gap-3 p-4 rounded-xl border border-default bg-default hover:bg-elevated hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-200"
    @click="handleClick"
  >
    <!-- 图标 -->
    <div class="flex items-start justify-between">
      <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-500/10 text-primary-500 group-hover:bg-primary-500/20 transition-colors">
        <UIcon
          :name="tool.icon"
          class="w-5 h-5"
        />
      </div>
    </div>

    <!-- 名称 -->
    <h3 class="text-base font-semibold text-default group-hover:text-primary-500 transition-colors">
      {{ tool.name }}
    </h3>

    <!-- 描述 -->
    <p class="text-sm text-muted line-clamp-2">
      {{ tool.description }}
    </p>
  </div>
</template>
