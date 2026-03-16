<script setup lang="ts">
/**
 * 时间戳转换工具
 * Unix 时间戳与日期时间互转
 */
import dayjs from 'dayjs'
import { useClipboard } from '@vueuse/core'

const id = 'timestamp-converter'

const toast = useCustomToast(id)

// 工具元数据定义
definePageMeta({
  layout: 'workspace',
  tool: {
    id,
    icon: 'lucide:clock',
    name: '时间戳转换',
    description: 'Unix 时间戳与日期时间互转，支持秒/毫秒',
    keywords: ['timestamp', 'unix', '时间戳', '日期', '时间', '转换', 'timestamp converter', 'unix time']
  }
})

// SEO 元信息
useSeoMeta({
  title: '时间戳转换 - Unix时间戳与日期互转工具',
  description: '免费在线时间戳转换工具，Unix 时间戳与日期时间互转，支持秒和毫秒。本地运行，隐私安全。',
  keywords: '时间戳转换,Unix时间戳,日期转换,时间戳转日期,timestamp converter',
  ogTitle: 'DevUtils - 时间戳转换 - Unix时间戳与日期互转工具',
  ogDescription: '免费在线时间戳转换，Unix 时间戳与日期互转。',
  ogUrl: 'https://devutils.fox9.dev/workspace/timestamp-converter'
})

type Unit = 'second' | 'millisecond'
const unit = ref<Unit>('second')
const timestamp = ref('')
const date = ref('')

function timestampToDate() {
  const val = timestamp.value.trim()
  if (!val) {
    date.value = ''
    return
  }
  const num = Number(val)
  if (Number.isNaN(num)) {
    date.value = ''
    toast.error('请输入有效的数字')
    return
  }
  const ms = unit.value === 'second' ? num * 1000 : num
  if (ms < -8640000000000000 || ms > 8640000000000000) {
    date.value = ''
    toast.error('时间戳超出有效范围')
    return
  }
  date.value = dayjs(ms).format('YYYY-MM-DD HH:mm:ss')
}

function dateToTimestamp() {
  const val = date.value.trim()
  if (!val) {
    timestamp.value = ''
    return
  }
  const d = dayjs(val)
  if (!d.isValid()) {
    timestamp.value = ''
    toast.error('请输入有效的日期时间，如：2024-01-01 12:00:00')
    return
  }
  const ts = unit.value === 'second' ? Math.floor(d.valueOf() / 1000) : d.valueOf()
  timestamp.value = String(ts)
}

function useNow() {
  if (unit.value === 'second') {
    timestamp.value = String(Math.floor(Date.now() / 1000))
    timestampToDate()
  } else {
    date.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
    dateToTimestamp()
  }
}

function clear() {
  timestamp.value = ''
  date.value = ''
}

const { copy: copyTimestamp, copied: copiedTimestamp } = useClipboard()
const { copy: copyDate, copied: copiedDate } = useClipboard()

function copyTimestampResult() {
  if (timestamp.value) copyTimestamp(timestamp.value)
}

function copyDateResult() {
  if (date.value) copyDate(date.value)
}

// 初始化显示当前时间
onMounted(() => {
  useNow()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <Note
      title="Unix 时间戳表示自 1970-01-01 00:00:00 UTC 起的秒数或毫秒数。"
    />

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-muted">时间单位</label>
      <div class="flex gap-2">
        <SegmentControl
          v-model="unit"
          :options="[
            { label: '秒 (10 位)', value: 'second' },
            { label: '毫秒 (13 位)', value: 'millisecond' }
          ]"
        />
        <UButton
          variant="ghost"
          color="error"
          icon="lucide:trash-2"
          @click="clear"
        >
          清空
        </UButton>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-muted">时间戳</label>
      <div class="flex gap-2">
        <UInput
          v-model="timestamp"
          placeholder="输入时间戳，如 1704067200"
          class="font-mono flex-1"
        />
        <UButton
          icon="lucide:clock"
          variant="outline"
          color="secondary"
          @click="useNow"
        >
          当前
        </UButton>
        <UButton
          icon="lucide:arrow-down"
          color="success"
          @click="timestampToDate"
        >
          转换
        </UButton>
        <UButton
          :color="copiedTimestamp ? 'success' : 'primary'"
          :icon="copiedTimestamp ? 'lucide:check' : 'lucide:copy'"
          @click="copyTimestampResult"
        >
          {{ copiedTimestamp ? '复制成功' : '复制结果' }}
        </UButton>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-muted">日期</label>
      <div class="flex gap-2">
        <UInput
          v-model="date"
          placeholder="输入日期，如 2024-01-01 12:00:00"
          class="flex-1"
        />
        <UButton
          icon="lucide:clock"
          variant="outline"
          color="secondary"
          @click="useNow"
        >
          当前
        </UButton>
        <UButton
          icon="lucide:arrow-up"
          color="primary"
          @click="dateToTimestamp"
        >
          转换
        </UButton>
        <UButton
          :color="copiedDate ? 'success' : 'primary'"
          :icon="copiedDate ? 'lucide:check' : 'lucide:copy'"
          @click="copyDateResult"
        >
          {{ copiedDate ? '复制成功' : '复制结果' }}
        </UButton>
      </div>
    </div>
  </div>
</template>
