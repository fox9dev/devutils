<script setup lang="ts">
/**
 * 时间戳转换工具
 * 支持时间戳与日期时间的互相转换
 */
import { useClipboard } from '@vueuse/core'
import dayjs from 'dayjs'

// 工具元数据定义
definePageMeta({
  layout: 'workspace',
  tool: {
    id: 'timestamp',
    icon: 'lucide:clock',
    name: '时间戳转换',
    description: '时间戳与日期时间互相转换，支持秒/毫秒',
    keywords: ['timestamp', 'time', 'date', '时间戳', '日期', 'unix']
  }
})

// 当前时间戳（实时更新）
const currentTimestamp = ref(Date.now())
const currentTimestampSeconds = computed(() => Math.floor(currentTimestamp.value / 1000))

// 更新当前时间戳
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    currentTimestamp.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

// 时间戳单位
const unit = ref<'seconds' | 'milliseconds'>('seconds')

// 时间戳输入
const timestampInput = ref('')
const timestampError = ref('')
const timestampResult = ref('')

// 日期时间输入
const dateInput = ref('')
const dateError = ref('')
const dateResult = ref('')

// 时间戳 → 日期时间
function convertTimestampToDate() {
  if (!timestampInput.value.trim()) {
    timestampError.value = ''
    timestampResult.value = ''
    return
  }

  timestampError.value = ''

  try {
    let ts = parseInt(timestampInput.value, 10)
    if (isNaN(ts)) {
      throw new Error('无效的时间戳')
    }

    // 如果是秒级时间戳，转换为毫秒
    if (unit.value === 'seconds') {
      ts = ts * 1000
    }

    const date = dayjs(ts)
    if (!date.isValid()) {
      throw new Error('无效的时间戳')
    }

    timestampResult.value = date.format('YYYY-MM-DD HH:mm:ss')
  } catch (e) {
    timestampError.value = e instanceof Error ? e.message : '转换失败'
    timestampResult.value = ''
  }
}

// 日期时间 → 时间戳
function convertDateToTimestamp() {
  if (!dateInput.value.trim()) {
    dateError.value = ''
    dateResult.value = ''
    return
  }

  dateError.value = ''

  try {
    const date = dayjs(dateInput.value)
    if (!date.isValid()) {
      throw new Error('无效的日期时间格式')
    }

    const ts = date.valueOf()
    dateResult.value = unit.value === 'seconds'
      ? Math.floor(ts / 1000).toString()
      : ts.toString()
  } catch (e) {
    dateError.value = e instanceof Error ? e.message : '转换失败'
    dateResult.value = ''
  }
}

// 复制
const { copy, copied: copiedTimestamp } = useClipboard()
const { copy: copyDate, copied: copiedDate } = useClipboard()

function copyTimestampResult() {
  if (timestampResult.value) {
    copy(timestampResult.value)
  }
}

function copyDateResult() {
  if (dateResult.value) {
    copyDate(dateResult.value)
  }
}

// 使用当前时间戳
function useCurrentTimestamp() {
  timestampInput.value = unit.value === 'seconds'
    ? currentTimestampSeconds.value.toString()
    : currentTimestamp.value.toString()
}

// 使用当前日期时间
function useCurrentDate() {
  dateInput.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
}

