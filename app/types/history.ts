/**
 * 历史记录条目
 */
export interface HistoryRecord {
  /** 自增 ID */
  id?: number
  /** 关联的工具 ID */
  toolId: string
  /** 输入数据 (JSON 字符串) */
  input: string
  /** 输出数据 (JSON 字符串) */
  output: string
  /** 操作描述/标签 */
  label?: string
  /** 创建时间戳 */
  timestamp: number
}

/**
 * 历史记录搜索选项
 */
export interface HistorySearchOptions {
  /** 工具 ID */
  toolId: string
  /** 搜索关键词 */
  keyword?: string
  /** 限制返回数量 */
  limit?: number
  /** 偏移量 */
  offset?: number
}
