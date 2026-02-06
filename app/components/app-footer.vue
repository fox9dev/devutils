<script setup lang="ts">
import dayjs from 'dayjs'

/**
 * 页脚组件
 * 包含版权信息、作者信息、友情链接
 */

const currentYear = dayjs().year()

const links = [
  { label: 'GitHub', href: 'https://github.com/fox9dev/devutils', icon: 'simple-icons:github' },
  { label: '反馈建议', href: 'https://github.com/fox9dev/devutils/issues', icon: 'lucide:message-circle' }
]
</script>

<template>
  <footer class="border-t border-default bg-default">
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
        <div class="flex items-center gap-3">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 text-sm text-muted hover:text-default transition-colors"
          >
            <UIcon
              :name="link.icon"
              class="h-4 w-4"
            />
            <span class="hidden sm:inline">{{ link.label }}</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
