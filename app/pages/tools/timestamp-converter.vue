<script setup lang="ts">
import type { HistoryRecord } from '~/types/history'
import { ToolCategory } from '~/types/tool'

definePageMeta({
  layout: 'tools',
  tool: {
    id: 'timestamp-converter',
    name: '时间戳转换',
    description: '时间戳与日期时间格式互转',
    icon: 'i-lucide-clock',
    category: ToolCategory.CONVERTER,
    keywords: ['timestamp', '时间戳', '日期', 'date', 'time', '转换', 'unix'],
    featured: true
  }
})

const { t } = useI18n()
const { saveHistory } = useHistory()
const { success, error: showError } = useAppToast()
const {
  $dayjs,
  nowTimestamp,
  timestampToDatetime: convertTimestampToDatetime,
  datetimeToTimestamp: convertDatetimeToTimestamp,
  todayStart,
  todayEnd,
  yesterdayStart,
  daysAgo
} = useDayjs()

const timestamp = ref('')
const datetime = ref('')
const unit = ref<'seconds' | 'milliseconds'>('seconds')
const historyVisible = ref(false)

// 当前时间戳
const currentTimestamp = ref(nowTimestamp())

// 更新当前时间戳
let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  timer = setInterval(() => {
    currentTimestamp.value = nowTimestamp()
  }, 1000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 时间戳转日期时间
function timestampToDatetime() {
  if (!timestamp.value) {
    datetime.value = ''
    return
  }

  try {
    const result = convertTimestampToDatetime(timestamp.value, unit.value)
    if (!result) {
      datetime.value = t('tools.timestampConverter.invalidTimestamp')
      return
    }
    datetime.value = result
    saveToHistory(t('tools.timestampConverter.timestampToDatetime'))
  } catch {
    datetime.value = t('tools.timestampConverter.convertFailed')
  }
}

// 日期时间转时间戳
function datetimeToTimestamp() {
  if (!datetime.value) {
    timestamp.value = ''
    return
  }

  try {
    const result = convertDatetimeToTimestamp(datetime.value, unit.value)
    if (result === null) {
      timestamp.value = t('tools.timestampConverter.invalidDatetime')
      return
    }
    timestamp.value = result.toString()
    saveToHistory(t('tools.timestampConverter.datetimeToTimestamp'))
  } catch {
    timestamp.value = t('tools.timestampConverter.convertFailed')
  }
}

// 使用当前时间
function useNow() {
  const now = $dayjs()
  datetime.value = now.format('YYYY-MM-DD HH:mm:ss')
  const ts = unit.value === 'seconds' ? Math.floor(now.valueOf() / 1000) : now.valueOf()
  timestamp.value = ts.toString()
}

// 保存到历史记录
async function saveToHistory(label: string) {
  if (!timestamp.value || !datetime.value) return
  await saveHistory({
    toolId: 'timestamp-converter',
    input: JSON.stringify({ timestamp: timestamp.value, datetime: datetime.value, unit: unit.value }),
    output: `${timestamp.value} ↔ ${datetime.value}`,
    label
  })
}

// 复制
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    success(t('common.copySuccess'))
  } catch {
    showError(t('common.copyFailed'))
  }
}

// 清空
function clearAll() {
  timestamp.value = ''
  datetime.value = ''
}

// 从历史记录恢复
function restoreFromHistory(record: HistoryRecord) {
  try {
    const data = JSON.parse(record.input)
    timestamp.value = data.timestamp || ''
    datetime.value = data.datetime || ''
    if (data.unit) unit.value = data.unit
    historyVisible.value = false
    success(t('historyPanel.restored'))
  } catch {
    // ignore
  }
}

// 常用时间戳快捷操作
const quickActions = computed(() => [
  { label: t('tools.timestampConverter.todayStart'), getValue: () => todayStart(unit.value) },
  { label: t('tools.timestampConverter.todayEnd'), getValue: () => todayEnd(unit.value) },
  { label: t('tools.timestampConverter.yesterdayStart'), getValue: () => yesterdayStart(unit.value) },
  { label: t('tools.timestampConverter.daysAgo', { n: 7 }), getValue: () => daysAgo(7, unit.value) },
  { label: t('tools.timestampConverter.daysAgo', { n: 30 }), getValue: () => daysAgo(30, unit.value) }
])

function applyQuickAction(getValue: () => number) {
  const ts = getValue()
  datetime.value = $dayjs(unit.value === 'seconds' ? ts * 1000 : ts).format('YYYY-MM-DD HH:mm:ss')
  timestamp.value = ts.toString()
}

