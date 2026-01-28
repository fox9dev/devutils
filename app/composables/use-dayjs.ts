import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 扩展 dayjs 插件
dayjs.extend(relativeTime)

/**
 * Dayjs Composable
 * 提供统一的日期时间处理
 */
export function useDayjs() {
  const { locale } = useI18n()

  // 根据当前语言设置 dayjs locale
  const dayjsLocale = computed(() => {
    return locale.value === 'zh-CN' ? 'zh-cn' : 'en'
  })

  /**
   * 创建 dayjs 实例
   */
  function $dayjs(date?: dayjs.ConfigType) {
    return dayjs(date).locale(dayjsLocale.value)
  }

  /**
   * 格式化日期时间
   */
  function formatDate(date: dayjs.ConfigType, format = 'YYYY-MM-DD HH:mm:ss'): string {
    return $dayjs(date).format(format)
  }

  /**
   * 格式化相对时间
   */
  function formatRelativeTime(date: dayjs.ConfigType): string {
    const d = $dayjs(date)
    const now = $dayjs()
    const diffMinutes = now.diff(d, 'minute')
    const diffHours = now.diff(d, 'hour')
    const diffDays = now.diff(d, 'day')

    if (diffMinutes < 1) {
      return locale.value === 'zh-CN' ? '刚刚' : 'Just now'
    } else if (diffMinutes < 60) {
      return locale.value === 'zh-CN' ? `${diffMinutes} 分钟前` : `${diffMinutes} min ago`
    } else if (diffHours < 24) {
      return locale.value === 'zh-CN' ? `${diffHours} 小时前` : `${diffHours} hours ago`
    } else if (diffDays === 1) {
      return locale.value === 'zh-CN' ? '昨天' : 'Yesterday'
    } else {
      return d.format(locale.value === 'zh-CN' ? 'M月D日 HH:mm' : 'MMM D, HH:mm')
    }
  }

  /**
   * 获取当前时间戳（秒）
   */
  function nowTimestamp(): number {
    return Math.floor(Date.now() / 1000)
  }

  /**
   * 时间戳转日期时间
   */
  function timestampToDatetime(
    timestamp: number | string,
    unit: 'seconds' | 'milliseconds' = 'seconds',
    format = 'YYYY-MM-DD HH:mm:ss'
  ): string {
    let ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp
    if (unit === 'seconds') {
      ts *= 1000
    }
    const d = $dayjs(ts)
    if (!d.isValid()) {
      return ''
    }
    return d.format(format)
  }

  /**
   * 日期时间转时间戳
   */
  function datetimeToTimestamp(
    datetime: string,
    unit: 'seconds' | 'milliseconds' = 'seconds'
  ): number | null {
    const d = $dayjs(datetime)
    if (!d.isValid()) {
      return null
    }
    const ts = d.valueOf()
    return unit === 'seconds' ? Math.floor(ts / 1000) : ts
  }

  /**
   * 获取今天开始时间的时间戳
   */
  function todayStart(unit: 'seconds' | 'milliseconds' = 'seconds'): number {
    const ts = $dayjs().startOf('day').valueOf()
    return unit === 'seconds' ? Math.floor(ts / 1000) : ts
  }

  /**
   * 获取今天结束时间的时间戳
   */
  function todayEnd(unit: 'seconds' | 'milliseconds' = 'seconds'): number {
    const ts = $dayjs().endOf('day').valueOf()
    return unit === 'seconds' ? Math.floor(ts / 1000) : ts
  }

  /**
   * 获取昨天开始时间的时间戳
   */
  function yesterdayStart(unit: 'seconds' | 'milliseconds' = 'seconds'): number {
    const ts = $dayjs().subtract(1, 'day').startOf('day').valueOf()
    return unit === 'seconds' ? Math.floor(ts / 1000) : ts
  }

  /**
   * 获取 N 天前的时间戳
   */
  function daysAgo(days: number, unit: 'seconds' | 'milliseconds' = 'seconds'): number {
    const ts = $dayjs().subtract(days, 'day').valueOf()
    return unit === 'seconds' ? Math.floor(ts / 1000) : ts
  }

  return {
    $dayjs,
    formatDate,
    formatRelativeTime,
    nowTimestamp,
    timestampToDatetime,
    datetimeToTimestamp,
    todayStart,
    todayEnd,
    yesterdayStart,
    daysAgo
  }
}
