<script setup lang="ts">
/**
 * 错误页面
 * 处理 404 等错误，复用 AppHeader / AppFooter 保持布局一致
 */
import type { NuxtError } from '#app'

const router = useRouter()
const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)

const title = computed(() => is404.value ? '页面未找到' : '出错了')

const description = computed(() =>
  is404.value
    ? '你访问的页面不存在或已被移除，请检查链接是否正确。'
    : props.error.message || '发生了意外错误，请稍后再试。'
)

function handleGoBack() {
  router.back()
}

function handleClearError() {
  clearError({ redirect: '/' })
}

useSeoMeta({
  title: title.value
})
</script>

<template>
  <UApp>
    <div class="min-h-screen flex flex-col bg-default">
      <AppHeader />

      <main class="flex-1 flex items-center justify-center">
        <div class="container mx-auto px-4 py-20 md:py-32">
          <div class="max-w-lg mx-auto text-center">
            <!-- 状态码 -->
            <p class="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-sky-500 to-teal-500 dark:from-sky-400 dark:to-teal-400 mb-4 select-none">
              {{ error.statusCode }}
            </p>

            <!-- 标题 -->
            <h1 class="text-2xl md:text-3xl font-bold text-default mb-3">
              {{ title }}
            </h1>

            <!-- 描述 -->
            <p class="text-muted mb-10">
              {{ description }}
            </p>

            <!-- 操作按钮 -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <UButton
                icon="lucide:arrow-left"
                class="px-8 bg-linear-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 border-0"
                @click="handleGoBack"
              >
                返回上一页
              </UButton>
              <UButton
                variant="outline"
                icon="lucide:home"
                class="border-sky-200 dark:border-sky-700 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30"
                @click="handleClearError"
              >
                返回首页
              </UButton>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  </UApp>
</template>
