<script setup lang="ts">
import type { HistoryRecord } from '~/types/history'
import { ToolCategory } from '~/types/tool'

definePageMeta({
  layout: 'tools',
  tool: {
    id: 'base64-codec',
    name: 'Base64 编解码',
    description: 'Base64 编码与解码转换',
    icon: 'i-lucide-file-code',
    category: ToolCategory.ENCODING,
    keywords: ['base64', '编码', '解码', 'encode', 'decode', '转换'],
    featured: true
  }
})

const { t } = useI18n()
const { saveHistory } = useHistory()
const { success, error: showError } = useAppToast()

const input = ref('')
const output = ref('')
const mode = ref<'encode' | 'decode'>('encode')
const historyVisible = ref(false)

// 编码
function encode() {
  if (!input.value) {
    output.value = ''
    return
  }

  try {
    // 使用 TextEncoder 替代废弃的 unescape
    const encoder = new TextEncoder()
    const data = encoder.encode(input.value)
    const binary = String.fromCharCode(...data)
    output.value = btoa(binary)
    saveToHistory(t('tools.base64Codec.encode'))
  } catch {
    output.value = t('tools.base64Codec.encodeFailed')
  }
}

// 解码
function decode() {
  if (!input.value) {
    output.value = ''
    return
  }

  try {
    // 使用 TextDecoder 替代废弃的 escape
    const binary = atob(input.value)
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
    const decoder = new TextDecoder()
    output.value = decoder.decode(bytes)
    saveToHistory(t('tools.base64Codec.decode'))
  } catch {
    output.value = t('tools.base64Codec.decodeFailed')
  }
}

// 转换
function convert() {
  if (mode.value === 'encode') {
    encode()
  } else {
    decode()
  }
}

// 切换模式并交换输入输出
function switchMode() {
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  const temp = input.value
  input.value = output.value
  output.value = temp
}

// 保存到历史记录
async function saveToHistory(label: string) {
  if (input.value && output.value) {
    await saveHistory({
      toolId: 'base64-codec',
      input: input.value,
      output: output.value,
      label
    })
  }
}

// 复制输出
async function copyOutput() {
  if (output.value) {
    try {
      await navigator.clipboard.writeText(output.value)
      success(t('common.copySuccess'))
    } catch {
      showError(t('common.copyFailed'))
    }
  }
}

// 清空
function clearAll() {
  input.value = ''
  output.value = ''
}

// 从历史记录恢复
function restoreFromHistory(record: HistoryRecord) {
  input.value = record.input
  output.value = record.output
  historyVisible.value = false
  success(t('historyPanel.restored'))
}

// SEO
useSeoMeta({
  title: `${t('tools.base64Codec.name')} - DevUtils`,
  description: t('tools.base64Codec.description')
})
</script>

<template>
  <div class="h-full bg-gray-50 p-6 dark:bg-gray-950">
    <div class="mx-auto h-full max-w-6xl">
      <div class="flex h-full flex-col">
        <!-- Toolbar -->
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <UButtonGroup>
            <UButton
              :color="mode === 'encode' ? 'primary' : 'neutral'"
              :variant="mode === 'encode' ? 'solid' : 'outline'"
              @click="mode = 'encode'"
            >
              {{ t('tools.base64Codec.encode') }}
            </UButton>
            <UButton
              :color="mode === 'decode' ? 'primary' : 'neutral'"
              :variant="mode === 'decode' ? 'solid' : 'outline'"
              @click="mode = 'decode'"
            >
              {{ t('tools.base64Codec.decode') }}
            </UButton>
          </UButtonGroup>

          <UButton
            icon="i-lucide-play"
            @click="convert"
          >
            {{ t('common.convert') }}
          </UButton>

          <UButton
            icon="i-lucide-arrow-left-right"
            variant="outline"
            @click="switchMode"
          >
            {{ t('common.swap') }}
          </UButton>

          <div class="flex-1" />

          <UButton
            icon="i-lucide-history"
            variant="ghost"
            size="sm"
            @click="historyVisible = true"
          >
            {{ t('common.history') }}
          </UButton>
          <UButton
            icon="i-lucide-trash-2"
            variant="ghost"
            size="sm"
            color="error"
            @click="clearAll"
          >
            {{ t('common.clear') }}
          </UButton>
        </div>

        <!-- Content -->
        <div class="grid flex-1 gap-4 lg:grid-cols-2">
          <!-- Input -->
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ mode === 'encode' ? t('tools.base64Codec.inputPlaceholder') : 'Base64' }}
            </label>
            <UTextarea
              v-model="input"
              :placeholder="t('tools.base64Codec.inputPlaceholder')"
              class="flex-1 font-mono text-sm"
              :rows="15"
              autoresize
            />
          </div>

          <!-- Output -->
          <div class="flex flex-col">
            <div class="mb-2 flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('tools.base64Codec.outputPlaceholder') }}
              </label>
              <UButton
                v-if="output"
                icon="i-lucide-copy"
                variant="ghost"
                size="xs"
                @click="copyOutput"
              >
                {{ t('common.copy') }}
              </UButton>
            </div>
            <div
              class="flex-1 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <pre
                v-if="output"
                class="whitespace-pre-wrap break-all text-gray-900 dark:text-gray-100"
              >{{ output }}</pre>
              <span
                v-else
                class="text-gray-400"
              >{{ t('tools.base64Codec.outputPlaceholder') }}</span>
            </div>
          </div>
        </div>

        <!-- History Panel -->
        <HistoryPanel
          v-model:open="historyVisible"
          tool-id="base64-codec"
          @select="restoreFromHistory"
        />
      </div>
    </div>
  </div>
</template>
