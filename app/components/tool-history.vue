<script setup lang="ts">
/**
 * 历史记录面板
 * 通过图标触发 Drawer 显示，支持按时间范围筛选（SegmentControl）、单条删除（带动画）、一键清空
 */
import type { ToolHistoryRecord } from '~/types/tool'
import SegmentControl from '~/components/segment-control.vue'

const { activeTab } = useToolTabs()
const toolId = computed(() => activeTab.value ?? '')
const { records, loading, list, remove, clearAll } = useToolHistory(toolId)
const { restore } = useToolHistoryContext()

// 时间范围选项
type TimeRangeKey = 'all' | 'today' | 'week' | 'month'
const timeRangeOptions: { label: string, value: TimeRangeKey }[] = [
  { label: '全部', value: 'all' },
  { label: '今天', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' }
]

const timeRange = ref<TimeRangeKey>('all')

function getTimeRangeBounds(): { from?: number, to?: number } {
  const now = Date.now()
  if (timeRange.value === 'all') return {}
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  if (timeRange.value === 'today') {
    return { from: d.getTime(), to: now }
  }
  if (timeRange.value === 'week') {
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day // 周一为起点
    d.setDate(d.getDate() + diff)
    return { from: d.getTime(), to: now }
  }
  if (timeRange.value === 'month') {
    d.setDate(1)
    return { from: d.getTime(), to: now }
  }
  return {}
}

// Drawer 显隐（由 UDrawer 的触发按钮与 v-model:open 控制）
const open = ref(false)

function closeDrawer() {
  open.value = false
}

// 打开时拉取；切换工具或时间范围时重新拉取
watch(open, (isOpen) => {
  if (isOpen && toolId.value) {
    const { from, to } = getTimeRangeBounds()
    list(from, to)
  }
})
watch([toolId, timeRange], () => {
  if (open.value && toolId.value) {
    const { from, to } = getTimeRangeBounds()
    list(from, to)
  }
}, { immediate: false })

// 删除单条：先做乐观动画，再调 remove
const removingIds = ref<Set<number>>(new Set())

async function handleRemove(record: ToolHistoryRecord) {
  const id = record.id
  if (id == null) return
  removingIds.value = new Set(removingIds.value).add(id)
  try {
    await remove(id)
  } finally {
    const next = new Set(removingIds.value)
    next.delete(id)
    removingIds.value = next
  }
}

function isRemoving(id: number | undefined): boolean {
  return id != null && removingIds.value.has(id)
}

// 恢复记录
function handleRestore(record: ToolHistoryRecord) {
  restore(record)
  closeDrawer()
}

// 清空全部
const clearing = ref(false)
async function handleClearAll() {
  if (!toolId.value) return
  clearing.value = true
  try {
    await clearAll()
  } finally {
    clearing.value = false
  }
}

function formatTime(ts: number) {
  const d = new Date(ts)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }
  return (
    d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
    + ' '
    + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  )
}
</script>

<template>
  <UDrawer
    v-model:open="open"
    direction="right"
    title="历史记录"
    description="历史记录"
    :handle="false"
    :ui="{
      content: 'w-full max-w-sm flex flex-col h-full max-h-[100dvh]',
      container: 'flex flex-col flex-1 min-h-0 overflow-hidden gap-4',
      body: 'flex-1 min-h-0 flex flex-col overflow-hidden'
    }"
  >
    <UButton
      variant="ghost"
      color="neutral"
      icon="i-lucide-history"
      size="sm"
      :disabled="!toolId"
      :class="[open ? 'bg-elevated' : '']"
    />

    <template #body>
      <div class="drawer-body flex flex-col h-full min-h-0">
        <!-- 时间筛选 + 清空全部 -->
        <div class="shrink-0 flex items-center gap-3 mb-4">
          <SegmentControl
            v-model="timeRange"
            :options="timeRangeOptions"
          />
          <UButton
            variant="ghost"
            color="error"
            size="lg"
            class="shrink-0"
            :disabled="records.length === 0 || clearing"
            :loading="clearing"
            icon="i-lucide-trash-2"
            @click="handleClearAll"
          >
            清空
          </UButton>
        </div>

        <!-- 可滚动列表区域：用 max-h 保证有明确高度才能滚动 -->
        <div class="history-list-wrap flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          <div
            v-if="loading"
            class="p-6 flex justify-center text-muted"
          >
            <UIcon
              name="i-lucide-loader-2"
              class="w-5 h-5 animate-spin"
            />
          </div>
          <template v-else>
            <TransitionGroup
              name="history-item"
              tag="ul"
              class="history-list"
            >
              <li
                v-for="record in records"
                :key="record.id!"
                class="history-item"
              >
                <button
                  type="button"
                  class="history-item-content"
                  :title="record.label"
                  @click="handleRestore(record)"
                >
                  <span class="truncate block text-sm text-default">{{ record.label || '（无摘要）' }}</span>
                  <span class="text-xs text-muted">{{ formatTime(record.createdAt) }}</span>
                </button>
                <UButton
                  variant="ghost"
                  color="neutral"
                  icon="i-lucide-trash-2"
                  size="xs"
                  class="history-item-delete"
                  :loading="isRemoving(record.id)"
                  @click.stop="handleRemove(record)"
                />
              </li>
            </TransitionGroup>
            <div
              v-if="!loading && records.length === 0"
              class="p-6 text-center text-sm text-muted"
            >
              暂无历史记录
            </div>
          </template>
        </div>
      </div>
    </template>
  </UDrawer>
</template>

<style scoped>
.drawer-body {
  /* 确保在 Drawer 的 body 内形成 flex 高度约束 */
  overflow: hidden;
}

.history-list-wrap {
  /* 独立滚动区域，避免与 Drawer 内部滚动冲突 */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.history-list {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--ui-border-default, rgb(0 0 0 / 0.1));
  transition: background-color 0.15s ease;
}

.history-item:hover {
  background-color: rgb(0 0 0 / 0.04);
}

.history-item:last-child {
  border-bottom: none;
}

.history-item-content {
  flex: 1;
  min-width: 0;
  text-align: left;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.history-item-delete {
  opacity: 0;
  flex-shrink: 0;
  color: var(--ui-color-muted);
  transition: opacity 0.2s ease;
}

.history-item:hover .history-item-delete {
  opacity: 1;
}

.history-item-delete:hover {
  color: var(--ui-color-error);
}

/* 删除动画：被删项在文档流中高度折叠 + 淡出，下方项自然平滑上移 */
.history-item-enter-active {
  transition:
    transform 0.25s cubic-bezier(0.32, 0.72, 0, 1),
    opacity 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}

.history-item-enter-from {
  opacity: 0;
  transform: translateX(-8px);
}

/* 被删项不脱离文档流，用 max-height + opacity 折叠，下方项会随空间收缩平滑上移 */
.history-item-leave-active {
  overflow: hidden;
  transition:
    max-height 0.35s cubic-bezier(0.32, 0.72, 0, 1),
    opacity 0.35s cubic-bezier(0.32, 0.72, 0, 1),
    padding 0.35s cubic-bezier(0.32, 0.72, 0, 1),
    border-bottom-width 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}

.history-item-leave-from {
  max-height: 100px;
  opacity: 1;
}

.history-item-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  border-bottom-width: 0;
}
</style>
