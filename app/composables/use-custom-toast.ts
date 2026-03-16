// 通用配置
const toastConfig = {
  duration: 2000,
  progress: false,
  close: false
}

export function useCustomToast(toolId: string) {
  const toast = useToast()

  return {
    success(message: string) {
      toast.add({
        id: toolId,
        title: message,
        color: 'success',
        icon: 'lucide:circle-check-big',
        ...toastConfig
      })
    },
    error(message: string) {
      toast.add({
        id: toolId,
        title: message,
        color: 'error',
        icon: 'lucide:circle-x',
        ...toastConfig
      })
    },
    warning(message: string) {
      toast.add({
        id: toolId,
        title: message,
        color: 'warning',
        icon: 'lucide:triangle-alert',
        ...toastConfig
      })
    },
    info(message: string) {
      toast.add({
        id: toolId,
        title: message,
        color: 'info',
        icon: 'lucide:info',
        ...toastConfig
      })
    }
  }
}
