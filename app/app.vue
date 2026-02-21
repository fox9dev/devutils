<script lang="ts" setup>
const { slideDirection, openTabs } = useToolTabs()

const transition = computed(() => {
  if (!slideDirection.value) return {}
  return { name: slideDirection.value, mode: 'out-in' as const }
})

const keepAliveInclude = computed(() => [...openTabs.value])
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage
        :keepalive="{ include: keepAliveInclude }"
        :transition="transition"
      />
    </NuxtLayout>
  </UApp>
</template>

<style>
/* 工具页面左右切换动画 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

/* slide-left：切到右侧 tab，内容从右进、向左出 */
.slide-left-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

/* slide-right：切到左侧 tab，内容从左进、向右出 */
.slide-right-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
