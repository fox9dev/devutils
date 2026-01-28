<script setup lang="ts">
const sidebarCollapsed = ref(false)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white dark:bg-gray-950">
    <AppHeader />
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <ToolSidebar v-model:collapsed="sidebarCollapsed" />

      <!-- Main Content -->
      <main class="flex flex-1 flex-col overflow-hidden">
        <!-- Tabs -->
        <ToolTabs />

        <!-- Tool Content -->
        <div class="flex-1 overflow-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
