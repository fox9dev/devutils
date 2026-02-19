<script setup lang="ts">
import dayjs from 'dayjs'

/**
 * 页脚组件
 * 包含版权信息、作者信息、友情链接
 */

// 使用 useState 确保 SSR/客户端年份一致，避免跨年时区差异导致的水合不匹配
const currentYear = useState('footer-year', () => dayjs().year())
</script>

<template>
  <footer class="border-t border-default">
    <div class="container mx-auto px-4 py-8 transition-all">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- 版权信息 -->
        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon
            name="lucide:terminal"
            class="h-4 w-4 text-primary-500"
          />
          <span>© {{ currentYear }} DevUtils. All rights reserved.</span>
        </div>

        <!-- 隐私说明 -->
        <div class="flex items-center gap-1.5 text-xs text-muted">
          <UIcon
            name="lucide:shield-check"
            class="h-3.5 w-3.5 text-green-500"
          />
          <span>所有数据在本地处理，不会上传至服务器</span>
        </div>

        <!-- 链接 -->
        <a
          href="https://github.com/fox9dev/devutils/issues"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 text-sm text-muted hover:text-default transition-colors"
        >
          <UIcon
            name="lucide:message-circle"
            class="h-4 w-4"
          />
          <span class="hidden sm:inline">反馈建议</span>
        </a>
      </div>
    </div>
  </footer>
</template>
