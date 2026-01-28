<script setup lang="ts">
import type { HistoryRecord } from '~/types/history'
import { ToolCategory } from '~/types/tool'

definePageMeta({
  layout: 'tools',
  tool: {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '格式化、压缩、验证 JSON 数据',
    icon: 'i-lucide-braces',
    category: ToolCategory.FORMAT,
    keywords: ['json', '格式化', 'format', 'beautify', '美化', '压缩', 'minify', '验证', 'validate'],
    featured: true
  }
})

const { t } = useI18n()
const { saveHistory } = useHistory()
const { success, error: showError } = useAppToast()

const input = ref('')
const output = ref('')
const error = ref('')
const indentSize = ref(2)
const historyVisible = ref(false)

// 格式化 JSON
function formatJson() {
  error.value = ''
  if (!input.value.trim()) {
    output.value = ''
    return
  }

  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed, null, indentSize.value)
    saveToHistory(t('tools.jsonFormatter.format'))
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('tools.jsonFormatter.invalidJson')
    output.value = ''
  }
}

// 压缩 JSON
function minifyJson() {
  error.value = ''
  if (!input.value.trim()) {
    output.value = ''
    return
  }

  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed)
    saveToHistory(t('tools.jsonFormatter.minify'))
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('tools.jsonFormatter.invalidJson')
    output.value = ''
  }
}

// 验证 JSON
function validateJson() {
  error.value = ''
  if (!input.value.trim()) {
    output.value = ''
    return
  }

  try {
    JSON.parse(input.value)
    output.value = t('tools.jsonFormatter.validJson')
    error.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('tools.jsonFormatter.invalidJson')
    output.value = t('tools.jsonFormatter.invalidJson')
  }
}

// 保存到历史记录
async function saveToHistory(label: string) {
  if (input.value && output.value) {
    await saveHistory({
      toolId: 'json-formatter',
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
  error.value = ''
}

// 从历史记录恢复
function restoreFromHistory(record: HistoryRecord) {
  input.value = record.input
  output.value = record.output
  error.value = ''
  historyVisible.value = false
  success(t('historyPanel.restored'))
}

// 示例数据
function loadSample() {
  input.value = JSON.stringify({
    name: 'DevUtils',
    version: '1.0.0',
    features: ['JSON 格式化', 'Base64 编解码', '文本对比'],
    config: {
      theme: 'dark',
      language: 'zh-CN'
    }
  })
}

// SEO
useSeoMeta({
  title: `${t('tools.jsonFormatter.name')} - DevUtils`,
  description: t('tools.jsonFormatter.description')
})
</script>

<template>
  <div class="h-full bg-gray-50 p-6 dark:bg-gray-950">
    <div class="mx-auto h-full max-w-6xl">
      <div class="flex h-full flex-col">
        <!-- Toolbar -->
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <UButton
            icon="i-lucide-sparkles"
            @click="formatJson"
          >
            {{ t('tools.jsonFormatter.format') }}
          </UButton>
          <UButton
            icon="i-lucide-minimize-2"
            variant="outline"
            @click="minifyJson"
          >
            {{ t('tools.jsonFormatter.minify') }}
          </UButton>
          <UButton
            icon="i-lucide-check-circle"
            variant="outline"
            @click="validateJson"
          >
            {{ t('tools.jsonFormatter.validate') }}
          </UButton>

          <div class="mx-2 h-6 w-px bg-gray-200 dark:bg-gray-700" />

          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">{{ t('tools.jsonFormatter.indent') }}:</span>
            <USelect
              v-model="indentSize"
              :items="[
                { label: '2 空格', value: 2 },
                { label: '4 空格', value: 4 },
                { label: 'Tab', value: '\t' }
              ]"
              size="sm"
              class="w-24"
            />
          </div>

          <div class="flex-1" />

          <UButton
            icon="i-lucide-file-text"
            variant="ghost"
            size="sm"
            @click="loadSample"
          >
            {{ t('common.sample') }}
          </UButton>
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
              {{ t('tools.jsonFormatter.inputPlaceholder') }}
            </label>
            <UTextarea
              v-model="input"
              :placeholder="t('tools.jsonFormatter.inputPlaceholder')"
              class="flex-1 font-mono text-sm"
              :rows="15"
              autoresize
            />
          </div>

          <!-- Output -->
          <div class="flex flex-col">
            <div class="mb-2 flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('tools.jsonFormatter.outputPlaceholder') }}
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
                class="whitespace-pre-wrap text-gray-900 dark:text-gray-100"
              >{{ output }}</pre>
              <span
                v-else
                class="text-gray-400"
              >{{ t('tools.jsonFormatter.outputPlaceholder') }}</span>
            </div>
            <p
              v-if="error"
              class="mt-2 text-sm text-red-500"
            >
              {{ error }}
            </p>
          </div>
        </div>

        <!-- History Panel -->
        <HistoryPanel
          v-model:open="historyVisible"
          tool-id="json-formatter"
          @select="restoreFromHistory"
        />
      </div>
    </div>
  </div>
</template>
