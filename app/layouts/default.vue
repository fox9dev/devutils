<script setup lang="ts">
/**
 * 默认布局
 * 用于落地页和工具列表页
 */
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
