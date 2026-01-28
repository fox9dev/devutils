import Dexie from 'dexie'
import type { HistoryRecord, HistorySearchOptions } from '~/types/history'

/**
 * DevUtils 数据库
 */
class DevUtilsDB extends Dexie {
  histories!: Dexie.Table<HistoryRecord, number>

  constructor() {
    super('DevUtilsDB')
    this.version(1).stores({
      histories: '++id, toolId, timestamp, label'
    })
  }
}

const db = new DevUtilsDB()

/**
 * 历史记录管理 Composable
 */
export function useHistory() {
  /**
   * 保存历史记录
   */
  async function saveHistory(
    record: Omit<HistoryRecord, 'id' | 'timestamp'>
  ): Promise<number> {
    return await db.histories.add({
      ...record,
      timestamp: Date.now()
    })
  }

  /**
   * 获取工具的历史记录
   */
  async function getHistory(
    options: HistorySearchOptions
  ): Promise<HistoryRecord[]> {
    const { toolId, keyword, limit = 50, offset = 0 } = options

    const query = db.histories.where('toolId').equals(toolId).reverse()

    if (keyword) {
      const records = await query.toArray()
      const lowerKeyword = keyword.toLowerCase()
      return records
        .filter(
          r =>
            r.input.toLowerCase().includes(lowerKeyword)
            || r.output.toLowerCase().includes(lowerKeyword)
            || (r.label && r.label.toLowerCase().includes(lowerKeyword))
        )
        .slice(offset, offset + limit)
    }

    return await query.offset(offset).limit(limit).toArray()
  }

  /**
   * 删除单条历史记录
   */
  async function deleteHistory(id: number): Promise<void> {
    await db.histories.delete(id)
  }

  /**
   * 清空工具的所有历史记录
   */
  async function clearHistory(toolId: string): Promise<void> {
    await db.histories.where('toolId').equals(toolId).delete()
  }

  /**
   * 获取历史记录总数
   */
  async function getHistoryCount(toolId: string): Promise<number> {
    return await db.histories.where('toolId').equals(toolId).count()
  }

  return {
    saveHistory,
    getHistory,
    deleteHistory,
    clearHistory,
    getHistoryCount
  }
}
