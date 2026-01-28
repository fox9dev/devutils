/**
 * 应用 Toast 提示 Composable
 */
export function useAppToast() {
  const toast = useToast()

  return {
    /**
     * 成功提示
     */
    success(message: string) {
      toast.add({
        title: message,
        icon: 'i-lucide-check-circle',
        color: 'success'
      })
    },

    /**
     * 错误提示
     */
    error(message: string) {
      toast.add({
        title: message,
        icon: 'i-lucide-x-circle',
        color: 'error'
      })
    },

    /**
     * 信息提示
     */
    info(message: string) {
      toast.add({
        title: message,
        icon: 'i-lucide-info',
        color: 'info'
      })
    },

    /**
     * 警告提示
     */
    warning(message: string) {
      toast.add({
        title: message,
        icon: 'i-lucide-alert-triangle',
        color: 'warning'
      })
    }
  }
}
