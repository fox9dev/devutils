<script setup lang="ts">
/**
 * URL 编解码工具
 * 支持 encodeURI / encodeURIComponent
 */
import { useClipboard } from '@vueuse/core'

// 工具元数据定义
definePageMeta({
  layout: 'workspace',
  tool: {
    id: 'url-codec',
    icon: 'lucide:link',
    name: 'URL 编解码',
    description: 'URL 编码与解码，支持 encodeURI 和 encodeURIComponent',
    keywords: ['url', 'encode', 'decode', 'uri', 'percent', '百分号编码']
  }
})

// 模式：编码 / 解码
const mode = ref<'encode' | 'decode'>('encode')

// 编码类型
const encodeType = ref<'uri' | 'component'>('component')

// 输入输出
const input = ref('')
const output = ref('')
const error = ref('')

// 自动处理
const autoProcess = ref(true)

// 历史记录
const { save: saveHistory } = useToolHistory('url-codec', {
  onRestore(record) {
    autoProcess.value = false
    mode.value = record.config.mode ?? 'encode'
    encodeType.value = record.config.encodeType ?? 'component'
    input.value = record.input
    output.value = record.output
    nextTick(() => { autoProcess.value = record.config.autoProcess ?? true })
  }
})

// 处理函数
function process() {
  if (!input.value) {
    output.value = ''
    error.value = ''
    return
  }

  error.value = ''

  try {
    if (mode.value === 'encode') {
      if (encodeType.value === 'uri') {
        output.value = encodeURI(input.value)
      } else {
        output.value = encodeURIComponent(input.value)
      }
    } else {
      if (encodeType.value === 'uri') {
        output.value = decodeURI(input.value)
      } else {
        output.value = decodeURIComponent(input.value)
      }
    }
    saveHistory(input.value, output.value, { mode: mode.value, encodeType: encodeType.value, autoProcess: autoProcess.value })
  } catch (e) {
    error.value = e instanceof Error ? e.message : '处理失败'
    output.value = ''
  }
}

// 监听变化（自动处理模式）
watch([input, mode, encodeType], () => {
  if (autoProcess.value) {
    process()
  }
}, { immediate: true })

// 切换模式时交换输入输出
function switchMode() {
  const newMode = mode.value === 'encode' ? 'decode' : 'encode'
  const temp = input.value
  input.value = output.value
  output.value = temp
  mode.value = newMode
  error.value = ''
}

// 清空
function clear() {
  input.value = ''
  output.value = ''
  error.value = ''
}

// 复制结果
const { copy, copied } = useClipboard()

function copyOutput() {
  if (output.value) {
    copy(output.value)
  }
}

// 示例
function loadExample() {
  if (mode.value === 'encode') {
    input.value = 'https://example.com/search?q=你好世界&lang=zh-CN'
  } else {
    input.value = 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3D%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C%26lang%3Dzh-CN'
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 h-full p-4">
    <!-- 操作栏 -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- 模式切换 -->
      <div class="inline-flex rounded-lg border border-[var(--ui-border)] p-0.5">
        <button
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="mode === 'encode' ? 'bg-primary-500 text-white' : 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]'"
          @click="mode = 'encode'"
        >
          编码
        </button>
        <button
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="mode === 'decode' ? 'bg-primary-500 text-white' : 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]'"
          @click="mode = 'decode'"
        >
          解码
        </button>
      </div>

      <!-- 编码类型 -->
      <div class="inline-flex rounded-lg border border-[var(--ui-border)] p-0.5">
        <button
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="encodeType === 'component' ? 'bg-[var(--ui-bg-elevated)] text-[var(--ui-text)]' : 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]'"
          @click="encodeType = 'component'"
        >
          URIComponent
        </button>
        <button
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="encodeType === 'uri' ? 'bg-[var(--ui-bg-elevated)] text-[var(--ui-text)]' : 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]'"
          @click="encodeType = 'uri'"
        >
          URI
        </button>
      </div>

      <UButton
        variant="outline"
        size="sm"
        icon="lucide:arrow-left-right"
        @click="switchMode"
      >
        交换
      </UButton>

      <div class="flex-1" />

      <label class="flex items-center gap-2 text-sm text-[var(--ui-text-muted)]">
        <UCheckbox v-model="autoProcess" />
        自动处理
      </label>

      <UButton
        v-if="!autoProcess"
        icon="lucide:play"
        @click="process"
      >
        执行
      </UButton>

      <UButton
        variant="ghost"
        size="sm"
        icon="lucide:file-code"
        @click="loadExample"
      >
        示例
      </UButton>
    </div>

    <!-- 说明 -->
    <div class="text-xs text-[var(--ui-text-muted)] bg-[var(--ui-bg-elevated)] px-3 py-2 rounded-lg">
      <span class="font-medium">URIComponent</span>：编码所有特殊字符（推荐用于查询参数）
      <span class="mx-2">|</span>
      <span class="font-medium">URI</span>：保留 URL 结构字符（://?#）
    </div>

    <!-- 主体区域 -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
      <!-- 输入区 -->
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-[var(--ui-text)]">
            {{ mode === 'encode' ? '原文' : '已编码' }}
          </label>
          <UButton
            variant="ghost"
            size="xs"
            icon="lucide:trash-2"
            @click="clear"
          >
            清空
          </UButton>
        </div>
        <UTextarea
          v-model="input"
          :placeholder="mode === 'encode' ? '输入要编码的 URL 或文本...' : '输入编码后的字符串...'"
          class="flex-1 font-mono text-sm"
          :rows="12"
          autoresize
        />
      </div>

      <!-- 输出区 -->
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-[var(--ui-text)]">
            {{ mode === 'encode' ? '已编码' : '原文' }}
          </label>
          <UButton
            variant="ghost"
            size="xs"
            :icon="copied ? 'lucide:check' : 'lucide:copy'"
            :disabled="!output"
            @click="copyOutput"
          >
            {{ copied ? '已复制' : '复制' }}
          </UButton>
        </div>
        <UTextarea
          v-model="output"
          readonly
          placeholder="结果将显示在这里..."
          class="flex-1 font-mono text-sm"
          :rows="12"
        />
      </div>
    </div>

    <!-- 错误提示 -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition-all duration-150"
      leave-to-class="opacity-0"
    >
      <div
        v-if="error"
        class="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm"
      >
        <UIcon name="lucide:alert-circle" class="w-4 h-4 flex-shrink-0" />
        <span>{{ error }}</span>
      </div>
    </Transition>
  </div>
</template>
