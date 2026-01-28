/**
 * 工具分类枚举
 */
export enum ToolCategory {
  TEXT = 'text',
  ENCODING = 'encoding',
  FORMAT = 'format',
  CRYPTO = 'crypto',
  CONVERTER = 'converter',
  GENERATOR = 'generator'
}

/**
 * 工具分类显示信息
 */
export const ToolCategoryInfo: Record<
  ToolCategory,
  { label: string, icon: string }
> = {
  [ToolCategory.TEXT]: { label: '文本处理', icon: 'i-lucide-text' },
  [ToolCategory.ENCODING]: { label: '编码转换', icon: 'i-lucide-binary' },
  [ToolCategory.FORMAT]: { label: '格式化', icon: 'i-lucide-braces' },
  [ToolCategory.CRYPTO]: { label: '加密解密', icon: 'i-lucide-lock' },
  [ToolCategory.CONVERTER]: { label: '转换工具', icon: 'i-lucide-refresh-cw' },
  [ToolCategory.GENERATOR]: { label: '生成器', icon: 'i-lucide-sparkles' }
}

/**
 * 工具定义接口
 */
export interface Tool {
  /** 唯一标识，如 'json-formatter' */
  id: string
  /** 显示名称 */
  name: string
  /** 简短描述 */
  description: string
  /** 图标名称 (Iconify 格式) */
  icon: string
  /** 工具分类 */
  category: ToolCategory
  /** 搜索关键词 */
  keywords: string[]
  /** 是否为热门工具 */
  featured?: boolean
}

/**
 * 工具标签页状态
 */
export interface ToolTab {
  /** 工具 ID */
  toolId: string
  /** 标签页唯一 key (支持同一工具多开) */
  key: string
  /** 标签页标题 */
  title: string
}