// 清空所有
function clearAll() {
  timestampInput.value = ''
  timestampError.value = ''
  timestampResult.value = ''
  dateInput.value = ''
  dateError.value = ''
  dateResult.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-6 p-4">
    <!-- 当前时间戳 -->
    <div class="p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-green-500/10 border border-[var(--ui-border)]">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-[var(--ui-text)]">当前时间戳</span>
        <span class="text-xs text-[var(--ui-text-muted)]">{{ dayjs(currentTimestamp).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <div class="text-2xl font-mono font-bold text-primary-500">
            {{ currentTimestampSeconds }}
          </div>
          <div class="text-xs text-[var(--ui-text-muted)]">秒</div>
        </div>
        <div class="flex-1">
          <div class="text-2xl font-mono font-bold text-green-500">
            {{ currentTimestamp }}
          </div>
          <div class="text-xs text-[var(--ui-text-muted)]">毫秒</div>
        </div>
      </div>
    </div>

    <!-- 单位切换 -->
    <div class="flex items-center gap-4">
      <span class="text-sm font-medium text-[var(--ui-text)]">时间戳单位：</span>
      <div class="inline-flex rounded-lg border border-[var(--ui-border)] p-0.5">
        <button
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="unit === 'seconds' ? 'bg-primary-500 text-white' : 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]'"
          @click="unit = 'seconds'"
        >
          秒 (s)
        </button>
        <button
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="unit === 'milliseconds' ? 'bg-primary-500 text-white' : 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]'"
          @click="unit = 'milliseconds'"
        >
          毫秒 (ms)
        </button>
      </div>
      <div class="flex-1" />
      <UButton variant="ghost" size="sm" icon="lucide:trash-2" @click="clearAll">
        清空
      </UButton>
    </div>

    <!-- 转换区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 时间戳 → 日期时间 -->
      <div class="p-4 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg)]">
        <h3 class="flex items-center gap-2 text-base font-semibold text-[var(--ui-text)] mb-4">
          <UIcon name="lucide:clock" class="w-5 h-5 text-primary-500" />
          时间戳 → 日期时间
        </h3>

        <div class="flex flex-col gap-3">
          <div class="flex gap-2">
            <UInput
              v-model="timestampInput"
              :placeholder="`输入${unit === 'seconds' ? '秒级' : '毫秒级'}时间戳...`"
              class="flex-1 font-mono"
            />
            <UButton size="sm" variant="outline" @click="useCurrentTimestamp">
              当前
            </UButton>
            <UButton icon="lucide:arrow-right" @click="convertTimestampToDate">
              转换
            </UButton>
          </div>

          <div v-if="timestampError" class="text-sm text-red-500">
            {{ timestampError }}
          </div>

          <div v-if="timestampResult" class="flex items-center gap-2 p-3 rounded-lg bg-[var(--ui-bg-elevated)]">
            <span class="flex-1 font-mono text-[var(--ui-text)]">{{ timestampResult }}</span>
            <UButton
              variant="ghost"
              size="xs"
              :icon="copiedTimestamp ? 'lucide:check' : 'lucide:copy'"
              @click="copyTimestampResult"
            />
          </div>
        </div>
      </div>

      <!-- 日期时间 → 时间戳 -->
      <div class="p-4 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg)]">
        <h3 class="flex items-center gap-2 text-base font-semibold text-[var(--ui-text)] mb-4">
          <UIcon name="lucide:calendar" class="w-5 h-5 text-green-500" />
          日期时间 → 时间戳
        </h3>

        <div class="flex flex-col gap-3">
          <div class="flex gap-2">
            <UInput
              v-model="dateInput"
              placeholder="输入日期时间 (YYYY-MM-DD HH:mm:ss)..."
              class="flex-1 font-mono"
            />
            <UButton size="sm" variant="outline" @click="useCurrentDate">
              当前
            </UButton>
            <UButton icon="lucide:arrow-right" @click="convertDateToTimestamp">
              转换
            </UButton>
          </div>

          <div v-if="dateError" class="text-sm text-red-500">
            {{ dateError }}
          </div>

          <div v-if="dateResult" class="flex items-center gap-2 p-3 rounded-lg bg-[var(--ui-bg-elevated)]">
            <span class="flex-1 font-mono text-[var(--ui-text)]">{{ dateResult }}</span>
            <span class="text-xs text-[var(--ui-text-muted)]">{{ unit === 'seconds' ? '秒' : '毫秒' }}</span>
            <UButton
              variant="ghost"
              size="xs"
              :icon="copiedDate ? 'lucide:check' : 'lucide:copy'"
              @click="copyDateResult"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 格式说明 -->
    <div class="text-xs text-[var(--ui-text-muted)] bg-[var(--ui-bg-elevated)] px-3 py-2 rounded-lg">
      <span class="font-medium">支持的日期格式：</span>
      YYYY-MM-DD、YYYY-MM-DD HH:mm:ss、YYYY/MM/DD、ISO 8601 等
    </div>
  </div>
</template>
