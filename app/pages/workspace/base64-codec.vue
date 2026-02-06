<script setup lang="ts">
/**
 * Base64 编解码工具
 * 支持文本的 Base64 编码和解码
 */
import { useClipboard } from '@vueuse/core'

// 工具元数据定义
definePageMeta({
  layout: 'workspace',
  tool: {
    id: 'base64-codec',
    icon: 'lucide:file-key',
    name: 'Base64 编解码',
    description: '文本与 Base64 互相转换，支持 Unicode',
    keywords: ['base64', 'encode', 'decode', '编码', '解码', '加密']
  }
})

// 模式：编码 / 解码
const mode = ref<'encode' | 'decode'>('encode')

// 输入输出
const input = ref('')
const output = ref('')
const error = ref('')

// 自动处理
const autoProcess = ref(true)

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
      // 编码：支持 Unicode
      output.value = btoa(unescape(encodeURIComponent(input.value)))
    } else {
      // 解码：支持 Unicode
      output.value = decodeURIComponent(escape(atob(input.value)))
    }
  } catch (e) {
    error.value = mode.value === 'encode' ? '编码失败' : '解码失败，请检查输入是否为有效的 Base64 字符串'
    output.value = ''
  }
}

// 监听输入变化（自动处理模式）
watch([input, mode], () => {
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
    input.value = 'Hello, DevUtils! 你好，开发工具！'
  } else {
    input.value = 'SGVsbG8sIERldlV0aWxzISDkvaDlpb3vvIzlvIDlj5Hlt6XlhbfvvIE='
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

    <!-- 主体区域 -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
      <!-- 输入区 -->
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-[var(--ui-text)]">
            {{ mode === 'encode' ? '原文' : 'Base64' }}
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
          :placeholder="mode === 'encode' ? '输入要编码的文本...' : '输入 Base64 字符串...'"
          class="flex-1 font-mono text-sm"
          :rows="15"
          autoresize
        />
      </div>

      <!-- 输出区 -->
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-[var(--ui-text)]">
            {{ mode === 'encode' ? 'Base64' : '原文' }}
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
          :rows="15"
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
