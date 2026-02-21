<script setup lang="ts" generic="T">
import { useResizeObserver } from '@vueuse/core'

/**
 * 分段控制器组件
 * 用于在多个互斥选项中进行切换，带有滑动动画
 * size 与 Nuxt UI Button 一致：xs | sm | md | lg | xl
 */

type SegmentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizeMap: Record<SegmentSize, { wrapper: string, indicator: string, button: string }> = {
  xs: {
    wrapper: 'px-0.5 py-1',
    indicator: 'top-0.5 bottom-0.5',
    button: 'px-2 py-0 text-xs'
  },
  sm: {
    wrapper: 'px-1 py-1.5',
    indicator: 'top-0.5 bottom-0.5',
    button: 'px-2.5 py-0 text-xs'
  },
  md: {
    wrapper: 'px-1 py-1.5',
    indicator: 'top-0.5 bottom-0.5',
    button: 'px-2.5 py-0 text-sm'
  },
  lg: {
    wrapper: 'px-1.5 py-2',
    indicator: 'top-1 bottom-1',
    button: 'px-3 py-0 text-sm'
  },
  xl: {
    wrapper: 'px-1.5 py-2',
    indicator: 'top-1 bottom-1',
    button: 'px-3 py-0 text-base'
  }
}

const props = withDefaults(
  defineProps<{
    /** 绑定值 */
    modelValue: T
    /** 选项列表 */
    options: { label: string, value: T }[]
    /** 尺寸，与 Nuxt UI 一致 */
    size?: SegmentSize
  }>(),
  { size: 'lg' }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void
}>()

const sizeClasses = computed(() => sizeMap[props.size])

// 引用项
const itemRefs = ref<HTMLElement[]>([])
const rootRef = ref<HTMLElement>()
const activeIndex = computed(() => props.options.findIndex(opt => opt.value === props.modelValue))

// 滑动块样式
const indicatorStyle = ref<Record<string, string>>({})

function updateIndicator() {
  const index = activeIndex.value
  if (index === -1 || !itemRefs.value[index]) {
    indicatorStyle.value = { opacity: '0' }
    return
  }

  const el = itemRefs.value[index]
  // 考虑到父容器可能有 padding，我们直接用 offsetLeft 因为 indicator 是 absolute left-0
  indicatorStyle.value = {
    opacity: '1',
    transform: `translateX(${el.offsetLeft}px)`,
    width: `${el.offsetWidth}px`
  }
}

watch(() => props.modelValue, () => {
  nextTick(updateIndicator)
})

onMounted(async () => {
  await nextTick() // 确保 DOM 渲染完成
  updateIndicator()
  // 使用 useResizeObserver 监听容器尺寸变化
  useResizeObserver(rootRef, () => {
    updateIndicator()
  })
})
</script>

<template>
  <div
    ref="rootRef"
    class="relative inline-flex bg-elevated rounded-lg ring-1 ring-inset ring-default"
    :class="sizeClasses.wrapper"
  >
    <!-- 滑动背景块 -->
    <div
      class="absolute left-0 bg-primary-500 rounded-md transition-all duration-300 ease-in-out pointer-events-none shadow-sm"
      :class="sizeClasses.indicator"
      :style="indicatorStyle"
    />

    <!-- 选项按钮 -->
    <button
      v-for="(option, index) in options"
      :key="index"
      ref="itemRefs"
      type="button"
      class="relative z-10 font-medium rounded-md transition-colors duration-200 focus:outline-none"
      :class="[sizeClasses.button, modelValue === option.value ? 'text-white' : 'text-muted hover:text-default']"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
