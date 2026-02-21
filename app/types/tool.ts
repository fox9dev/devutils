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
