<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { HistoryRecord } from '~/types/history'

const props = defineProps<{
  toolId: string
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  (e: 'select', record: HistoryRecord): void
}>()

const { t } = useI18n()
const { formatRelativeTime } = useDayjs()
const { getHistory, deleteHistory, clearHistory, getHistoryCount } = useHistory()

const searchKeyword = ref('')
const records = ref<HistoryRecord[]>([])
const totalCount = ref(0)
const loading = ref(false)

// 加载历史记录
async function loadHistory() {
  loading.value = true
  try {
    records.value = await getHistory({
      toolId: props.toolId,
      keyword: searchKeyword.value,
      limit: 50
    })
    totalCount.value = await getHistoryCount(props.toolId)
  } finally {
    loading.value = false
  }
}

// 监听工具 ID 变化
watch(() => props.toolId, loadHistory, { immediate: true })

// 监听搜索关键词变化（防抖）
const debouncedSearch = useDebounceFn(loadHistory, 300)
watch(searchKeyword, debouncedSearch)

// 监听面板可见性
watch(open, (isOpen) => {
  if (isOpen) {
    loadHistory()
  }
})

// 选择记录
function handleSelect(record: HistoryRecord) {
  emit('select', record)
  open.value = false
}

// 删除记录
async function handleDelete(record: HistoryRecord) {
  if (record.id) {
    await deleteHistory(record.id)
    await loadHistory()
  }
}

// 清空所有记录
async function handleClearAll() {
  await clearHistory(props.toolId)
  await loadHistory()
}

// 截断文本
function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
</script>

<template>
  <USlideover
    v-model:open="open"
    :title="t('historyPanel.title')"
  >
    <template #body>
      <div class="flex h-full flex-col">
        <!-- Search -->
        <div class="mb-4">
          <UInput
            v-model="searchKeyword"
            :placeholder="t('historyPanel.searchHistory')"
            icon="i-lucide-search"
            size="sm"
          />
        </div>

        <!-- Stats -->
        <div class="mb-4 flex items-center justify-between text-sm text-gray-500">
          <span>{{ t('historyPanel.totalRecords', { n: totalCount }) }}</span>
          <UButton
            v-if="totalCount > 0"
            size="xs"
            color="error"
            variant="ghost"
            icon="i-lucide-trash-2"
            @click="handleClearAll"
          >
            {{ t('historyPanel.clearAll') }}
          </UButton>
        </div>

        <!-- Loading -->
        <div
          v-if="loading"
          class="flex flex-1 items-center justify-center"
        >
          <UIcon
            name="i-lucide-loader-2"
            class="size-6 animate-spin text-gray-400"
          />
        </div>

        <!-- Records List -->
        <div
          v-else-if="records.length > 0"
          class="flex-1 space-y-2 overflow-y-auto"
        >
          <div
            v-for="record in records"
            :key="record.id"
            class="group cursor-pointer rounded-lg border border-gray-200 p-3 transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:hover:border-primary-700 dark:hover:bg-primary-950"
            @click="handleSelect(record)"
          >
            <div class="mb-1 flex items-center justify-between">
              <span class="text-xs text-gray-500">{{ formatRelativeTime(record.timestamp) }}</span>
              <button
                class="rounded p-1 opacity-0 transition-opacity hover:bg-gray-200 group-hover:opacity-100 dark:hover:bg-gray-700"
                @click.stop="handleDelete(record)"
              >
                <UIcon
                  name="i-lucide-trash-2"
                  class="size-3 text-red-500"
                />
              </button>
            </div>
            <div
              v-if="record.label"
              class="mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              {{ record.label }}
            </div>
            <div class="font-mono text-xs text-gray-600 dark:text-gray-400">
              {{ truncateText(record.input) }}
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="flex flex-1 flex-col items-center justify-center text-center"
        >
          <UIcon
            name="i-lucide-history"
            class="mb-2 size-12 text-gray-300 dark:text-gray-600"
          />
          <p class="text-sm text-gray-500">
            {{ t('historyPanel.noHistory') }}
          </p>
        </div>
      </div>
    </template>
  </USlideover>
</template>
