<script setup lang="ts">
/**
 * JSON 格式化工具
 * 支持格式化、压缩、验证 JSON 数据
 */
import { useClipboard } from '@vueuse/core'

// 工具元数据定义
definePageMeta({
  layout: 'workspace',
  tool: {
    id: 'json-formatter',
    icon: 'lucide:braces',
    name: 'JSON 格式化',
    description: '格式化、压缩、验证 JSON 数据，支持自定义缩进',
    keywords: ['json', 'format', '格式化', '压缩', 'minify', 'beautify', '美化']
  }
})

// 输入输出
const input = ref('')
const output = ref('')
const error = ref('')
const isProcessing = ref(false)

// 配置选项
const indentSize = ref(2)
const indentOptions = [
  { label: '2 空格', value: 2 },
  { label: '4 空格', value: 4 },
  { label: 'Tab', value: '\t' }
]

// 格式化 JSON
function formatJSON() {
  if (!input.value.trim()) {
    error.value = ''
    output.value = ''
    return
  }

  isProcessing.value = true
  error.value = ''

  try {
    const parsed = JSON.parse(input.value)
    const indent = typeof indentSize.value === 'number' ? indentSize.value : indentSize.value
    output.value = JSON.stringify(parsed, null, indent)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '无效的 JSON 格式'
    output.value = ''
  } finally {
    isProcessing.value = false
  }
}

// 压缩 JSON
function minifyJSON() {
  if (!input.value.trim()) {
    error.value = ''
    output.value = ''
    return
  }

  isProcessing.value = true
  error.value = ''

  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '无效的 JSON 格式'
    output.value = ''
  } finally {
    isProcessing.value = false
  }
}

// 验证 JSON
function validateJSON() {
  if (!input.value.trim()) {
    error.value = ''
    output.value = ''
    return
  }

  isProcessing.value = true
  error.value = ''

  try {
    JSON.parse(input.value)
    output.value = '✓ JSON 格式正确'
  } catch (e) {
    error.value = e instanceof Error ? e.message : '无效的 JSON 格式'
    output.value = ''
  } finally {
    isProcessing.value = false
  }
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

// 示例 JSON
function loadExample() {
  input.value = JSON.stringify({
    name: "DevUtils",
    version: "1.0.0",
    features: ["JSON 格式化", "Base64 编解码", "URL 编解码"],
    author: {
      name: "Developer",
      email: "dev@example.com"
    },
    isOpen: true
  }, null, 2)
}
</script>

<template>
  <div class="flex flex-col gap-4 h-full p-4">
    <!-- 操作栏 -->
    <div class="flex flex-wrap items-center gap-2">
      <UButton
        icon="lucide:wand"
        @click="formatJSON"
        :loading="isProcessing"
      >
        格式化
      </UButton>
      <UButton
        variant="outline"
        icon="lucide:minimize-2"
        @click="minifyJSON"
        :loading="isProcessing"
      >
        压缩
      </UButton>
      <UButton
        variant="outline"
        icon="lucide:check-circle"
        @click="validateJSON"
        :loading="isProcessing"
      >
        验证
      </UButton>

      <div class="flex-1" />

      <USelectMenu
        v-model="indentSize"
        :items="indentOptions"
        value-key="value"
        size="sm"
        class="w-28"
      />
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
          <label class="text-sm font-medium text-[var(--ui-text)]">输入</label>
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
          placeholder="在此粘贴 JSON..."
          class="flex-1 font-mono text-sm"
          :rows="15"
          autoresize
        />
      </div>

      <!-- 输出区 -->
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-[var(--ui-text)]">输出</label>
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
          placeholder="处理结果将显示在这里..."
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
