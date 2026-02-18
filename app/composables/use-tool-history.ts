/**
 * 工具历史记录 Composable
 * 提供按工具隔离的历史记录增删查功能 + restore 通信机制
 */
import type { InjectionKey, MaybeRef } from 'vue'
import { unref } from 'vue'
import Dexie, { type Table } from 'dexie'
import type { ToolHistoryRecord } from '~/types/tool'

// —— restore 通信层 ——

type RestoreHandler = (record: ToolHistoryRecord) => void

interface ToolHistoryContext {
  register: (fn: RestoreHandler) => () => void
  restore: (record: ToolHistoryRecord) => void
}

const historyContextKey: InjectionKey<ToolHistoryContext> = Symbol('historyContext')

/**
 * 布局端：提供 restore 上下文（provide），必须在祖先组件中调用
 */
export function useToolHistoryProvider() {
  const handler = ref<RestoreHandler | null>(null)

  const context: ToolHistoryContext = {
    register(fn: RestoreHandler) {
      handler.value = fn
      return () => {
        if (handler.value === fn) {
          handler.value = null
        }
      }
    },
    restore(record: ToolHistoryRecord) {
      handler.value?.(record)
    }
  }

  provide(historyContextKey, context)
}

/**
 * 子组件端：获取 restore 上下文（inject）
 */
export function useToolHistoryContext() {
  return inject(historyContextKey)!
}

// —— 数据层 ——

class HistoryDB extends Dexie {
  history!: Table<ToolHistoryRecord>

  constructor() {
    super('devutils-history')
    this.version(1).stores({
      history: '++id, toolId, createdAt, [toolId+createdAt]'
    })
  }
}

const historyDB = new HistoryDB()

const LABEL_MAX_LEN = 50

function makeLabel(input: any): string {
  const raw = typeof input === 'string' ? input : (JSON.stringify(input) ?? '')
  const text = raw.length > 200 ? raw.slice(0, 200) : raw
  const line = text.replace(/\s+/g, ' ').trim()
  return line.length > LABEL_MAX_LEN
    ? `${line.slice(0, LABEL_MAX_LEN)}…`
    : line
}

interface UseToolHistoryOptions {
  /** 历史恢复回调，注册后自动处理 keepAlive 场景 */
  onRestore?: RestoreHandler
}

export function useToolHistory(toolId: MaybeRef<string>, options: UseToolHistoryOptions = {}) {
  const records = ref<ToolHistoryRecord[]>([])
  const loading = ref(false)

  function getToolId() {
    return unref(toolId)
  }

  /** 查询历史记录，可选时间范围 */
  async function list(from?: number, to?: number) {
    const id = getToolId()
    if (!id) {
      records.value = []
      return
    }
    loading.value = true
    try {
      const query = historyDB.history
        .where('[toolId+createdAt]')
        .between(
          [id, from ?? Dexie.minKey],
          [id, to ?? Dexie.maxKey],
          true,
          true
        )
      records.value = await query.reverse().toArray()
    } finally {
      loading.value = false
    }
  }

  /** 保存一条记录 */
  async function save(
    input: any,
    output: any,
    config: Record<string, any> = {}
  ) {
    const id = getToolId()
    if (!id) return
    await historyDB.history.add({
      toolId: id,
      input,
      output,
      config,
      createdAt: Date.now(),
      label: makeLabel(input)
    })
  }

  /** 删除单条 */
  async function remove(id: number) {
    await historyDB.history.delete(id)
    records.value = records.value.filter(r => r.id !== id)
  }

  /** 清空当前工具所有历史 */
  async function clearAll() {
    const id = getToolId()
    if (!id) return
    await historyDB.history.where('toolId').equals(id).delete()
    records.value = []
  }

  // —— restore handler 注册（工具页端） ——
  if (options.onRestore) {
    const ctx = inject(historyContextKey)
    if (ctx) {
      const fn = options.onRestore
      let cleanup: (() => void) | null = null

      const activate = () => {
        cleanup = ctx.register(fn)
      }
      const deactivate = () => {
        cleanup?.()
        cleanup = null
      }

      activate()
      onActivated(activate)
      onDeactivated(deactivate)
      onUnmounted(deactivate)
    }
  }

  return { records, loading, list, save, remove, clearAll }
}
