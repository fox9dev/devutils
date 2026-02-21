<script setup lang="ts">
/**
 * Nuxt UI 风格 Alert 组件
 * 布局参考 Ant Design Alert，默认为主题色，支持 color 配置
 */

export type AlertColor = 'primary' | 'success' | 'info' | 'warning' | 'error'

const colorConfig: Record<
  AlertColor,
  { bg: string, border: string, text: string }
> = {
  primary: {
    bg: 'bg-primary-500/10',
    border: 'border-primary-500/40',
    text: 'text-primary-500'
  },
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/40',
    text: 'text-green-500'
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/40',
    text: 'text-blue-500'
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/40',
    text: 'text-amber-600 dark:text-amber-400'
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/40',
    text: 'text-red-500'
  }
}

const iconMap: Record<AlertColor, string> = {
  primary: 'lucide:lightbulb',
  success: 'lucide:circle-check',
  info: 'lucide:info',
  warning: 'lucide:triangle-alert',
  error: 'lucide:circle-alert'
}

const props = withDefaults(
  defineProps<{
    /** 主文案 */
    title?: string
    /** 辅助说明文字 */
    description?: string
    /** 颜色类型，默认 primary（主题色） */
    color?: AlertColor
    /** 是否显示图标 */
    showIcon?: boolean
  }>(),
  {
    title: '',
    description: '',
    color: 'primary',
    showIcon: true
  }
)

const styles = computed(() => colorConfig[props.color])
const iconName = computed(() => iconMap[props.color])
</script>

<template>
  <div
    class="flex gap-3 rounded-lg border p-3 text-sm"
    :class="[
      styles.bg,
      styles.border
    ]"
  >
    <div
      v-if="showIcon"
      class="shrink-0 flex"
      :class="styles.text"
    >
      <UIcon
        :name="iconName"
        class="size-5"
        aria-hidden
      />
    </div>

    <div class="min-w-0 flex-1">
      <div
        class="font-medium flex items-center"
        :class="styles.text"
      >
        <slot name="default">
          {{ title }}
        </slot>
      </div>
      <div
        v-if="description || $slots.description"
        class="text-sm opacity-90 mt-2"
        :class="styles.text"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </div>
    </div>
  </div>
</template>
