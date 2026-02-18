/**
 * 工具类型定义
 */

// 工具元数据
export interface ToolMeta {
  id: string // 唯一标识，与文件名一致
  icon: string // 图标名称
  name: string // 显示名称
  description: string // 工具描述
  keywords: string[] // 搜索关键词
}

/**
 * 历史记录数据结构
 * input / output / config 统一使用 any，由各工具自行决定存储格式
 * IndexedDB 原生支持 string / number / object / array / Blob / ArrayBuffer 等类型
 */
export interface ToolHistoryRecord {
  id?: number
  toolId: string // 工具标识
  input: any // 输入数据（可为 string / object / Blob 等）
  output: any // 输出数据（可为 string / object / Blob 等）
  config: Record<string, any> // 工具配置（直接存对象，无需 JSON 序列化）
  createdAt: number // 操作时间戳 (ms)
  label: string // 摘要标签
}
