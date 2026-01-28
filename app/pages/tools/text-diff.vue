<script setup lang="ts">
import { diffLines, diffWords, diffChars, type Change } from 'diff'
import type { HistoryRecord } from '~/types/history'
import { ToolCategory } from '~/types/tool'

definePageMeta({
  layout: 'tools',
  tool: {
    id: 'text-diff',
    name: '文本对比',
    description: '对比两段文本的差异',
    icon: 'i-lucide-diff',
    category: ToolCategory.TEXT,
    keywords: ['diff', '对比', '比较', 'compare', '差异', '文本'],
    featured: true
  }
})

const { t } = useI18n()
const { saveHistory } = useHistory()
const { success } = useAppToast()

const textA = ref('')
const textB = ref('')
const diffResult = ref<Change[]>([])
const diffMode = ref<'lines' | 'words' | 'chars'>('lines')
const historyVisible = ref(false)

// 对比
function compare() {
  if (!textA.value && !textB.value) {
    diffResult.value = []
    return
  }

  switch (diffMode.value) {
    case 'lines':
      diffResult.value = diffLines(textA.value, textB.value)
      break
    case 'words':
      diffResult.value = diffWords(textA.value, textB.value)
      break
    case 'chars':
      diffResult.value = diffChars(textA.value, textB.value)
      break
  }

  saveToHistory()
}

// 统计
const stats = computed(() => {
  let added = 0
  let removed = 0
  for (const part of diffResult.value) {
    if (part.added) added += part.count || 0
    if (part.removed) removed += part.count || 0
  }
  return { added, removed }
})

// 保存到历史记录
async function saveToHistory() {
  if (textA.value || textB.value) {
    await saveHistory({
      toolId: 'text-diff',
      input: JSON.stringify({ textA: textA.value, textB: textB.value }),
      output: JSON.stringify(stats.value),
      label: `+${stats.value.added} -${stats.value.removed}`
    })
  }
}

// 清空
function clearAll() {
  textA.value = ''
  textB.value = ''
  diffResult.value = []
}

// 从历史记录恢复
function restoreFromHistory(record: HistoryRecord) {
  try {
    const data = JSON.parse(record.input)
    textA.value = data.textA || ''
    textB.value = data.textB || ''
    compare()
    historyVisible.value = false
    success(t('historyPanel.restored'))
  } catch {
    // ignore
  }
}

// 交换
function swap() {
  const temp = textA.value
  textA.value = textB.value
  textB.value = temp
  if (diffResult.value.length > 0) {
    compare()
  }
}

// 示例
function loadSample() {
  textA.value = `function hello() {
  console.log("Hello, World!");
  return true;
}`
  textB.value = `function hello() {
  console.log("Hello, DevUtils!");
  console.log("Welcome!");
  return true;
}`
}

// SEO
useSeoMeta({
  title: `${t('tools.textDiff.name')} - DevUtils`,
  description: t('tools.textDiff.description')
})
</script>

<template>
  <div class="h-full bg-gray-50 p-6 dark:bg-gray-950">
    <div class="mx-auto h-full max-w-6xl">
      <div class="flex h-full flex-col">
        <!-- Toolbar -->
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <UButton
            icon="i-lucide-git-compare"
            @click="compare"
          >
            {{ t('tools.textDiff.compare') }}
          </UButton>

          <UButton
            icon="i-lucide-arrow-left-right"
            variant="outline"
            @click="swap"
          >
            {{ t('tools.textDiff.swap') }}
          </UButton>

          <div class="mx-2 h-6 w-px bg-gray-200 dark:bg-gray-700" />

          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">{{ t('tools.textDiff.diffMode') }}:</span>
            <UButtonGroup size="sm">
              <UButton
                :color="diffMode === 'lines' ? 'primary' : 'neutral'"
                :variant="diffMode === 'lines' ? 'solid' : 'outline'"
                @click="diffMode = 'lines'"
              >
                {{ t('tools.textDiff.lines') }}
              </UButton>
              <UButton
                :color="diffMode === 'words' ? 'primary' : 'neutral'"
                :variant="diffMode === 'words' ? 'solid' : 'outline'"
                @click="diffMode = 'words'"
              >
                {{ t('tools.textDiff.words') }}
              </UButton>
              <UButton
                :color="diffMode === 'chars' ? 'primary' : 'neutral'"
                :variant="diffMode === 'chars' ? 'solid' : 'outline'"
                @click="diffMode = 'chars'"
              >
                {{ t('tools.textDiff.chars') }}
              </UButton>
            </UButtonGroup>
          </div>

          <div class="flex-1" />

          <UButton
            icon="i-lucide-file-text"
            variant="ghost"
            size="sm"
            @click="loadSample"
          >
            {{ t('tools.textDiff.sample') }}
          </UButton>
          <UButton
            icon="i-lucide-history"
            variant="ghost"
            size="sm"
            @click="historyVisible = true"
          >
            {{ t('tools.textDiff.history') }}
          </UButton>
          <UButton
            icon="i-lucide-trash-2"
            variant="ghost"
            size="sm"
            color="error"
            @click="clearAll"
          >
            {{ t('tools.textDiff.clear') }}
          </UButton>
        </div>

        <!-- Input Area -->
        <div class="mb-4 grid gap-4 lg:grid-cols-2">
          <!-- Text A -->
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('tools.textDiff.originalText') }}
            </label>
            <UTextarea
              v-model="textA"
              :placeholder="t('tools.textDiff.textAPlaceholder')"
              class="font-mono text-sm"
              :rows="8"
            />
          </div>

          <!-- Text B -->
          <div class="flex flex-col">
            <label class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('tools.textDiff.modifiedText') }}
            </label>
            <UTextarea
              v-model="textB"
              :placeholder="t('tools.textDiff.textBPlaceholder')"
              class="font-mono text-sm"
              :rows="8"
            />
          </div>
        </div>

        <!-- Diff Result -->
        <div class="flex-1">
          <div class="mb-2 flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('tools.textDiff.diffResult') }}
            </label>
            <div
              v-if="diffResult.length > 0"
              class="flex items-center gap-4 text-sm"
            >
              <span class="text-green-600 dark:text-green-400">
                +{{ stats.added }} {{ t('tools.textDiff.added') }}
              </span>
              <span class="text-red-600 dark:text-red-400">
                -{{ stats.removed }} {{ t('tools.textDiff.removed') }}
              </span>
            </div>
          </div>
          <div
            class="h-64 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <template v-if="diffResult.length > 0">
              <span
                v-for="(part, index) in diffResult"
                :key="index"
                :class="{
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': part.added,
                  'bg-red-100 text-red-800 line-through dark:bg-red-900 dark:text-red-200': part.removed
                }"
              >{{ part.value }}</span>
            </template>
            <span
              v-else
              class="text-gray-400"
            >{{ t('tools.textDiff.emptyResult') }}</span>
          </div>
        </div>

        <!-- History Panel -->
        <HistoryPanel
          v-model:open="historyVisible"
          tool-id="text-diff"
          @select="restoreFromHistory"
        />
      </div>
    </div>
  </div>
</template>