// SEO
useSeoMeta({
  title: `${t('tools.timestampConverter.name')} - DevUtils`,
  description: t('tools.timestampConverter.description')
})
</script>

<template>
  <div class="h-full bg-gray-50 p-6 dark:bg-gray-950">
    <div class="mx-auto h-full max-w-6xl">
      <div class="flex h-full flex-col">
        <!-- Current Timestamp -->
        <div class="mb-6 rounded-xl bg-linear-to-r from-primary-50 to-primary-100 p-4 dark:from-primary-950 dark:to-primary-900">
          <div class="mb-1 text-sm text-primary-600 dark:text-primary-400">
            {{ t('tools.timestampConverter.currentTimestamp') }}
          </div>
          <div class="flex items-center justify-between">
            <span class="font-mono text-2xl font-bold text-primary-700 dark:text-primary-300">
              {{ currentTimestamp }}
            </span>
            <UButton
              size="sm"
              variant="soft"
              icon="i-lucide-copy"
              @click="copy(currentTimestamp.toString())"
            >
              {{ t('common.copy') }}
            </UButton>
          </div>
        </div>

        <!-- Toolbar -->
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <UButton
            icon="i-lucide-clock"
            @click="useNow"
          >
            {{ t('tools.timestampConverter.useNow') }}
          </UButton>

          <div class="mx-2 h-6 w-px bg-gray-200 dark:bg-gray-700" />

          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">{{ t('tools.timestampConverter.timestamp') }}:</span>
            <UButtonGroup size="sm">
              <UButton
                :color="unit === 'seconds' ? 'primary' : 'neutral'"
                :variant="unit === 'seconds' ? 'solid' : 'outline'"
                @click="unit = 'seconds'"
              >
                {{ t('tools.timestampConverter.seconds') }}
              </UButton>
              <UButton
                :color="unit === 'milliseconds' ? 'primary' : 'neutral'"
                :variant="unit === 'milliseconds' ? 'solid' : 'outline'"
                @click="unit = 'milliseconds'"
              >
                {{ t('tools.timestampConverter.milliseconds') }}
              </UButton>
            </UButtonGroup>
          </div>

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

        <!-- Converters -->
        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Timestamp to Datetime -->
          <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <h3 class="mb-4 font-medium text-gray-900 dark:text-white">
              {{ t('tools.timestampConverter.timestampToDatetime') }}
            </h3>
            <div class="space-y-4">
              <UInput
                v-model="timestamp"
                :placeholder="t('tools.timestampConverter.timestampPlaceholder')"
                icon="i-lucide-hash"
                class="font-mono"
              />
              <UButton
                block
                icon="i-lucide-arrow-down"
                @click="timestampToDatetime"
              >
                {{ t('common.convert') }}
              </UButton>
              <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <span class="font-mono text-gray-900 dark:text-white">{{ datetime || '-' }}</span>
                <UButton
                  v-if="datetime && !datetime.includes(t('tools.timestampConverter.invalidTimestamp'))"
                  icon="i-lucide-copy"
                  variant="ghost"
                  size="xs"
                  @click="copy(datetime)"
                />
              </div>
            </div>
          </div>

          <!-- Datetime to Timestamp -->
          <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <h3 class="mb-4 font-medium text-gray-900 dark:text-white">
              {{ t('tools.timestampConverter.datetimeToTimestamp') }}
            </h3>
            <div class="space-y-4">
              <UInput
                v-model="datetime"
                :placeholder="t('tools.timestampConverter.datetimePlaceholder')"
                icon="i-lucide-calendar"
                class="font-mono"
              />
              <UButton
                block
                icon="i-lucide-arrow-down"
                @click="datetimeToTimestamp"
              >
                {{ t('common.convert') }}
              </UButton>
              <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <span class="font-mono text-gray-900 dark:text-white">{{ timestamp || '-' }}</span>
                <UButton
                  v-if="timestamp && !timestamp.includes(t('tools.timestampConverter.invalidDatetime'))"
                  icon="i-lucide-copy"
                  variant="ghost"
                  size="xs"
                  @click="copy(timestamp)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-6">
          <h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('tools.timestampConverter.quickActions') }}
          </h3>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="action in quickActions"
              :key="action.label"
              size="sm"
              variant="outline"
              @click="applyQuickAction(action.getValue)"
            >
              {{ action.label }}
            </UButton>
          </div>
        </div>

        <!-- History Panel -->
        <HistoryPanel
          v-model:open="historyVisible"
          tool-id="timestamp-converter"
          @select="restoreFromHistory"
        />
      </div>
    </div>
  </div>
</template>
