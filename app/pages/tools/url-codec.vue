<script setup lang="ts">
import type { HistoryRecord } from '~/types/history'
import { ToolCategory } from '~/types/tool'

definePageMeta({
  layout: 'tools',
  tool: {
    id: 'url-codec',
    name: 'URL 编解码',
    description: 'URL 编码与解码转换',
    icon: 'i-lucide-link',
    category: ToolCategory.ENCODING,
    keywords: ['url', 'uri', '编码', '解码', 'encode', 'decode', 'encodeURIComponent'],
    featured: true
  }
})

const { t } = useI18n()
const { saveHistory } = useHistory()
const { success, error: showError } = useAppToast()

const input = ref('')
const output = ref('')
const mode = ref<'encode' | 'decode'>('encode')
const encodeType = ref<'component' | 'full'>('component')
const historyVisible = ref(false)

// 编码
function encode() {
  if (!input.value) {
    output.value = ''
    return
  }

  if (encodeType.value === 'component') {
    output.value = encodeURIComponent(input.value)
  } else {
    output.value = encodeURI(input.value)
  }
  saveToHistory(t('tools.urlCodec.encode'))
}

// 解码
function decode() {
  if (!input.value) {
    output.value = ''
    return
  }

  try {
    if (encodeType.value === 'component') {
      output.value = decodeURIComponent(input.value)
    } else {
      output.value = decodeURI(input.value)
    }
    saveToHistory(t('tools.urlCodec.decode'))
  } catch {
    output.value = t('tools.urlCodec.decodeFailed')
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
      toolId: 'url-codec',
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
      success(t('tools.urlCodec.copySuccess'))
    } catch {
      showError(t('tools.urlCodec.copyFailed'))
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

// 示例
function loadSample() {
  input.value = 'https://example.com/path?name=张三&city=北京'
}

// SEO
useSeoMeta({
  title: `${t('tools.urlCodec.name')} - DevUtils`,
  description: t('tools.urlCodec.description')
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
              {{ t('tools.urlCodec.encode') }}
            </UButton>
            <UButton
              :color="mode === 'decode' ? 'primary' : 'neutral'"
              :variant="mode === 'decode' ? 'solid' : 'outline'"
              @click="mode = 'decode'"
            >
              {{ t('tools.urlCodec.decode') }}
            </UButton>
          </UButtonGroup>

          <UButton
            icon="i-lucide-play"
            @click="convert"
          >
            {{ t('tools.urlCodec.convert') }}
          </UButton>

          <UButton
            icon="i-lucide-arrow-left-right"
            variant="outline"
            @click="switchMode"
          >
            {{ t('tools.urlCodec.swap') }}
          </UButton>

          <div class="mx-2 h-6 w-px bg-gray-200 dark:bg-gray-700" />

          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">{{ t('tools.urlCodec.type') }}:</span>
            <USelect
              v-model="encodeType"
              :items="[
                { label: 'encodeURIComponent', value: 'component' },
                { label: 'encodeURI', value: 'full' }
              ]"
              size="sm"
              class="w-44"
            />
          </div>

          <div class="flex-1" />

          <UButton
            icon="i-lucide-file-text"
            variant="ghost"
            size="sm"
            @click="loadSample"
          >
            {{ t('tools.urlCodec.sample') }}
          </UButton>
          <UButton
            icon="i-lucide-history"
            variant="ghost"
            size="sm"
            @click="historyVisible = true"
          >
            {{ t('tools.urlCodec.history') }}
          </UButton>
          <UButton
            icon="i-lucide-trash-2"
            variant="ghost"
            size="sm"
            color="error"
            @click="clearAll"
          >
            {{ t('tools.urlCodec.clear') }}
          </UButton>
        </div>

        <!-- Content -->
        <div class="grid flex-1 gap-4 lg:grid-cols-2">
          <!-- Input -->
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ mode === 'encode' ? t('tools.urlCodec.originalText') : t('tools.urlCodec.encodedString') }}
            </label>
            <UTextarea
              v-model="input"
              :placeholder="mode === 'encode' ? t('tools.urlCodec.inputPlaceholderEncode') : t('tools.urlCodec.inputPlaceholderDecode')"
              class="flex-1 font-mono text-sm"
              :rows="15"
              autoresize
            />
          </div>

          <!-- Output -->
          <div class="flex flex-col">
            <div class="mb-2 flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ mode === 'encode' ? t('tools.urlCodec.encodeResult') : t('tools.urlCodec.decodeResult') }}
              </label>
              <UButton
                v-if="output"
                icon="i-lucide-copy"
                variant="ghost"
                size="xs"
                @click="copyOutput"
              >
                {{ t('tools.urlCodec.copy') }}
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
              >{{ t('tools.urlCodec.outputPlaceholder') }}</span>
            </div>
          </div>
        </div>

        <!-- History Panel -->
        <HistoryPanel
          v-model:open="historyVisible"
          tool-id="url-codec"
          @select="restoreFromHistory"
        />
      </div>
    </div>
  </div>
</template>
